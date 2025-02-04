// Initialize DataTable with Multi-column Ordering
$(document).ready(function() {
    $('#myTable').DataTable({
        order: [], // Default no ordering
        columnDefs: [
            { targets: '_all', orderable: true } // Allow multi-column ordering
        ],
        paging: true,
        lengthMenu: [20, 50, 75, 100],
        searching: true,
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/French.json" // French translation (optional)
        }
    });
});
