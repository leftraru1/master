$(document).ready(function () {

    handleDataTableServicios.init();
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
            $("#formBuscarQR").data('bootstrapValidator').resetForm();
            var bootstrapValidator = $('#formBuscarQR').data('bootstrapValidator');
            bootstrapValidator.validate();
            if (bootstrapValidator.isValid()) {
                handleServicio.buscarTodos();
            }

        });
        $("#btnDescargarPDF").on("click", function (e) {
            e.preventDefault();
            handleServicio.DescargaPDF(handleServicio.getIdServicio());
        });
        $("#btnDescargarPNG").on("click", function (e) {
            e.preventDefault();
            handleServicio.DescargaImagen(handleServicio.getIdServicio());
        });

        $("#cmbSedeFiltro").on("change", function (e) {
            e.preventDefault();
            console.log("#cmbSedeFiltro.change")
            handleCombos.CargaEdificiosSede(true);
        });

    }

    function handleGenericEvents() {

        $('#tbCodigosQR tbody').on("click", ".trabCodigoQR", function () {
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
            //.on('click', '#btnDescargarPDF', function (e) {
            //    e.preventDefault();

            //})
            //.on('click', '#btnDescargarPNG', function (e) {
            //    e.preventDefault();

            //});

        });

    }

    function handleCargaDataInicial() {

        handleCombos.CargaSedes(function (response) {
            handleCombos.CargaCategoriasServicios(function (response) {
                handleCombos.CargaEdificiosSede(true);
            });
        });

        handleServicio.cargaInicial();
    }

    return {
        init: init
    }

}();

var handleDataTableServicios = function () {

    var tb;

    return {

        init: function () {

            tb = $('#tbCodigosQR').DataTable({
                //"dom": "<'dt-toolbar'<'col-xs-12 col-sm-6 hidden-xs'f><'col-sm-6 col-xs-12 hidden-xs'<'toolbar'>>r>t<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>",
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
                        "targets": [1],
                        "className": "visible-lg visible-md visible-sm visible-xs",
                        "orderable": false,
                        "sorting": false,
                        "searchable": false
                    },
                    {
                        "targets": [2],
                        "className": "dt-body-right"
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
                    , "<a href='javascript:void(0);' data-id='" + elem.SER_ID_SERVICIO + "' class='fa fa-qrcode fa-lg trabCodigoQR' data-toggle='tooltip'   title='Código QR' data-original-title='Código QR' ></a>"
                    , elem.SER_ID_SERVICIO
                    , elem.SER_NOMBRE
                    , elem.SED_NOMBRE
                    , elem.EDI_NOMBRE
                    , elem.TIP_NOMBRE
                    //, elem.SER_URL
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

        //public int SER_ID_SERVICIO { get; set; }
        //public string SER_NOMBRE { get; set; }
        //public string SER_URL { get; set; }
        //public bool ? SER_VIGENTE { get; set; }
        //public DateTime SER_FECHA_CREACION { get; set; }
        //public DateTime ? SER_FECHA_ACTUALIZACION { get; set; }
        //public int SER_EDI_ID_EDIFICIO { get; set; }
        //public int SER_TIP_ID_TIPO_SERVICIO { get; set; }
        //public int SER_USU_ID_USUARIO { get; set; }
        //public string EDI_NOMBRE { get; set; }
        //public string TIP_NOMBRE { get; set; }
        //public string SED_NOMBRE { get; set; }
        //public DTOSede Sede { get; set; }
        var Sede = {
            SED_ID_SEDE: ($("#cmbSedeFiltro").val() == "-1") ? null : $("#cmbSedeFiltro").val()
        }

        var servicio = {
            SER_ID_SERVICIO: ($("#txtCodigoFiltro").val() == "") ? 0 : $("#txtCodigoFiltro").val(),
            SER_NOMBRE: ($("#txtNombreFiltro").val() == "") ? null : $("#txtNombreFiltro").val(),
            SER_VIGENTE: $("#chkVigenteFiltro").is(":checked"),
            SER_EDI_ID_EDIFICIO: ($("#cmbEdificioFiltro").val() == "-1") ? null : $("#cmbEdificioFiltro").val(),
            SER_TIP_ID_TIPO_SERVICIO: ($("#cmbCategoriaFiltro").val() == "-1") ? null : $("#cmbCategoriaFiltro").val(),
            Sede: Sede
        }
        console.log(servicio);
        return servicio;
    }
    function cargaInicial() {
        //cargaInicialServicios(function (response) {
        //    handleDataTableServicios.llenarData(response);
        //});
        busquedaServicios(function (response) {
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
        $('#formBuscarQR').bootstrapValidator({
            framework: 'bootstrap ',
            live: 'disabled',
            excluded: [':disabled'],
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'txtCodigoFiltro': {
                    validators: {
                        integer: {
                            message: 'Debe ingresar sólo números.',
                            min: 1,
                            max: 2147483647
                        }
                    }
                },
                'txtNombreFiltro': {
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