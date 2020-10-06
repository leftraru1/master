$(document).ready(function () {

    handleDataTableUsuarios.init();

    handlePageStates.init();

});

var handlePageStates = function () {

    var pn_busqueda = $("#pnlBusqueda");
    var pn_registro = $("#pnlRegistro");

    function init() {

        var prom = handleCargaDataInicial();

        prom.then(
            function () {

                handleFormValidations.aplicaValidaciones();
                habilitarFormulario(true);

                handleButtonsEvents();
                handleGenericEvents();

                handleUsuario.buscarTodos();

                pn_busqueda.show();
                pn_registro.hide();

                $("#txtRutCompleto").rut({ formatOn: 'keyup' });
                $("#txtRutCompletoFiltro").rut({ formatOn: 'keyup' });

                $("#txtRutCompleto").on("paste", function (e) {
                    e.preventDefault();
                });
                $("#txtRutCompletoFiltro").on("paste", function (e) {
                    e.preventDefault();
                });


            },
            function (error) {
                handleMensaje.mensajeError(error);
            }
       );

    }

    var handleFormValidations = function () {

        function aplicaValidaciones() {

            validaUsuario();
            validaBusqueda();

        }

        function validaUsuario() {

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
                    txtRutCompleto: {
                        validators: {
                            callback: {
                                message: '',
                                callback: function (value, validator) {

                                    if (value != '')
                                    {
                                        var val = handleUtilidades.validarRut(value);
                                        
                                        if (val.resultado) {
                                            $("#txtRutCompleto").val(val.rutFormateado);
                                            return {
                                                valid: true,
                                                message: ''
                                            };
                                        }
                                        else {
                                            return {
                                                valid: false,
                                                message: 'Debe ingresar un rut válido'
                                            };
                                        }
                                    }
                                    else
                                        return {
                                            valid: false,
                                            message: 'Debe ingresar un rut antes de consultar'
                                        };

                                }
                            }
                        }
                    },
                    cmbPerfil: {
                        validators: {
                            callback: {
                                message: 'Debe indicar perfil del usuario',
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
                    cmbSede: {
                        validators: {
                            callback: {
                                message: 'Debe indicar sede del usuario',
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

        function validaBusqueda() {

            $('#FormBusquedaUsuario').bootstrapValidator({
                framework: 'bootstrap ',
                live: 'disabled',
                excluded: [':disabled'],
                icon: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    txtRutCompletoFiltro: {
                        validators: {
                            callback: {
                                message: '',
                                callback: function (value, validator) {

                                    if (value != '') {
                                        var val = handleUtilidades.validarRut(value);

                                        if (val.resultado) {
                                            $("#txtRutCompleto").val(val.rutFormateado);
                                            return {
                                                valid: true,
                                                message: ''
                                            };
                                        }
                                        else {
                                            return {
                                                valid: false,
                                                message: 'Debe ingresar un rut válido'
                                            };
                                        }
                                    }
                                    else
                                        return {
                                            valid: true,
                                            message: ''
                                        };

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

    function handleButtonsEvents() {

        $("#btnBuscar").on("click", function (e) {

            e.preventDefault();

            $("#FormBusquedaUsuario").data('bootstrapValidator').resetForm();
            var bootstrapValidator = $('#FormBusquedaUsuario').data('bootstrapValidator');
            bootstrapValidator.validate();

            if (bootstrapValidator.isValid()) {
                handleUsuario.buscarTodos();
            }

        });

        $("#btnNuevo").on("click", function (e) {

            e.preventDefault();

            habilitarFormulario(false);
            limpiarFormulario();

            pn_busqueda.hide();
            pn_registro.show();

            var usuario = { 
                  USU_ID_USUARIO: 0
                , USU_RUT: 0
                , USU_DV_RUT: null
                , USU_NOMBRE_COMPLETO: null
                , USU_LOGIN: null
                , USU_VIGENTE: true
                , USU_PERF_ID_PERFIL: 0
                , USU_SED_ID_SEDE: null
                , USU_RUT_COMPLETO: null
            }
            handleVariables.SetUsuario(usuario);

        });

        $("#btnBuscarRut").on("click", function (e) {

            e.preventDefault();

            $("#FormTrabajador").data('bootstrapValidator').resetForm();
            var bootstrapValidator = $('#FormTrabajador').data('bootstrapValidator');
            bootstrapValidator.validate();

            if (bootstrapValidator.isValid()) {

                var rut = $("#txtRutCompleto").val();
                handleUsuario.buscarRut(rut, function (response) {

                    if (response.Resultado == false) {
                        handleMensaje.mensajeInfo(response.Mensaje);
                    }
                    else {

                        habilitarFormulario(true);

                        $("#hdIdUsuario").val(response.Elemento.USU_ID_USUARIO);
                        $('#cmbPerfil').selectpicker('val', (response.Elemento.USU_PERF_ID_PERFIL == 0) ? "-1" : response.Elemento.USU_PERF_ID_PERFIL);
                        $('#cmbSede').selectpicker('val', (response.Elemento.USU_SED_ID_SEDE == null) ? "-1" : response.Elemento.USU_SED_ID_SEDE);

                        $("#txtNombreCompleto").val(response.Elemento.USU_NOMBRE_COMPLETO);
                        $("#txtLogin").val(response.Elemento.USU_LOGIN);
                        $("#txtLogin").attr("disabled", true)

                        var vigente = (response.Elemento.USU_VIGENTE) ? "on" : "off";
                        if (response.Elemento.USU_ID_USUARIO == 0)
                            vigente = true;
                        $("#chkVigente").bootstrapToggle(vigente);

                    }

                });

            }

        });

        $("#btnGuardar").on("click", function (e) {

            e.preventDefault();

            GuardarCambios();

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
                        habilitarFormulario(false);
                        handleUsuario.buscarTodos();
                        limpiarFormulario();
                    }
                );
            } else {
                habilitarFormulario(false);
                handleUsuario.buscarTodos();
                limpiarFormulario();
            }

            var usuario = {
                USU_ID_USUARIO: 0
                , USU_RUT: 0
                , USU_DV_RUT: null
                , USU_NOMBRE_COMPLETO: null
                , USU_LOGIN: null
                , USU_VIGENTE: true
                , USU_PERF_ID_PERFIL: 0
                , USU_SED_ID_SEDE: null
                , USU_RUT_COMPLETO: null
            }
            handleVariables.SetUsuario(usuario);

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
                        limpiarFormularioFiltro();
                        handleUsuario.buscarTodos();
                    }
                );
            }
            else {
                pn_busqueda.show();
                pn_registro.hide();
                limpiarFormularioFiltro();
                handleUsuario.buscarTodos();
            }

            limpiarFormularioFiltro();
            handleUsuario.buscarTodos();

        });

    }

    function handleGenericEvents() {

        $('#tbUsuarios tbody').on("click", ".trabEditar", function () {
            $("#FormTrabajador").data('bootstrapValidator').resetForm();

            habilitarFormulario(true);
            limpiarFormulario();

            var id = $(this).attr("data-id");
            handleUsuario.buscarId(id);

            pn_busqueda.hide();
            pn_registro.show();

        });

        $('#tbUsuarios tbody').on("click", ".trabEliminar", function () {
            var dato = $(this);
            handleMensaje.mensajeConfirmacion('¿Desea eliminar el registro seleccionado?',
                function () {

                    var id = dato.attr("data-id");
                    handleUsuario.eliminar(id);

                });
        });

    }

    function limpiarFormulario() {

        $("#hdIdUsuario").val("");

        $("#txtRutCompleto").val("");
        $("#txtRutCompleto").focus();

        $("#txtNombreCompleto").val("");
        $("#txtLogin").val("");
        $("#cmbSede").selectpicker('val', "-1");
        $("#cmbPerfil").selectpicker('val', "-1");
        $("#chkVigente").bootstrapToggle("on");

        var usuario = {
            USU_ID_USUARIO: 0
                , USU_RUT: 0
                , USU_DV_RUT: null
                , USU_NOMBRE_COMPLETO: null
                , USU_LOGIN: null
                , USU_VIGENTE: true
                , USU_PERF_ID_PERFIL: 0
                , USU_SED_ID_SEDE: null
                , USU_RUT_COMPLETO: null
        }
        handleVariables.SetUsuario(usuario);

    }

    function limpiarFormularioFiltro() {

        $("#txtRutCompletoFiltro").val("");
        $("#txtNombreCompletoFiltro").val("");
        $("#cmbSedeFiltro").selectpicker('val', "-1");
        $("#cmbPerfilFiltro").selectpicker('val', "-1");
        $("#chkVigenteFiltro").bootstrapToggle("on");

        var usuario = {
            USU_ID_USUARIO: 0
                , USU_RUT: 0
                , USU_DV_RUT: null
                , USU_NOMBRE_COMPLETO: null
                , USU_LOGIN: null
                , USU_VIGENTE: true
                , USU_PERF_ID_PERFIL: 0
                , USU_SED_ID_SEDE: null
                , USU_RUT_COMPLETO: null
        }
        handleVariables.SetUsuario(usuario);

    }

    function habilitarFormulario(habilitado) {

        $("#FormTrabajador").data('bootstrapValidator').resetForm();
        $("#FormBusquedaUsuario").data('bootstrapValidator').resetForm();

        $(".habilitadoInicial").prop("disabled", habilitado);
        $("input[type='text'].habilitadoModifica, input[type='file'].habilitadoModifica, button.habilitadoModifica, textarea.habilitadoModifica").prop("disabled", !habilitado);

        var isDisabled = (habilitado) ? "enable" : "disable";
        $("input[type='checkbox'].habilitadoModifica").bootstrapToggle(isDisabled);

        (habilitado) ? handleUtilidades.selectpickerEnable("select.habilitadoModifica") : handleUtilidades.selectpickerDisable("select.habilitadoModifica");
        (habilitado) ? $("div.habilitadoModifica").removeAttr("disabled") : $("div.habilitadoModifica").attr("disabled", true);

    }

    function handleCargaDataInicial() {

        var deferred = $.Deferred();

        var cargaPerfiles = $.ajax({
            type: "GET",
            url: initApp.pathBase + "/Perfil/BuscarVigentes",
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        });

        var cargaSedes = $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Sede/Buscar",
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        });

        $.when(cargaPerfiles, cargaSedes).done(function (r1, r2) {

            handleUtilidades.llenarCombo('cmbPerfil', r1[0], 'PERF_ID', 'PERF_NOMBRE');
            handleUtilidades.llenarComboTodos('cmbPerfilFiltro', r1[0], 'PERF_ID', 'PERF_NOMBRE', false, 'Todos');

            handleUtilidades.llenarCombo('cmbSede', r2[0], 'SED_ID_SEDE', 'SED_NOMBRE');
            handleUtilidades.llenarComboTodos('cmbSedeFiltro', r2[0], 'SED_ID_SEDE', 'SED_NOMBRE', false, 'Todas');

            deferred.resolve();

        }).fail(function () {

            deferred.reject();

        });

        return deferred.promise();
    }

    function GuardarCambios(volver) {

        $("#FormTrabajador").data('bootstrapValidator').resetForm();
        var bootstrapValidator = $('#FormTrabajador').data('bootstrapValidator');
        bootstrapValidator.validate();

        if (bootstrapValidator.isValid()) {

            var USU_ID_USUARIO = ($("#hdIdUsuario").val() == "") ? 0 : $("#hdIdUsuario").val();
            var USU_RUT_COMPLETO = ($("#txtRutCompleto").val() == "") ? null : $("#txtRutCompleto").val();

            handleUsuario.ExisteUsuario(USU_RUT_COMPLETO, function (response) {
                var existe = false;
                if (USU_ID_USUARIO == 0)
                    if (response.USU_ID_USUARIO > 0) {
                        existe = true;
                        handleMensaje.mensajeInfo('El usuario ya se encuentra registrado');
                    }

                if (existe == false)
                    handleUsuario.guardar(function (respuesta) {

                        if (respuesta.valor) {
                            handleMensaje.mensajeExito("Los datos han sido actualizados con éxito");
                        }
                        else
                            handleMensaje.mensajeError("Error al actualizar: " + respuesta.mensaje);

                        limpiarFormulario();
                        habilitarFormulario(false);

                        if (volver) {
                            pn_busqueda.show();
                            pn_registro.hide();
                        }

                    });

            });

        }

    }

    return {

        init: init,
        habilitarFormulario: habilitarFormulario,
        limpiarFormulario: limpiarFormulario
    };

}();

var handleDataTableUsuarios = function () {

    var tb;
    return {
        init: function () {

            tb = $('#tbUsuarios').DataTable({
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
                        "width":"1%"
                    },
                    {
                        "targets": [8],
                        "orderable": false,
                        "sorting": false
                    }
                ]
            });

        },
        llenarData: function (data) {

            tb.clear();
            tb.state.clear();
            tb.draw();

            $.each(data, function (i, elem) {
                var rut = handleUtilidades.validarRut(elem.USU_RUT + '-' + elem.USU_DV_RUT);
                tb.row.add([
                    ""
                    , "<a href='javascript:void(0);' data-id='" + elem.USU_ID_USUARIO + "' class='fa fa-edit fa-lg trabEditar' data-toggle='tooltip' title='Editar' data-original-title='Editar'  ></a>"
                    , "<a href='javascript:void(0);' data-id='" + elem.USU_ID_USUARIO + "' class='fa fa-trash-o fa-lg trabEliminar' data-toggle='tooltip'   title='Eliminar' data-original-title='Borrar' ></a>"
                    , rut.rutFormateado
                    , elem.USU_NOMBRE_COMPLETO
                    , elem.USU_LOGIN
                    , elem.Perfil.PERF_NOMBRE
                    , (elem.Sede == 'null' || elem.Sede == null) ? "" : elem.Sede.SED_NOMBRE
                    , elem.USU_VIGENTE == true ? 'Sí' : 'No'
                ]);
            });

            tb.draw();
            tb.columns.adjust().draw();
        }
    }
}();

var handleUsuario = function () {

    function filtros() {

        var usuario = {
            USU_RUT_COMPLETO: ($("#txtRutCompletoFiltro").val() == "") ? null : $("#txtRutCompletoFiltro").val(),
            USU_PERF_ID_PERFIL: ($("#cmbPerfilFiltro").val() == "-1") ? null : $("#cmbPerfilFiltro").val(),
            USU_SED_ID_SEDE: ($("#cmbSedeFiltro").val() == "-1") ? null : $("#cmbSedeFiltro").val(),
            USU_NOMBRE_COMPLETO: ($("#txtNombreCompletoFiltro").val() == "") ? null : $("#txtNombreCompletoFiltro").val(),
            USU_VIGENTE: $("#chkVigenteFiltro").is(":checked")
        }

        return usuario;
    }

    function get() {

        var usuario = {
            USU_ID_USUARIO: ($("#hdIdUsuario").val() == "") ? null : $("#hdIdUsuario").val(),
            USU_RUT_COMPLETO: ($("#txtRutCompleto").val() == "") ? null : $("#txtRutCompleto").val(),
            USU_PERF_ID_PERFIL: ($("#cmbPerfil").val() == "-1") ? null : $("#cmbPerfil").val(),
            USU_SED_ID_SEDE: ($("#cmbSede").val() == "-1") ? null : $("#cmbSede").val(),
            USU_NOMBRE_COMPLETO: ($("#txtNombreCompleto").val() == "") ? null : $("#txtNombreCompleto").val(),
            USU_LOGIN: ($("#txtLogin").val() == "") ? null : $("#txtLogin").val(),
            USU_VIGENTE: $("#chkVigente").is(":checked")
        }

        return usuario;
    }

    function set(usuario) {

        if (usuario.USU_ID_USUARIO == 0)
            nuevo(usuario);
        else
            editar(usuario);
    }

    function nuevo(servicio) {

        $("#hdIdUsuario").val(usuario.USU_ID_USUARIO);
        //handlePageStates.habilitarFormulario(true);

    }

    function editar(usuario) {

        $("#hdIdUsuario").val(usuario.USU_ID_USUARIO);
        handlePageStates.habilitarFormulario(true);

        $('#cmbPerfil').selectpicker('val', (usuario.USU_PERF_ID_PERFIL == null) ? "-1" : usuario.USU_PERF_ID_PERFIL);
        $('#cmbSede').selectpicker('val', (usuario.USU_SED_ID_SEDE == null) ? "-1" : usuario.USU_SED_ID_SEDE);

        $("#txtNombreCompleto").val(usuario.USU_NOMBRE_COMPLETO);
        $("#txtLogin").val(usuario.USU_LOGIN);
        $("#txtLogin").attr("disabled", true)

        var vigente = (usuario.USU_VIGENTE) ? "on" : "off";
        $("#chkVigente").bootstrapToggle(vigente);

        var rut_completo = handleUtilidades.validarRut(usuario.USU_RUT_COMPLETO);
        $("#txtRutCompleto").val(rut_completo.rutFormateado);
    }

    function buscarTodos() {

        busquedaUsuarios(function (response) {

            handleDataTableUsuarios.llenarData(response);

        });

    }

    function busquedaUsuarios(callback) {

        var usuario = filtros();

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Usuario/BuscarTodos",
            data: JSON.stringify({ usuario: usuario }),
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

    function buscarRut(rut,callback) {

        $.ajax({
            type: "GET",
            url: initApp.pathBase + "/Usuario/BuscarPorRut",
            data: { rut: rut },
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

        var usuario = get();

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Usuario/Guardar",
            data: JSON.stringify({ usuario: usuario }),
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

    function ExisteUsuario(rut_completo, callback) {

        $.ajax({
            type: "GET",
            url: initApp.pathBase + "/Usuario/ExisteUsuario",
            data: { rut_completo: rut_completo },
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
            url: initApp.pathBase + "/Usuario/BuscarId",
            data: { id: id },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        })
            .done(function (response) {
                try {

                    handleVariables.SetUsuario(response);
                    set(response);

                } catch (ex) {
                    handleMensaje.mensajeError(ex);
                }
            });

    }

    function eliminar(id) {

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Usuario/Eliminar",
            data: JSON.stringify({ id: id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function (respuesta) {

            buscarTodos();

            if (respuesta.Resultado == false)
                handleMensaje.mensajeError("Usuario no pudo ser eliminado, tiene dependencias con Categorías, Edificios y/o Servicios");
        });
    }

    return {
        buscarTodos: buscarTodos,
        guardar: guardar,
        buscarRut: buscarRut,
        ExisteUsuario: ExisteUsuario,
        buscarId: buscarId,
        eliminar: eliminar
    };

}();

var handleVariables = function () {

    function SetUsuario(data) {
        $("#hdDataUsuario").val(JSON.stringify(data));
    }

    function GetUsuario() {
        var valor = $.parseJSON($("#hdDataUsuario").val());
        return valor;
    }

    function GetDatosGuardar() {

        var usuario = {
            USU_ID_USUARIO: ($("#hdIdUsuario").val() == "") ? null : $("#hdIdUsuario").val(),
            USU_RUT_COMPLETO: ($("#txtRutCompleto").val() == "") ? null : $("#txtRutCompleto").val(),
            USU_PERF_ID_PERFIL: ($("#cmbPerfil").val() == "-1") ? 0 : $("#cmbPerfil").val(),
            USU_SED_ID_SEDE: ($("#cmbSede").val() == "-1") ? null : $("#cmbSede").val(),
            USU_NOMBRE_COMPLETO: ($("#txtNombreCompleto").val() == "") ? null : $("#txtNombreCompleto").val(),
            USU_LOGIN: ($("#txtLogin").val() == "") ? null : $("#txtLogin").val(),
            USU_VIGENTE: $("#chkVigente").is(":checked")
        }

        return usuario;
    }

    function ValidaGuardarCambios() {

        var valor = false;
        var dataEditar = GetUsuario();
        var dataGuardar = GetDatosGuardar();

        if (dataEditar.USU_ID_USUARIO == dataGuardar.USU_ID_USUARIO) {
            //update
            if (dataEditar.USU_SED_ID_SEDE != dataGuardar.USU_SED_ID_SEDE)
                valor = true;
            if (dataEditar.USU_PERF_ID_PERFIL != dataGuardar.USU_PERF_ID_PERFIL)
                valor = true;
            if (dataEditar.USU_RUT_COMPLETO != dataGuardar.USU_RUT_COMPLETO.replace(/\./g, ''))
                valor = true;
            if (dataEditar.USU_NOMBRE_COMPLETO != dataGuardar.USU_NOMBRE_COMPLETO)
                valor = true;
            if (dataEditar.USU_LOGIN != dataGuardar.USU_LOGIN)
                valor = true;
            if (dataEditar.USU_VIGENTE != dataGuardar.USU_VIGENTE)
                valor = true;
        } else {
            //insert
            if (dataEditar.USU_SED_ID_SEDE != null)
                valor = true;
            if (dataEditar.USU_PERF_ID_PERFIL != 0)
                valor = true;
            if (dataEditar.USU_RUT_COMPLETO != null)
                valor = true;
            if (dataEditar.USU_NOMBRE_COMPLETO != null)
                valor = true;
            if (dataEditar.USU_LOGIN != null)
                valor = true;
            if (dataEditar.USU_VIGENTE != true)
                valor = true;
        }

        return valor;
    }

    return {
          SetUsuario: SetUsuario
        , GetUsuario: GetUsuario
        , ValidaGuardarCambios: ValidaGuardarCambios
    }

}();