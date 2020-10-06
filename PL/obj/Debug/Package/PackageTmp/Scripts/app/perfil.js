var handleDataTablePerfil = function () {

    var tb;

    return {

        init: function () {

            tb = $('#tbPerfiles').DataTable({
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
                    },{
                        "targets": [2],
                        "visible": false
                    }
                ]
            });
        },
        llenarData: function (data) {

            tb.clear();
            tb.state.clear();
            tb.draw()
            $.each(data, function (i, dato) {
                tb.row.add([
                      ""
                    , "<a href='javascript:void(0);' data-id='" + dato.PERF_ID + "' class='fa fa-edit fa-lg perfEditar' data-toggle='tooltip' title='Editar' data-original-title='Editar'  ></a>"
                    , "<a href='javascript:void(0);' data-id='" + dato.PERF_ID + "' class='fa fa-trash-o fa-lg perfEliminar' data-toggle='tooltip'   title='Eliminar' data-original-title='Eliminar' ></a>"
                    , handleUtilidades.ajustaString(dato.PERF_NOMBRE)
                    , handleUtilidades.ajustaString(dato.PERF_DESCRIPCION, 100)
                    , dato.PERF_ADMINISTRADOR == true ? 'Sí' : 'No'
                    , dato.PERF_VIGENCIA == true ? 'Sí' : 'No'
                ]);
            });

            tb.draw(false);

        },
        deleteAll: function () {

            if (tb !== undefined) {
                tb.rows().remove()
                    .draw();
            }
        },
        obtenerTodo: function () {
            return tb.rows().data();
        }
    }

}();

var handleDuallistBox = function () {

    var initializeDuallistbox;

    function init() {

        initializeDuallistbox = $('#cmbFunciones').bootstrapDualListbox({
            nonSelectedListLabel: 'Funcionalidades',
            selectedListLabel: 'Perfil Configurado',
            preserveSelectionOnMove: 'moved',
            moveOnSelect: false,
            filterPlaceHolder: 'Buscar',
            infoText: 'Mostrando {0}',
            moveAllLabel: 'Mover Todo',
            moveSelectedLabel: 'Mover Seleccionado',
            removeAllLabel: 'Quitar Todo',
            removeSelectedLabel: 'Quitar Seleccionado',
            infoTextFiltered: 'Mostrando {0} de {1}',
            filterTextClear: 'Mostrar Todo',
            infoTextEmpty: "Sin Datos"
        });

    }

    function llenarData(response) {
        handleUtilidades.llenarComboItems('cmbFunciones', response, 'FUN_ID', 'FUN_NOMBRE');
        $('#cmbFunciones').bootstrapDualListbox('refresh', true);
    }

    function setValues(values) {

        var array = [];

        $.each(values, function (i, val) {

            array.push(val.FUN_ID);

        });

        $('#cmbFunciones').val(array);
        $('#cmbFunciones').bootstrapDualListbox('refresh', true);
    }

    function obtenerSeleccionados() {

        var funciones = [];
        var idp = $("#hdPerID").val();

        $.each($('#cmbFunciones').val(), function (i, val) {

            var funcion = {
                FUN_ID: val,
                PERF_ID: idp
            }

            funciones.push(funcion);

        });

        return funciones;
    }

    return {

        init: init,
        llenarData: llenarData,
        setValues: setValues,
        obtenerSeleccionados: obtenerSeleccionados
    };

}()

var handlePerfil = function () {

    function get() {

        var perfil = {
            PERF_ID: ($("#hdPerID").val() == "") ? null : $("#hdPerID").val(),
            PERF_NOMBRE: ($("#txtNombre").val() == "") ? null : $("#txtNombre").val(),
            PERF_DESCRIPCION: ($("#txtDescripcion").val() == "") ? null : $("#txtDescripcion").val(),
            PERF_VIGENCIA: $("#chkVigente").is(":checked"),
            PERF_ADMINISTRADOR: $("#chkAdministrador").is(":checked"),
            Funciones: handleDuallistBox.obtenerSeleccionados()
        }

        return perfil;

    }

    function set(perfil) {

        $("#hdPerID").val(perfil.PERF_ID);

        $("#txtNombre").val(perfil.PERF_NOMBRE);
        $("#txtDescripcion").val(perfil.PERF_DESCRIPCION);

        var vigente = (perfil.PERF_VIGENCIA) ? "on" : "off";
        $("#chkVigente").bootstrapToggle(vigente);

        var administrador = (perfil.PERF_ADMINISTRADOR) ? "on" : "off";
        $("#chkAdministrador").bootstrapToggle(administrador);

        handleDuallistBox.setValues(perfil.Funciones);
    }

    function buscarTodos() {

        $.ajax({
            type: "GET",
            url: initApp.pathBase + "/Perfil/BuscarTodos",
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        }).done(function (response) {
            handleDataTablePerfil.llenarData(response);
        });

    }

    function guardar(callback) {

        var perfil = get();

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Perfil/GuardarPerfil",
            data: JSON.stringify({ perfil: perfil }),
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        }).done(function (response) {

            try {

                handlePageStates.limpiarFormulario();

                if (callback !== undefined)
                    callback();

                handleMensaje.mensajeExito("El registro se ha modificado exitosamente");

            } catch (ex) {
                handleMensaje.mensajeError(ex);
            }

        });

    }

    function eliminar(id) {

        $.ajax({
            type: "DELETE",
            url: initApp.pathBase + "/Perfil/EliminarPerfil",
            data: JSON.stringify({ id: id }),
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        }).done(function (response) {
            buscarTodos();
        });

    }

    function buscarId(id) {

        $.ajax({
            type: "GET",
            url: initApp.pathBase + "/Perfil/BuscarPerfil/" + id,
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        }).done(function (response) {
            try {
                set(response);
            } catch (ex) {
                handleMensaje.mensajeError(ex);
            }
        });

    }

    return {
        buscarTodos: buscarTodos,
        guardar: guardar,
        eliminar: eliminar,
        buscarId: buscarId,
    };

}();

