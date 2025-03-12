// Initialize DataTable with Multi-column Ordering
$(document).ready(function () {
  document.getElementById("dateDebut").defaultValue = "2019-01-01";
  document.getElementById("dateFin").defaultValue = "2019-02-01";
  $("#myTable").DataTable({
    order: [], // Default no ordering
    columnDefs: [
      { targets: "_all", orderable: true }, // Allow multi-column ordering
    ],
    paging: true,
    lengthMenu: [20, 50, 75, 100],
    searching: true,
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/French.json", // French translation (optional)
    },
  });
});

const key = "q7DK2OGFoBwDd3qpCCW5";
const source = new ol.source.TileJSON({
  url: `https://api.maptiler.com/maps/streets-v2/tiles.json?key=${key}`,
  tileSize: 512,
});

const attribution = new ol.control.Attribution({
  collapsible: false,
});

const container = document.getElementById("popup");
const content = document.getElementById("popup-content");
const closer = document.getElementById("popup-closer");

const overlay = new ol.Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

const map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: source,
    }),
  ],
  overlays: [overlay],
  target: "map",
  view: new ol.View({
    constrainResolution: true,
    center: ol.proj.fromLonLat([-73.627539, 45.523914]),
    zoom: 11,
  }),
});

fetch("/statistique/dataJson").then((response) => {
  response.json().then((data) => {
    console.log(data);
    data.forEach((compteur) => {
      const layer = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: [
            new ol.Feature({
              geometry: new ol.geom.Point(
                ol.proj.fromLonLat([compteur.Longitude, compteur.Latitude])
              ),
              nom: compteur.Nom,
            }),
          ],
        }),
        style: new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 1],
            crossOrigin: "anonymous",
            src: "/images/marker-icon.png",
          }),
        }),
      });
      map.addLayer(layer);
    });
  });
});

map.on("click", function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  if (feature) {
    const coordinates = feature.getGeometry().getCoordinates();
    content.innerHTML =
      "<p>Nom:</p><code>" + feature.get("nom") + "</code><br>";

    overlay.setPosition(coordinates);
  }
});
var id = 0;
const myModal = new bootstrap.Modal(document.getElementById("statsModal"));
document.querySelectorAll(".btn-compteur").forEach((e) => {
  e.addEventListener("click", () => {
    myModal.show();
    id = e.dataset.idCompteur;
    const valDateDebut = document.querySelector("#dateDebut").value;
    const valDateFin = document.querySelector("#dateFin").value;
    const valradio = document.querySelector(
      "input[name=radioTime]:checked"
    ).value;
    fetch(
      `gti525/v1/compteurs/${id}?debut=${valDateDebut}&fin=${valDateFin}&periode=${valradio}`
    ).then((response) => {
      response.json().then((data) => {
        console.log(data);
        const x = data.compteurs.map((item) => item._id);
        const y = data.compteurs.map((item) => item.totalPassage);
        console.log({ x, y });
        // const keys = Object.keys(data);
        // const values = Object.values(data);
        chart(x, y);
      });
    });
  });
});
var chartObj = undefined;
function chart(x, y) {
  const ctx = document.getElementById("statsCharts");

  chartObj = new Chart(ctx, {
    type: "bar",
    data: {
      labels: x,
      datasets: [
        {
          label: `Nombre de passage pour le compteur #${id}`,
          data: y,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

document.querySelector("#getChart").addEventListener("click", () => {
  const valradio = document.querySelector(
    "input[name=radioTime]:checked"
  ).value;
  const valDateDebut = document.querySelector("#dateDebut").value;
  const valDateFin = document.querySelector("#dateFin").value;
  console.log({
    valradio,
    valDateDebut,
    valDateFin,
  });

  fetch(
    `gti525/v1/compteurs/${id}?debut=${valDateDebut}&fin=${valDateFin}&periode=${valradio}`
  ).then((response) => {
    response.json().then((data) => {
      console.log(data);
      const x = data.compteurs.map((item) => item._id);
      const y = data.compteurs.map((item) => item.totalPassage);
      chartObj.destroy();
      chart(x, y);
    });
  });
});
