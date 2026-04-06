// DAYMAP - Main app controller
// Source for all app logic

document.addEventListener("DOMContentLoaded", function() {
    // Display today date in header
    const dateEl = document.getElementById("current-date");
    const today = new Date();
    dateEl.textContent = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    initMap();
});