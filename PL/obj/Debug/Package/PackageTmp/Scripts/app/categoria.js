$(document).ready(function () {
    handleDataTableCategorias.init();
    handlePageStates.init();
});

var handlePageStates = function () {
    var pn_busqueda = $("#pnlBusqueda");
    var pn_registro = $("#pnlRegistro");
    function init() {
        handleFormValidations.aplicaValidaciones();
        handleButtonsEvents();
        handleGenericEvents();
        handleCargaDataInicial();
        pn_busqueda.show();
        pn_registro.hide();
        function handleButtonsEvents() {

            $("#btnLimpiar").on("click", function (e) {
                e.preventDefault();

                var valor = handleTipoServicio.ValidaGuardarCambios();
                if (valor) {
                    handleMensaje.mensajeConfirmacionSINO('¿Desea guardar los cambios realizados?',
                        function () {
                            GuardarCambios(false);
                        },
                        function () {
                            limpiarFormulario();
                            habilitarFormulario(true);
                            handleTipoServicio.cargaInicial();
                        }
                    );
                } else {
                    limpiarFormulario();
                    habilitarFormulario(true);
                    handleTipoServicio.cargaInicial();
                }
            });
            $("#btnBuscar").on("click", function (e) {
                e.preventDefault();
                $("#formBuscarCategoria").data('bootstrapValidator').resetForm();
                var bootstrapValidator = $('#formBuscarCategoria').data('bootstrapValidator');
                bootstrapValidator.validate();
                if (bootstrapValidator.isValid()) {
                    handleTipoServicio.buscarTodos();
                }
            });
            $("#btnNuevo").on("click", function (e) {
                e.preventDefault();

                limpiarFormulario();
                habilitarFormulario(true);
                pn_busqueda.hide();
                pn_registro.show();
                handleTipoServicio.SetTipoServicio(handleTipoServicio.getNuevo());
            });
            $("#btnVolver").on("click", function (e) {
                e.preventDefault();
                var valor = handleTipoServicio.ValidaGuardarCambios();
                if (valor) {
                    handleMensaje.mensajeConfirmacionSINO('¿Desea guardar los cambios realizados?',
                        function () {
                            GuardarCambios(true);
                        },
                        function () {
                            pn_busqueda.show();
                            pn_registro.hide();
                            limpiarFormulario();
                            habilitarFormulario(true);
                            handleTipoServicio.cargaInicial();
                        }
                    );
                }
                else {
                    limpiarFormulario();
                    habilitarFormulario(true);
                    pn_busqueda.show();
                    pn_registro.hide();
                    handleTipoServicio.cargaInicial();
                }
            });
            $("#btnGuardar").on("click", function (e) {
                e.preventDefault();
                GuardarCambios(false);
            })
        }
        function GuardarCambios(volver) {
            $("#FormTipoServicio").data('bootstrapValidator').resetForm();
            var bootstrapValidator = $('#FormTipoServicio').data('bootstrapValidator');
            bootstrapValidator.validate();

            if (bootstrapValidator.isValid()) {
                handleTipoServicio.guardar(function (respuesta) {
                    if (respuesta.valor) {
                        handleTipoServicio.cargaInicial();
                        handleMensaje.mensajeExito("Los datos han sido guardados con éxito");
                    }
                    else {
                        handleMensaje.mensajeError("Error al guardar: " + respuesta.mensaje);
                    }

                    limpiarFormulario();
                    habilitarFormulario(true);


                    if (volver) {
                        pn_busqueda.show();
                        pn_registro.hide();
                        handleTipoServicio.cargaInicial();
                    }
                });
            }
        }
        function handleGenericEvents() {
            $('#tbCategorias tbody').on("click", ".trabEditar", function () {
                var dato = $(this);
                $("#hdIdTipoServicio").val(dato.attr("data-id"));
                handleTipoServicio.buscarId($("#hdIdTipoServicio").val());
                pn_busqueda.hide();
                pn_registro.show();
            });
            $('#tbCategorias tbody').on("click", ".trabEliminar", function () {
                var dato = $(this);
                handleMensaje.mensajeConfirmacion('¿Está seguro que desea eliminar el registro seleccionado?',
                    function () {
                        var id = dato.attr("data-id");
                        handleTipoServicio.eliminar(id);
                    });
            });
        }
        function handleCargaDataInicial() {
            handleTipoServicio.cargaInicial();
        }
    }
    function habilitarFormulario(habilitado) {

        $("#FormTipoServicio").data('bootstrapValidator').resetForm();
        $("#formBuscarCategoria").data('bootstrapValidator').resetForm();

        $(".habilitadoInicial").prop("disabled", habilitado);
        $("input[type='text'].habilitadoModifica, input[type='file'].habilitadoModifica, button.habilitadoModifica, textarea.habilitadoModifica").prop("disabled", !habilitado);

        var isDisabled = (habilitado) ? "enable" : "disable";
        $("input[type='checkbox'].habilitadoModifica").bootstrapToggle(isDisabled);

        (habilitado) ? handleUtilidades.selectpickerEnable("select.habilitadoModifica") : handleUtilidades.selectpickerDisable("select.habilitadoModifica");
        (habilitado) ? $("div.habilitadoModifica").removeAttr("disabled") : $("div.habilitadoModifica").attr("disabled", true);

    }
    function limpiarFormulario() {

        $("#hdIdTipoServicio").val("");
        $("#txtNombreServicio").val("");

        $("#chkVigencia").bootstrapToggle("on");
        $("#chkVigenciaFiltro").bootstrapToggle("on");

        $("#txtCodigo").val("");
        $("#txtNombre").val("");
        $("#chkVigenciaFiltro").bootstrapToggle("on");
        handleTipoServicio.SetTipoServicio(handleTipoServicio.getNuevo());

    }
    return {
        init: init
    }
}();

