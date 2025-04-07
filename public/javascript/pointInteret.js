let dataTable;
const deletePoint = async (id) => {
  const res = await fetch("/pointInteret/delete/" + id, {
    method: "DELETE",
  });

  return res.json();
};

const getPointInteret = async (id) => {
  const res = await fetch("/pointInteret/" + id);

  return res.json();
};
const getPointInteretInArea = async (id) => {
  const res = await fetch("/pointInteret/allAreaPoints/" + id);
  const json = await res.json();
  return json;
};
const updatePointInteret = async (id) => {
  try {
    const form = document.querySelector("#formPointInteret");
    const formData = new FormData(form);
    console.log("hello", form);
    var object = {};
    formData.forEach((value, key) => (object[key] = value));
    var json = JSON.stringify(object);
    const res = await fetch("/pointInteret/update/" + id, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json,
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};
function searchDataTable() {
  let searchData = $("#arrondissement :selected").text();

  if (searchData == "Tous") {
    searchData = "";
  }
  dataTable.search(searchData).draw();
}

$(function () {
  dataTable = $("#myTable").DataTable({
    order: [], // Default no ordering
    columnDefs: [
      { targets: "_all", orderable: true }, // Allow multi-column ordering
    ],
    paging: true,
    lengthMenu: [20, 50, 75, 100],
    searching: true,
  });
  // Initialize map
  var map = L.map("map").setView([45.5017, -73.5673], 10);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  var geojsonLayer;
  var selectedArrondissementLayer = null;
  // var arrondissements = [];

  function selectArrondissementByName(arrondissementName) {
    if (selectedArrondissementLayer !== null) {
      geojsonLayer.resetStyle(selectedArrondissementLayer);
      selectedArrondissementLayer = null;
    }

    geojsonLayer.eachLayer(function (layer) {
      if (layer.feature.properties.CODEID === Number(arrondissementName)) {
        selectedArrondissementLayer = layer;
        layer.setStyle({
          fillColor: "#FF0000",
          weight: 2,
          opacity: 1,
          color: "white",
          fillOpacity: 0.5,
        });
        map.fitBounds(layer.getBounds());
      }
    });
  }

  // Load GeoJSON data
  $.getJSON("/gti525/v1/territoire/geojson", function (data) {
    geojsonLayer = L.geoJSON(data, {
      style: function (feature) {
        return {
          fillColor: "#ADD8E6",
          weight: 2,
          opacity: 1,
          color: "white",
          fillOpacity: 0.7,
        };
      },
      onEachFeature: function (feature, layer) {
        layer.on({
          mouseover: function (e) {
            layer.setStyle({
              weight: 5,
              color: "#666",
              fillOpacity: 0.9,
            });
          },
          mouseout: function (e) {
            if (
              selectedArrondissementLayer === null ||
              selectedArrondissementLayer != layer
            ) {
              geojsonLayer.resetStyle(layer);
            } else {
              layer.setStyle({
                fillColor: "#FF0000",
                weight: 2,
                opacity: 1,
                color: "white",
                fillOpacity: 0.5,
              });
            }
          },
          click: function (e) {
            if (selectedArrondissementLayer !== null) {
              geojsonLayer.resetStyle(selectedArrondissementLayer);
            }
            selectedArrondissementLayer = layer;
            layer.setStyle({
              fillColor: "#FF0000",
              weight: 2,
              opacity: 1,
              color: "white",
              fillOpacity: 0.5,
            });

            $(
              `#arrondissement option[value="${feature.properties.CODEID}"]`
            ).prop("selected", true);
            searchDataTable();

            map.fitBounds(e.target.getBounds());
          },
        });
      },
    }).addTo(map);

    $("#arrondissement").on("change", function () {
      var selectedArrondissement = $(this).val();
      if (selectedArrondissement === "Tous") {
        if (selectedArrondissementLayer !== null) {
          geojsonLayer.resetStyle(selectedArrondissementLayer);
          selectedArrondissementLayer = null;
        }
        map.setView([45.5017, -73.5673], 10);
      } else {
        selectArrondissementByName(selectedArrondissement);
      }
      searchDataTable();
    });
  });

  dataTable.on("click", "tbody tr", (e) => {
    let classList = e.currentTarget.classList;

    if (classList.contains("selected")) {
      classList.remove("selected");
    } else {
      dataTable
        .rows(".selected")
        .nodes()
        .each((row) => row.classList.remove("selected"));
      classList.add("selected");
    }
  });

  document.querySelector("#deletePoint").addEventListener("click", function () {
    const id = $(dataTable.row(".selected").node()).data("id");
    console.log(id);
    if (id !== undefined) {
      deletePoint(id).then((res) => {
        if (res.message == "success") {
          dataTable.row(".selected").remove().draw();
        }
      });
    }
  });
  const myModal = new bootstrap.Modal(document.getElementById("EditModal"));
  document.querySelector("#editpoint").addEventListener("click", function () {
    const id = $(dataTable.row(".selected").node()).data("id");
    console.log(id);
    if (id !== undefined) {
      getPointInteret(id).then((res) => {
        console.log(res);
        console.log(res.result.Nom_parc_lieu);
        $("#NomDuLieu").val(res.result.Nom_parc_lieu);
        $("#Adresse").val(res.result.Intersection);
        $("#arrondissementForm").val(res.result.Arrondissement);
        $("#TypeDeLieuForm").val(res.result.type);
        $("#latitude").val(res.result.Latitude);
        $("#longitude").val(res.result.Longitude);
        $("#Remarque").val(res.result.Remarque);
        $("#dispoDate").val(res.result.DispoDate.split("T")[0]);
        $("#codePostale").val(res.result.codePostal);

        myModal.show();
      });
    }
  });

  document
    .querySelector("#updatePointInteret")
    .addEventListener("click", () => {
      const id = $(dataTable.row(".selected").node()).data("id");
      if (id !== undefined) {
        updatePointInteret(id).then((res) => {
          if (res.message == "success") {
            myModal.hide();
            newData = [
              res.pointInteret.type,
              res.pointInteret.Arrondissement,
              res.pointInteret.Nom_parc_lieu,
              res.pointInteret.Intersection,
            ]; //Array, data here must match structure of table data
            dataTable.row(".selected").data(newData).draw();
          }
        });
      }
    });
  function addPoint(latitude, longitude, map, special) {
    // coordinates in tile space
    var x = latitude;
    var y = longitude;

    try {
      if (special) {
        console.log("lol");
        const icon = new L.Icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });
        L.marker([x, y], { icon }).addTo(map);
        map.flyTo([x, y], 11.5);
      } else {
        L.marker([x, y]).addTo(map);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }
  const myModalPoints = new bootstrap.Modal(
    document.getElementById("ViewPointInteret")
  );
  let mapView;
  $("#ViewPointInteret").on("hidden.bs.modal", function (e) {
    console.log("hey");
    mapView.off();
    mapView.remove();
  });
  document
    .querySelector("#showPoint")
    .addEventListener("click", async function () {
      const id = $(dataTable.row(".selected").node()).data("id");

      if (id != undefined) {
        mapView = L.map("mapModal").setView([45.5017, -73.5673], 10);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapView);

        myModalPoints.show();
        setTimeout(function () {
          mapView.invalidateSize();
        }, 100);

        const res = await getPointInteretInArea(id);

        res.result.forEach((points) => {
          if (id == points._id) {
            console.log(points);
            addPoint(points.Latitude, points.Longitude, mapView, true);
          } else {
            addPoint(points.Latitude, points.Longitude, mapView, false);
          }
        });
      }
    });

  document.querySelector("#MenuBtn").addEventListener("click", () => {
    $(".group-button").toggle();
  });
});
