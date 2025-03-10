const key = "q7DK2OGFoBwDd3qpCCW5";
const source = new ol.source.TileJSON({
  url: `https://api.maptiler.com/maps/streets-v2/tiles.json?key=${key}`,
  tileSize: 512,
});

const attribution = new ol.control.Attribution({
  collapsible: false,
});

const map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: source,
    }),
  ],
  target: "map",
  view: new ol.View({
    constrainResolution: true,
    center: ol.proj.fromLonLat([-73.627539, 45.523914]),
    zoom: 11,
  }),
});

const styles = {
  autre: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "rgb(68, 138, 255)",
      width: 2,
    }),
  }),
  REV: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "#2AC7DD",
      width: 2,
    }),
  }),
  voie_partagee: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "#84CA4B",
      width: 2,
    }),
  }),
  voie_protegee: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "#025D29",
      width: 2,
    }),
  }),

  sentier_polyvalent: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "#B958D9",
      width: 2,
    }),
  }),
};

function condition(feature) {
  let rac = ["EV", "PE", "TR"];

  if (rac.includes(feature.getProperties().REV_AVANCEMENT_CODE)) {
    return "REV";
  }

  let tvc = [1, 3, 8, 9];
  const avancementCode = feature.getProperties().AVANCEMENT_CODE;
  if (
    tvc.includes(Number.parseInt(feature.getProperties().TYPE_VOIE_CODE)) &&
    avancementCode == "E"
  ) {
    return "voie_partagee";
  }
  tvc = [4, 5, 6];

  if (
    !rac.includes(feature.getProperties().REV_AVANCEMENT_CODE) &&
    avancementCode == "E" &&
    tvc.includes(Number.parseInt(feature.getProperties().TYPE_VOIE_CODE))
  ) {
    return "voie_protegee";
  }

  if (avancementCode == "E" && feature.getProperties().TYPE_VOIE_CODE == 7) {
    return "sentier_polyvalent";
  }

  return "autre";
}
const styleFunction = function (feature) {
  return styles[condition(feature)];
};

const bikeRoutes = new ol.source.Vector({
  url: `/itineraire/geo`,
  format: new ol.format.GeoJSON(),
});

const bikeRoutesLayer = new ol.layer.Vector({
  source: bikeRoutes,
  style: styleFunction,
});

map.addLayer(bikeRoutesLayer);

bikeRoutesLayer.once("featuresloadend", function () {
  map.getView().fit(bikeRoutesLayer.getExtent());
});

var myModal = new bootstrap.Modal(document.getElementById("myModal"));
document.getElementById("popupIcon").addEventListener("click", () => {
  myModal.show();
});