var handleDataTableCategorias = function () {
    var tb;
    return {
        init: function () {
            tb = $('#tbCategorias').DataTable({
                "columnDefs": [
                    {
                        "targets": [3],
                        "className": "dt-body-right"
                    },
                    {
                        "targets": [0],
                        "className": "hidden-lg hidden-md hidden-sm visible-xs ocultaOrden",
                        "orderable": false,
                        "sorting": false,
                        "searchable": false
                    },
                    {
                        "targets": [1, 2],
                        "className": "visible-lg visible-md visible-sm visible-xs ",
                        "orderable": false,
                        "sorting": false,
                        "searchable": false,
                        "width": "1%"
                    }

                ],
            });
        },
        llenarData: function (data) {
            tb.clear();
            tb.state.clear();
            tb.draw();
            $.each(data, function (i, elem) {
                var checked = (elem.TIP_VIGENTE) ? "Sí" : "No";
                tb.row.add([
                    ""
                    , "<a href='javascript:void(0);' data-id='" + elem.TIP_ID_TIPO_SERVICIO + "' class='fa fa-edit fa-lg trabEditar' data-toggle='tooltip' title='Editar' data-original-title='Editar'  ></a>"
                    , "<a href='javascript:void(0);' data-id='" + elem.TIP_ID_TIPO_SERVICIO + "' class='fa fa-trash-o fa-lg trabEliminar' data-toggle='tooltip'   title='Eliminar' data-original-title='Borrar' ></a>"
                    , elem.TIP_ID_TIPO_SERVICIO
                    , elem.TIP_NOMBRE
                    , checked
                ]);
            });
            tb.draw(false);
            tb.columns.adjust().draw();
        }
    }
}();

var handleFormValidations = function () {
    function aplicaValidaciones() {
        validaRegistro()
    }
    function validaRegistro() {
        $('#FormTipoServicio').bootstrapValidator({
            framework: 'bootstrap ',
            live: 'disabled',
            excluded: [':disabled'],
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'txtCodigo': {
                    validators: {
                        integer: {
                            message: 'Debe ingresar sólo números.'
                        }
                    }
                },
                'txtNombreServicio': {
                    validators: {
                        notEmpty: {
                            message: 'Debe ingresar nombre de la categoría.'
                        },
                        stringLength: {
                            max: 100,
                            message: 'Sólo se permiten 100 caracteres como máximo'
                        },
                        regexp: {
                            regexp: '^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s_0-9]+',
                            message: 'Debe ingresar un nombre de categoría válido.'
                        }
                    }
                }
            }
        })
        $('#formBuscarCategoria').bootstrapValidator({
            framework: 'bootstrap ',
            live: 'disabled',
            excluded: [':disabled'],
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'txtCodigo': {
                    validators: {
                        integer: {
                            message: 'Debe ingresar sólo números.'
                        }
                    }
                },
                'txtNombre': {
                    validators: {
                        stringLength: {
                            max: 100,
                            message: 'Sólo se permiten 100 caracteres como máximo.'
                        },
                        regexp: {
                            regexp: '[a-zA-ZñÑáéíóúÁÉÍÓÚ\s_0-9]+',
                            message: 'Debe ingresar un nombre de categoría válido.'
                        }
                    }
                }
            }
        })
    }
    return {
        aplicaValidaciones: aplicaValidaciones
    }
}();

