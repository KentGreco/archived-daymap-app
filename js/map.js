// DAYMAP - Map module
// Handles Leaflet map initialization and controls

let map;

function initMap(){
    map = L.map("map").setView([39.4799, -76.6408], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetmap contributors",
        maxZoom: 19
    }).addTo(map);

    //Test pin:
    L.marker([39.4799, -76.6408]).addTo(map).bindPopup("<b>DAYMAP</b><br>Cockeysville, MD").openPopup();
}