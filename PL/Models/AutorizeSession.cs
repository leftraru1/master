using BL.Modelos;
using EL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PL.Models
{
    public class AutorizeSession : AuthorizeAttribute
    {

        public override void OnAuthorization(AuthorizationContext filterContext)
        {

            DTOSessionUsuario sess = (DTOSessionUsuario)MSession.ReturnSessionObject();

            string controlador = filterContext.ActionDescriptor.ControllerDescriptor.ControllerName;
            string accion = filterContext.ActionDescriptor.ActionName;

            if (sess == null)
                if (!MSession.isAjaxCall())
                    filterContext.Result = new RedirectResult(filterContext.HttpContext.Request.ApplicationPath);
                else
                {
                    filterContext.Result = new HttpUnauthorizedResult();
                    filterContext.Result = new HttpUnauthorizedResult();
                }
            else
            {
                sess.llamada = controlador + "/" + accion;
                if (sess.Funcionalidades.FindAll(x => x.FUN_CONTROLLER.ToUpper() == controlador.ToUpper() && x.FUN_ACTION.ToUpper() == accion.ToUpper()).Count == 0)
                    if (sess.Funcionalidades.FindAll(x => x.FUN_CONTROLLER.ToUpper() == controlador.ToUpper() && (x.FUN_ACTION == "" || accion.ToUpper().Contains("EXCEL") || accion.ToUpper().Contains("CSV") || accion.ToUpper().Contains("PDF") || accion.ToUpper().Contains("DETALLE") || accion.ToUpper().Contains("PNG"))).Count == 0)
                        if ((controlador.ToUpper() != "MODIFICARACCESO" && controlador.ToUpper() != "IMAGEN"))
                            if (!MSession.isAjaxCall())
                            {
                                MSession.FreeSession();
                                filterContext.Result = new RedirectResult(filterContext.HttpContext.Request.ApplicationPath);
                            }
            }

        }


    }
}