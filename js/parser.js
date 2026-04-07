// DAYMAP - Natural Language Task Parser
// Uses chrono-node (free, no API key, runs entirely in the browser)

// Keyword category detector 
const CATEGORY_KEYWORDS = {
    assignment: ['homework', 'assignment', 'essay', 'report', 'study', 'exam',
                 'quiz', 'project', 'lab', 'paper', 'due', 'class', 'lecture',
                 'reading', 'test', 'submit'],
    work:       ['shift', 'work', 'job', 'clock in', 'clock out', 'meeting',
                 'interview', 'training', 'schedule', 'hours'],
    event:      ['lesson', 'practice', 'game', 'concert', 'party', 'appointment',
                 'visit', 'trip', 'hangout', 'gym', 'workout', 'church', 'club'],
    errand:     ['pick up', 'drop off', 'buy', 'grocery', 'groceries', 'cvs',
                 'pharmacy', 'bank', 'mail', 'post', 'store', 'shop', 'return',
                 'get', 'bring', 'deliver'],
    personal:   ['call', 'text', 'email', 'remind', 'remember', 'birthday',
                 'anniversary', 'personal']
};

function detectCategory(text) {
    const lower = text.toLowerCase();
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(kw => lower.includes(kw))) return cat;
    }
    return 'personal';
}

// Simple location extractor 
// Looks for "at [place]" or "@ [place]" patterns
function extractLocation(text) {
    const match = text.match(/\bat\s+([A-Z][a-zA-Z\s&'.]+?)(?:\s+(?:on|at|by|from|until|tomorrow|today|\d))/i)
                || text.match(/@\s*(.+?)(?:\s+(?:on|at|by|\d))/i)
                || text.match(/\bat\s+([A-Z][a-zA-Z\s&'.]{2,})/i);
    return match ? match[1].trim() : '';
}

// Strip date/time/location noise from title 
function cleanTitle(text, parsedResults) {
    let clean = text;

    // Remove chrono-parsed date references
    if (parsedResults && parsedResults.length > 0) {
        parsedResults.forEach(result => {
            clean = clean.replace(result.text, '').trim();
        });
    }

    // Remove common noise words left over
    clean = clean
        .replace(/\s+at\s+$/i, '')
        .replace(/\s+on\s+$/i, '')
        .replace(/\s+by\s+$/i, '')
        .replace(/\s{2,}/g, ' ')
        .trim();

    return clean || text; // fallback to original if we wiped everything
}

// Main parse function 
function parseTaskInput(rawText) {
    if (!rawText || !rawText.trim()) return null;

    const text = rawText.trim();
    const now = new Date();

    // Use chrono-node to parse date and time from the text
    let parsedDate = '';
    let parsedTime = '';
    let chronoResults = [];

    try {
        chronoResults = chrono.parse(text, now, { forwardDate: true });

        if (chronoResults.length > 0) {
            const first = chronoResults[0].start;

            // Extract date (YYYY-MM-DD)
            if (first.isCertain('day') || first.isCertain('month')) {
                const d = chronoResults[0].date();
                parsedDate = d.toISOString().split('T')[0];
            }

            // Extract time (HH:MM)
            if (first.isCertain('hour')) {
                const d = chronoResults[0].date();
                const hh = String(d.getHours()).padStart(2, '0');
                const mm = String(d.getMinutes()).padStart(2, '0');
                parsedTime = `${hh}:${mm}`;
            }
        }
    } catch (e) {
        console.warn('Chrono parse error:', e);
    }

    const category     = detectCategory(text);
    const locationName = extractLocation(text);
    const title        = cleanTitle(text, chronoResults);

    return {
        title,
        date:  parsedDate,
        time:  parsedTime,
        category,
        locationName
    };
}

// Exported helper: apply parsed result to sheet fields 
function applyParsedTask(parsed) {
    if (!parsed) return;

    if (parsed.title)
        document.getElementById('sheet-title').value = parsed.title;

    if (parsed.date)
        setCustomDate(parsed.date);      // calls custom date picker API (sheet.js)

    if (parsed.time)
        setCustomTime(parsed.time);      // calls custom time picker API (sheet.js)

    if (parsed.locationName)
        document.getElementById('sheet-location').value = parsed.locationName;

    if (parsed.category) {
        document.querySelectorAll('.category-ui').forEach(p => p.classList.remove('selected'));
        const pill = document.querySelector(`.category-ui[data-cat="${parsed.category}"]`);
        if (pill) pill.classList.add('selected');
    }
}