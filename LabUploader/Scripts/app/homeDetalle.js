var handleActionsPage = function () {

    var pagina = 1;
    var total = 0;

    return {
        prevClick: function () {

            if (!$("#li_prev").hasClass("disabled")) {
                if (pagina > 1) {
                    pagina = pagina - 1;
                    if (pagina == 1) {
                        $("#li_prev").addClass("disabled");
                        $("#li_prev a").prop("disabled", true);
                    }
                }
                var registros = pagina * 6;
                if (registros >= total) {
                    $("#li_next").addClass("disabled");
                    $("#li_next a").prop("disabled", true);
                }

                handleActionsPage.cargaNoticias();
            }

        },
        nextClick: function () {

            if (!$("#li_next").hasClass("disabled")) {

                $("#li_prev").removeClass("disabled");
                $("#li_prev a").prop("disabled", false);
                pagina = pagina + 1;
                var registros = pagina * 6;
                if (registros >= total) {
                    $("#li_next").addClass("disabled");
                    $("#li_next a").prop("disabled", true);
                }

                handleActionsPage.cargaNoticias();
            }

        },
        cargaNoticias: function () {

            var mes = null;
            var anio = null;

            if ($("#mesAnio").val() != "") {

                var dataFecha = $("#mesAnio").val().split("/");
                mes = dataFecha[0];
                anio = dataFecha[1];

            }


            var not = {
                NOT_MES: mes,
                NOT_ANIO: anio
            }

            $.ajax({
                type: "POST",
                url: initApp.pathBase + "/Noticia/cargaNoticias",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ not: not, pagina: pagina })
                //async: true
            }).done(function (noticias) {
                try {

                    if (noticias.length > 0) {
                        total = noticias[0].NOT_TOTAL
                    }
                    else {
                        total = 0;
                    }

                    if (pagina == 1) {
                        $("#li_prev").addClass("disabled");
                        $("#li_prev a").prop("disabled", true);
                    }
                    else {
                        $("#li_prev").removeClass("disabled");
                        $("#li_prev a").prop("disabled", false);
                    }

                    var registros = pagina * 6;
                    if (registros >= total) {
                        $("#li_next").addClass("disabled");
                        $("#li_next a").prop("disabled", true);
                    }
                    else {
                        $("#li_next").removeClass("disabled");
                        $("#li_next a").prop("disabled", false);
                    }

                    var listado = $("#lst_noticias #contenedorNoticias");
                    listado.empty();
                    $.each(noticias, function (i, val) {

                        var raiz = ($("#rutaRelativa").val() == "/") ? "" : $("#rutaRelativa").val();
                        var ruta = ((val.NOT_RUTA != "" && val.NOT_RUTA != null) && (val.NOT_EXT != "" && val.NOT_EXT != null)) ?
                            (raiz + val.NOT_RUTA) : raiz + "../../img/not-available-es.png";

                        var data = '<a class="list-group-item clearfix cargaNoticia" data-id="' + val.NOT_ID + '" href="javascript:void(0);">' +
                                        '<div class="col-xs-4 col-md-4">' +
                                            '<img class="img-responsive" class="imagen-muestra" src="' + ruta + '" alt="">' +
                                        '</div>' +
                                        '<div class="col-xs-6 col-md-8">' +
                                            '<h5 class="list-group-item-heading" style="word-break: break-all;">' + val.NOT_TITULO + '</h5>' +
                                            '<p><span class="glyphicon glyphicon-time"></span> ' + handleUtilidades.formatoFecha(val.NOT_FECHA_EDICION) + '</p>' +
                                        '</div>' +
                                    '</a>'

                        listado.append(data);

                    });

                } catch (ex) {
                    handleMensaje.mensajeError(ex);
                }
            })
             .fail(function (response) {
                 handleMensaje.mensajeError(response.statusText);
             });

        }
    }

}()


var handlePageEvents = function () {

    return {

        charge: function () {

            var fecha = new Date();
            var ano = fecha.getFullYear();
            var mes = (fecha.getMonth() + 1).toString();
            console.log(mes.length);
            if (mes.length == 1) {
                mes = "0" + mes;
            }
            //$("#mesAnio").val(mes + "/" + ano);
            $("#mesAnio").datepicker('setDate', mes + "/" + ano);

            $("#li_prev").prop("disabled", true);

            $("#li_prev").on("click", function () {
                handleActionsPage.prevClick();
            });

            $("#li_next").on("click", function () {
                handleActionsPage.nextClick();
            });

            $("#mesAnio").on("change", function () {
                handleActionsPage.cargaNoticias();
            });

            handleActionsPage.cargaNoticias();

            $("#lst_noticias").on("click", "a.cargaNoticia", function () {

                var id = $(this).attr("data-id");

                var not = {
                    NOT_ID: id
                };

                $.ajax({
                    type: "POST",
                    url: initApp.pathBase + "/Noticia/Buscar",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(not)
                    //async: true
                }).done(function (res) {
                    try {

                        var data = '<div class="col-md-12 contenedor-lectura-noticia">' +
                                            '<h2>' + res.NOT_TITULO + '</h2>' +
                                            '<p class="destacar-post-noticia"><span class="glyphicon glyphicon-time"></span>' + handleUtilidades.formatoFecha(res.NOT_FECHA_EDICION) + '</p>' +
                                            '<div class="lectura-noticia">' + res.NTEX_TEXTO + '</div>' +
                                            '<hr>' +
                                    '</div>';

                        var contenedor = $("#contenedorNoticia");
                        contenedor.empty();
                        contenedor.append(data);

                    } catch (ex) {
                        handleMensaje.mensajeError(ex);
                    }
                })
                .fail(function (response) {
                    handleMensaje.mensajeError(response.statusText);
                });

            })

        }



    }

}()

$(document).ready(function () {
    
    handlePageEvents.charge();

});
