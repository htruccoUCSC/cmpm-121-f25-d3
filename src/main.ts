// @deno-types="npm:@types/leaflet"
import leaflet from "leaflet";

// Style sheets
import "leaflet/dist/leaflet.css"; // supporting style for Leaflet
import "./style.css"; // student-controlled page style

// Fix missing marker images
import "./_leafletWorkaround.ts"; // fixes for missing Leaflet images

const controlPanelDiv = document.createElement("div");
controlPanelDiv.id = "controlPanel";
document.body.append(controlPanelDiv);

const mapDiv = document.createElement("div");
mapDiv.id = "map";
document.body.append(mapDiv);

const statusPanelDiv = document.createElement("div");
statusPanelDiv.id = "statusPanel";
document.body.append(statusPanelDiv);

// Our classroom location
const CLASSROOM_LATLNG = leaflet.latLng(
  36.997936938057016,
  -122.05703507501151,
);

// Tunable gameplay parameters
const GAMEPLAY_ZOOM_LEVEL = 19;
const TILE_DEGREES = 1e-4;
const NEIGHBORHOOD_SIZE_X = 35;
const NEIGHBORHOOD_SIZE_Y = 14;

// Create the map (element with id "map" is defined in index.html)
const map = leaflet.map(mapDiv, {
  center: CLASSROOM_LATLNG,
  zoom: GAMEPLAY_ZOOM_LEVEL,
  minZoom: GAMEPLAY_ZOOM_LEVEL,
  maxZoom: GAMEPLAY_ZOOM_LEVEL,
  zoomControl: false,
  scrollWheelZoom: false,
});

// Populate the map with a background tile layer
leaflet
  .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  })
  .addTo(map);

// Add a marker to represent the player
const playerMarker = leaflet.marker(CLASSROOM_LATLNG);
playerMarker.bindTooltip("That's you!");
playerMarker.addTo(map);

const origin = CLASSROOM_LATLNG;

// Draw a grid of tiles around the player's location using the neighborhood range.
for (let i = -NEIGHBORHOOD_SIZE_Y; i <= NEIGHBORHOOD_SIZE_Y; i++) {
  for (let j = -NEIGHBORHOOD_SIZE_X; j <= NEIGHBORHOOD_SIZE_X; j++) {
    const bounds = leaflet.latLngBounds(
      [
        [origin.lat + i * TILE_DEGREES, origin.lng + j * TILE_DEGREES],
        [
          origin.lat + (i + 1) * TILE_DEGREES,
          origin.lng + (j + 1) * TILE_DEGREES,
        ],
      ],
    );

    // lightly style each rectangle so the map remains readable
    const rect = leaflet.rectangle(bounds, {
      weight: 1,
      color: "#3388ff",
      fillOpacity: 0.04,
    });
    rect.addTo(map);
  }
}
