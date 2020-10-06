using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using BL.Modelos;
using EL.DTO;
namespace ESSBIO
{
    /// <summary>
    /// Descripción breve de Service1
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // Para permitir que se llame a este servicio Web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente. 
    // [System.Web.Script.Services.ScriptService]
    public class Service1 : System.Web.Services.WebService
    {
        private MServicios _servicios;
        [WebMethod]
        public DTORespuestaFTP obtenerRutas(string Usuario, string Password, int TipoDocumento, int NumeroMuestra)
        {
            DTORespuestaFTP respuesta = new DTORespuestaFTP();
            try
            {
                this._servicios = new MServicios();
                //Validar el usuario.
                DTOUsuario usuario = new DTOUsuario() { Password = Password, Nombre = Usuario };
                if (!this._servicios.IsUsuarioValido(usuario)) {
                    throw new Exception("ERROR: Credenciales de usuario son incorrectas.");
                }
                DTOInforme informe = new DTOInforme();
                informe.TipoDocumento = TipoDocumento;
                informe.NumeroMuestra = NumeroMuestra;
                if (informe == null)
                {
                    throw new Exception("ERROR: El parámetro de entrada no puede ser nulo.");
                }
                respuesta = this._servicios.obtenerArchivo(informe);
                return respuesta;
            }
            catch (Exception ex)
            {
                respuesta.Resultado = false;
                respuesta.Mensaje = "WebService.obtenerRutas: " + ex.Message;
                return respuesta;
            }
        }
    }
}