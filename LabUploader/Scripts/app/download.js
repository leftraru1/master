$(document).ready(function () {

    handleDataTable.init();
    handlePageStates.init();

});

var handlePageStates = function () {

    var pn_busqueda = $("#pnlBusqueda");

    function init() {
        handleFormValidations.aplicaValidaciones();
        handleButtonsEvents();
        handleCargaDataInicial();
        handleGenericEvents();
        pn_busqueda.show();
    }

    function handleButtonsEvents() {
        $("#btnBuscar").on("click", function (e) {
            e.preventDefault();
            $("#FormBusqueda").data('bootstrapValidator').resetForm();
            var bootstrapValidator = $('#FormBusqueda').data('bootstrapValidator');
            bootstrapValidator.validate();
            if (bootstrapValidator.isValid()) {
                handleServicio.buscarTodos();
            }

        });
    }

    function handleGenericEvents() {

        $('#tbFiles tbody').on("click", ".checkDownload", function () {

        });

        $('#tbFiles tbody').on("click", ".downloadFile", function () {

        });

        $(".downloadSelected").on("click", function (e) {
            handleMensaje.mensajeExito("downloadSelected");
        });

        $(".checkDownloadAll").on("click", function (e) {
            if ($(this).prop('checked') == true) {
                $('.checkDownload').prop('checked', true);
            } else {
                $('.checkDownload').prop('checked', false);
            }
            

        });

    }

    function handleCargaDataInicial() {
        handleServicio.cargaInicial();
    }

    return {
        init: init
    }

}();