var handlePageStates = function () {

    var handleFormValidations = function () {

        function aplicaValidaciones() {

            validaPerfil();

        }

        function validaPerfil() {

            $('#FormPerfil').bootstrapValidator({
                framework: 'bootstrap ',
                live: 'disabled',
                excluded: [':disabled'],
                icon: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    txtNombre: {
                        validators: {
                            notEmpty: {
                                message: 'El nombre es requerido'
                            },
                            stringLength: {
                                max: 50,
                                message: 'Solo se permiten 50 caracteres como máximo'
                            }
                        }
                    },
                    txtDescripcion: {
                        validators: {
                            notEmpty: {
                                message: 'El apellido paterno es requerido'
                            },
                            stringLength: {
                                max: 50,
                                message: 'Solo se permiten 50 caracteres como máximo'
                            }
                        }
                    },
                    cmbFunciones: {
                        validators: {
                            //notEmpty: {
                            //    message: 'Debe seleccionar al menos una función'
                            //},
                            callback: {
                                message: 'Debe seleccionar al menos una función',
                                callback: function (value, validator) {
                                    if (value == "" || value === null || value === undefined) {
                                        if (!$(".bootstrap-duallistbox-container .box2").hasClass("has-error")) {
                                            $(".bootstrap-duallistbox-container .box2").addClass("has-error");
                                            $(".bootstrap-duallistbox-container .box2").append("<span class='error-spam'>Debe seleccionar al menos una función</span>");
                                        }
                                        return false;
                                    }
                                    else {
                                        $(".bootstrap-duallistbox-container .box2").removeClass("has-error");
                                        $(".box2 .error-spam").remove();
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }
            })

        }

        return {

            aplicaValidaciones: aplicaValidaciones

        };

    }();

    function init() {

        handleFormValidations.aplicaValidaciones();
        handleCargaDataInicial();
        limpiarFormulario();
        handleButtonsEvents();
        handleChangeEvents();
        handleGenericEvents();

    }

    function handleButtonsEvents() {

        $("#btnGuardar").on("click", function (e) {

            e.preventDefault();

            $("#FormPerfil").data('bootstrapValidator').resetForm();
            var bootstrapValidator = $('#FormPerfil').data('bootstrapValidator');
            bootstrapValidator.validate();

            if (bootstrapValidator.isValid()) {
                handlePerfil.guardar(function () { handlePerfil.buscarTodos(); });
            }

        });

        $("#btnLimpiar").on("click", function (e) {

            e.preventDefault();

            limpiarFormulario();

        });

    }

    function limpiarFormulario() {

        $("#FormPerfil").data('bootstrapValidator').resetForm();

        $(".bootstrap-duallistbox-container .box2").removeClass("has-error");
        $(".box2 .error-spam").remove();

        $("#hdPerID").val("");
        $("#txtNombre").val("");
        $("#txtDescripcion").val("");
        $("#chkVigente").bootstrapToggle("on");
        $("#chkAdministrador").bootstrapToggle("on");
        handleDuallistBox.setValues([]);
    }

    function handleCargaDataInicial() {

        var cargaFuncionalidades = function () {
            return $.ajax({
                type: "GET",
                url: initApp.pathBase + "/Funcionalidad/BuscarSeleccionables",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            }).done(function (response) {
                handleDuallistBox.llenarData(response);
            }, handlePerfil.buscarTodos());
        }

        cargaFuncionalidades();

    }

    function handleChangeEvents() {

        $("#cmbFunciones").on("change", function () {
            if ($(this).val() !== "" && $(this).val() !== null && $(this).val() !== undefined)
                $('#FormPerfil').bootstrapValidator('revalidateField', $(this));
        });        

    }

    function handleGenericEvents() {

        handleDuallistBox.init();

        $('#tbPerfiles tbody').on("click", ".perfEditar", function () {

            $("#FormPerfil").data('bootstrapValidator').resetForm();
            limpiarFormulario();

            var id = $(this).attr("data-id");
            handlePerfil.buscarId(id);

        });

        $('#tbPerfiles tbody').on("click", ".perfEliminar", function () {
            var dato = $(this);

            handleMensaje.mensajeConfirmacion('¿Está seguro que desea eliminar el registro seleccionado?',
                function () {
                    var id = dato.attr("data-id");
                    handlePerfil.eliminar(id);
                });
        });

    }

    return {

        init: init,
        limpiarFormulario: limpiarFormulario
    };

}();

$(document).ready(function () {

    handleDataTablePerfil.init();

    handlePageStates.init();

});