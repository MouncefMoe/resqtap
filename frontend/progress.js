import { getProgressSummary } from './progressService.js';
import { triggerSync, startSync } from './syncService.js';

const refreshBadge = document.getElementById('refreshBadge');
const lastDateEl = document.getElementById('lastDate');
const totalSessionsEl = document.getElementById('totalSessions');
const monthlyList = document.getElementById('monthlyList');

async function render() {
    const summary = await getProgressSummary();
    if (summary.lastTrainingDate) {
        lastDateEl.textContent = `Last training: ${new Date(summary.lastTrainingDate).toLocaleDateString()}`;
    } else {
        lastDateEl.textContent = 'Last training: —';
    }
    totalSessionsEl.textContent = `Total sessions: ${summary.total}`;
    if (summary.refreshOverdue) {
        refreshBadge.textContent = 'Refresh overdue';
        refreshBadge.className = 'badge muted-badge';
    } else {
        refreshBadge.textContent = 'Up to date';
        refreshBadge.className = 'badge success-badge';
    }
    monthlyList.innerHTML = '';
    const entries = Object.entries(summary.monthlyCounts).sort(([a], [b]) => (a < b ? 1 : -1));
    if (!entries.length) {
        const li = document.createElement('li');
        li.textContent = 'No training sessions yet.';
        monthlyList.appendChild(li);
        return;
    }
    entries.forEach(([month, count]) => {
        const li = document.createElement('li');
        li.textContent = `${month}: ${count}`;
        monthlyList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    startSync();
    triggerSync('progress-open');
    render();
});
