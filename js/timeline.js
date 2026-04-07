// DAYMAP - Timeline of tasks
// Displays a chronological timeline of tasks and events based on route

function renderTimeline() {
    const taskList = document.getElementById("task-list");
    if (!taskList) return;

    const existingCards = taskList.querySelectorAll(".task-card");
    existingCards.forEach(card => card.remove());

    const tasks = getUpcomingTasks();
    tasks.sort((a, b) => {
        if (!a.time) return 1;
        if (!b.time) return -1;
        return a.time.localeCompare(b.time);
    });

    const addCard = document.getElementById("add-task-card");
    tasks.forEach(task => {
        const card = createTaskCard(task);
        taskList.insertBefore(card, addCard);
    });

    updateTaskCount();
}

function getUpcomingTasks() {
    const today = new Date().toISOString().split("T")[0];
    const weekEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const tasks = getAllTasks();
    const filtered = tasks.filter(t => !t.date || t.date >= today);
    return filtered;
}

function updateTaskCount() {
    const countEl = document.getElementById("task-count");
    if (!countEl) return;
    const count = document.querySelectorAll(".task-card").length;
    countEl.textContent = count === 1 ? "1 task" : `${count} tasks`;
}

