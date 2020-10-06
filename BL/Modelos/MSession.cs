using AutoMapper;
using EL.DTO;
using System.Web.Mvc;

namespace BL.Modelos
{
    public class MSession
    {

        private static IMapper mapper;
        private BL.Utilidades.DESEncrypt encriptacion;
        private MLogin modelo = new MLogin();
        private MFuncionalidad mFuncionalidad = new MFuncionalidad();

        public MSession()
        {
            mapper = BL.Utilidades.AutoMapperConfiguration.Configure();
            encriptacion = new Utilidades.DESEncrypt();
            modelo = new MLogin();
        }

        public DTORespuesta ValidaLogin(DTOLogin login)
        {
            DTORespuesta respuesta = modelo.ValidaLogin(login);

            if ((bool)respuesta.Resultado)
            {
                DTOUsuario user = mapper.Map<DTOUsuario, DTOUsuario>((DTOUsuario)respuesta.Elemento);

                DTOSessionUsuario sess = new DTOSessionUsuario();
                sess.Usuario = mapper.Map<DTOUsuario, DTOUsuario>(user);
                sess.Funcionalidades = mFuncionalidad.GetFuncionalidadesByLogin(login.USU_USERNAME);

                UrlHelper url = new UrlHelper(System.Web.HttpContext.Current.Request.RequestContext);

                RegisterSession(sess);
            }

            return respuesta;
        }

        private static void RegisterSession(DTOSessionUsuario sess)
        {
            System.Web.HttpContext.Current.Session["UsuarioSess"] = sess;
        }

        public static void FreeSession()
        {
            System.Web.HttpContext.Current.Session["UsuarioSess"] = null;
            System.Web.HttpContext.Current.Session.RemoveAll();
            System.Web.HttpContext.Current.Session.Clear();
        }

        public static bool CheckSession()
        {
            if (System.Web.HttpContext.Current.Session["UsuarioSess"] != null)
                return true;
            else
                return false;
        }

        public static object ReturnSessionObject()
        {
            if (CheckSession())
                return System.Web.HttpContext.Current.Session["UsuarioSess"];
            else
                return null;
        }

        public static bool isAjaxCall()
        {

            if (System.Web.HttpContext.Current.Request.Headers["X-Requested-With"] != null &&
                !string.IsNullOrWhiteSpace(System.Web.HttpContext.Current.Request.Headers["X-Requested-With"]))
                return true;
            else
                return false;

        }

    }
}
