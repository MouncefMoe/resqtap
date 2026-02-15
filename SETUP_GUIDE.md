# ResqTap Setup Guide - Mobile Device Testing

## What Was Fixed

### 1. ✅ AWS Cognito Configuration
- **Updated**: [frontend/auth.js](frontend/auth.js) with your real Cognito credentials
  - User Pool: `us-east-2_FAWeRCqg6`
  - Client ID: `3jgk6bspjforn3v0vccoo8rr95`
  - Region: `us-east-2`
- **Updated**: [frontend/config.js](frontend/config.js) with matching Amplify configuration

### 2. ✅ API Base URL Configuration
- **Created**: [frontend/backend-config.js](frontend/backend-config.js) - Centralized backend configuration
- **Updated**: [frontend/api.js](frontend/api.js) to use dynamic backend URL
- **Updated**: [frontend/config.js](frontend/config.js) to import from api.js
- **Fixed**: Capacitor configuration to use `https` scheme instead of `http`

### 3. ✅ Consolidated Duplicate Controllers
- **Removed**: `EmergencyController.java` (backed up to `.backup`)
- **Updated**: [CrisisController.java](src/main/java/com/example/resqtap/controller/CrisisController.java)
  - Now responds to both `/api/crisis-plans` AND `/api/emergencies`
  - Single source of truth for emergency endpoints

### 4. ✅ Standardized DTO Usage
- **Updated**: [EmergencyDTO.java](src/main/java/com/example/resqtap/dto/EmergencyDTO.java)
  - Added `slug` field for URL-friendly emergency identification
  - Auto-generates slug from emergency name (e.g., "CPR Adult" → "cpr-adult")
- **Fixed**: [frontend/injury.js](frontend/injury.js) endpoint path from `/id/{slug}` to `/slug/{slug}`

### 5. ✅ Fixed Resource Loading Issue
- **Fixed**: Capacitor config to prevent `localhost` resource loading errors
- Updated from `androidScheme: "http"` to `androidScheme: "https"`
- Added hostname configuration for proper app resource loading

---

## CRITICAL: Configure Your Backend IP Address

**⚠️ IMPORTANT: You MUST update this before testing on your phone!**

### Step 1: Find Your Computer's IP Address

**On Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually something like `192.168.1.x` or `10.0.x.x`)

**On Mac:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```
Or go to System Settings → Network → Your WiFi → Details

**On Linux:**
```bash
ip addr show | grep "inet "
```

### Step 2: Update Backend Configuration

Open [frontend/backend-config.js](frontend/backend-config.js) and change line 15:

```javascript
// BEFORE (default):
export const BACKEND_IP = '192.168.1.50'; // CHANGE THIS TO YOUR ACTUAL IP

// AFTER (use YOUR actual IP):
export const BACKEND_IP = '192.168.1.123'; // Your computer's IP
```

### Step 3: Ensure Same WiFi Network

**CRITICAL**: Your phone and computer MUST be on the SAME WiFi network!

- Phone WiFi: `YourHomeWiFi`
- Computer WiFi: `YourHomeWiFi` (must match!)

---

## Running the Application

### Backend (Spring Boot)

1. **Start the backend server:**
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
   ```

2. **Verify it's running:**
   - Open browser: http://localhost:8080/api/emergencies
   - You should see JSON data with 72 emergencies

3. **Test from your phone's perspective:**
   - Replace `localhost` with your IP from Step 1
   - Example: http://192.168.1.123:8080/api/emergencies
   - If this works in your phone's browser, the app will work!

### Mobile App (Capacitor)

1. **Sync web content to native projects:**
   ```bash
   cd mobile
   npm run cap:sync
   ```

2. **For Android:**
   ```bash
   npm run cap:open:android
   ```
   Then in Android Studio, click the green "Run" button

3. **For iOS:**
   ```bash
   npm run cap:open:ios
   ```
   Then in Xcode, select your device and click "Run"

---

## Troubleshooting

### Issue: "Startup Error - failed to load resource"

**Cause**: App trying to load from `localhost` instead of local network IP

**Fix**:
1. Double-check you updated [backend-config.js](frontend/backend-config.js) with YOUR IP
2. Rebuild the app: `npm run cap:sync` in the `mobile/` directory
3. Completely close and restart the app on your phone

### Issue: "Network request failed" or "Cannot connect to backend"

**Checklist**:
- [ ] Backend is running (`./mvnw spring-boot:run`)
- [ ] Phone and computer are on same WiFi
- [ ] Backend IP in [backend-config.js](frontend/backend-config.js) is correct
- [ ] Test the URL in phone's browser first: `http://YOUR_IP:8080/api/emergencies`
- [ ] Check firewall: Allow port 8080 on your computer

