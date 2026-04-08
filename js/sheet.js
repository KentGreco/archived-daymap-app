// DAYMAP — Sheet Controller
// Sliding calendar, time drums, priority scroller, recurring options, quick parser, save task.

const addCard     = document.getElementById('add-task-card');
const sheet       = document.getElementById('add-task-sheet');
const overlay     = document.getElementById('sheet-overlay');
const closeButton = document.getElementById('sheet-close');
const saveButton  = document.getElementById('sheet-save');
 
function openSheet() {
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
    overlay.classList.add('visible');
    setSheetDefaults();
    renderRecentChips();
    if (typeof renderCategoryChips === 'function') renderCategoryChips();
    setTimeout(() => document.getElementById('quick-add-input')?.focus(), 320);
}
 
function closeSheet() {
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('visible');
}
 
function clearSheet() {
    document.getElementById('quick-add-input').value  = '';
    document.getElementById('sheet-title').value      = '';
    document.getElementById('sheet-location').value   = '';
    document.getElementById('sheet-notes').value      = '';
    if (typeof resetCategorySelection === 'function') resetCategorySelection();
    resetCustomDate();
    resetCustomTime();
    resetPriority();
    resetRecurring();
}
 
addCard?.addEventListener('click', openSheet);
addCard?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSheet(); }
});
closeButton?.addEventListener('click', closeSheet);
overlay?.addEventListener('click', closeSheet);

//  DEFAULT DATE & TIME
function setSheetDefaults() {
    const now  = new Date();
    setCustomDate(now.toISOString().split('T')[0]);
    const next = new Date(now);
    next.setHours(now.getHours() + 1, 0, 0, 0);
    setCustomTime(`${String(next.getHours()).padStart(2,'0')}:00`);
}

//  CUSTOM DATE PICKER + SLIDING CALENDAR
const MONTHS_FULL  = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun',
                      'Jul','Aug','Sep','Oct','Nov','Dec'];
 
let selectedDate   = new Date();
 
