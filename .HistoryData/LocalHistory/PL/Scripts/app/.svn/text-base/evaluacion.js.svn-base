var handleEvaluacion = function () {
    return {

        Buscar: function (id) {
            var p = {
                SER_ID_SERVICIO: id,

            }
            $.ajax({
                type: "POST",
                url: initApp.pathBase + "/Evaluacion/Buscar",
                data: JSON.stringify({ entidad: p }),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            })
                .done(function (response) {
                    try {
                        $("#txt_servicio").text(response.SER_NOMBRE)
                        $("#txt_lugar").text(response.EDI_NOMBRE)
                        $("#txt_edificio").text(response.Sede.SED_NOMBRE)

                    } catch (ex) {

                    }
                });

        },

    }

}();
var handleEventos = function () {

    return {

        charge: function () {
            ;
            $("#img-face-1").on("click", function () {
                var p = {
                    EVA_SER_ID_SERVICIO: $("#idServicio").val(),
                    EVA_NOTA: 1

                }
                $.ajax({
                    type: "POST",
                    url: initApp.pathBase + "/Evaluacion/Gurdar",
                    data: JSON.stringify({ entidad: p }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                })
                    .done(function (response) {
                        try {


                        } catch (ex) {

                        }
                    });

            });
            $("#img-face-2").on("click", function () {
                alert('bb');
            });
            $("#img-face-3").on("click", function () {
                alert('cc');
            });




        },
    }
}();

var handleFormValidation = function () {
    return {
        init: function () {
            $('#FormContrato').bootstrapValidator({
                //framework: 'bootstrap ',
                //live: 'disabled',
                //  excluded: [':disabled', ':hidden', ':not(:visible)'],
                icon: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    cmb_paciente_detalle: {
                        validators: {
                            callback: {
                                message: 'El paciente es requerido',
                                callback: function (value, validator) {
                                    if (value == "" || value === null || value === undefined) {
                                        $("[data-id = 'cmb_paciente_detalle']").addClass("cmbAjaxError");
                                        $("[data-id = 'cmb_paciente_detalle']").removeClass("cmbAjaxOK");
                                        return false;
                                    }
                                    else {
                                        $("[data-id = 'cmb_paciente_detalle']").addClass("cmbAjaxOK");
                                        $("[data-id = 'cmb_paciente_detalle']").removeClass("cmbAjaxError");
                                        return true;
                                    }
                                }
                            }
                        }
                    },
                    cmb_solicitud: {
                        validators: {
                            callback: {
                                message: 'La solicitud es requerida',
                                callback: function (value, validator) {
                                    if (value == "" || value === null || value === undefined) {
                                        $("[data-id = 'cmb_solicitud']").addClass("cmbAjaxError");
                                        $("[data-id = 'cmb_solicitud']").removeClass("cmbAjaxOK");
                                        return false;
                                    }
                                    else {
                                        $("[data-id = 'cmb_solicitud']").addClass("cmbAjaxOK");
                                        $("[data-id = 'cmb_solicitud']").removeClass("cmbAjaxError");
                                        return true;
                                    }
                                }
                            }
                        }
                    },
                    cmb_activo: {
                        validators: {
                            callback: {
                                message: 'El activo  es requerido',
                                callback: function (value, validator) {
                                    if (value == "" || value === null || value === undefined) {
                                        $("[data-id = 'cmb_activo']").addClass("cmbAjaxError");
                                        $("[data-id = 'cmb_activo']").removeClass("cmbAjaxOK");
                                        return false;
                                    }
                                    else {
                                        $("[data-id = 'cmb_activo']").addClass("cmbAjaxOK");
                                        $("[data-id = 'cmb_activo']").removeClass("cmbAjaxError");
                                        return true;
                                    }
                                }
                            }
                        }
                    },

                    cmb_representante: {
                        validators: {
                            callback: {
                                message: 'El representante  es requerido',
                                callback: function (value, validator) {
                                    if (value == "" || value === null || value === undefined) {
                                        $("[data-id = 'cmb_representante']").addClass("cmbAjaxError");
                                        $("[data-id = 'cmb_representante']").removeClass("cmbAjaxOK");
                                        return false;
                                    }
                                    else {
                                        $("[data-id = 'cmb_representante']").addClass("cmbAjaxOK");
                                        $("[data-id = 'cmb_representante']").removeClass("cmbAjaxError");
                                        return true;
                                    }
                                }
                            }
                        }
                    },

                    dvmodificado: {
                        validators: {
                            callback: {
                                message: 'El contrato modificado  es requerido',
                                callback: function (value, validator) {
                                    var valida = $("#checkOriginal").is(":checked");
                                    if (valida.toString().toLocaleUpperCase() == 'FALSE') {  //CONTRATO MODIFICADO
                                        var tb = $('#tbDocumentos').DataTable();
                                        if (tb.rows().count() == 0) {
                                            $("#dvmodificado").addClass("cmbAjaxError");
                                            $("#dvmodificado").removeClass("cmbAjaxOK");
                                            return false;

                                        }

                                        else {
                                            $("#dvmodificado").addClass("cmbAjaxOK");
                                            $("#dvmodificado").removeClass("cmbAjaxError");
                                            return true;
                                        }

                                    } else { return true; }
                                }
                            }
                        }
                    },
                    txt_fecha_desde: {
                        validators: {
                            notEmpty: {
                                message: 'La fecha desde es requerida'
                            },


                        }
                    },

                    txt_fecha_hasta: {
                        validators: {
                            notEmpty: {
                                message: 'La fecha hasta es requerida'
                            },

                        }
                    },


                },


            });
        }
    }
}();
$(document).ready(function () {




    handleEventos.charge();
    if ($("#idService").val() != null && $("#idService").val().toString().trim() != "") {

        handleEvaluacion.Buscar($("#idService").val());

    }

});