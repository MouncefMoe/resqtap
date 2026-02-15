import { BACKEND_URL } from './backend-config.js';

export function getApiBase() {
  const isNative =
    typeof window !== "undefined" &&
    window.Capacitor &&
    window.Capacitor.isNativePlatform &&
    window.Capacitor.isNativePlatform();

  if (!isNative) {
    // Running in browser (development)
    return "http://localhost:8080";
  }

  const ua = navigator.userAgent || "";
  const isEmulator =
    /Android SDK built for x86|google_sdk|Emulator/i.test(ua);

  if (isEmulator) {
    // Android emulator uses special IP to reach host machine
    return "http://10.0.2.2:8080";
  }

  // REAL DEVICE - Check localStorage for custom backend URL first
  const customBackend = localStorage.getItem('resqtap_backend_url');
  if (customBackend) {
    return customBackend;
  }

  // Use the configured backend URL from backend-config.js
  // Make sure to update BACKEND_IP in backend-config.js with your computer's IP!
  return BACKEND_URL;
}
