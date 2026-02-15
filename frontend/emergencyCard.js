/**
 * emergencyCard.js - Emergency Card Display
 *
 * Shows critical medical information for first responders.
 * Key behaviors:
 * - Hide sections with no data (don't show placeholders)
 * - Make emergency contacts tappable (tel: links)
 * - Read from same profileService as profile.js
 */

import { getProfile } from './profileService.js';

// DOM Elements
const nameSection = document.getElementById('nameSection');
const userNameValue = document.getElementById('userNameValue');
const bloodTypeSection = document.getElementById('bloodTypeSection');
const bloodTypeValue = document.getElementById('bloodTypeValue');
const allergiesSection = document.getElementById('allergiesSection');
const allergiesValue = document.getElementById('allergiesValue');
const conditionsSection = document.getElementById('conditionsSection');
const conditionsValue = document.getElementById('conditionsValue');
const medicationsSection = document.getElementById('medicationsSection');
const medicationsValue = document.getElementById('medicationsValue');
const contactsSection = document.getElementById('contactsSection');
const contactsList = document.getElementById('contactsList');

/**
 * Convert array to readable text
 */
function listToText(list) {
    if (!list || !Array.isArray(list) || list.length === 0) return null;
    return list.join(', ');
}

/**
 * Extract phone number from "Name: Phone" format
 */
function extractPhone(contact) {
    if (!contact) return null;

    // Try to extract phone from "Name: Phone" format
    const colonIndex = contact.indexOf(':');
    if (colonIndex !== -1) {
        const phone = contact.substring(colonIndex + 1).trim();
        // Remove non-phone characters for the href, keep display as-is
        return phone;
    }

    // If no colon, assume the whole thing might be a phone
    return contact;
}

/**
 * Create a clean phone number for tel: links
 */
function cleanPhoneForLink(phone) {
    if (!phone) return '';
    // Keep only digits, +, and -
    return phone.replace(/[^\d+\-]/g, '');
}

/**
 * Hide a section if it has no data
 */
function hideIfEmpty(section, value) {
    if (!section) return;
    if (!value || value === '-') {
        section.classList.add('hidden');
    } else {
        section.classList.remove('hidden');
    }
}

/**
 * Render the emergency card with profile data
 */
async function renderCard() {
    try {
        const profile = await getProfile();

        // User Name
        const userName = profile.userName || null;
        if (userNameValue) userNameValue.textContent = userName || '-';
        hideIfEmpty(nameSection, userName);

        // Blood Type
        const bloodType = profile.bloodType || null;
        if (bloodTypeValue) bloodTypeValue.textContent = bloodType || '-';
        hideIfEmpty(bloodTypeSection, bloodType);

        // Allergies
        const allergies = listToText(profile.allergies);
        if (allergiesValue) allergiesValue.textContent = allergies || '-';
        hideIfEmpty(allergiesSection, allergies);

        // Chronic Conditions
        const conditions = listToText(profile.chronicConditions);
        if (conditionsValue) conditionsValue.textContent = conditions || '-';
        hideIfEmpty(conditionsSection, conditions);

        // Medications
        const medications = profile.medications || null;
        if (medicationsValue) medicationsValue.textContent = medications || '-';
        hideIfEmpty(medicationsSection, medications);

        // Emergency Contacts
        const contacts = profile.emergencyContacts || [];
        if (contactsList) {
            contactsList.innerHTML = '';

            if (contacts.length === 0) {
                // Hide the entire contacts section if no contacts
                if (contactsSection) contactsSection.classList.add('hidden');
            } else {
                if (contactsSection) contactsSection.classList.remove('hidden');

                contacts.forEach(contact => {
                    const li = document.createElement('li');
                    const phone = extractPhone(contact);
                    const cleanPhone = cleanPhoneForLink(phone);

                    if (cleanPhone) {
                        // Create tappable link
                        const link = document.createElement('a');
                        link.href = `tel:${cleanPhone}`;
                        link.className = 'contact-item';
                        link.textContent = contact;
                        li.appendChild(link);
                    } else {
                        // Just display text if no valid phone
                        const span = document.createElement('span');
                        span.className = 'contact-item';
                        span.textContent = contact;
                        li.appendChild(span);
                    }

                    contactsList.appendChild(li);
                });
            }
        }

    } catch (err) {
        console.error('[EmergencyCard] Failed to load profile:', err);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    renderCard();
});
