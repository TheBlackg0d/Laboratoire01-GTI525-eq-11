// Initialize DataTable with Multi-column Ordering
$(document).ready(function () {
  let dataTable = $("#myTable").DataTable({
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
