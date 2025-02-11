﻿#region Using

using System.Web.Optimization;

#endregion

namespace PL
{
    public static class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {

            //bundles.Add(new StyleBundle("~/content/smartadmin").IncludeDirectory("~/content/css", "*.css"));
            bundles.Add(new StyleBundle("~/content/smartadmin").Include(
                "~/content/css/bootstrap.css")
                .Include(
                "~/content/css/font-awesome.css",
                new CssRewriteUrlTransform())
                .Include(
                "~/content/css/dataTables.bootstrap.css",
                "~/content/css/bootstrap-datepicker.css",
                "~/content/css/bootstrap-dialog.css",
                "~/content/css/bootstrap-toggle.css",
                "~/content/css/bootstrap-select.css",
                "~/content/css/lockscreen.css",
                "~/content/css/smartadmin-production-plugins.css",
                "~/content/css/smartadmin-production.css",
                "~/content/css/smartadmin-rtl.css",
                "~/content/css/smartadmin-skins.css",
                "~/content/css/estilos.css"));

            bundles.Add(new StyleBundle("~/content/actividad").Include(
               "~/content/css/fullCalendar.css",
               "~/content/css/app/actividad.css"));

            bundles.Add(new StyleBundle("~/content/noticia").Include(
                "~/content/css/summernote.css",
                "~/content/css/app/noticia.css"));

            bundles.Add(new StyleBundle("~/content/home").Include(
                "~/content/css/app/home.css"));

            bundles.Add(new StyleBundle("~/content/login").Include(
                "~/content/css/app/login.css"));

            bundles.Add(new StyleBundle("~/content/usuario").Include(
                "~/content/css/app/usuario.css"));

            bundles.Add(new StyleBundle("~/content/trabajador").Include(
                "~/content/css/app/trabajador.css"));

            bundles.Add(new StyleBundle("~/content/modificarAcceso").Include(
                "~/content/css/app/login.css",
                "~/content/css/app/modificarAcceso.css"));

            bundles.Add(new StyleBundle("~/content/dashboard").Include(
                "~/content/css/c3.css",
                "~/content/css/app/dashboard.css"));

            bundles.Add(new ScriptBundle("~/scripts/smartadmin").Include(
                "~/scripts/libs/jquery-2.1.1.js",
                 "~/scripts/libs/jquery-ui-1.10.3.js",
                "~/scripts/app.config.js",
                "~/scripts/plugin/jquery-touch/jquery.ui.touch-punch.js",
                "~/scripts/bootstrap/bootstrap.js",
                "~/scripts/plugin/moment/moment.js",
                "~/scripts/notification/SmartNotification.js",
                //"~/scripts/smartwidgets/jarvis.widget.js",
                "~/scripts/plugin/jquery-validate/jquery.validate.js",
                "~/scripts/plugin/masked-input/jquery.maskedinput.js",
                "~/scripts/plugin/bootstrap-select/bootstrap-select.js",
                "~/scripts/plugin/bootstrap-select/ajax-bootstrap-select.js",
                "~/scripts/plugin/bootstrap-select/ajax-bootstrap-select.es-ES.js",
                "~/scripts/plugin/bootstrap-slider/bootstrap-slider.js",
                "~/scripts/plugin/bootstrap-progressbar/bootstrap-progressbar.js",
                "~/scripts/plugin/msie-fix/jquery.mb.browser.js",
                //"~/scripts/plugin/fastclick/fastclick.js",                
                "~/scripts/plugin/bootstrap-datepicker/bootstrap-datepicker.js",
                "~/scripts/plugin/bootstrap-datepicker/bootstrap-datepicker.es.js",
                "~/scripts/plugin/bootstrap-timepicker/bootstrap-timepicker.js",
                "~/scripts/plugin/bootstrap-dialog/bootstrap-dialog.js",
                "~/scripts/plugin/datatables/jquery.dataTables.js",
                "~/scripts/plugin/datatables/dataTables.colVis.js",
                "~/scripts/plugin/datatables/dataTables.tableTools.js",
                "~/scripts/plugin/datatables/dataTables.bootstrap.js",
                "~/scripts/plugin/datatable-responsive/datatables.responsive.js",
                "~/scripts/plugin/bootstrap-toggle/bootstrap-toggle.js",
                "~/scripts/plugin/bootstrapvalidator/bootstrapValidator.js",
                "~/scripts/plugin/bootstrapvalidator/language/es_CL.js",
                "~/scripts/app.js"));

            bundles.Add(new ScriptBundle("~/js/trabajador").Include(
            "~/scripts/app/trabajador.js"));

            bundles.Add(new ScriptBundle("~/js/home").Include(
            "~/scripts/app/home.js"));
            bundles.Add(new ScriptBundle("~/js/homeDetalle").Include(
            "~/scripts/app/homeDetalle.js"));

            bundles.Add(new ScriptBundle("~/js/noticias").Include(
            "~/scripts/plugin/summernote/summernote.js",
            "~/scripts/app/noticias.js"));

