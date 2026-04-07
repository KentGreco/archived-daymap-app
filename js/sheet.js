// DAYMAP - Sheet Controller
// Custom date/time pickers, priority scroller, quick-add parser, open/close

// Sheet Open/Close
const addCard    = document.getElementById('add-task-card');
const sheet      = document.getElementById('add-task-sheet');
const overlay    = document.getElementById('sheet-overlay');
const closeButton = document.getElementById('sheet-close');
const saveButton = document.getElementById('sheet-save');

function openSheet() {
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
    overlay.classList.add('visible');
    setSheetDefaults();
    renderRecentChips();
    setTimeout(() => document.getElementById('quick-add-input').focus(), 320);
}

function closeSheet() {
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('visible');
}

function clearSheet() {
    document.getElementById('quick-add-input').value = '';
    document.getElementById('sheet-title').value     = '';
    document.getElementById('sheet-location').value  = '';
    document.getElementById('sheet-notes').value     = '';
    resetCustomDate();
    resetCustomTime();
    resetPriority();
    document.querySelectorAll('.category-ui').forEach(p => p.classList.remove('selected'));
    document.querySelector('.category-ui[data-cat="assignment"]').classList.add('selected');
}

addCard.addEventListener('click', openSheet);
addCard.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSheet(); }
});
closeButton.addEventListener('click', closeSheet);
overlay.addEventListener('click', closeSheet);


// Default Date and Time
function setSheetDefaults() {
    const now = new Date();

    // Default date = today
    setCustomDate(now.toISOString().split('T')[0]);

    // Default time = next round hour
    const next = new Date(now);
    next.setHours(now.getHours() + 1, 0, 0, 0);
    setCustomTime(`${String(next.getHours()).padStart(2,'0')}:00`);
}


// Custom Date Picker
let selectedDate = new Date();

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun',
                'Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS_IN_MONTH = (m, y) => new Date(y, m + 1, 0).getDate();

function buildDatePicker() {
    const picker = document.getElementById('custom-date-picker');
    if (!picker) return;

    const today = new Date();
    selectedDate = new Date(today);

    renderDateDisplay();
}

