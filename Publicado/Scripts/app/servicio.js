$(document).ready(function () {

    handleDataTableServicios.init();

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
                    cmbSede: {
                        validators: {
                            callback: {
                                message: 'Debe seleccionar sede',
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
                    },
                    cmbEdificio: {
                        validators: {
                            callback: {
                                message: 'Debe seleccionar un edificio',
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
                    },
                    cmbCategoria: {
                        validators: {
                            callback: {
                                message: 'Debe seleccionar una categoría para el servicio',
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
                    },
                    txtNombreServicio: {
                        validators: {
                            notEmpty: {
                                message: 'Debe ingresar nombre del servicio'
                            },
                            stringLength: {
                                max: 100,
                                message: 'Solo se permiten 100 caracteres como máximo'
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

        $("#hdIdServicio").val("");
        $("#txtNombreServicio").val("");
        $("#txtNombreServicio").focus();
        $("#chkVigente").bootstrapToggle("on");
        $("#cmbCategoria").selectpicker('val', "-1");


        var session = handleVariables.GetSession();
        var Sede = { SED_ID_SEDE: (session.Usuario.Perfil.PERF_ADMINISTRADOR == false) ? session.Usuario.USU_SED_ID_SEDE : null }
        var servicio = {
            SER_ID_SERVICIO: 0
            , SER_NOMBRE: null
            , SER_VIGENTE: true
            , Sede: Sede
            , EDI_ID_EDIFICIO: null
            , TIP_ID_TIPO_SERVICIO: null
        }
        handleVariables.SetServicio(servicio);


        if (session.Usuario.Perfil.PERF_ADMINISTRADOR == true)
            $("#cmbSede").selectpicker('val', "-1");
        else
            $("#cmbSede").selectpicker('val', session.Usuario.USU_SED_ID_SEDE.toString());

        handleCombos.CargaEdificiosSede(false);
    }

    function handleButtonsEvents() {

        $("#btnBuscar").on("click", function (e) {

            e.preventDefault();

            handleServicio.buscarTodos();

        });

        $("#btnNuevo").on("click", function (e) {

            e.preventDefault();

            habilitarFormulario(true);
            limpiarFormulario();

            pn_busqueda.hide();
            pn_registro.show();

            var session = handleVariables.GetSession();
            var Sede = { SED_ID_SEDE: (session.Usuario.Perfil.PERF_ADMINISTRADOR == false) ? session.Usuario.USU_SED_ID_SEDE : null }
            var servicio = {
                SER_ID_SERVICIO: 0
                , SER_NOMBRE: null
                , SER_VIGENTE: true
                , Sede: Sede
                , EDI_ID_EDIFICIO: null
                , TIP_ID_TIPO_SERVICIO: null
            }
            handleVariables.SetServicio(servicio);

        });

        $("#btnLimpiar").on("click", function (e) {

            e.preventDefault();

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
            var Sede = { SED_ID_SEDE: (session.Usuario.Perfil.PERF_ADMINISTRADOR == false) ? session.Usuario.USU_SED_ID_SEDE : null }
            var servicio = {
                SER_ID_SERVICIO: 0
                , SER_NOMBRE: null
                , SER_VIGENTE: true
                , Sede: Sede
                , EDI_ID_EDIFICIO: null
                , TIP_ID_TIPO_SERVICIO: null
            }
            handleVariables.SetServicio(servicio);

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

            handleServicio.buscarTodos();

        });

        $("#cmbSedeFiltro").on("change", function (e) {
            e.preventDefault();
            handleCombos.CargaEdificiosSede(true);
        });

        $("#cmbSede").on("change", function (e) {
            e.preventDefault();
            handleCombos.CargaEdificiosSede(false);
        });

        $("#btnGuardar").on("click", function (e) {

            e.preventDefault();

            GuardarCambios();

        });

        $("#btnDescargarPDF").on("click", function (e) {
            e.preventDefault();
            handleServicio.DescargaPDF(handleServicio.getIdServicio());
        });

        $("#btnDescargarPNG").on("click", function (e) {
            e.preventDefault();
            handleServicio.DescargaImagen(handleServicio.getIdServicio());
        });

    }

    function handleGenericEvents() {

        $('#tbServicios tbody').on("click", ".trabEditar", function () {
            $("#FormTrabajador").data('bootstrapValidator').resetForm();

            habilitarFormulario(true);
            limpiarFormulario();

            var id = $(this).attr("data-id");
            handleServicio.buscarId(id);

            pn_busqueda.hide();
            pn_registro.show();

        });

        $('#tbServicios tbody').on("click", ".trabEliminar", function () {
            var dato = $(this);
            handleMensaje.mensajeConfirmacion('¿Desea eliminar el registro seleccionado?',
                function () {
                    var id = dato.attr("data-id");
                    handleServicio.eliminar(id);
                });
        });

        $('#tbServicios tbody').on("click", ".trabCodigoQR", function () {
            var dato = $(this);
            var SER_ID_SERVICIO = dato.attr("data-id");
            handleServicio.setIdServicio(SER_ID_SERVICIO);

            handleServicio.GeneraCodigoQR(SER_ID_SERVICIO, function (response) {

                $('#imgQRcode').attr('src', response.URL);
                $('#imgQRcode').attr('width', response.width);
                $('#imgQRcode').attr('height', response.heigth);
                $("#lblServicioQR").html(response.servicio);

            });

            $('#ModalPopUp').modal('show');
            $('#ModalPopUp').modal({
                backdrop: 'static',
                keyboard: false
            })
        });

    }

    function handleCargaDataInicial() {

        habilitarFormulario(true);

        handleCombos.CargaSedes(function (response) {
            handleCombos.CargaCategoriasServicios(function (response) {
                handleCombos.CargaEdificiosSede(true);
                handleCombos.CargaEdificiosSede(false);
            });
        });

        handleServicio.SeteaSession()

        handleServicio.buscarTodos();


        $("#tbServicios_length").on("change", function (e) {

            e.preventDefault();

            var valor = $("#tbServicios_length option:selected").val();

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

    function GuardarCambios(volver) {

        $("#FormTrabajador").data('bootstrapValidator').resetForm();
        var bootstrapValidator = $('#FormTrabajador').data('bootstrapValidator');
        bootstrapValidator.validate();

        if (bootstrapValidator.isValid()) {

            var SER_ID_SERVICIO = ($("#hdIdServicio").val() == "") ? 0 : $("#hdIdServicio").val();
            var SER_NOMBRE = ($("#txtNombreServicio").val() == "") ? null : $("#txtNombreServicio").val();
            var EDI_ID_EDIFICIO = ($("#cmbEdificio").val() == "-1") ? null : $("#cmbEdificio").val();
            var TIP_ID_TIPO_SERVICIO = ($("#cmbCategoria").val() == "-1") ? null : $("#cmbCategoria").val();

            handleServicio.ExisteServicio(SER_NOMBRE, EDI_ID_EDIFICIO, TIP_ID_TIPO_SERVICIO, function (response) {
                var existe = false;
                if (SER_ID_SERVICIO == 0) {
                    if (response.EDI_NOMBRE != null) {
                        existe = true;
                        handleMensaje.mensajeError('El servicio ya se encuentra registrado');
                    }
                }

                if (existe == false)
                    handleServicio.guardar(function (respuesta) {

                        if (respuesta.valor) {
                            handleServicio.cargaInicial();
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

    return {
        init: init
        , habilitarFormulario: habilitarFormulario
    }

}();

var handleDataTableServicios = function () {

    var tb;

    return {

        init: function () {

            tb = $('#tbServicios').DataTable({
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
                        "targets": [1, 2, 3],
                        "className": "visible-lg visible-md visible-sm visible-xs",
                        "orderable": false,
                        "sorting": false,
                        "searchable": false,
                        "width": "1%"
                    },
                    {
                        "targets": [4],
                        "className": "dt-body-right"
                    }
                    
                ]
            });
        },
        llenarData: function (data) {

            tb.clear();
            tb.state.clear();
            tb.draw();

            $.each(data, function (i, elem) {
                tb.row.add([
                    ""
                    , "<a href='javascript:void(0);' data-id='" + elem.SER_ID_SERVICIO + "' class='fa fa-edit fa-lg trabEditar' data-toggle='tooltip' title='Editar' data-original-title='Editar'></a>"
                    , "<a href='javascript:void(0);' data-id='" + elem.SER_ID_SERVICIO + "' class='fa fa-trash-o fa-lg trabEliminar' data-toggle='tooltip'   title='Eliminar' data-original-title='Eliminar'></a>"
                    , "<a href='javascript:void(0);' data-id='" + elem.SER_ID_SERVICIO + "' class='fa fa-qrcode fa-lg trabCodigoQR' data-toggle='tooltip'   title='Código QR' data-original-title='Código QR'></a>"
                    , "<label style='text-align:right !important;'>" + elem.SER_ID_SERVICIO + "</label>"
                    , elem.SER_NOMBRE
                    , elem.SED_NOMBRE
                    , elem.EDI_NOMBRE
                    , elem.TIP_NOMBRE
                    , handleUtilidades.formatoFecha(elem.SER_FECHA_CREACION)
                    , (elem.SER_FECHA_ACTUALIZACION == 'null' || elem.SER_FECHA_ACTUALIZACION == null) ? "" : handleUtilidades.formatoFecha(elem.SER_FECHA_ACTUALIZACION)
                    , elem.SER_VIGENTE == true ? 'Sí' : 'No'
                ]);
            });
            tb.draw(false);
            tb.columns.adjust().draw();
        }

    }
}();

var handleServicio = function () {
    var _idServicio = 0;

    function getIdServicio() {
        return this._idServicio;
    }

    function setIdServicio(idServicio) {
        this._idServicio = idServicio;
    }

    function filtros() {

        var Sede = {
            SED_ID_SEDE: ($("#cmbSedeFiltro").val() == "-1") ? null : $("#cmbSedeFiltro").val()
        }

        var servicio = {
            SER_ID_SERVICIO: ($("#txtCodigoFiltro").val() == "") ? 0 : $("#txtCodigoFiltro").val(),
            SER_NOMBRE: ($("#txtNombreFiltro").val() == "") ? null : $("#txtNombreFiltro").val(),
            SER_VIGENTE: $("#chkVigenteFiltro").is(":checked"),
            SER_EDI_ID_EDIFICIO: ($("#cmbEdificioFiltro").val() == "-1") ? null : $("#cmbEdificioFiltro").val(),
            TIP_ID_TIPO_SERVICIO: ($("#cmbCategoriaFiltro").val() == "-1") ? null : $("#cmbCategoriaFiltro").val(),
            Sede: Sede
        }

        return servicio;
    }

    function cargaInicial() {

        cargaInicialServicios(function (response) {

            handleDataTableServicios.llenarData(response);

        });

    }

    function cargaInicialServicios(callback) {

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Servicio/ObtenerTodos",
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

        busquedaServicios(function (response) {

            handleDataTableServicios.llenarData(response);

        });

    }

    function busquedaServicios(callback) {

        var servicio = filtros();

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Servicio/BuscarTodos",
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

    function get() {

        var fecha_actual = new Date();
        var servicio = {
            SER_ID_SERVICIO: ($("#hdIdServicio").val() == "") ? 0 : $("#hdIdServicio").val(),
            SER_NOMBRE: ($("#txtNombreServicio").val() == "") ? null : $("#txtNombreServicio").val(),
            SER_VIGENTE: $("#chkVigente").is(":checked"),
            SER_EDI_ID_EDIFICIO: ($("#cmbEdificio").val() == "-1") ? null : $("#cmbEdificio").val(),
            SER_TIP_ID_TIPO_SERVICIO: ($("#cmbCategoria").val() == "-1") ? null : $("#cmbCategoria").val(),
            SER_FECHA_CREACION: fecha_actual,
            SER_FECHA_ACTUALIZACION: fecha_actual
        }

        return servicio;
    }

    function set(servicio) {

        if (servicio.SER_ID_SERVICIO == 0)
            nuevo(servicio);
        else
            editar(servicio);
    }

    function nuevo(servicio) {

        $("#hdIdServicio").val(servicio.SER_ID_SERVICIO);
        handlePageStates.habilitarFormulario(true);

    }

    function editar(servicio) {

        $("#hdIdServicio").val(servicio.SER_ID_SERVICIO);
        handlePageStates.habilitarFormulario(true);

        $('#cmbSede').selectpicker('val', (servicio.Sede.SED_ID_SEDE == null) ? "-1" : servicio.Sede.SED_ID_SEDE);
        handleCombos.busquedaEdificios(servicio.Sede.SED_ID_SEDE, function (data) {
            handleUtilidades.llenarComboSelectValue('cmbEdificio', data, 'EDI_ID_EDIFICIO', 'EDI_NOMBRE', true, servicio.SER_EDI_ID_EDIFICIO);
        });

        $("#txtNombreServicio").val(servicio.SER_NOMBRE);
        $('#cmbCategoria').selectpicker('val', (servicio.SER_TIP_ID_TIPO_SERVICIO == null) ? "-1" : servicio.SER_TIP_ID_TIPO_SERVICIO);
        
        var vigente = (servicio.SER_VIGENTE) ? "on" : "off";
        $("#chkVigente").bootstrapToggle(vigente);

    }

    function guardar(callback) {

        var servicio = get();

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Servicio/Guardar",
            data: JSON.stringify({ servicio: servicio }),
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

    function ExisteServicio(nombre, id_edificio, id_tipo, callback) {

        $.ajax({
            type: "GET",
            url: initApp.pathBase + "/Servicio/ExisteServicio",
            data: { nombre: nombre, id_edificio: id_edificio, id_tipo: id_tipo },
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

    function buscarId(id) {

        $.ajax({
            type: "GET",
            url: initApp.pathBase + "/Servicio/BuscarId",
            data: { id: id },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        })
            .done(function (response) {
                try {

                    handleVariables.SetServicio(response);
                    set(response);

                } catch (ex) {
                    handleMensaje.mensajeError(ex);
                }
            });

    }

    function eliminar(id) {

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Servicio/Eliminar",
            data: JSON.stringify({ id: id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function (respuesta) {

            buscarTodos();

            if (respuesta.Resultado == false)
                handleMensaje.mensajeError("El servicio no pudo ser eliminado ya que ha sido evaluado");
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

    function GeneraCodigoQR(id, callback) {

        $.ajax({
            type: "GET",
            url: initApp.pathBase + "/Servicio/GeneraCodigoQR",
            data: { id: id },
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

    function buscarServicio(id, callback) {

        var servicio = {
            SER_ID_SERVICIO: id
        }

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Servicio/BuscarServicio",
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

    function DescargaImagen(id) {

        buscarServicio(id, function (servicio) {

            if (servicio != null) {
                $.ajax({
                    type: "POST",
                    url: initApp.pathBase + "/Servicio/ServicioFiltrosImagen",
                    data: JSON.stringify({ servicio: servicio }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                })
                    .done(function (response) {
                        try {
                            window.open(initApp.pathBase + "/Servicio/ImagenServicioToPNG", '_blank');
                        } catch (ex) {

                            handleMensaje.mensajeError(ex);

                        }

                    });

            }

        });

    }

    function DescargaPDF(id) {

        buscarServicio(id, function (servicio) {
            if (servicio != null) {
                $.ajax({
                    type: "POST",
                    url: initApp.pathBase + "/Servicio/ServicioFiltrosImagen",
                    data: JSON.stringify({ servicio: servicio }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                })
                    .done(function (response) {
                        try {
                            window.open(initApp.pathBase + "/Servicio/ImagenServicioToPDF", '_blank');
                        } catch (ex) {
                            handleMensaje.mensajeError(ex);
                        }
                    });
            }
        });

    }

    return {
          buscarTodos: buscarTodos
        , guardar: guardar
        , ExisteServicio: ExisteServicio
        , buscarId: buscarId
        , eliminar: eliminar
        , SeteaSession: SeteaSession
        , GeneraCodigoQR: GeneraCodigoQR
        , DescargaImagen: DescargaImagen
        , DescargaPDF: DescargaPDF
        , cargaInicial: cargaInicial
        , getIdServicio: getIdServicio
        , setIdServicio: setIdServicio
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
                        callback(response);

                    var opcion1 = 'Todas';
                    var opcion2 = 'Seleccione';

                    if (response.length == 1) {
                        opcion1 = '';
                        opcion2 = '';
                    }

                    handleUtilidades.llenarComboTodos('cmbSedeFiltro', response, 'SED_ID_SEDE', 'SED_NOMBRE', true, opcion1);
                    handleUtilidades.llenarComboTodos('cmbSede', response, 'SED_ID_SEDE', 'SED_NOMBRE', true, opcion2);

                } catch (ex) {
                    handleMensaje.mensajeError(ex);
                }
            });

    }

    function CargaCategoriasServicios(callback) {

        var tipoServicio = {
              TIP_ID_TIPO_SERVICIO: 0
            , TIP_NOMBRE: null
            , TIP_VIGENTE: true
        }

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/CategoriaServicio/Buscar",
            data: JSON.stringify({ tipoServicio: tipoServicio }),
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        })
            .done(function (response) {
                try {

                    if (callback !== undefined)
                        callback(response);

                    handleUtilidades.llenarComboTodos('cmbCategoriaFiltro', response, 'TIP_ID_TIPO_SERVICIO', 'TIP_NOMBRE', true, 'Todas');
                    handleUtilidades.llenarComboTodos('cmbCategoria', response, 'TIP_ID_TIPO_SERVICIO', 'TIP_NOMBRE', true, 'Seleccione');

                } catch (ex) {
                    handleMensaje.mensajeError(ex);
                }
            });

    }

    function busquedaEdificios(sede_id, callback) {

        var edificio = {
            EDI_ID_EDIFICIO: 0,
            EDI_NOMBRE: null,
            EDI_VIGENTE: true,
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

    function CargaEdificiosSede(filtro) {

        var sede_id = 0;
        if (filtro == true) {
            sede_id = $("#cmbSedeFiltro").val();
            busquedaEdificios(sede_id, function (response) {
                handleUtilidades.llenarComboRefresh('cmbEdificioFiltro', response, 'EDI_ID_EDIFICIO', 'EDI_NOMBRE', true, 'Todos');
            });
        }
        else {
            sede_id = $("#cmbSede").val();
            busquedaEdificios(sede_id, function (response) {
                handleUtilidades.llenarComboRefresh('cmbEdificio', response, 'EDI_ID_EDIFICIO', 'EDI_NOMBRE', true, 'Seleccione');
            });
        }

    }

    return {
        CargaSedes: CargaSedes
        , CargaEdificiosSede: CargaEdificiosSede
        , CargaCategoriasServicios: CargaCategoriasServicios
        , busquedaEdificios: busquedaEdificios
    }
}();

var handleVariables = function () {

    function SetServicio(data) {
        $("#hdDataServicio").val(JSON.stringify(data));
    }

    function GetServicio() {
        var valor = $.parseJSON($("#hdDataServicio").val());
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

        var Sede = { SED_ID_SEDE: ($("#cmbSede").val() == "-1") ? null : parseInt($("#cmbSede").val()) }
        var servicio = {
              SER_ID_SERVICIO: ($("#hdIdServicio").val() == "") ? 0 : parseInt($("#hdIdServicio").val())
            , SER_NOMBRE: ($("#txtNombreServicio").val() == "") ? null : $("#txtNombreServicio").val()
            , SER_VIGENTE: $("#chkVigente").is(":checked")
            , Sede: Sede
            , SER_EDI_ID_EDIFICIO: ($("#cmbEdificio").val() == "-1") ? null : parseInt($("#cmbEdificio").val())
            , SER_TIP_ID_TIPO_SERVICIO: ($("#cmbCategoria").val() == "-1") ? null : parseInt($("#cmbCategoria").val())
        }

        return servicio;
    }

    function ValidaGuardarCambios() {
        var valor = false;
        var dataEditar = GetServicio();
        var dataGuardar = GetDatosGuardar();
        var session = handleVariables.GetSession();

        if (dataEditar.SER_ID_SERVICIO == dataGuardar.SER_ID_SERVICIO) {
            //update
            if (dataEditar.Sede.SED_ID_SEDE != dataGuardar.Sede.SED_ID_SEDE)
                valor = true;
            if (dataEditar.SER_EDI_ID_EDIFICIO != dataGuardar.SER_EDI_ID_EDIFICIO)
                valor = true;
            if (dataEditar.SER_TIP_ID_TIPO_SERVICIO != dataGuardar.SER_TIP_ID_TIPO_SERVICIO)
                valor = true;
            if (dataEditar.SER_NOMBRE != dataGuardar.SER_NOMBRE)
                valor = true;
            if (dataEditar.SER_VIGENTE != dataGuardar.SER_VIGENTE)
                valor = true;
        } else {
            //insert
            if (dataEditar.Sede.SED_ID_SEDE != '-1' && session.Usuario.Perfil.PERF_ADMINISTRADOR == true)
                valor = true;
            if (dataEditar.SER_EDI_ID_EDIFICIO != '-1')
                valor = true;
            if (dataEditar.SER_TIP_ID_TIPO_SERVICIO != '-1')
                valor = true;
            if (dataEditar.SER_NOMBRE != '')
                valor = true;
            if (dataEditar.SER_VIGENTE != true)
                valor = true;
        }

        return valor;
    }

    return {
        SetServicio: SetServicio
        , GetServicio: GetServicio
        , SetSession: SetSession
        , GetSession: GetSession
        , ValidaGuardarCambios: ValidaGuardarCambios
    }
}();