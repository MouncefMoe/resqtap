/**
 * Backend Server Configuration
 *
 * IMPORTANT: When testing on a physical device, you MUST update the
 * BACKEND_IP with your computer's local IP address.
 *
 * To find your IP:
 * - Windows: Open CMD and run "ipconfig", look for IPv4 Address
 * - Mac/Linux: Open Terminal and run "ifconfig" or "ip addr", look for inet
 * - The IP usually looks like: 192.168.x.x or 10.0.x.x
 *
 * Make sure your phone and computer are on the SAME Wi-Fi network!
 */

// CONFIGURE THIS: Your computer's local IP address where Spring Boot is running
export const BACKEND_IP = '10.0.0.27'; // CHANGE THIS TO YOUR ACTUAL IP
export const BACKEND_PORT = '8080';

// Don't modify these unless you know what you're doing
export const BACKEND_URL = `http://${BACKEND_IP}:${BACKEND_PORT}`;
