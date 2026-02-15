# ResqTap Quick Start - Physical Device Testing

## 🚀 3-Minute Setup

### 1️⃣ Find Your Computer's IP (30 seconds)

**Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```cmd
ipconfig
```

Look for something like: **192.168.1.123** (your IP will be different!)

---

### 2️⃣ Update Backend Config (1 minute)

**File**: `frontend/backend-config.js` (line 15)

```javascript
export const BACKEND_IP = '192.168.1.123';  // 👈 PUT YOUR IP HERE!
```

---

### 3️⃣ Start Backend (30 seconds)

```bash
./mvnw spring-boot:run
```

**Verify**: Open http://localhost:8080/api/emergencies in browser
Should see JSON with 72 emergencies ✅

---

### 4️⃣ Build Mobile App (1 minute)

```bash
cd mobile
npm run cap:sync
npm run cap:open:android   # For Android
# OR
npm run cap:open:ios       # For iOS
```

Then click **Run** in Android Studio or Xcode ▶️

---

## ✅ Testing Checklist

Before running on your phone:

- [ ] Backend running (`./mvnw spring-boot:run`)
- [ ] Updated IP in `frontend/backend-config.js`
- [ ] Phone & computer on **SAME WiFi**
- [ ] Can access `http://YOUR_IP:8080/api/emergencies` from phone browser

---

## 🔥 What Was Fixed

1. ✅ **AWS Cognito** configured with your credentials
   - Pool: `us-east-2_FAWeRCqg6`
   - Client: `3jgk6bspjforn3v0vccoo8rr95`

2. ✅ **Backend URL** now configurable (no more localhost errors!)

3. ✅ **Duplicate controllers** removed (single API endpoint)

4. ✅ **DTO standardized** with slug field for clean URLs

5. ✅ **Resource loading fixed** (Capacitor HTTPS config)

---

## 🐛 Common Issues

### "Startup Error - failed to load resource"
→ **Fix**: Update IP in `backend-config.js` and rebuild

### "Cannot connect to backend"
→ **Check**: Phone and computer on same WiFi?
→ **Test**: Access `http://YOUR_IP:8080/api/emergencies` from phone browser first

### "Dark blue screen"
→ **Fix**: Check JavaScript console (USB debugging + Chrome inspect)

---

## 📱 Test on Your Phone

1. Launch app
2. Should see emergency cards loading
3. Click any card → See step-by-step instructions
4. Try favorite ⭐ button
5. Try search and filters

---

## 🎯 Your Cognito Credentials

```
Region: us-east-2
User Pool ID: us-east-2_FAWeRCqg6
Client ID: 3jgk6bspjforn3v0vccoo8rr95
Domain: https://us-east-2_FAWeRCqg6.auth.us-east-2.amazoncognito.com
```

Already configured in:
- `frontend/auth.js`
- `frontend/config.js`

---

## 📚 More Help

See **SETUP_GUIDE.md** for detailed troubleshooting and configuration.

---

**Last Updated**: 2026-01-05
**Status**: ✅ All fixes applied, tests passing, production JAR built