var handleTipoServicio = function () {
    function get() {
        var tipoServicio = {
            TIP_ID_TIPO_SERVICIO: ($("#hdIdTipoServicio").val() == "") ? 0 : $("#hdIdTipoServicio").val(),
            TIP_NOMBRE: ($("#txtNombreServicio").val() == "") ? null : $("#txtNombreServicio").val(),
            TIP_VIGENTE: $("#chkVigencia").is(":checked")
        }
        return tipoServicio;
    }
    function getNuevo() {
        var tipoServicio = {
            TIP_ID_TIPO_SERVICIO: 0,
            TIP_NOMBRE: null,
            TIP_VIGENTE: true
        }
        return tipoServicio;
    }
    function set(tipoServicio) {

        handleTipoServicio.SetTipoServicio(tipoServicio);

        if (tipoServicio.TIP_ID_TIPO_SERVICIO == 0)
            nuevo(tipoServicio);
        else
            editar(tipoServicio);
    }
    function nuevo(tipoServicio) {
        $("#hdIdTipoServicio").val(tipoServicio.TIP_ID_TIPO_SERVICIO);
    }
    function editar(tipoServicio) {

        $("#hdIdTipoServicio").val(tipoServicio.TIP_ID_TIPO_SERVICIO);

        $("#txtNombreServicio").val(tipoServicio.TIP_NOMBRE);
        var vigente = (tipoServicio.TIP_VIGENTE) ? "on" : "off";
        $("#chkVigencia").bootstrapToggle(vigente);
    }
    function filtros() {

        var tipoServicio = {
            TIP_ID_TIPO_SERVICIO: ($("#txtCodigo").val() == "") ? 0 : $("#txtCodigo").val(),
            TIP_NOMBRE: ($("#txtNombre").val() == "") ? null : $("#txtNombre").val(),
            TIP_VIGENTE: $("#chkVigenciaFiltro").is(":checked")
        }

        return tipoServicio;
    }
    function cargaInicial() {
        //cargaInicialTipoServicio(function (response) {
        //    handleDataTableCategorias.llenarData(response);
        //});
        busquedaTipoServicio(function (response) {
            handleDataTableCategorias.llenarData(response);
        });
    }
    function cargaInicialTipoServicio(callback) {
        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/CategoriaServicio/BuscarTodas",
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
    function buscarTodos() {
        busquedaTipoServicio(function (response) {
            handleDataTableCategorias.llenarData(response);
        });
    }
    function busquedaTipoServicio(callback) {

        var tipoServicio = filtros();
        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/CategoriaServicio/Buscar",
            data: JSON.stringify({ tipoServicio: tipoServicio }),
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
    function guardar(callback) {

        var tipoServicio = get();

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/CategoriaServicio/Guardar",
            data: JSON.stringify({ tipoServicio: tipoServicio }),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        })
            .done(function (response) {
                var respuesta = {}
                try {

                    set(response);
                    respuesta = { valor: true, mensaje: '' }
                } catch (ex) {
                    respuesta = { valor: false, mensaje: ex };
                }

                if (callback !== undefined)
                    callback(respuesta);
            });

    }
    function buscarId(id) {

        $.ajax({
            type: "GET",
            url: initApp.pathBase + "/CategoriaServicio/BuscarId",
            data: { id: id },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        })
            .done(function (response) {
                try {
                    set(response);

                } catch (ex) {
                    handleMensaje.mensajeError(ex);
                }
            });

    }
    function eliminar(id) {

        $.ajax({
            type: "DELETE",
            url: initApp.pathBase + "/CategoriaServicio/Eliminar",
            data: JSON.stringify({ id: id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).fail(function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        }).done(function (response) {
            try {
                if (response.Resultado) {
                    buscarTodos();
                    handleMensaje.mensajeExito(response.Mensaje);
                } else {
                    handleMensaje.mensajeError(response.Mensaje);
                }

            } catch (ex) {
                handleMensaje.mensajeError("Registro no pudo ser eliminado, tiene dependencias con servicios");
            }
        });

    }
    function SetTipoServicio(data) {
        $("#hdDataTipoServicio").val(JSON.stringify(data));
    }
    function GetTipoServicio() {
        var valor = $.parseJSON($("#hdDataTipoServicio").val());
        return valor;
    }
    function GetDatosGuardar() {
        return get();
    }
    function ValidaGuardarCambios() {
        var dataEditar = GetTipoServicio();
        var dataGuardar = GetDatosGuardar();
        var valor = false;

        if (dataEditar.TIP_ID_TIPO_SERVICIO == dataGuardar.TIP_ID_TIPO_SERVICIO) {
            //update
            if (dataEditar.TIP_NOMBRE != dataGuardar.TIP_NOMBRE)
                valor = true;
            if (dataEditar.TIP_VIGENTE != dataGuardar.TIP_VIGENTE)
                valor = true;
        } else {
            //insert
            if (dataEditar.TIP_NOMBRE != '')
                valor = true;
            if (dataEditar.TIP_VIGENTE != true)
                valor = true;
        }

        return valor;
    }
    return {
        buscarTodos: buscarTodos
        , cargaInicial: cargaInicial
        , guardar: guardar
        , buscarId: buscarId
        , eliminar: eliminar
        , SetTipoServicio: SetTipoServicio
        , GetTipoServicio: GetTipoServicio
        , GetDatosGuardar: GetDatosGuardar
        , ValidaGuardarCambios: ValidaGuardarCambios
        , getNuevo: getNuevo
    }
}();