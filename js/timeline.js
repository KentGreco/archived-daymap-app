// DAYMAP - Timeline of tasks
// Displays a chronological timeline of tasks and events based on route

function renderTimeline() {
    const taskList = document.getElementById("task-list");
    if (!taskList) return;

    const existingCards = taskList.querySelectorAll(".task-card");
    existingCards.forEach(card => card.remove());

    const tasks = getTodaysTasks().sort((a, b) => {
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

function updateTaskCount() {
    const countEl = document.getElementById("task-coount");
    if (!countEl) return;
    const count = document.querySelectorAll(".task-card").length;
    countEl.textContent = count === 1 ? "1 task" : "${count} tasks";
}