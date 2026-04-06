// DAYMAP - Add task sheet
// Logic for the task sheet UI and interactions

document.addEventListener("DOMContentLoaded", function() {
    //Sheet open/close logic
    const addCard = document.getElementById("add-task-card");
    const sheet = document.getElementById("add-task-sheet");
    const overlay = document.getElementById("sheet-overlay");
    const closeButton = document.getElementById("sheet-close");
    const saveButton = document.getElementById('sheet-save');

    function openSheet() {
        sheet.classList.add("open");
        sheet.setAttribute("aria-hidden", "false");
        overlay.classList.add("visible");
        setTimeout(() => document.getElementById("sheet-title").focus(), 300);
    }

    function closeSheet() {
        sheet.classList.remove("open");
        sheet.setAttribute("aria-hidden", "true");
        overlay.classList.remove("visible");
        document.getElementById("add-task-card").focus();
    }

    function clearSheet() {
        document.getElementById("sheet-title").value = "";
        document.getElementById("sheet-date").value = "";
        document.getElementById("sheet-time").value = "";
        document.getElementById("sheet-location").value = "";
        document.getElementById("sheet-priority").value = "";
        document.getElementById("sheet-notes").value = "";
        document.querySelectorAll(".category-ui").forEach(p => p.classList.remove("selected"));
        document.querySelector('.category-ui[data-cat="assignment"]').classList.add('selected');
    }

    saveButton.addEventListener("click", function() {
        const title = document.getElementById("sheet-title").value.trim();
        if (!title) {
            const input = document.getElementById("sheet-title");
            input.style.borderColor = "#EF4444";
            input.focus();
            setTimeout(() => input.style.borderColor = "", 1500);
            return;
        }

        const selectedCat = document.querySelector(".category-ui.selected");

        const taskData = {
            title: title,
            category: selectedCat ? selectedCat.dataset.cat : "personal",
            date: document.getElementById("sheet-date").value,
            time: document.getElementById("sheet-time").value,
            locationName: document.getElementById("sheet-location").value.trim(),
            priority: document.getElementById("sheet-priority").value,
            notes: document.getElementById("sheet-notes").value.trim()
        };

        addTask(taskData);
        renderTimeline();
        clearSheet();
        closeSheet();
    });

    // Category pill switching
    document.querySelectorAll(".category-ui").forEach(pill => {
        pill.addEventListener("click", function() {
            document.querySelectorAll(".category-ui").forEach(p => p.classList.remove("selected"));
            this.classList.add("selected");
        });
    });

    addCard.addEventListener("click", openSheet);
    addCard.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openSheet(); }
    });
    closeButton.addEventListener("click", closeSheet);
    overlay.addEventListener("click", closeSheet);
});

