$(document).ready(function () {

    handleDataTableExportacion.init();

    handlePageStates.init();

});

var handlePageStates = function () {

    var pn_busqueda = $("#pnlBusqueda");

    function init() {

        handleFormValidations.aplicaValidaciones();
        handleButtonsEvents();
        handleCargaDataInicial();

        pn_busqueda.show();
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
                    txtFechaFin: {
                        validators: {
                            notEmpty: {
                                message: 'Seleccione la fecha fin'
                            },
                            callback: {
                                message: '',
                                callback: function (value, validator) {

                                    var fechaInicio = handleUtilidades.convierteAfecha($("#txtFechaInicio").val());
                                    var fechaFin = handleUtilidades.convierteAfecha(value);

                                    if (fechaFin < fechaInicio) {
                                        return {
                                            valid: false,
                                            message: 'Debe ser mayor o igual a la fecha inicio'
                                        };
                                    }
                                    else
                                        return {
                                            valid: true
                                        };
                                }
                            }

                        }
                    },
                    txtFechaInicio: {
                        validators: {
                            notEmpty: {
                                message: 'Seleccione la fecha inicio'
                            }
                            ,
                            callback: {
                                message: '',
                                callback: function (value, validator) {

                                    var fechaActual = new Date();
                                    var fechaInicio = handleUtilidades.convierteAfecha(value);

                                    if (fechaInicio > fechaActual) {
                                        return {
                                            valid: false,
                                            message: 'Debe ser menor o igual a la fecha actual'
                                        };
                                    }
                                    else {
                                        var fechaFin = handleUtilidades.convierteAfecha($("#txtFechaFin").val());
                                        if (fechaFin != '')
                                        {
                                            if (fechaInicio > fechaFin)
                                            {
                                                return {
                                                    valid: false,
                                                    message: 'Debe ser menor o igual a la fecha fin'
                                                };
                                            }
                                            else
                                                return {
                                                    valid: true
                                                };
                                        } else
                                            return {
                                                valid: true
                                            };

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

    function handleButtonsEvents() {

        $("#btnBuscar").on("click", function (e) {

            e.preventDefault();

            $("#FormTrabajador").data('bootstrapValidator').resetForm();
            var bootstrapValidator = $('#FormTrabajador').data('bootstrapValidator');
            bootstrapValidator.validate();

            if (bootstrapValidator.isValid()) {

                handleExportacion.IntervaloFechas(function (response) {

                    var fechaInicio = handleUtilidades.convierteAfecha($("#txtFechaInicio").val());
                    var fechaFin = handleUtilidades.convierteAfecha($("#txtFechaFin").val());

                    var diferencia = new Date(fechaFin - fechaInicio);
                    var diasDiff = (diferencia / 1000 / 60 / 60 / 24) + 1;

                    if (diasDiff <= parseInt(response)) {
                        handleExportacion.buscar();
                    }
                    else {
                        handleMensaje.mensajeError('El rango máximo a consultar es de ' + response + ' días');
                    }

                });

            }

        });

        $("#btnExportar").on("click", function (e) {

            e.preventDefault();

            $("#FormTrabajador").data('bootstrapValidator').resetForm();
            var bootstrapValidator = $('#FormTrabajador').data('bootstrapValidator');
            bootstrapValidator.validate();

            if (bootstrapValidator.isValid()) {
                
                handleExportacion.IntervaloFechas(function (response) {

                    var fechaInicio = handleUtilidades.convierteAfecha($("#txtFechaInicio").val());
                    var fechaFin = handleUtilidades.convierteAfecha($("#txtFechaFin").val());

                    var diferencia = new Date(fechaFin - fechaInicio);
                    var diasDiff = (diferencia / 1000 / 60 / 60 / 24) + 1;

                    console.log(diasDiff);
                    console.log(parseInt(response));

                    if (diasDiff <= parseInt(response)) {
                        handleExportacion.generarExcel();
                    }
                    else {
                        handleMensaje.mensajeError('El rango máximo a consultar es de ' + response + ' días');
                    }

                });

            }

        });

        $("#cmbSedeFiltro").on("change", function (e) {
            e.preventDefault();
            handleCombos.CargaEdificiosSede();
        });

        $("#cmbEdificioFiltro").on("change", function (e) {
            e.preventDefault();
            handleCombos.CargaServiciosEdificio();
        });

    }

    function handleCargaDataInicial() {

        habilitarFormulario(true);

        handleCombos.CargaSedes(function () {
            handleCombos.CargaCategoriasServicios(function () {
                handleCombos.CargaEdificiosSede(function () {
                    handleCombos.CargaServiciosEdificio();
                });
            });
        });

    }

    return {
        init: init
    }

}();

var handleDataTableExportacion = function () {

    var tb;

    return {

        init: function () {

            tb = $('#tbVotos').DataTable({
                "columnDefs": [
                    {
                        "targets": [1,6,8],
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
                        "targets": [0],
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
                    , elem.EVA_ID_EVALUACION
                    , elem.Servicio.SER_NOMBRE
                    , elem.TipoServicio.TIP_NOMBRE
                    , elem.Sede.SED_NOMBRE
                    , elem.Edificio.EDI_NOMBRE
                    , handleUtilidades.formatoFecha(elem.EVA_FECHA_HORA) + ' ' + handleUtilidades.formatoHora(elem.EVA_FECHA_HORA)
                    , elem.EVA_NOTA == 1 ? 'Mala' : elem.EVA_NOTA == 2 ? 'Regular' : elem.EVA_NOTA == 3 ? 'Buena' : ''
                    , elem.EVA_REGISTRO
                    , elem.EVA_IDENTIFICACION_DISPOSITIVO
                ]);
            });
            tb.draw(false);
            tb.columns.adjust().draw();
        }

    }
}();

var handleExportacion = function () {

    function filtros() {

        var evaluacion = {
            EVA_FECHA_INICIO: ($("#txtFechaInicio").val() == "") ? null : $("#txtFechaInicio").val() + " 00:00:00.000",
            EVA_FECHA_TERMINO: ($("#txtFechaFin").val() == "") ? null : $("#txtFechaFin").val() + " 23:59:59.999",
            Sede: { SED_ID_SEDE: ($("#cmbSedeFiltro").val() == "-1") ? null : $("#cmbSedeFiltro").val() },
            Edificio: { EDI_ID_EDIFICIO: ($("#cmbEdificioFiltro").val() == "-1") ? null : $("#cmbEdificioFiltro").val() },
            TipoServicio: { TIP_ID_TIPO_SERVICIO: ($("#cmbCategoriaFiltro").val() == "-1") ? null : $("#cmbCategoriaFiltro").val() },
            EVA_SER_ID_SERVICIO: ($("#cmbServicioFiltro").val() == "-1") ? null : $("#cmbServicioFiltro").val()
        }

        return evaluacion;
    }

    function buscar() {

        busquedaEvaluaciones(function (response) {

            handleDataTableExportacion.llenarData(response);

        });

    }

    function generarExcel() {

        busquedaEvaluaciones(function (response) {

            if (response.length > 0) {

                var evaluacion = filtros();

                $.ajax({
                    type: "POST",
                    url: initApp.pathBase + "/ExportacionExcel/EvaluacionFiltrosArchivo",
                    data: JSON.stringify({ evaluacion: evaluacion }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                })
                .done(function (response) {
                    try {
                        window.open(initApp.pathBase + "/ExportacionExcel/ListadoEvaluacionesToExcel", '_blank');
                    } catch (ex) {
                        handleMensaje.mensajeError(ex);
                    }
                });

            }
            else
                handleMensaje.mensajeInfo("El excel no se generará porque no tiene datos");

        });

    }

    function busquedaEvaluaciones(callback) {

        var evaluacion = filtros();

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/ExportacionExcel/BuscarEvaluaciones",
            data: JSON.stringify({ evaluacion: evaluacion }),
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

    function IntervaloFechas(callback) {

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/ExportacionExcel/IntervaloFechas",
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
          buscar: buscar
        , generarExcel: generarExcel
        , IntervaloFechas: IntervaloFechas
    }
}();

var handleCombos = function () {

    function CargaSedes(callback) {

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Sede/Buscar",
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        })
            .done(function (response) {
                try {

                    if (callback !== undefined)
                        callback();

                    var opcion1 = 'Todas';

                    if (response.length == 1) {
                        opcion1 = '';
                    }

                    handleUtilidades.llenarComboTodos('cmbSedeFiltro', response, 'SED_ID_SEDE', 'SED_NOMBRE', true, opcion1);

                } catch (ex) {
                    handleMensaje.mensajeError(ex);
                }
            });

    }

    function CargaCategoriasServicios(callback) {

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/CategoriaServicio/BuscarTodas",
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        })
            .done(function (response) {
                try {

                    if (callback !== undefined)
                        callback();

                    handleUtilidades.llenarComboTodos('cmbCategoriaFiltro', response, 'TIP_ID_TIPO_SERVICIO', 'TIP_NOMBRE', true, 'Todas');

                } catch (ex) {
                    handleMensaje.mensajeError(ex);
                }
            });

    }

    function busquedaEdificios(sede_id, callback) {

        var edificio = {
            EDI_ID_EDIFICIO: 0,
            EDI_NOMBRE: null,
            EDI_VIGENTE: null,
            EDI_SED_ID_SEDE: sede_id
        }

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

    function CargaEdificiosSede(callback) {

        var sede_id = $("#cmbSedeFiltro").val();

        console.log(sede_id);

        busquedaEdificios(sede_id, function (response) {
            handleUtilidades.llenarComboRefresh('cmbEdificioFiltro', response, 'EDI_ID_EDIFICIO', 'EDI_NOMBRE', true, 'Todos');

            if (callback !== undefined)
                callback();
        });

    }

    function CargaServiciosEdificio() {

        var id_edificio = $("#cmbEdificioFiltro").val();
        busquedaServicios(id_edificio, function (response) {
            handleUtilidades.llenarComboRefresh('cmbServicioFiltro', response, 'SER_ID_SERVICIO', 'SER_NOMBRE', true, 'Todos');
        });

    }

    function busquedaServicios(id_edificio, callback) {

        var servicio = {
            SER_ID_SERVICIO: 0,
            SER_NOMBRE: null,
            SER_VIGENTE: null,
            SER_EDI_ID_EDIFICIO: id_edificio,
            SER_TIP_ID_TIPO_SERVICIO: null,
            Sede: { SED_ID_SEDE: null }
        }

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Servicio/BuscarTodosFull",
            data: JSON.stringify({ servicio: servicio }),
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
        CargaSedes: CargaSedes
        , CargaEdificiosSede: CargaEdificiosSede
        , CargaCategoriasServicios: CargaCategoriasServicios
        , busquedaEdificios: busquedaEdificios
        , CargaServiciosEdificio: CargaServiciosEdificio
    }
}();