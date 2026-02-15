import { saveProfile } from './profileService.js';

const form = document.getElementById('onboardForm');
const skipBtn = document.getElementById('skipBtn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    
    const conditions = [];
    form.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => conditions.push(cb.value));
    if (document.getElementById('conditionsOther').value) {
        conditions.push(document.getElementById('conditionsOther').value);
    }

    const profile = {
        bloodType: formData.get('bloodType'),
        allergies: formData.get('allergies').split(',').map(s => s.trim()).filter(Boolean),
        chronicConditions: conditions,
        emergencyContacts: formData.get('contacts').split(',').map(s => s.trim()).filter(Boolean),
        country: formData.get('country'),
        preferredLanguage: formData.get('language'),
        updatedAt: new Date().toISOString()
    };

    await saveProfile(profile);
    window.location.href = 'index.html';
});

skipBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});