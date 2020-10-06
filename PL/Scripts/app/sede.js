$(document).ready(function () {

    handleDataTableSedes.init();

    handlePageStates.init();

});

var handlePageStates = function () {

    var pn_busqueda = $("#pnlBusqueda");
    var pn_registro = $("#pnlRegistro");

    function init() {

        handleButtonsEvents();
        handleCargaDataInicial();
        handleGenericEvents();


        pn_busqueda.show();
        pn_registro.hide();
    }

    function handleButtonsEvents() {

        $("#btnNuevo").on("click", function (e) {

            e.preventDefault();

            pn_busqueda.hide();
            pn_registro.show();

        });

        $("#btnVolver").on("click", function (e) {

            e.preventDefault();

            pn_busqueda.show();
            pn_registro.hide();

        });

    }

    function handleGenericEvents() {

        $('#tbSedes tbody').on("click", ".trabEditar", function () {
            
            pn_busqueda.hide();
            pn_registro.show();

        });

        $('#tbSedes tbody').on("click", ".trabEliminar", function () {
            var dato = $(this);
            handleMensaje.mensajeConfirmacion('¿Está seguro que desea eliminar el registro seleccionado?',
                function () {
                    var id = dato.attr("data-id");
                    //handleTrabajador.eliminar(id);
                });
        });

    }

    function handleCargaDataInicial() {

        handleSede.buscarTodos();

    }

    return {
        init: init
    }

}();

var handleDataTableSedes = function () {

    var tb;

    return {

        init: function () {

            tb = $('#tbSedes').DataTable({
                //"dom": "<'dt-toolbar'<'col-xs-12 col-sm-6 hidden-xs'f><'col-sm-6 col-xs-12 hidden-xs'<'toolbar'>>r>t<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>",
                "columnDefs": [
                    {
                        "targets": [0],
                        "className": "hidden-lg hidden-md hidden-sm visible-xs ocultaOrden",
                        "orderable": false,
                        "sorting": false,
                        "searchable": false
                    },
                    {
                        "targets": [1, 2],
                        "className": "visible-lg visible-md visible-sm visible-xs",
                        "orderable": false,
                        "sorting": false,
                        "searchable": false,
                        "width": "1%"
                    },
                ],
            });
        },
        llenarData: function (data) {

            tb.clear();
            tb.state.clear();
            tb.draw();
            $.each(data, function (i, elem) {
                tb.row.add([
                      ""
                    , "<a href='javascript:void(0);' data-id='" + elem.SD_ID + "' class='fa fa-edit fa-lg trabEditar' data-toggle='tooltip' title='Editar' data-original-title='Editar'  ></a>"
                    , "<a href='javascript:void(0);' data-id='" + elem.SD_ID + "' class='fa fa-trash-o fa-lg trabEliminar' data-toggle='tooltip'   title='Eliminar' data-original-title='Borrar' ></a>"
                    , elem.SD_ID
                    , elem.SD_NOMBRE
                    , handleUtilidades.formatoFecha(elem.SD_FECHA_CREACION)
                    , (elem.SD_FECHA_MODIFICACION == 'null' || elem.SD_FECHA_MODIFICACION == null) ? "" : handleUtilidades.formatoFecha(elem.SD_FECHA_MODIFICACION)
                    , elem.SD_ESTADO == true ? 'Activo': 'Inactivo'
                ]);
            });
            tb.draw(false);

        }

    }
}();

var handleSede = function () {

    function buscarTodos() {

        busquedaSedes(function (response) {

            handleDataTableSedes.llenarData(response);

        });

    }

    function busquedaSedes(callback) {

        //var sede = filtros();

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Sede/Buscar",
            //data: JSON.stringify({ trabajador: sede }),
            data: null,
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        })
        .done(function (response) {
            try {

                if (callback !== undefined)
                    callback(response);

            } catch (ex) {
                handleMensaje.mensajeError(ex);
            }
        });

    }

    return {
        buscarTodos: buscarTodos
    }
}();