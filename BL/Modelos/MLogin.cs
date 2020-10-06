using AutoMapper;
using EL.DTO;
using EL.Entidades;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
namespace BL.Modelos
{
    public class MLogin
    {
        private static IMapper mapper { get; set; }

        public MLogin()
        {
            mapper = BL.Utilidades.AutoMapperConfiguration.Configure();
        }

        public async Task<DTOUsuario> UpdateUsuario(DTOUsuario entidad)
        {
            return entidad;
        }


        private bool ValidaAdmin(DTOLogin login)
        {
            string ADMIN_USER = System.Web.Configuration.WebConfigurationManager.AppSettings["AdminUser"];
            string ADMIN_PASS = System.Web.Configuration.WebConfigurationManager.AppSettings["AdminPass"];

            if (login.USU_USERNAME == ADMIN_USER && login.USU_PASS == ADMIN_PASS)
                return true;
            else
                return false;

        }

        public DTORespuesta ValidaLogin(DTOLogin login)
        {
            DTORespuesta respuesta = new DTORespuesta();
            Essbio.SUL.Seguridad.Usuario user = null;
            try
            {
                user = new Essbio.SUL.Seguridad.Usuario(login.USU_USERNAME, login.USU_PASS);
            }
            catch (Exception ex)
            {
                respuesta.Resultado = false;
                respuesta.Mensaje = ex.Message.Replace("<br/>","\\n");
                return respuesta;
            }

            try
            {
                if (ValidaAdmin(login) == false)
                {
                    if (user != null)
                    {

                        DTOUsuario usuario = new DTOUsuario();
                        usuario.USU_DV_RUT = "";
                        usuario.USU_ID_USUARIO = user.P_ID_USUARIO;
                        usuario.USU_LOGIN = login.USU_USERNAME;
                        usuario.USU_NOMBRE_COMPLETO = login.USU_USERNAME;
                        usuario.USU_PERF_ADMINISTRADOR = true;
                        usuario.USU_PERF_ID_PERFIL = 0;
                        usuario.USU_RUT = 0;
                        usuario.USU_RUT_COMPLETO = "";
                        usuario.USU_SED_ID_SEDE = 0;
                        usuario.USU_VIGENTE = true;

                        if (user.EstadoUsuario == Essbio.SUL.Seguridad.EstadoUsuario.Logeado)
                        {
                            respuesta.Resultado = true;
                            respuesta.Elemento = usuario;
                        }
                        else
                        {
                            respuesta.Resultado = false;
                            respuesta.Mensaje = "La cuenta de usuario esta no vigente, comuníquese con el administrador del sistema";
                        }

                    }
                    else
                    {
                        respuesta.Resultado = false;
                        respuesta.Mensaje = "Las credenciales ingresadas no son correctas, reingrese nuevamente";
                    }

                }
                else
                {
                    DTOUsuario usuario = new DTOUsuario();

                    if (usuario.USU_ID_USUARIO > 0)
                    {
                        respuesta.Resultado = true;
                        respuesta.Elemento = usuario;
                    }
                    else
                    {
                        respuesta.Resultado = false;
                        respuesta.Mensaje = "La cuenta de usuario esta no vigente, comuníquese con el administrador del sistema";
                    }
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }

            return respuesta;
        }

    }
}
