let dataTable;
const deletePoint = async (id) => {
  const res = await fetch("pointInteret/delete/" + id, {
    method: "DELETE",
  });

  return res.json();
};

const getPointInteret = async (id) => {
  const res = await fetch("pointInteret/" + id);

  return res.json();
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
        console.log(res.result);
        $("NomDuLieu").val(res.result.Nom_parc_lieu);
        $("#Addresse").val(res.result.Intersection);
        $("#arrondissementForm").val(res.result.Arrondissement);
        $("#TypeDeLieuForm").val(res.result.type);
        $("#latitude").val(res.result.Latitude);
        $("#longitude").val(res.result.Longitude);
        $("#Remarque").val(res.result.Remarque);

        myModal.show();
      });
    }
  });

  document.querySelector("#MenuBtn").addEventListener("click", () => {
    $(".group-button").toggle();
  });
});
