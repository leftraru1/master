using BL.Modelos;
using EL.DTO;
using System;
using System.Net;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace PL.Controllers
{
    public class LoginController : Controller
    {

        private MLogin modeloLogin { get; set; }
        private MFile mFile;
        private BL.Utilidades.DESEncrypt encrypt = new BL.Utilidades.DESEncrypt();

        public LoginController()
        {
            modeloLogin = new MLogin();
        }

        [AllowAnonymous]
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult CerrarSession()
        {
            Session.RemoveAll();
            Session.Clear();
            Session.Abandon();

            return RedirectToAction("Index", "Login");
        }

        public JsonResult DatosSession()
        {
            DTOSessionUsuario session = (DTOSessionUsuario)MSession.ReturnSessionObject();
            try
            {
                session = (DTOSessionUsuario)MSession.ReturnSessionObject();
                Response.StatusCode = (int)HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                Response.StatusDescription = ex.Message.Replace("\r", "").Replace("\n", "").Replace("\t", "").Replace("\v", "").Replace("\f", "").ToString();
            }

            return new JsonResult { JsonRequestBehavior = JsonRequestBehavior.AllowGet, Data = session };
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> Login(DTOLogin user)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (string.IsNullOrWhiteSpace(user.USU_USERNAME) || string.IsNullOrWhiteSpace(user.USU_PASS))
                        return RedirectToAction("Index", "Login");

                    MSession modelo = new MSession();
                    DTORespuesta respuesta = modelo.ValidaLogin(user);

                    if ((bool)respuesta.Resultado)
                    {
                        DTOSessionUsuario sess = (DTOSessionUsuario)MSession.ReturnSessionObject();
                        sess.Usuario = await modeloLogin.UpdateUsuario(sess.Usuario);
                        //TODO: Eliminar los archivos asociados al usuario. (Async)
                        mFile = new MFile();
                        await mFile.eliminarArchivosByLoginAsync(sess.Usuario.USU_LOGIN);
                        return RedirectToAction("Index", "Home");
                    }
                    else
                    {
                        Session["ResultadoAccesoLogin"] = respuesta;
                        return RedirectToAction("Index", "Login");
                    }

                }
                else
                    return RedirectToAction("Index", "Login");
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", "Login");
            }
        }


    }
}