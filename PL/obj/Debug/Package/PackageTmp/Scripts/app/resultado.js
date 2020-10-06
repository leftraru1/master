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
       

        },
    }
}();


$(document).ready(function () {




    handleEventos.charge();
    if ($("#idService").val() != null && $("#idService").val().toString().trim() != "") {

        handleEvaluacion.Buscar($("#idService").val());

    }

});