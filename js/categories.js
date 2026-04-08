// DAYMAP — Category Manager
// User-created categories stored in localStorage. Each category: { id, name, color }

const CAT_KEY = 'daymap_categories';

// Functions
function getCategories() {
    try {
        return JSON.parse(localStorage.getItem(CAT_KEY) || '[]');
    } catch { return []; }
}

function saveCategories(cats) {
    localStorage.setItem(CAT_KEY, JSON.stringify(cats));
}

function createCategory(name, color) {
    const cats = getCategories();
    const id   = 'cat_' + Date.now();
    cats.push({ id, name: name.trim(), color });
    saveCategories(cats);
    return { id, name, color };
}

function deleteCategory(id) {
    saveCategories(getCategories().filter(c => c.id !== id));
}

function getCategoryById(id) {
    return getCategories().find(c => c.id === id) || null;
}

// Render chips into the sheet row
let selectedCategoryIds = [];

function renderCategoryChips() {
    const row      = document.getElementById('category-chips-row');
    const addChip  = document.getElementById('add-category-chip');
    if (!row) return;

    // Remove existing chips (not the add-chip)
    row.querySelectorAll('.category-chip').forEach(el => el.remove());

    const cats = getCategories();

    cats.forEach(cat => {
        const chip = document.createElement('button');
        chip.className = 'category-chip';
        chip.dataset.id = cat.id;
        chip.textContent = cat.name;

        // Base style from color
        applyCategoryChipStyle(chip, cat.color, false);

        // Selection toggle
        chip.addEventListener('click', function() {
            const idx = selectedCategoryIds.indexOf(cat.id);
            if (idx === -1) {
                selectedCategoryIds.push(cat.id);
                applyCategoryChipStyle(chip, cat.color, true);
            } else {
                selectedCategoryIds.splice(idx, 1);
                applyCategoryChipStyle(chip, cat.color, false);
            }
        });

        // Right-click to delete
        chip.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            if (confirm(`Delete category "${cat.name}"?`)) {
                deleteCategory(cat.id);
                renderCategoryChips();
            }
        });

        row.insertBefore(chip, addChip);
    });

    // Re-init lucide icons for any new icons
    if (window.lucide) lucide.createIcons();
}

function applyCategoryChipStyle(chip, color, selected) {
    if (selected) {
        chip.style.background    = color;
        chip.style.color         = '#fff';
        chip.style.borderColor   = color;
        chip.style.boxShadow     = `0 3px 10px ${color}55`;
    } else {
        chip.style.background    = hexToRgba(color, 0.10);
        chip.style.color         = color;
        chip.style.borderColor   = hexToRgba(color, 0.28);
        chip.style.boxShadow     = 'none';
    }
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

function getSelectedCategories() {
    return selectedCategoryIds
        .map(id => getCategoryById(id))
        .filter(Boolean);
}

function resetCategorySelection() {
    selectedCategoryIds = [];
    document.querySelectorAll('.category-chip').forEach(chip => {
        const cat = getCategoryById(chip.dataset.id);
        if (cat) applyCategoryChipStyle(chip, cat.color, false);
    });
}


// Category Popup
let chosenColor = '#2563EB';

function openCategoryPopup() {
    const popup = document.getElementById('category-popup');
    const inner = document.querySelector('.sheet-inner');
    if (!popup || !inner) return;

    popup.classList.add('open');
    popup.setAttribute('aria-hidden', 'false');
    inner.classList.add('blurred');

    document.getElementById('new-category-name').value = '';
    updateCategoryPreview();
    setTimeout(() => document.getElementById('new-category-name').focus(), 200);
}

function closeCategoryPopup() {
    const popup = document.getElementById('category-popup');
    const inner = document.querySelector('.sheet-inner');
    popup?.classList.remove('open');
    popup?.setAttribute('aria-hidden', 'true');
    inner?.classList.remove('blurred');
}

function updateCategoryPreview() {
    const badge = document.getElementById('category-preview-badge');
    const name  = document.getElementById('new-category-name')?.value.trim() || 'Category';
    if (!badge) return;
    badge.textContent        = name;
    badge.style.background   = hexToRgba(chosenColor, 0.12);
    badge.style.color        = chosenColor;
    badge.style.borderColor  = hexToRgba(chosenColor, 0.28);
}


// Wire popup events
document.addEventListener('DOMContentLoaded', function() {
    renderCategoryChips();

    // Open popup
    document.getElementById('add-category-chip')
        ?.addEventListener('click', openCategoryPopup);

    // Close popup
    document.getElementById('category-popup-close')
        ?.addEventListener('click', closeCategoryPopup);

    // Color swatches
    document.querySelectorAll('.color-swatch[data-color]').forEach(swatch => {
        swatch.addEventListener('click', function() {
            chosenColor = this.dataset.color;
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            updateCategoryPreview();
        });
    });

    // Custom color input
    const customInput = document.getElementById('custom-color-input');
    customInput?.addEventListener('input', function() {
        chosenColor = this.value;
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
        this.closest('.color-swatch-custom').classList.add('selected');
        updateCategoryPreview();
    });

    // Live preview on name input
    document.getElementById('new-category-name')
        ?.addEventListener('input', updateCategoryPreview);

    // Create button
    document.getElementById('category-create-btn')
        ?.addEventListener('click', function() {
            const name = document.getElementById('new-category-name')?.value.trim();
            if (!name) {
                document.getElementById('new-category-name').style.borderColor = '#EF4444';
                document.getElementById('new-category-name').focus();
                setTimeout(() => document.getElementById('new-category-name').style.borderColor = '', 1500);
                return;
            }
            createCategory(name, chosenColor);
            renderCategoryChips();
            closeCategoryPopup();
        });
});