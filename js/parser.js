// DAYMAP - Natural Language Task Parser
// Uses chrono-node

const FALLBACK_KEYWORD_MAP = [
    { keywords: ['homework','assignment','essay','report','study','exam','quiz',
                 'project','lab','paper','due','class','lecture','reading','test'],
      label: 'School' },
    { keywords: ['shift','work','job','meeting','interview','training','hours'],
      label: 'Work' },
    { keywords: ['lesson','practice','game','concert','party','appointment',
                 'gym','workout','church','club','trip'],
      label: 'Event' },
    { keywords: ['pick up','drop off','buy','grocery','cvs','pharmacy','bank',
                 'mail','store','shop','return','get','bring'],
      label: 'Errand' },
];

function matchCategoryFromText(text) {
    const lower = text.toLowerCase();

    // 1. Try to match against user-created categories by name
    const userCats = (typeof getCategories === 'function') ? getCategories() : [];
    for (const cat of userCats) {
        if (lower.includes(cat.name.toLowerCase())) return cat;
    }

    // 2. Fallback keyword heuristics → find a user cat with that label or return the label string if no user cat exists yet
    for (const rule of FALLBACK_KEYWORD_MAP) {
        if (rule.keywords.some(kw => lower.includes(kw))) {
            // Try to find a user-created category whose name matches
            const match = userCats.find(c =>
                c.name.toLowerCase() === rule.label.toLowerCase()
            );
            return match || { id: null, name: rule.label, color: '#64748B' };
        }
    }

    return null;
}

// Location extractor
function extractLocation(text) {
    const match =
        text.match(/\bat\s+([A-Z][a-zA-Z\s&'.]+?)(?:\s+(?:on|at|by|from|until|tomorrow|today|\d))/i) ||
        text.match(/@\s*(.+?)(?:\s+(?:on|at|by|\d))/i) ||
        text.match(/\bat\s+([A-Z][a-zA-Z\s&'.]{2,})/i);
    return match ? match[1].trim() : '';
}

// Strip date/time refs from title
function cleanTitle(text, chronoResults) {
    let clean = text;
    (chronoResults || []).forEach(r => {
        clean = clean.replace(r.text, '').trim();
    });
    return clean
        .replace(/\s+at\s*$/i, '')
        .replace(/\s+on\s*$/i, '')
        .replace(/\s+by\s*$/i, '')
        .replace(/\s{2,}/g, ' ')
        .trim() || text;
}

// Main parse function
function parseTaskInput(rawText) {
    if (!rawText?.trim()) return null;
    const text = rawText.trim();
    const now  = new Date();

    let parsedDate    = '';
    let parsedTime    = '';
    let chronoResults = [];

    try {
        chronoResults = chrono.parse(text, now, { forwardDate: true });
        if (chronoResults.length > 0) {
            const first = chronoResults[0].start;
            if (first.isCertain('day') || first.isCertain('month')) {
                parsedDate = chronoResults[0].date().toISOString().split('T')[0];
            }
            if (first.isCertain('hour')) {
                const d  = chronoResults[0].date();
                parsedTime = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
            }
        }
    } catch (e) {
        console.warn('chrono parse error:', e);
    }

    const category     = matchCategoryFromText(text);
    const locationName = extractLocation(text);
    const title        = cleanTitle(text, chronoResults);

    return { title, date: parsedDate, time: parsedTime, category, locationName };
}

// Apply parsed result to sheet fields
function applyParsedTask(parsed) {
    if (!parsed) return;

    if (parsed.title)
        document.getElementById('sheet-title').value = parsed.title;

    if (parsed.date)
        setCustomDate(parsed.date);

    if (parsed.time)
        setCustomTime(parsed.time);

    if (parsed.locationName)
        document.getElementById('sheet-location').value = parsed.locationName;

    // Select the matching category chip if it exists as a user category
    if (parsed.category?.id) {
        const chip = document.querySelector(`.category-chip[data-id="${parsed.category.id}"]`);
        if (chip && typeof applyCategoryChipStyle === 'function') {
            selectedCategoryIds = [parsed.category.id];
            applyCategoryChipStyle(chip, parsed.category.color, true);
        }
    }
}