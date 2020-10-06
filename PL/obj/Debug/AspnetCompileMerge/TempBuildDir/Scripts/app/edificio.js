$(document).ready(function () {

    handleDataTableEdificios.init();

    handlePageStates.init();

});

var handlePageStates = function () {

    var pn_busqueda = $("#pnlBusqueda");
    var pn_registro = $("#pnlRegistro");

    function init() {

        handleFormValidations.aplicaValidaciones();
        handleButtonsEvents();
        handleCargaDataInicial();
        handleGenericEvents();


        pn_busqueda.show();
        pn_registro.hide();
    }

    var handleFormValidations = function () {

        function aplicaValidaciones() {

            validaRegistro()

        }

        function validaRegistro() {

            $('#FormTrabajador').bootstrapValidator({
                framework: 'bootstrap ',
                live: 'disabled',
                excluded: [':disabled'],
                icon: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    txtNombreEdificio: {
                        validators: {
                            notEmpty: {
                                message: 'Debe ingresar nombre del edificio'
                            },
                            stringLength: {
                                max: 5,
                                message: 'Solo se permiten 5 caracteres como máximo'
                            }
                        }
                    },
                    cmbSede: {
                        validators: {
                            callback: {
                                message: 'Debe seleccionar Sede',
                                callback: function (value, validator) {
                                    if (value == "-1") {
                                        return false;
                                    }
                                    else {
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
        }

    }();

    function habilitarFormulario(habilitado) {

        $("#FormTrabajador").data('bootstrapValidator').resetForm();

        $(".habilitadoInicial").prop("disabled", habilitado);
        $("input[type='text'].habilitadoModifica, input[type='file'].habilitadoModifica, button.habilitadoModifica, textarea.habilitadoModifica").prop("disabled", !habilitado);

        var isDisabled = (habilitado) ? "enable" : "disable";
        $("input[type='checkbox'].habilitadoModifica").bootstrapToggle(isDisabled);

        (habilitado) ? handleUtilidades.selectpickerEnable("select.habilitadoModifica") : handleUtilidades.selectpickerDisable("select.habilitadoModifica");
        (habilitado) ? $("div.habilitadoModifica").removeAttr("disabled") : $("div.habilitadoModifica").attr("disabled", true);

    }

    function limpiarFormulario() {

        $("#hdIdEdificio").val("");
        $("#txtNombreEdificio").val("");

        $("#chkVigente").bootstrapToggle("on");
        $("#chkVigenteFiltro").bootstrapToggle("on");

        var session = handleVariables.GetSession();
        var edificio = {
            EDI_ID_EDIFICIO: 0, EDI_NOMBRE: null, EDI_VIGENTE: true,
            EDI_SED_ID_SEDE: (session.Usuario.Perfil.PERF_ADMINISTRADOR == false) ? session.Usuario.USU_SED_ID_SEDE : null
        }
        handleVariables.SetEdificio(edificio);

        if (session.Usuario.Perfil.PERF_ADMINISTRADOR == true)
            $("#cmbSede").selectpicker('val', "-1");
        else
            $("#cmbSede").selectpicker('val', session.Usuario.USU_SED_ID_SEDE.toString());
    }

    function handleButtonsEvents() {

        $("#btnBuscar").on("click", function (e) {

            e.preventDefault();

            handleEdificio.buscarTodos();

        });

        $("#btnNuevo").on("click", function (e) {

            e.preventDefault();

            habilitarFormulario(true);
            limpiarFormulario();

            pn_busqueda.hide();
            pn_registro.show();

            var session = handleVariables.GetSession();
            var edificio = {
                EDI_ID_EDIFICIO: 0, EDI_NOMBRE: null, EDI_VIGENTE: true,
                EDI_SED_ID_SEDE: (session.Usuario.Perfil.PERF_ADMINISTRADOR == false) ? session.Usuario.USU_SED_ID_SEDE : null
            }
            handleVariables.SetEdificio(edificio);

        });

        $("#btnGuardar").on("click", function (e) {

            e.preventDefault();

            GuardarCambios();

        });

        $("#btnLimpiar").on("click", function (e) {

            e.preventDefault();

            //$("#txtNombreEdificio").attr('autofocus', 'true');
            $("#txtNombreEdificio").focus();

            var valor = handleVariables.ValidaGuardarCambios();
            if (valor) {
                handleMensaje.mensajeConfirmacionSINO('¿Desea guardar los cambios realizados?',
                    function () {
                        GuardarCambios(false);
                    },
                    function () {
                        limpiarFormulario();
                        habilitarFormulario(true);
                    }
                );
            } else {
                limpiarFormulario();
                habilitarFormulario(true);
            }

            var session = handleVariables.GetSession();
            var edificio = {
                EDI_ID_EDIFICIO: 0, EDI_NOMBRE: null, EDI_VIGENTE: true,
                EDI_SED_ID_SEDE: (session.Usuario.Perfil.PERF_ADMINISTRADOR == false) ? session.Usuario.USU_SED_ID_SEDE : null
            }
            handleVariables.SetEdificio(edificio);

            handleEdificio.buscarTodos();

        });

        $("#btnVolver").on("click", function (e) {

            e.preventDefault();

            var valor = handleVariables.ValidaGuardarCambios();
            if (valor) {
                handleMensaje.mensajeConfirmacionSINO('¿Desea guardar los cambios realizados?',
                    function () {
                        GuardarCambios(true);
                    },
                    function () {
                        pn_busqueda.show();
                        pn_registro.hide();
                    }
                );
            }
            else {
                pn_busqueda.show();
                pn_registro.hide();
            }

            handleEdificio.buscarTodos();
        });

    }

    function GuardarCambios(volver) {
        $("#FormTrabajador").data('bootstrapValidator').resetForm();
        var bootstrapValidator = $('#FormTrabajador').data('bootstrapValidator');
        bootstrapValidator.validate();

        if (bootstrapValidator.isValid()) {

            var EDI_ID_EDIFICIO = ($("#hdIdEdificio").val() == "") ? 0 : $("#hdIdEdificio").val();
            var EDI_NOMBRE = ($("#txtNombreEdificio").val() == "") ? null : $("#txtNombreEdificio").val();
            var EDI_SED_ID_SEDE = ($("#cmbSede").val() == "-1") ? null : $("#cmbSede").val();

            handleEdificio.ExisteEdificio(EDI_NOMBRE, EDI_SED_ID_SEDE, function (response) {
                var existe = false;
                if (EDI_ID_EDIFICIO == 0) {
                    if (response.EDI_NOMBRE != null) {
                        existe = true;
                        handleMensaje.mensajeError('El edificio ya se encuentra registrado');
                    }
                }

                if (existe == false)
                    handleEdificio.guardar(function (respuesta) {

                        if (respuesta.valor) {
                            //handleEdificio.buscarTodos();
                            handleMensaje.mensajeExito("Los datos han sido actualizados con éxito");
                        }
                        else
                            handleMensaje.mensajeError("Error al actualizar: " + respuesta.mensaje);

                        limpiarFormulario();
                        habilitarFormulario(true);

                        if (volver) {
                            pn_busqueda.show();
                            pn_registro.hide();
                        }
                    });

            });
        }

    }

    function handleGenericEvents() {

        $('#tbEdificios tbody').on("click", ".trabEditar", function () {

            $("#FormTrabajador").data('bootstrapValidator').resetForm();

            habilitarFormulario(true);
            limpiarFormulario();

            var id = $(this).attr("data-id");
            handleEdificio.buscarId(id);

            pn_busqueda.hide();
            pn_registro.show();

        });

        $('#tbEdificios tbody').on("click", ".trabEliminar", function () {
            var dato = $(this);
            handleMensaje.mensajeConfirmacion('¿Desea eliminar el registro seleccionado?',
                function () {
                    var id = dato.attr("data-id");
                    handleEdificio.eliminar(id);
                });
        });

    }

    function handleCargaDataInicial() {

        habilitarFormulario(true);

        var cargaSedes = function () {
            return $.ajax({
                type: "POST",
                url: initApp.pathBase + "/Sede/Buscar",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            }).done(function (response) {

                var opcion1 = 'Todas';
                var opcion2 = 'Seleccione';

                if (response.length == 1) {
                    opcion1 = '';
                    opcion2 = '';
                }

                handleUtilidades.llenarComboTodos('cmbSedeFiltro', response, 'SED_ID_SEDE', 'SED_NOMBRE', true, opcion1);
                handleUtilidades.llenarComboTodos('cmbSede', response, 'SED_ID_SEDE', 'SED_NOMBRE', true, opcion2);

            },
                handleEdificio.SeteaSession(),
                //handleEdificio.cargaInicial()
                handleEdificio.buscarTodos()
            );
        }

        cargaSedes();

        
        $("#tbEdificios_length").on("change", function (e) {

            e.preventDefault();

            var valor = $("#tbEdificios_length option:selected").val();

            if (valor == '25')
                $("#left-panel").css("min-height", "130%");
            else if (valor == '50')
                $("#left-panel").css("min-height", "160%");
            else if (valor == '100')
                $("#left-panel").css("min-height", "220%");
            else
                $("#left-panel").css("min-height", "100%");

        });


    }

    return {
        init: init
        , habilitarFormulario: habilitarFormulario
    }

}();

var handleDataTableEdificios = function () {

    var tb;

    return {

        init: function () {

            tb = $('#tbEdificios').DataTable({
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
                    , "<a href='javascript:void(0);' data-id='" + elem.EDI_ID_EDIFICIO + "' class='fa fa-edit fa-lg trabEditar' data-toggle='tooltip' title='Editar' data-original-title='Editar'  ></a>"
                    , "<a href='javascript:void(0);' data-id='" + elem.EDI_ID_EDIFICIO + "' class='fa fa-trash-o fa-lg trabEliminar' data-toggle='tooltip'   title='Eliminar' data-original-title='Borrar' ></a>"
                    , elem.EDI_ID_EDIFICIO
                    , elem.EDI_NOMBRE
                    , elem.SED_NOMBRE
                    , handleUtilidades.formatoFecha(elem.EDI_FECHA_CREACION)
                    , (elem.EDI_FECHA_ACTUALIZACION == 'null' || elem.EDI_FECHA_ACTUALIZACION == null) ? "" : handleUtilidades.formatoFecha(elem.EDI_FECHA_ACTUALIZACION)
                    , elem.EDI_VIGENTE == true ? 'Sí' : 'No'
                ]);
            });
            tb.draw(false);
            tb.columns.adjust().draw();
        }

    }
}();

var handleEdificio = function () {

    function get() {
        var fecha_actual = new Date();

        var edificio = {
            EDI_ID_EDIFICIO: ($("#hdIdEdificio").val() == "") ? 0 : $("#hdIdEdificio").val(),
            EDI_NOMBRE: ($("#txtNombreEdificio").val() == "") ? null : $("#txtNombreEdificio").val(),
            EDI_VIGENTE: $("#chkVigente").is(":checked"),
            EDI_SED_ID_SEDE: ($("#cmbSede").val() == "-1") ? null : $("#cmbSede").val(),
            EDI_FECHA_CREACION: fecha_actual,
            EDI_FECHA_ACTUALIZACION: fecha_actual
        }

        return edificio;
    }

    function set(edificio) {

        if (edificio.EDI_ID_EDIFICIO == 0)
            nuevo(edificio);
        else
            editar(edificio);
    }

    function nuevo(edificio) {

        $("#hdIdEdificio").val(edificio.EDI_ID_EDIFICIO);
        handlePageStates.habilitarFormulario(true);

    }

    function editar(edificio) {

        $("#hdIdEdificio").val(edificio.EDI_ID_EDIFICIO);
        handlePageStates.habilitarFormulario(true);

        $("#txtNombreEdificio").val(edificio.EDI_NOMBRE);
        $('#cmbSede').selectpicker('val', (edificio.EDI_SED_ID_SEDE == null) ? "-1" : edificio.EDI_SED_ID_SEDE);
        var vigente = (edificio.EDI_VIGENTE) ? "on" : "off";
        $("#chkVigente").bootstrapToggle(vigente);
    }

    function filtros() {

        var edificio = {
            EDI_ID_EDIFICIO: ($("#txtCodigoFiltro").val() == "") ? 0 : $("#txtCodigoFiltro").val(),
            EDI_NOMBRE: ($("#txtNombreFiltro").val() == "") ? null : $("#txtNombreFiltro").val(),
            EDI_VIGENTE: $("#chkVigenteFiltro").is(":checked"),
            EDI_SED_ID_SEDE: ($("#cmbSedeFiltro").val() == "-1") ? null : $("#cmbSedeFiltro").val()
        }

        return edificio;
    }

    function cargaInicial() {

        cargaInicialEdificios(function (response) {

            handleDataTableEdificios.llenarData(response);

        });

    }

    function cargaInicialEdificios(callback) {

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Edificio/ObtenerTodos",
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

        busquedaEdificios(function (response) {

            handleDataTableEdificios.llenarData(response);

        });

    }

    function busquedaEdificios(callback) {

        var edificio = filtros();

        console.log(edificio);

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Edificio/BuscarTodos",
            data: JSON.stringify({ edificio: edificio }),
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

        var edificio = get();

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Edificio/Guardar",
            data: JSON.stringify({ edificio: edificio }),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        })
            .done(function (response) {
                var respuesta = {}
                try {

                    set(response);
                    respuesta = { valor: true, mensaje: '' }

                } catch (ex) {
                    respuesta = { valor: false, mensaje: ex }
                }

                if (callback !== undefined)
                    callback(respuesta);
            });

    }

    function buscarId(id) {

        $.ajax({
            type: "GET",
            url: initApp.pathBase + "/Edificio/BuscarId",
            data: { id: id },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        })
            .done(function (response) {
                try {

                    handleVariables.SetEdificio(response);
                    set(response);

                } catch (ex) {
                    handleMensaje.mensajeError(ex);
                }
            });

    }

    function ExisteEdificio(nombre, id_sede, callback) {

        $.ajax({
            type: "GET",
            url: initApp.pathBase + "/Edificio/ExisteEdificio",
            data: { nombre: nombre, id_sede: id_sede },
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

    function eliminar(id) {

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Edificio/Eliminar",
            data: JSON.stringify({ id: id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function (respuesta) {

            buscarTodos();

            if (respuesta.Resultado == false)
                handleMensaje.mensajeError("Edificio no pudo ser eliminado, tiene dependencias con Servicios");
        });
    }

    function SeteaSession() {

        buscaDatosSession(function (response) {
            handleVariables.SetSession(response);
        });

    }

    function buscaDatosSession(callback) {

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Login/DatosSession",
            dataType: "json",
            contentType: "application/json; charset=utf-8"
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
        , guardar: guardar
        , buscarId: buscarId
        , eliminar: eliminar
        , ExisteEdificio: ExisteEdificio
        , SeteaSession: SeteaSession
        , cargaInicial: cargaInicial
    }
}();

var handleVariables = function () {

    function SetEdificio(data) {
        $("#hdDataEdificio").val(JSON.stringify(data));
    }

    function GetEdificio() {
        var valor = $.parseJSON($("#hdDataEdificio").val());
        return valor;
    }

    function SetSession(data) {
        $("#hdDataSession").val(JSON.stringify(data));
    }

    function GetSession() {
        var valor = $.parseJSON($("#hdDataSession").val());
        return valor;
    }

    function GetDatosGuardar() {

        var edificio = {
            EDI_ID_EDIFICIO: ($("#hdIdEdificio").val() == "") ? 0 : parseInt($("#hdIdEdificio").val()),
            EDI_NOMBRE: ($("#txtNombreEdificio").val() == "") ? null : $("#txtNombreEdificio").val(),
            EDI_VIGENTE: $("#chkVigente").is(":checked"),
            EDI_SED_ID_SEDE: ($("#cmbSede").val() == "-1") ? null : parseInt($("#cmbSede").val())
        }

        return edificio;
    }

    function ValidaGuardarCambios() {
        var dataEditar = GetEdificio();
        var dataGuardar = GetDatosGuardar();
        var session = handleVariables.GetSession();
        var valor = false;

        if (dataEditar.EDI_ID_EDIFICIO == dataGuardar.EDI_ID_EDIFICIO) {
            //update
            if (dataEditar.EDI_NOMBRE != dataGuardar.EDI_NOMBRE)
                valor = true;
            if (dataEditar.EDI_SED_ID_SEDE != dataGuardar.EDI_SED_ID_SEDE)
                valor = true;
            if (dataEditar.EDI_VIGENTE != dataGuardar.EDI_VIGENTE)
                valor = true;

        } else {
            //insert
            if (dataEditar.EDI_NOMBRE != '')
                valor = true;
            if (dataEditar.EDI_SED_ID_SEDE != '-1' && session.Usuario.Perfil.PERF_ADMINISTRADOR == true)
                valor = true;
            if (dataEditar.EDI_VIGENTE != true)
                valor = true;
        }

        return valor;
    }

    return {
        SetEdificio: SetEdificio
        , SetSession: SetSession
        , GetSession: GetSession
        , ValidaGuardarCambios: ValidaGuardarCambios
    }
}();