function renderDateDisplay() {
    const d = selectedDate;
    const el = document.getElementById('date-display');
    if (el) el.textContent =
        `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// Exported for parser.js
function setCustomDate(iso) {
    if (!iso) return;
    const [y, m, day] = iso.split('-').map(Number);
    selectedDate  = new Date(y, m - 1, day);
    renderDateDisplay();
}

function resetCustomDate() {
    selectedDate = new Date();
    renderDateDisplay();
}

function getSelectedDate() {
    return selectedDate.toISOString().split('T')[0];
}
 
// Date arrow navigation (prev/next day)
document.addEventListener('click', function(e) {
    if (e.target.closest('#date-prev')) {
        selectedDate.setDate(selectedDate.getDate() - 1);
        renderDateDisplay();
        return;
    }
    if (e.target.closest('#date-next')) {
        selectedDate.setDate(selectedDate.getDate() + 1);
        renderDateDisplay();
        return;
    }
});
 
 

//  CUSTOM TIME PICKER

let selectedHour   = 12;
let selectedMinute = 0;
let selectedPeriod = 'PM';
 
function renderTimeDisplay() {
    const h = document.getElementById('time-hour');
    const m = document.getElementById('time-minute');
    const p = document.getElementById('time-period');
    if (h) h.textContent = String(selectedHour).padStart(2,'0');
    if (m) m.textContent = String(selectedMinute).padStart(2,'0');
    if (p) p.textContent = selectedPeriod;
}
 
// Exported for parser.js
function setCustomTime(hhmm) {
    if (!hhmm) return;
    const [h, m]   = hhmm.split(':').map(Number);
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
 
document.addEventListener('click', function(e) {
    if (e.target.closest('#hour-up'))     { selectedHour = (selectedHour % 12) + 1; renderTimeDisplay(); }
    if (e.target.closest('#hour-down'))   { selectedHour = selectedHour === 1 ? 12 : selectedHour - 1; renderTimeDisplay(); }
    if (e.target.closest('#min-up'))      { selectedMinute = (selectedMinute + 5) % 60; renderTimeDisplay(); }
    if (e.target.closest('#min-down'))    { selectedMinute = (selectedMinute - 5 + 60) % 60; renderTimeDisplay(); }
    if (e.target.closest('#period-toggle')) {
        selectedPeriod = selectedPeriod === 'AM' ? 'PM' : 'AM';
        renderTimeDisplay();
    }
});
 
 

//  PRIORITY SCROLLER

const PRIORITIES      = ['high', 'medium', 'low'];
const PRIORITY_LABELS = { high: '🔴 High', medium: '🟡 Med', low: '🟢 Low' };
let currentPriorityIndex = 1;
 
function renderPriority() {
    const track  = document.getElementById('priority-track');
    const handle = document.getElementById('priority-handle');
    const label  = document.getElementById('priority-label');
    if (!track || !handle || !label) return;
 
    const pct = (currentPriorityIndex / (PRIORITIES.length - 1)) * 100;
    handle.style.left    = `${pct}%`;
    track.dataset.priority = PRIORITIES[currentPriorityIndex];
    label.textContent    = PRIORITY_LABELS[PRIORITIES[currentPriorityIndex]];
}
 
function resetPriority() { currentPriorityIndex = 1; renderPriority(); }
function getSelectedPriority() { return PRIORITIES[currentPriorityIndex]; }
 
document.addEventListener('click', function(e) {
    if (e.target.closest('#priority-prev')) {
        currentPriorityIndex = Math.max(0, currentPriorityIndex - 1);
        renderPriority();
    }
    if (e.target.closest('#priority-next')) {
        currentPriorityIndex = Math.min(PRIORITIES.length - 1, currentPriorityIndex + 1);
        renderPriority();
    }
    const track = e.target.closest('#priority-track');
    if (track && !e.target.closest('#priority-handle')) {
        const rect = track.getBoundingClientRect();
        const pct  = (e.clientX - rect.left) / rect.width;
        currentPriorityIndex = Math.round(pct * (PRIORITIES.length - 1));
        currentPriorityIndex = Math.max(0, Math.min(PRIORITIES.length - 1, currentPriorityIndex));
        renderPriority();
    }
});
 
// Drag handle
(function() {
    let dragging = false;
    document.addEventListener('mousedown', e => { if (e.target.closest('#priority-handle')) dragging = true; });
    document.addEventListener('mousemove', e => {
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
 
 

//  RECURRING OPTIONS
let recurringEnabled  = false;
let currentFreq       = 'daily';
let selectedRecurDays = []; // for weekly mode (0=Sun…6=Sat)
 
function resetRecurring() {
    recurringEnabled  = false;
    currentFreq       = 'daily';
    selectedRecurDays = [];
 
    const toggle = document.getElementById('recurring-toggle');
    if (toggle) toggle.checked = false;
 
    const opts = document.getElementById('recurring-options');
    if (opts) opts.style.display = 'none';
 
    document.querySelectorAll('.recur-freq-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.freq === 'daily');
    });
    document.querySelectorAll('.recur-day-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('recur-days-row')?.style && (document.getElementById('recur-days-row').style.display = 'none');
    document.getElementById('recur-custom-row')?.style && (document.getElementById('recur-custom-row').style.display = 'none');
    if (document.getElementById('recur-interval')) document.getElementById('recur-interval').value = '1';
}
 
function getRecurringData() {
    if (!recurringEnabled) return null;
    const base = { freq: currentFreq };
    if (currentFreq === 'weekly') base.days = [...selectedRecurDays];
    if (currentFreq === 'custom') {
        base.interval = parseInt(document.getElementById('recur-interval')?.value || '1', 10);
        base.unit     = document.getElementById('recur-unit')?.value || 'days';
    }
    return base;
}
 
document.addEventListener('DOMContentLoaded', function() {
    // Recurring toggle
    document.getElementById('recurring-toggle')?.addEventListener('change', function() {
        recurringEnabled = this.checked;
        const opts = document.getElementById('recurring-options');
        if (opts) opts.style.display = recurringEnabled ? 'block' : 'none';
    });
 
    // Frequency buttons
    document.querySelectorAll('.recur-freq-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentFreq = this.dataset.freq;
            document.querySelectorAll('.recur-freq-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('recur-days-row').style.display   = currentFreq === 'weekly' ? 'flex' : 'none';
            document.getElementById('recur-custom-row').style.display = currentFreq === 'custom'  ? 'flex' : 'none';
        });
    });
 
    // Day toggle buttons (weekly)
    document.querySelectorAll('.recur-day-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const day = parseInt(this.dataset.day);
            const idx = selectedRecurDays.indexOf(day);
            if (idx === -1) { selectedRecurDays.push(day); this.classList.add('active'); }
            else { selectedRecurDays.splice(idx, 1); this.classList.remove('active'); }
        });
    });
});
 
//  QUICK-ADD NATURAL LANGUAGE PARSER
document.getElementById('quick-parse-btn')?.addEventListener('click', function() {
    const raw = document.getElementById('quick-add-input')?.value.trim();
    if (!raw) return;
    this.textContent = '...';
    this.disabled    = true;
    try {
        const parsed = parseTaskInput(raw);
        if (parsed) applyParsedTask(parsed);
        document.getElementById('quick-add-input').value = '';
    } catch (e) { console.warn('Quick parse failed:', e); }
    this.textContent = '→';
    this.disabled    = false;
});
 
document.getElementById('quick-add-input')?.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('quick-parse-btn')?.click(); }
});
 
//  RECENT TASK CHIPS
function saveRecentTask(taskData) {
    let recents = JSON.parse(localStorage.getItem('daymap_recents') || '[]');
    recents = recents.filter(t => t.title !== taskData.title);
    recents.unshift({ title: taskData.title, categoryIds: taskData.categoryIds || [] });
    localStorage.setItem('daymap_recents', JSON.stringify(recents.slice(0, 5)));
}
 
function renderRecentChips() {
    const container = document.getElementById('recent-chips');
    if (!container) return;
    const recents = JSON.parse(localStorage.getItem('daymap_recents') || '[]');
    if (recents.length === 0) { container.style.display = 'none'; return; }
 
    container.style.display = 'flex';
    container.innerHTML = recents.map(r =>
        `<button class="recent-chip" data-title="${r.title}">${r.title}</button>`
    ).join('');
 
    container.querySelectorAll('.recent-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            document.getElementById('sheet-title').value = this.dataset.title;
        });
    });
}
 
//  SAVE TASK
saveButton?.addEventListener('click', function() {
    const title = document.getElementById('sheet-title')?.value.trim();
    if (!title) {
        const input = document.getElementById('sheet-title');
        input.style.borderColor = '#EF4444';
        input.focus();
        setTimeout(() => input.style.borderColor = '', 1500);
        return;
    }
 
    const cats        = (typeof getSelectedCategories === 'function') ? getSelectedCategories() : [];
    const recurData   = getRecurringData();
 
    const taskData = {
        title,
        categories:   cats,          // array of { id, name, color }
        categoryIds:  cats.map(c => c.id),
        date:         getSelectedDate(),
        time:         getSelectedTime(),
        locationName: document.getElementById('sheet-location')?.value.trim() || '',
        priority:     getSelectedPriority(),
        notes:        document.getElementById('sheet-notes')?.value.trim() || '',
        recurring:    recurData
    };
 
    saveRecentTask(taskData);
    addTask(taskData);
    renderTimeline();
    clearSheet();
    closeSheet();
});
 
//  INIT
document.addEventListener('DOMContentLoaded', function() {
    renderDateDisplay();
    renderTimeDisplay();
    renderPriority();
});