function renderDateDisplay() {
    const d = selectedDate;
    const display = document.getElementById('date-display');
    if (display) {
        display.textContent =
            `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
        display.dataset.value = d.toISOString().split('T')[0];
    }
}

// Parser Logic
function setCustomDate(isoString) {
    if (!isoString) return;
    const [y, m, day] = isoString.split('-').map(Number);
    selectedDate = new Date(y, m - 1, day);
    renderDateDisplay();
}

function resetCustomDate() {
    selectedDate = new Date();
    renderDateDisplay();
}

function getSelectedDate() {
    return document.getElementById('date-display')?.dataset.value || '';
}

// Date picker arrow buttons (prev/next day)
document.addEventListener('click', function(e) {
    if (e.target.closest('#date-prev')) {
        selectedDate.setDate(selectedDate.getDate() - 1);
        renderDateDisplay();
    }
    if (e.target.closest('#date-next')) {
        selectedDate.setDate(selectedDate.getDate() + 1);
        renderDateDisplay();
    }
});


// Custom Time Picker
let selectedHour   = 12;
let selectedMinute = 0;
let selectedPeriod = 'PM';

function renderTimeDisplay() {
    const hEl = document.getElementById('time-hour');
    const mEl = document.getElementById('time-minute');
    const pEl = document.getElementById('time-period');
    if (hEl) hEl.textContent = String(selectedHour).padStart(2, '0');
    if (mEl) mEl.textContent = String(selectedMinute).padStart(2, '0');
    if (pEl) pEl.textContent = selectedPeriod;
}

// Exported: called by parser.js and setSheetDefaults
function setCustomTime(hhmm) {
    if (!hhmm) return;
    const [h, m] = hhmm.split(':').map(Number);
    selectedHour   = h % 12 || 12;
    selectedMinute = m;
    selectedPeriod = h >= 12 ? 'PM' : 'AM';
    renderTimeDisplay();
}

function resetCustomTime() {
    const next = new Date();
    next.setHours(next.getHours() + 1, 0, 0, 0);
    setCustomTime(`${String(next.getHours()).padStart(2,'0')}:00`);
}

function getSelectedTime() {
    let h24 = selectedHour % 12;
    if (selectedPeriod === 'PM') h24 += 12;
    return `${String(h24).padStart(2,'0')}:${String(selectedMinute).padStart(2,'0')}`;
}

// Time drum interactions
document.addEventListener('click', function(e) {
    // Hour
    if (e.target.closest('#hour-up'))   { selectedHour = (selectedHour % 12) + 1; renderTimeDisplay(); }
    if (e.target.closest('#hour-down')) { selectedHour = selectedHour === 1 ? 12 : selectedHour - 1; renderTimeDisplay(); }
    // Minute (increments of 5)
    if (e.target.closest('#min-up'))    { selectedMinute = (selectedMinute + 5) % 60; renderTimeDisplay(); }
    if (e.target.closest('#min-down'))  { selectedMinute = (selectedMinute - 5 + 60) % 60; renderTimeDisplay(); }
    // Period toggle
    if (e.target.closest('#period-toggle')) {
        selectedPeriod = selectedPeriod === 'AM' ? 'PM' : 'AM';
        renderTimeDisplay();
    }
});


//Custom Priority Scroller
const PRIORITIES = ['high', 'medium', 'low'];
const PRIORITY_LABELS = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' };
let currentPriorityIndex = 1; // default: medium

function renderPriority() {
    const track  = document.getElementById('priority-track');
    const handle = document.getElementById('priority-handle');
    const label  = document.getElementById('priority-label');
    if (!track || !handle || !label) return;

    const pct = (currentPriorityIndex / (PRIORITIES.length - 1)) * 100;
    handle.style.left = `${pct}%`;

    const p = PRIORITIES[currentPriorityIndex];
    label.textContent = PRIORITY_LABELS[p];

    // Color the track fill
    track.dataset.priority = p;
}

function resetPriority() {
    currentPriorityIndex = 1;
    renderPriority();
}

function getSelectedPriority() {
    return PRIORITIES[currentPriorityIndex];
}

// Click on track to jump to nearest priority
document.addEventListener('click', function(e) {
    const track = e.target.closest('#priority-track');
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    currentPriorityIndex = Math.round(pct * (PRIORITIES.length - 1));
    currentPriorityIndex = Math.max(0, Math.min(PRIORITIES.length - 1, currentPriorityIndex));
    renderPriority();
});

// Arrow buttons on priority
document.addEventListener('click', function(e) {
    if (e.target.closest('#priority-prev')) {
        currentPriorityIndex = Math.max(0, currentPriorityIndex - 1);
        renderPriority();
    }
    if (e.target.closest('#priority-next')) {
        currentPriorityIndex = Math.min(PRIORITIES.length - 1, currentPriorityIndex + 1);
        renderPriority();
    }
});

// Mouse drag on the handle
(function setupPriorityDrag() {
    let dragging = false;

    document.addEventListener('mousedown', function(e) {
        if (e.target.closest('#priority-handle')) dragging = true;
    });

    document.addEventListener('mousemove', function(e) {
        if (!dragging) return;
        const track = document.getElementById('priority-track');
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const pct  = (e.clientX - rect.left) / rect.width;
        currentPriorityIndex = Math.round(pct * (PRIORITIES.length - 1));
        currentPriorityIndex = Math.max(0, Math.min(PRIORITIES.length - 1, currentPriorityIndex));
        renderPriority();
    });

    document.addEventListener('mouseup', () => { dragging = false; });
})();


//Quick add parser
const quickInput = document.getElementById('quick-add-input');
const quickBtn   = document.getElementById('quick-parse-btn');

if (quickBtn) {
    quickBtn.addEventListener('click', function() {
        const raw = quickInput?.value.trim();
        if (!raw) return;

        this.textContent = '...';
        this.disabled = true;

        try {
            const parsed = parseTaskInput(raw); // from parser.js
            if (parsed) {
                applyParsedTask(parsed);         // from parser.js
                quickInput.value = '';
            }
        } catch (e) {
            console.warn('Quick parse failed:', e);
        }

        this.textContent = '→';
        this.disabled = false;
    });

    // Also trigger on Enter key in quick input
    quickInput?.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); quickBtn.click(); }
    });
}


//Recent tasks chips
function saveRecentTask(taskData) {
    let recents = JSON.parse(localStorage.getItem('daymap_recents') || '[]');
    recents = recents.filter(t => t.title !== taskData.title);
    recents.unshift({ title: taskData.title, category: taskData.category, locationName: taskData.locationName });
    localStorage.setItem('daymap_recents', JSON.stringify(recents.slice(0, 5)));
}

function renderRecentChips() {
    const container = document.getElementById('recent-chips');
    if (!container) return;
    const recents = JSON.parse(localStorage.getItem('daymap_recents') || '[]');

    if (recents.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'flex';
    container.innerHTML = recents.map(r => `
        <button class="recent-chip" data-title="${r.title}"
                data-cat="${r.category}" data-loc="${r.locationName || ''}">
            ${r.title}
        </button>
    `).join('');

    container.querySelectorAll('.recent-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            document.getElementById('sheet-title').value    = this.dataset.title;
            document.getElementById('sheet-location').value = this.dataset.loc;
            document.querySelectorAll('.category-ui').forEach(p => p.classList.remove('selected'));
            const pill = document.querySelector(`.category-ui[data-cat="${this.dataset.cat}"]`);
            if (pill) pill.classList.add('selected');
        });
    });
}


//Category pills
document.querySelectorAll('.category-ui').forEach(pill => {
    pill.addEventListener('click', function() {
        document.querySelectorAll('.category-ui').forEach(p => p.classList.remove('selected'));
        this.classList.add('selected');
    });
});


//Save task
saveButton.addEventListener('click', function() {
    const title = document.getElementById('sheet-title').value.trim();
    if (!title) {
        const input = document.getElementById('sheet-title');
        input.style.borderColor = '#EF4444';
        input.focus();
        setTimeout(() => input.style.borderColor = '', 1500);
        return;
    }

    const selectedCat = document.querySelector('.category-ui.selected');

    const taskData = {
        title,
        category:     selectedCat ? selectedCat.dataset.cat : 'personal',
        date:         getSelectedDate(),
        time:         getSelectedTime(),
        locationName: document.getElementById('sheet-location').value.trim(),
        priority:     getSelectedPriority(),
        notes:        document.getElementById('sheet-notes').value.trim()
    };

    saveRecentTask(taskData);
    addTask(taskData);
    renderTimeline();
    clearSheet();
    closeSheet();
});


//Initialize pickers
document.addEventListener('DOMContentLoaded', function() {
    buildDatePicker();
    renderTimeDisplay();
    renderPriority();
});