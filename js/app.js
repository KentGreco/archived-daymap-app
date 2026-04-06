// DAYMAP - Main app controller
// Source for all app logic

document.addEventListener("DOMContentLoaded", function() {
    const dateEl = document.getElementById("current-date");
    const today = new Date();
    dateEl.textContent = today.toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });

    initMap();

    renderTimeline();
})