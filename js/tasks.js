// DAYMAP - Task operations
// Create, read, update, and delete tasks

function formatTime(timeStr) {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":").map(number);
    const period = h>=12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

function getDeadlineClass(task) {
    if (task.category !== "assignment" || !task.date) return "";
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    if (task.date === today) return "deadline-today";
    if (task.date === tomorrow) return "deadline-tomorrow";
    return "";
}

function createTaskCard(task) {
    const card = document.createElement("div");
    card.className = `task-card category-${task.category} ${getDeadlineClass(task)}`;
    card.dataset.id = task.id;

    if (task.time) {
        const timeEl = document.createElement("div");
        timeEl.className = "task-time";
        timeEl.textContent = formatTime(task.time);
        card.appendChild(timeEl);
    }

    const titleEl = document.createElement("div");
    titleEl.className = "task-title";
    titleEl.textContent = task.title;
    card.appendChild(titleEl);

    if (task.locationName) {
        const locEl = document.createElement("div");
        locEl.className = "task-location";
        locEl.innerHTML = `
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
            </svg>
            ${task.locationName}
        `;
        card.appendChild(locEl);
    }

    const code = document.createElement("div");
    code.className = "task-category-code ${task.category}";
    code.textContent = task.category.charAt(0).toUpperCase() + task.category.slice(1);
    card.appendChild(code);

    const deleteButton = document.createElement('button');
    deleteButton.className = "task-delete-button";
    deleteButton.setAttribute("aria-label", "Delete task");
    deleteButton.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    `;

    deleteButton.addEventListener('click', function(e) {
        e.stopPropagation();
        card.classList.add('removing');
        setTimeout(() => {
            deleteTask(task.id);
            card.remove();
            updateTaskCount();
        }, 280);
    });

    card.appendChild(deleteButton);
    return card;
}