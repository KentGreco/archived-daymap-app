// DAYMAP - Add task sheet
// Logic for the task sheet UI and interactions

//Sheet open/close logic
const addCard = document.getElementById('add-task-card');
const sheet = document.getElementById('add-task-sheet');
const overlay = document.getElementById('sheet-overlay');
const closeButton = document.getElementById('close-sheet-button');

function openSheet() {
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
    overlay.classList.add('visible');
    setTimeout(() => document.getElementById('sheet-title').focus(), 300);
}

function closeSheet() {
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('visible');
}

addCard.addEventListener('click', openSheet);
addCard.addEventListener('keydown', e=> {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openSheet();
    }
});
closeButton.addEventListener('click', closeSheet);
overlay.addEventListener('click', closeSheet);

//Delete on hover logic
document.querySelectorAll('task-delete-button').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const card = this.closest('.task-card');
        card.classList.add('removing');
        setTimeout(() => card.remove(), 280);
    });
});

//Category UI logic
document.querySelectorAll('.category-ui').forEach(ui => {
    ui.addEventListener('click', function() {
        document.querySelectorAll('.category-ui').forEach(p => p.classList.remove('selected'));
        this.classList.add('selected');
        document.getElementById('sheet-rate').style.display = this.dataset.cat === 'work' ? 'block' : 'none';
    });
});