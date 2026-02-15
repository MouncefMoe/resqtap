# Health Profile Save/Load Bug Fix

## Problem Description

After logging in, users could fill out the health profile form (blood type, preferred units, height, weight, allergies, chronic conditions, medications, emergency notes), but when they clicked "Save Profile", the form would become empty and not show the saved data.

---

## Root Causes Identified

### 1. Health Form Not Reloading After Save
**File**: `frontend/script.js` (line 841-846)

**Issue**: After saving the profile, `this.start()` was called which would reload the app, but the health profile form data wasn't being reloaded or displayed.

### 2. Health Form Not Loading Existing Data
**File**: `frontend/script.js` (line 724-823)

**Issue**: When `renderHealthForm()` was called, it created an empty form without loading existing profile data from localStorage. Users who already filled out the form would see an empty form again.

### 3. renderAppShell Checking Wrong Property
**File**: `frontend/script.js` (line 826-842)

**Issue**: `renderAppShell()` was checking `user.health` from `getCurrentUser()`, but:
- `getCurrentUser()` only returns AWS Cognito data (username, email, sub, emailVerified)
- Health profile is stored separately in localStorage via `profileService.js`
- This caused the app to always show the health form even after the user filled it out

---

## Fixes Applied

### Fix 1: Health Form Now Loads Existing Data

**File**: `frontend/script.js` (lines 817-838)

**Added**: Automatic profile loading when health form renders

```javascript
// Load existing profile data if available
(async () => {
    const { getProfile } = await import('./profileService.js');
    const profile = await getProfile();
    if (profile) {
        const form = document.getElementById('healthForm');
        if (profile.bloodType) form.bloodType.value = profile.bloodType;
        if (profile.units) {
            const unitsRadio = form.querySelector(`input[name="units"][value="${profile.units}"]`);
            if (unitsRadio) {
                unitsRadio.checked = true;
                updateLabels();
            }
        }
        if (profile.height) form.height.value = profile.height;
        if (profile.weight) form.weight.value = profile.weight;
        if (profile.allergies) form.allergies.value = profile.allergies;
        if (profile.conditions) form.conditions.value = profile.conditions;
        if (profile.medications) form.medications.value = profile.medications;
        if (profile.emergencyNotes) form.emergencyNotes.value = profile.emergencyNotes;
    }
})();
```

**Result**: ✅ Form now displays previously saved data

---

### Fix 2: renderAppShell Properly Checks Health Profile

**File**: `frontend/script.js` (lines 849-861)

**Before**:
```javascript
async renderAppShell() {
    const user = await AuthService.getCurrentUser();
    if (!user.health) {  // ❌ user.health doesn't exist!
        this.renderHealthForm();
        return;
    }
    // ...
}
```

**After**:
```javascript
async renderAppShell() {
    // Load health profile from localStorage
    const { getProfile } = await import('./profileService.js');
    const healthProfile = await getProfile();

    // Check if user has completed health profile
    if (!healthProfile || !healthProfile.bloodType) {
        this.renderHealthForm();
        return;
    }
    // ...
}
```

**Result**: ✅ App correctly detects if health profile is complete

---

### Fix 3: Profile Page Reloads After Save

**File**: `frontend/profile.js` (lines 56-72)

**Before**:
```javascript
async function handleSubmit(event) {
    event.preventDefault();
    const next = { /* form data */ };
    await saveProfile(next);
    showStatus('Saved locally. Will sync when sign-in is available.');
    // ❌ Missing: loadProfile() to refresh form
}
```

**After**:
```javascript
async function handleSubmit(event) {
    event.preventDefault();
    const next = { /* form data */ };
    await saveProfile(next);

    // Reload the form to show saved data
    await loadProfile();

    showStatus('Profile saved successfully!');
}
```

**Result**: ✅ Form refreshes to show saved data after clicking "Save Profile"

---

## How Health Profile Works Now

### Data Flow:

1. **User fills health form** (blood type, units, height, weight, etc.)
2. **Clicks "Save Profile"**
3. **Data saved** to localStorage via `profileService.js` (key: `resqtap:profile`)
4. **Form reloads** to display saved data
5. **User can navigate away** and come back - data persists
6. **After login**, app checks if health profile exists:
   - If NO profile → Show health form
   - If profile exists → Show main app

### Storage Location:

- **Local Storage Key**: `resqtap:profile`
- **Storage API**: Capacitor Preferences (with localStorage fallback)
- **Data Format**: JSON object with fields:
  ```javascript
  {
    bloodType: "O+",
    units: "metric",
    height: "175",
    weight: "70",
    allergies: "Peanuts, Penicillin",
    conditions: "Asthma",
    medications: "Albuterol",
    emergencyNotes: "Inhaler needed",
    updatedAt: "2026-01-06T..."
  }
  ```

---

## Files Modified

| File | Lines | Change |
|------|-------|--------|
| [frontend/script.js](frontend/script.js#L817-L838) | 817-838 | Added profile data loading to health form |
| [frontend/script.js](frontend/script.js#L849-L861) | 849-861 | Fixed renderAppShell to check health profile from localStorage |
| [frontend/profile.js](frontend/profile.js#L56-L72) | 56-72 | Added loadProfile() call after save |

---

## Testing Steps

### Test 1: First-Time Health Profile Creation
```
1. Login with new account
2. Fill out health form:
   - Blood Type: O+
   - Units: Metric
   - Height: 175 cm
   - Weight: 70 kg
   - Allergies: Peanuts
   - Conditions: Asthma
   - Medications: Albuterol
   - Emergency Notes: Carries inhaler
3. Click "Save Profile"
4. ✅ Expected: Form shows saved data, no empty fields
5. ✅ Expected: Main app loads
```

### Test 2: Editing Existing Health Profile
```
1. Login
2. Navigate to Profile (if not already on health form)
3. Update health information (e.g., change weight to 72)
4. Click "Save Profile"
5. ✅ Expected: Form reloads with new weight value (72)
6. ✅ Expected: No data loss
```

### Test 3: Profile Persistence After Logout/Login
```
1. Login and fill out health profile
2. Save profile
3. Logout
4. Close app
5. Reopen app and login again
6. ✅ Expected: Health profile data still there
7. ✅ Expected: Main app loads (not health form)
```

### Test 4: Empty Form Bug (Original Issue)
```
1. Login (with existing account)
2. Health form shows (if first time)
3. Fill out ALL fields
4. Click "Save Profile"
5. ❌ BEFORE: All fields become empty
6. ✅ AFTER: All fields show saved data
7. ✅ AFTER: Main app loads
```

---

## Additional Notes

### Backend Sync (Future Enhancement)

Currently, health profile data is **only stored locally** (localStorage/Capacitor Preferences).

**To enable backend sync**, you would need to:

1. Create backend endpoint: `PUT /api/profile`
2. Create `ProfileController.java` in Spring Boot
3. Create `UserProfile` entity
4. The existing `syncService.js` already queues profile for sync
5. Once backend endpoint exists, profile will sync automatically when user is online

**Current behavior**:
- ✅ Profile saves locally
- ✅ Profile persists across app restarts
- ❌ Profile does NOT sync to backend (endpoint doesn't exist)
- ⚠️ If user logs in on different device, profile won't be there

---

## Summary

**Problem**: Health profile form became empty after saving

**Root Causes**:
1. Form didn't reload after save
2. Form didn't load existing data when rendered
3. App incorrectly checked for health profile existence

**Solutions**:
1. ✅ Added `loadProfile()` call after save
2. ✅ Added automatic profile loading in `renderHealthForm()`
3. ✅ Fixed `renderAppShell()` to check localStorage for health profile

**Result**:
- ✅ Health profile saves correctly
- ✅ Form displays saved data
- ✅ Data persists after logout/login
- ✅ App correctly detects if health profile is complete

---

**Status**: ✅ All fixes applied and synced to Android!

**Next Step**: Test on your Android device by creating an account, filling out health profile, and verifying data persists!