var handleDataTable = function () {

    var tb;

    return {

        init: function () {

            tb = $('#tbFiles').DataTable({
                "destroy": true,
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
                        "className": "visible-lg visible-md visible-sm visible-xs dt-body-center dt-head-center",
                        "orderable": false,
                        "sorting": false,
                        "searchable": false
                    }
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
                    , "<input type='checkbox' value='false' class='checkDownload'>"
                    , "<a href='javascript:void(0);' data-id='" + elem.NUMERO_INFORME + "' class='fa fa-download fa-lg downloadFile' data-toggle='tooltip'   title='Descargar Informe' data-original-title='Descargar Informe' ></a>"
                    , elem.NOMBRE_USUARIO
                    , elem.NUMERO_INFORME
                    , elem.FECHA_ELBORACION_TO_STRING
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
        var file = {
            NOMBRE_USUARIO: ($("#txtNumeroInforme").val() == "") ? 0 : $("#txtNumeroInforme").val(),
            NUMERO_INFORME: ($("#txtNombreUsuario").val() == "") ? null : $("#txtNombreUsuario").val(),
            FECHA_ELBORACION: ($("#txtFechaElaboracion").val() == "") ? null : $("#txtFechaElaboracion").val()
        }
        console.log(file);
        return file;
    }
    function cargaInicial() {
        busquedaServicios(function (response) {
            handleDataTable.llenarData(response);
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
            handleDataTable.llenarData(response);
        });
    }
    function busquedaServicios(callback) {

        var file = filtros();

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Informes/Buscar",
            data: JSON.stringify({ file: file }),
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
            EDI_ID_EDIFICIO: ($("#cmbEdificio").val() == "-1") ? null : $("#cmbEdificio").val(),
            TIP_ID_TIPO_SERVICIO: ($("#cmbCategoria").val() == "-1") ? null : $("#cmbCategoria").val(),
            //SER_URL: ($("#txtURL").val() == "") ? null : $("#txtURL").val(),
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
            handleUtilidades.llenarComboSelectValue('cmbEdificio', data, 'EDI_ID_EDIFICIO', 'EDI_NOMBRE', true, servicio.EDI_ID_EDIFICIO);
        });

        $("#txtNombreServicio").val(servicio.SER_NOMBRE);
        $('#cmbCategoria').selectpicker('val', (servicio.TIP_ID_TIPO_SERVICIO == null) ? "-1" : servicio.TIP_ID_TIPO_SERVICIO);
        //$("#txtURL").val(servicio.SER_URL);
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

                console.log(response);

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
            type: "DELETE",
            url: initApp.pathBase + "/Servicio/Eliminar",
            data: JSON.stringify({ id: id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        })
            .done(function (response) {
                try {

                    buscarTodos();
                    handleMensaje.mensajeExito("Registro eliminado con éxito");

                } catch (ex) {
                    handleMensaje.mensajeError("Registro no pudo ser eliminado, tiene dependencias con servicios");
                }
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
                            return;
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
                        callback(response);

                    handleUtilidades.llenarComboTodos('cmbCategoriaFiltro', response, 'TIP_ID_TIPO_SERVICIO', 'TIP_NOMBRE', true, 'Todas');

                } catch (ex) {
                    handleMensaje.mensajeError(ex);
                }
            });

    }

    function busquedaEdificios(sede_id, callback) {
        console.log("busquedaEdificios: " + sede_id);
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
        console.log("CargaEdificiosSede(" + filtro + ")")
        if (filtro == true) {
            sede_id = $("#cmbSedeFiltro").val();
            busquedaEdificios(sede_id, function (response) {
                handleUtilidades.llenarComboRefresh('cmbEdificioFiltro', response, 'EDI_ID_EDIFICIO', 'EDI_NOMBRE', true, 'Todos');
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
    var _countDownload = 0;

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

        var Sede = { SED_ID_SEDE: ($("#cmbSede").val() == "-1") ? null : $("#cmbSede").val() }
        var servicio = {
            SER_ID_SERVICIO: ($("#hdIdServicio").val() == "") ? 0 : $("#hdIdServicio").val()
            , SER_NOMBRE: ($("#txtNombreServicio").val() == "") ? null : $("#txtNombreServicio").val()
            , SER_VIGENTE: $("#chkVigente").is(":checked")
            , Sede: Sede
            , EDI_ID_EDIFICIO: ($("#cmbEdificio").val() == "-1") ? null : $("#cmbEdificio").val()
            , TIP_ID_TIPO_SERVICIO: ($("#cmbCategoria").val() == "-1") ? null : $("#cmbCategoria").val()
        }

        return servicio;
    }

    function ValidaGuardarCambios() {
        var valor = false;
        var dataEditar = GetServicio();
        var dataGuardar = GetDatosGuardar();
        var session = handleVariables.GetSession();

        console.log(dataEditar);
        console.log(dataGuardar);

        if (dataEditar.SER_ID_SERVICIO == dataGuardar.SER_ID_SERVICIO) {
            //update
            if (dataEditar.Sede.SED_ID_SEDE != dataGuardar.Sede.SED_ID_SEDE)
                valor = true;
            if (dataEditar.EDI_ID_EDIFICIO != dataGuardar.EDI_ID_EDIFICIO)
                valor = true;
            if (dataEditar.TIP_ID_TIPO_SERVICIO != dataGuardar.TIP_ID_TIPO_SERVICIO)
                valor = true;
            if (dataEditar.SER_NOMBRE != dataGuardar.SER_NOMBRE)
                valor = true;
            if (dataEditar.SER_VIGENTE != dataGuardar.SER_VIGENTE)
                valor = true;
        } else {
            //insert
            if (dataEditar.Sede.SED_ID_SEDE != '-1' && dataEditar.Sede.SED_ID_SEDE == session.Usuario.SED_ID_SEDE)
                valor = true;
            if (dataEditar.EDI_ID_EDIFICIO != '-1')
                valor = true;
            if (dataEditar.TIP_ID_TIPO_SERVICIO != '-1')
                valor = true;
            if (dataEditar.EDI_NOMBRE != '')
                valor = true;
            if (dataEditar.EDI_VIGENTE != true)
                valor = true;
        }

        return valor;
    }

    function getCountDownload() {
        if (this._countDownload == null) this.setCountDownload(0);

        return this._countDownload;
    }
    function setCountDownload(countDownload) {
        this._countDownload = countDownload;
    }
    return {
        SetServicio: SetServicio
        , GetServicio: GetServicio
        , SetSession: SetSession
        , GetSession: GetSession
        , ValidaGuardarCambios: ValidaGuardarCambios
        , getCountDownload: getCountDownload
        , setCountDownload: setCountDownload
    }
}();

var handleFormValidations = function () {
    function aplicaValidaciones() {
        validaRegistro()
    }
    function validaRegistro() {
        $('#FormBusqueda').bootstrapValidator({
            framework: 'bootstrap ',
            live: 'disabled',
            excluded: [':disabled'],
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'txtNumeroInforme': {
                    validators: {
                        integer: {
                            message: 'Debe ingresar sólo números.',
                            min: 1,
                            max: 2147483647
                        }
                    }
                },
                'txtNombreUsuario': {
                    validators: {
                        stringLength: {
                            max: 100,
                            message: 'Sólo se permiten 100 caracteres como máximo.'
                        },
                        regexp: {
                            regexp: '^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s_0-9]+',
                            message: 'Debe ingresar un nombre de servicio válido.'
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