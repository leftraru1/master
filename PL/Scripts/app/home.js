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

                        var ruta = ((val.NOT_RUTA != "" && val.NOT_RUTA != null) && (val.NOT_EXT != "" && val.NOT_EXT != null)) ?
                            val.NOT_RUTA : "/recursos/img/add-picture.png";

                        var data = '<div class=" col-sm-6 col-md-4 cargaNoticia">' +
                                        '<div class="thumbnail clearfix">' +
                                            '<a href="Home/Detalle/' + val.NOT_ID + '" })"><img src="' + ruta + '" style="height: 300px;" alt=""></a>' +
                                            '<div class="caption">' +
                                                '<h3 style="word-break: break-all;">' + val.NOT_TITULO + '</h3>' +
                                                '<p><b class="b-fecha">Fecha:</b> ' + handleUtilidades.formatoFecha(val.NOT_FECHA_EDICION) + '</p>' +
                                                '<p style="word-break: break-all;">' + val.NOT_DESCRIPCION + '</p>' +
                                            '</div>' +
                                            '<p><a href="Home/Detalle/' + val.NOT_ID + '" class="btn btn-amarillo btn-xs pull-right">Leer Más</a></p>' +
                                        '</div>' +
                                    '</div>';

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

            $("#li_prev").prop("disabled", true);

            $("#li_prev").on("click", function () {
                handleActionsPage.prevClick();
            });

            $("#li_next").on("click", function () {
                handleActionsPage.nextClick();
            });

            handleActionsPage.cargaNoticias();

        }



    }

}()

$(document).ready(function () {

    handlePageEvents.charge();

});
