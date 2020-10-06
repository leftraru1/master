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

    function ip_local() {
        var ip = false;
        window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || false;

        if (window.RTCPeerConnection) {
            ip = [];
            var pc = new RTCPeerConnection({ iceServers: [] }), noop = function () { };
            pc.createDataChannel('');
            pc.createOffer(pc.setLocalDescription.bind(pc), noop);

            pc.onicecandidate = function (event) {
                if (event && event.candidate && event.candidate.candidate) {
                    var s = event.candidate.candidate.split('\n');
                    ip.push(s[0].split(' ')[4]);
                }
            }
        }

        return ip;
    }

    function init()
    {
        //var data = ip_local();
        //var str = JSON.stringify(data);
        //console.log(data);

        //$.each(data, function (i, elem) {
        //    console.log(elem);
        //});

        GetClientIP(function (response) {
            $("#hdIPDispositivo").val(response.Elemento.IP_CLIENTE);
        });

        $("#img-face-1").on("click", function () {

            var evaluacion = {
                    EVA_SER_ID_SERVICIO: $("#idService").val(),
                    EVA_NOTA: 3,
                    EVA_IDENTIFICACION_DISPOSITIVO: $("#hdIPDispositivo").val()
            }

            GuardarEvaluacion(evaluacion, function (response) {
                if (response.Resultado == false)
                    handleMensaje.mensajeInfo(response.Mensaje);
                else
                {
                    $('#inicio').hide();
                    $('#termino').show();
                    $("#idRegistro").text(response.Elemento)
                }
            });
            
        });

        $("#img-face-2").on("click", function () {
            
            var evaluacion = {
                EVA_SER_ID_SERVICIO: $("#idService").val(),
                EVA_NOTA: 2,
                EVA_IDENTIFICACION_DISPOSITIVO: $("#hdIPDispositivo").val()
            }

            GuardarEvaluacion(evaluacion, function (response) {
                if (response.Resultado == false)
                    handleMensaje.mensajeInfo(response.Mensaje);
                else {
                    $('#inicio').hide();
                    $('#termino').show();
                    $("#idRegistro").text(response.Elemento)
                }
            });

        });

        $("#img-face-3").on("click", function () {
            
            var evaluacion = {
                EVA_SER_ID_SERVICIO: $("#idService").val(),
                EVA_NOTA: 1,
                EVA_IDENTIFICACION_DISPOSITIVO: $("#hdIPDispositivo").val()
            }

            GuardarEvaluacion(evaluacion, function (response) {
                if (response.Resultado == false)
                    handleMensaje.mensajeInfo(response.Mensaje);
                else {
                    $('#inicio').hide();
                    $('#termino').show();
                    $("#idRegistro").text(response.Elemento)
                }
            });

        });

    }

    function GetClientIP(callback)
    {

        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Evaluacion/GetClientIP",
            data: null,
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        })
        .done(function (response) {

            if (callback !== undefined)
                callback(response);

        });

    }

    function GuardarEvaluacion(entidad, callback)
    {
        $.ajax({
            type: "POST",
            url: initApp.pathBase + "/Evaluacion/Guardar",
            data: JSON.stringify({ entidad: entidad }),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        })
        .done(function (response) {
                
            if (callback !== undefined)
                callback(response);

        });

    }

    return {
        init: init
    }
}();

$(document).ready(function () {

    handleEventos.init();

    if ($("#idService").val() != null && $("#idService").val().toString().trim() != "") {
        handleEvaluacion.Buscar($("#idService").val());
    }

    $('#termino').hide();

});

