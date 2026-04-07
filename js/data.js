// DAYMAP - Data layer
// Handles localStorage read/write for all task data

const STORAGE_KEY = "daymap_tasks";

function generateId() {
    return "task_" + Date.now() + "_" + Math.random()
}

function getAllTasks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error("Error fetching tasks");
        return [];
    }
}

function saveTasks(tasks) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
        console.error("Error saving tasks:", e);
    }
}

function addTask(taskData) {
    const tasks = getAllTasks();
    const newTask = {
        id: generateId(), title: taskData.title, category: taskData.category||"personal",
        date: taskData.date||"", time: taskData.time||"", locationName: taskData.locationName||"",
        latitude: taskData.latitude||null, longitude: taskData.longitude||null, priority: taskData.priority||"",
        notes: taskData.notes||"", completed: false, createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasks(tasks);
    return newTask;
}

function deleteTask(id) {
    const tasks = getAllTasks().filter(t => t.id !== id);
    saveTasks(tasks);
}


