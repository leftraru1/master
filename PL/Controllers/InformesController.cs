using System;
using System.Collections.Generic;
using System.Web.Mvc;
using EL.DTO;
using BL.Modelos;
using System.Net;
using System.IO;
using PL.Models;
using System.Linq;
using System.Web;
namespace PL.Controllers
{
    public class InformesController : Controller
    {
        DTOSessionUsuario session = (DTOSessionUsuario)MSession.ReturnSessionObject();
        private MFile modelo = new MFile();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Download()
        {
            return View();
        }
        public ActionResult Upload()
        {
            return View(new DTOFileModel());
        }
        [HttpPost]
        public JsonResult Buscar(DTOFile filtro)
        {
            List<DTOFile> files = new List<DTOFile>();
            try
            {
                files = modelo.Buscar(filtro);
                Response.StatusCode = (int)HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                Response.StatusDescription = ex.Message.Replace("\r", "").Replace("\n", "").Replace("\t", "").Replace("\v", "").Replace("\f", "").ToString();
            }

            return new JsonResult { JsonRequestBehavior = JsonRequestBehavior.AllowGet, Data = files };
        }

        [HttpGet]
        public ActionResult DescargarInforme(string nombreArchivo)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(nombreArchivo))
                    Response.StatusCode = (int)HttpStatusCode.BadRequest;
                else
                {
                    string contentType = modelo.GetMimeType(nombreArchivo);

                    byte[] fileBytes = modelo.obtenerInformeToByte(nombreArchivo, session.Usuario.USU_LOGIN);

                    Response.StatusCode = (int)HttpStatusCode.OK;
                    Response.Clear();
                    Response.AddHeader("Content-Length",
                               fileBytes.Length.ToString());
                    return File(fileBytes, contentType, nombreArchivo);
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                Response.StatusDescription = ex.Message;
            }
            return null;

        }

        [HttpPost]
        public ActionResult UploadFiles(HttpPostedFileBase[] files)
        {
            DTOFileModel fileModel = new DTOFileModel();
            try
            {
                @ViewBag.CssMSg = "text-success";
                if (files[0] == null)
                {
                    ViewBag.UploadStatus = "Debe seleccionar al menos un archivo.";
                    @ViewBag.CssMSg = "text-danger";
                }

                if (ModelState.IsValid && files[0] != null)
                {
                    fileModel.files = files;
                    if (modelo.subirArchivos(fileModel))
                    {
                        ViewBag.UploadStatus = files.Count().ToString() + " archivos cargados correctamente.";
                    }
                    else
                    {
                        ViewBag.UploadStatus = "Hubo un error al cargar los archivos. Intente nuevamente.";
                    }
                }
            }
            catch (Exception ex)
            {
                ViewBag.UploadStatus = "ERROR: " + ex.Message;
                if (ex.InnerException != null)
                {
                    ViewBag.UploadStatus = "ERROR: " + ex.InnerException.Message;
                    if (ex.InnerException.InnerException != null)
                    {
                        ViewBag.UploadStatus = "ERROR: " + ex.InnerException.InnerException.Message;
                    }
                }
            }

            return View("Upload");
        }
    }
}