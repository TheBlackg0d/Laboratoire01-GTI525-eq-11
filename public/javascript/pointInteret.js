// Initialize DataTable with Multi-column Ordering

//   // Initialize the map
//   var map = L.map('map').setView([45.5017, -73.5673], 11);

//   // Add a tile layer to the map
//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//   }).addTo(map);

//   // Load GeoJSON data
//   $.getJSON('/path/to/territoires.geojson', function(data) {
//     var geojsonLayer = L.geoJson(data, {
//       style: function(feature) {
//         return { color: "#3388ff" };
//       }
//     }).addTo(map);

//     // Handle arrondissement selection
//     $('#arrondissement').change(function() {
//       var selectedArrondissement = $(this).val();
//       geojsonLayer.eachLayer(function(layer) {
//         if (layer.feature.properties.name === selectedArrondissement) {
//           layer.setStyle({ color: "#ff7800" });
//         } else {
//           layer.setStyle({ color: "#3388ff" });
//         }
//       });
//     });
//   });

//   $("#arrondissement").on("change", () => {
//     let searchData = $(this).find(":selected").val();

//     if (searchData == "Tous") {
//       searchData = "";
//     }
//     console.log(searchData);
//     dataTable.search(searchData).draw();
//   });
// });
let dataTable;
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
            // $("#arrondissement").val(feature.properties.CODEID);
            searchDataTable();

            map.fitBounds(e.target.getBounds());
          },
        });
        // arrondissements.push(feature.properties.NOM);
      },
    }).addTo(map);

    // var select = $("#arrondissement");
    // select.empty();
    // select.append(
    //   $("<option>", {
    //     value: "Tous",
    //     text: "Tous",
    //   })
    // );
    // arrondissements.sort().forEach(function (arrondissement) {
    //   select.append(
    //     $("<option>", {
    //       value: arrondissement,
    //       text: arrondissement,
    //     })
    //   );
    // });
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

  // Load Arrondissements from CSV
  //   $.ajax({
  //     type: "GET",
  //     url: "/data/territoires.csv",
  //     dataType: "text",
  //     success: function (data) {
  //       Papa.parse(data, {
  //         complete: function (results) {
  //           // Populate the table
  //           var tableBody = $("#myTable tbody");
  //           tableBody.empty();
  //           results.data.forEach(function (row) {
  //             if (row[0] && row[1] && row[2]) {
  //               var arrondissement = row[0];
  //               var code = row[1];
  //               var abbreviation = row[2];
  //               var newRow = `
  //                               <tr data-arrondissement="${arrondissement}">
  //                                   <td>${arrondissement}</td>
  //                                   <td>${code}</td>
  //                                   <td>${abbreviation}</td>
  //                               </tr>
  //                           `;
  //               tableBody.append(newRow);
  //             }
  //           });

  //           $("#myTable").DataTable();

  //           $("#myTable tbody").on("click", "tr", function () {
  //             var arrondissement = $(this).data("arrondissement");
  //             $("#arrondissement").val(arrondissement);
  //             selectArrondissementByName(arrondissement);
  //           });
  //         },
  //       });
  //     },
  //   });
});