**Windows Firewall:**
```powershell
netsh advfirewall firewall add rule name="Spring Boot" dir=in action=allow protocol=TCP localport=8080
```

**Mac Firewall:**
System Settings → Network → Firewall → Allow port 8080

### Issue: "Authentication failed" or "Cognito errors"

**Verify Cognito Setup**:
1. Check AWS Cognito console: https://console.aws.amazon.com/cognito
2. Verify User Pool ID matches: `us-east-2_FAWeRCqg6`
3. Verify Client ID matches: `3jgk6bspjforn3v0vccoo8rr95`
4. Check App Client settings:
   - Enable "Authorization code grant"
   - Enable "Implicit grant" (for testing)
   - Add callback URL: `resqtap://auth/callback`

### Issue: Dark blue screen with no content

**Cause**: JavaScript error preventing app initialization

**Debug**:
1. Enable USB debugging on phone
2. Connect to computer
3. For Android: Chrome → `chrome://inspect` → Find your device
4. For iOS: Safari → Develop → [Your iPhone] → ResqTap
5. Check console for JavaScript errors

---

## Testing Checklist

### Backend Testing
- [ ] Backend starts successfully: `./mvnw spring-boot:run`
- [ ] API responds: http://localhost:8080/api/emergencies
- [ ] Returns 72 emergencies in JSON format
- [ ] Can access from phone's browser using computer's IP

### Mobile App Testing
- [ ] Updated [backend-config.js](frontend/backend-config.js) with correct IP
- [ ] Synced Capacitor: `npm run cap:sync`
- [ ] App launches without "Startup Error"
- [ ] Emergency cards load and display
- [ ] Clicking an emergency shows step-by-step instructions
- [ ] Favorites button works
- [ ] Can navigate between steps (Next/Back)
- [ ] Search and filters work

### Authentication Testing
- [ ] Can access login screen
- [ ] Login redirects to AWS Cognito
- [ ] Can sign up for new account
- [ ] Can log in with existing account
- [ ] Token is stored and persists on app restart

---

## API Endpoints Reference

All endpoints now available at both paths:
- `/api/crisis-plans/*` (original)
- `/api/emergencies/*` (new, frontend uses this)

### Available Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/emergencies` | Get all emergencies (72 items) |
| GET | `/api/emergencies/{id}` | Get emergency by ID |
| GET | `/api/emergencies/slug/{slug}` | Get by URL slug (e.g., "cpr-adult") |
| GET | `/api/emergencies/name/{name}` | Get by exact name |
| GET | `/api/emergencies/search?term=cpr` | Search emergencies |
| GET | `/api/emergencies/category/cardiac` | Filter by category |
| GET | `/api/emergencies/severity/CRITICAL` | Filter by severity |
| GET | `/api/emergencies/critical` | Get all critical/high severity |

---

## Next Steps

1. **Update Backend IP**: Edit [backend-config.js](frontend/backend-config.js) with your computer's IP
2. **Start Backend**: Run `./mvnw spring-boot:run`
3. **Sync Capacitor**: In `mobile/` folder, run `npm run cap:sync`
4. **Build & Run**: Open in Android Studio or Xcode and run on your device
5. **Test**: Try loading emergencies, clicking cards, navigation, favorites

---

## Additional Configuration (Optional)

### Enable HTTPS (Production)

For production, you'll want to use HTTPS. Current setup uses HTTP for development/testing.

1. Get SSL certificate (Let's Encrypt, AWS Certificate Manager, etc.)
2. Configure Spring Boot for HTTPS in `application-prod.yml`
3. Update Capacitor config to use `https://` URLs
4. Deploy to proper hosting (AWS, Heroku, etc.)

### Database Migration (Production)

Current setup uses H2 (in-memory) for dev. For production:

1. Set up PostgreSQL database (AWS RDS recommended)
2. Update `application-prod.yml` with database credentials
3. Set environment variables on hosting platform
4. Run with: `java -jar resqtap-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod`

---

## Build Information

- **Backend JAR**: `target/resqtap-0.0.1-SNAPSHOT.jar`
- **Spring Boot**: 3.5.0
- **Java**: 17
- **Database**: H2 (dev), PostgreSQL (prod)
- **Caching**: Caffeine
- **Security**: OAuth2 + JWT (AWS Cognito)

---

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Verify all checklist items
3. Check browser console (F12) for errors
4. Check Spring Boot console output for backend errors
5. Verify Cognito configuration in AWS Console

**Common Mistake**: Forgetting to update the IP in backend-config.js - this is the #1 cause of mobile app failures!
