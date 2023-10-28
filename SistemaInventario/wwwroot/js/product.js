let dataTable;

$(document).ready(function () {
    $("#tbl-data").LoadingOverlay("show");
    loadDataTable();
    $("#tbl-data").LoadingOverlay("hide");

}); //fin de funcion

function loadDataTable() {
    dataTable = $("#tbl-data").DataTable({
        "ajax": {
            "url": "/Admin/Product/GetAll"
        },
        "columns": [
            { "data": "serieNumber" },
            { "data": "description" },
            { "data": "category.name" },
            { "data": "brand.name" },
            {
                "data": "price", "className": "text-end",
                "render": function (data) {
                    var d = data.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                    return d;
                }
            },
            {
                "data": "pState",
                "render": function (data) {
                    if (data == true) {
                        return '<span class="badge bg-success">Activo</span>';
                    }
                    else {
                        return '<span class="badge bg-secondary">Inactivo</span>';
                    }
                }
            },
            {
                "data": "id",
                "render": function (data) {
                    return `
                        <div class="text-center">
                            <a href="/Admin/Product/Upsert/${data}" class="btn btn-info text-white" style="cursor:pointer">
                                <i class="bi bi-pencil-square"></i>
                            </a>

                             <a onclick=Delete("/Admin/Product/Delete/${data}") class="btn btn-danger text-white" style="cursor:pointer">
                                <i class="bi bi-trash3-fill"></i>
                            </a>
                        </div>
                    `;
                }
            }
        ],
        "language": {
            "lengthMenu": "Mostrar _MENU_ Registros Por Pagina",
            "zeroRecords": "Ningun Registro",
            "info": "Mostrar pagina _PAGE_ de _PAGES_",
            "infoEmpty": "no hay registros",
            "infoFiltered": "(filtered from _MAX_ total registros)",
            "search": "Buscar",
            "paginate": {
                "first": "Primero",
                "last": "�ltimo",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        }
    });
}

function Delete(url) {
    swal({
        title: "Esta seguro de eliminar el producto?",
        text: "Este registro no se podr� recuperar",
        icon: "warning",
        buttons: true,
        dangerMode: true
    }).then((del) => {
        if (del) {
            $("#tbl-data").LoadingOverlay("show");
            $.ajax({
                type: "POST",
                url: url,
                success: function (data) {
                    $("#tbl-data").LoadingOverlay("hide");
                    if (data.success) {
                        toastr.success(data.message);
                        dataTable.ajax.reload();
                    }
                    else {
                        $("#tbl-data").LoadingOverlay("hide");
                        toastr.error(data.message);
                    }
                }
            })
        }
    })
}