var handleDataTable = function () {

    var tb;

    return {

        init: function () {

            tb = $('#tabla').DataTable({
                "columnDefs": [
                    {
                        //generalmente la prmera columna esta oculta y vacia, para que se dibuje el boton de responsividad en en esta cuando sea el momento indicado
                        "targets": [0],
                        "className": "hidden-lg hidden-md hidden-sm visible-xs ocultaOrden",
                        "orderable": false,
                        "sorting": false,
                        "searchable": false
                    },
                    {
                        //generalmente son los botones para eliminar y editar
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
        agregar: function (dato) {
            //funcion para agregar solo una fila nueva
            tb.row.add([
                    "",
                    "<a href='javascript:void(0);' data-id='" + dato.id + "' class='fa fa-edit fa-lg editar' data-toggle='tooltip' title='Editar' data-original-title='Editar'  ></a>",
                    "<a href='javascript:void(0);' data-id='" + dato.id + "' class='fa fa-trash-o fa-lg eliminar' data-toggle='tooltip'   title='Eliminar' data-original-title='Borrar' ></a>",                    
            ]);

            tb.draw(false);

        },
        llenarData: function (data) {

            tb.clear();
            tb.state.clear();
            tb.draw()
            // funcion para agregar una coleccion de filas nuevas
            $.each(data, function (i, dato) {
                tb.row.add([
                    "",
                    "<a href='javascript:void(0);' data-id='" + dato.id + "' class='fa fa-edit fa-lg editar' data-toggle='tooltip' title='Editar' data-original-title='Editar'  ></a>",
                    "<a href='javascript:void(0);' data-id='" + dato.id + "' class='fa fa-trash-o fa-lg eliminar' data-toggle='tooltip'   title='Eliminar' data-original-title='Borrar' ></a>",
                ]);
            });
            tb.draw(false);

        },
        deleteAll: function () {
            //funcion para borrar todos los datos de la tabla
            if (tb !== undefined) {
                tb.rows().remove()
                    .draw();
            }
        },
        obtenerTodo: function () {
            //funcion para obtener todos los datos de la tabla
            return tb.rows().data();
        },
    }

}();

var handleNegocio = function () {

    function get() {

        //obtener los datos de un objeto desde el formulario

        var objeto = {

        }

        return objeto;

    }

    function set(objeto) {

        //setear los datos de un objeto al formulario

    }

    function buscarTodos() {

        //funcion que busca una lista del objeto

    }

    function guardar(callback) {

        var objeto = get();

        //funcion que guarda el objeto

    }

    function eliminar(id) {

        //funcion que elimina un objeto en particular

    }

    function buscarEspecifico(id) {

        //funcion que busca un objeto por un campo en particular

    }

    return {
        buscarTodos: buscarTodos,
        guardar: guardar,
        eliminar: eliminar
    };

}();

var handlePageStates = function () {

    var handleFormValidations = function () {

        function aplicaValidaciones() {

            validaFormulario();

        }

        function validaFormulario() {

            //validaciones por formulario

        }

        return {

            aplicaValidaciones: aplicaValidaciones

        };

    }();

    function init() {

        var prom = handleCargaDataInicial();

        prom.then(
            function () {
                handleFormValidations.aplicaValidaciones();
                habilitarFormulario(false);
                handleButtonsEvents();
                handleChangeEvents();
                handleGenericEvents();
            },
            function (error) {
                handleMensaje.mensajeError(error);
            }
       );

    }

    function handleButtonsEvents() {

        //eventos de botones (generalmente click)

    }

    function limpiarFormulario() {
        
        //funcion de limpieza de formulario

    }

    function habilitarFormulario(habilitado) {

        //funcion de para manejar la habilitacion de los campos del formulario

    }

    function handleCargaDataInicial() {

        var deferred = $.Deferred();

        $.when().done(function () {

            //funciones ajax que cargan data

            deferred.resolve();

        });

        return deferred.promise();
    }

    function handleChangeEvents() {

        //eventos change de combos, check u otros

    }

    function handleGenericEvents() {

        //eventos de toda clase que escapen a las otras clasificaciones

    }

    return {

        init: init,
        habilitarFormulario: habilitarFormulario,
        limpiarFormulario: limpiarFormulario
    };

}();

$(document).ready(function () {

    handleDataTable.init(); //funcion que inicializa la tabla
    handlePageStates.init(); //funcion que inicializa el formulario

});