            bundles.Add(new ScriptBundle("~/js/noticiasDetalle").Include(
            "~/scripts/app/homeDetalle.js"));

            bundles.Add(new ScriptBundle("~/js/actividad").Include(
                "~/scripts/plugin/fullcalendar/fullCalendar.js",
                "~/scripts/plugin/fullcalendar/fullCalendarEs.js",
                "~/scripts/app/actividad.js"));

            bundles.Add(new ScriptBundle("~/js/login").Include(
            "~/scripts/app/login.js"));

            bundles.Add(new ScriptBundle("~/js/usuario").Include(
            "~/scripts/app/usuario.js"));

            bundles.Add(new ScriptBundle("~/js/perfil").Include(
                "~/scripts/plugin/bootstrap-duallistbox/jquery.bootstrap-duallistbox.js",
                "~/scripts/app/perfil.js"));

            bundles.Add(new ScriptBundle("~/js/modificarAcceso").Include(
                "~/scripts/app/modificarAcceso.js"));

            bundles.Add(new ScriptBundle("~/js/dashboard").Include(
                "~/scripts/plugin/c3/d3.js",
                "~/scripts/plugin/c3/c3.js",
                "~/scripts/app/dashboard.js"));

            bundles.Add(new ScriptBundle("~/js/cliente").Include(
                "~/scripts/app/cliente.js"));

            /* NUEVO */
            bundles.Add(new StyleBundle("~/content/nuevoestilo").Include(
                "~/content/css/bootstrap.css")
                .Include("~/content/css/font-awesome.css", new CssRewriteUrlTransform())
                .Include(
                "~/content/css/dataTables.bootstrap.css",
                "~/content/css/bootstrap-datepicker.css",
                "~/content/css/bootstrap-dialog.css",
                "~/content/css/bootstrap-toggle.css",
                "~/content/css/bootstrap-select.css",
                "~/content/css/lockscreen.css",
                "~/content/css/smartadmin-production-plugins.css",
                "~/content/css/smartadmin-rtl.css",
                "~/content/css/smartadmin-skins.css",
                "~/content/css/estilos.css",
                 "~/content/css/nuevos-estilos.css"
                 ));

            /* NUEVO */
            bundles.Add(new ScriptBundle("~/js/sede").Include(
            "~/scripts/app/sede.js"));

            /* NUEVO */
            bundles.Add(new ScriptBundle("~/js/ubicacion").Include(
            "~/scripts/app/ubicacion.js"));

            /* NUEVO */
            bundles.Add(new ScriptBundle("~/js/servicio").Include(
            "~/scripts/app/servicio.js"));

            /* NUEVO */
            bundles.Add(new ScriptBundle("~/js/voto").Include(
            "~/scripts/app/voto.js"));


            /* NUEVO */
            bundles.Add(new StyleBundle("~/content/evaluacion)").Include(
       "~/content/css/bootstrap.css")
       .Include(
       "~/content/css/font-awesome.css",
       new CssRewriteUrlTransform())
       .Include(
       "~/content/css/dataTables.bootstrap.css",
       "~/content/css/bootstrap-datepicker.css",
       "~/content/css/bootstrap-dialog.css",
       "~/content/css/bootstrap-toggle.css",
       "~/content/css/bootstrap-select.css",
       "~/content/css/lockscreen.css",
       "~/content/css/smartadmin-production-plugins.css",
       "~/content/css/smartadmin-production.css",
       "~/content/css/smartadmin-rtl.css",
       "~/content/css/smartadmin-skins.css",
       "~/content/css/estilos.css"
        ));

            /* NUEVO */
            bundles.Add(new ScriptBundle("~/js/evaluacion").Include(
            "~/scripts/app/evaluacion.js"));

            /* NUEVO */
            bundles.Add(new ScriptBundle("~/js/edificio").Include(
            "~/scripts/app/edificio.js"));

            /* NUEVO */
            bundles.Add(new ScriptBundle("~/js/codigoqr").Include(
            "~/scripts/app/codigoqr.js"));

            /* NUEVO */
            bundles.Add(new StyleBundle("~/content/main-login").Include(
                "~/content/css/bootstrap.css")
                .Include(
                "~/content/css/font-awesome.css",
                new CssRewriteUrlTransform())
                .Include(
                "~/content/css/dataTables.bootstrap.css",
                "~/content/css/bootstrap-datepicker.css",
                "~/content/css/bootstrap-dialog.css",
                "~/content/css/bootstrap-toggle.css",
                "~/content/css/bootstrap-select.css",
                "~/content/css/lockscreen.css",
                "~/content/css/smartadmin-production-plugins.css",
                "~/content/css/smartadmin-rtl.css",
                "~/content/css/smartadmin-skins.css",
                "~/content/css/estilos.css",
                "~/content/css/main-login.css"
                 ));

            /* NUEVO */
            bundles.Add(new ScriptBundle("~/js/categoria").Include(
            "~/scripts/app/categoria.js"));

            BundleTable.EnableOptimizations = false;
        }
    }
}