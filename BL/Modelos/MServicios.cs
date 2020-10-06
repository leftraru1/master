using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EL.DTO;
using BL.Utilidades;
using System.Web.Configuration;

namespace BL.Modelos
{
    public class MServicios
    {
        private string _usuarioInternet { get { return AESEncrytDecry.Desencriptar(WebConfigurationManager.AppSettings["usuario_internet"]); } }
        private string _passwordInternet { get { return AESEncrytDecry.Desencriptar(WebConfigurationManager.AppSettings["password_internet"]); } }

        public DTORespuestaFTP obtenerArchivo(DTOInforme informe)
        {
            DTORespuestaFTP respuesta = new DTORespuestaFTP();
            try
            {
                SFTP ftp = new SFTP();

                string carpeta = "";
                switch (informe.TipoDocumento)
                {
                    case 1:
                        carpeta = WebConfigurationManager.AppSettings["ftp_informes"];
                        break;
                    case 2:
                        carpeta = WebConfigurationManager.AppSettings["ftp_ecfa"];
                        break;
                    default:
                        throw new Exception("ERROR: El tipo de documento no es correcto: 1=Informe/2=ECFA");
                }
                List<string> contenido = ftp.obtenerContenido(carpeta);
                string archivoFormat;
                foreach (string archivo in contenido)
                {
                    archivoFormat = archivo.Replace(carpeta, "");
                    archivoFormat = archivoFormat.Replace("/", "");
                    archivoFormat = archivoFormat.Replace(".", "");
                    if (archivoFormat.Split('_')[0].ToString().Equals(informe.NumeroMuestra.ToString()))
                    {
                        respuesta.Rutas.Add(archivo);
                    }
                }

                if (respuesta.Rutas.Count == 0)
                {
                    throw new Exception("ERROR: No se encontraron archivos en '" + carpeta + "' para el informe '" + informe.NumeroMuestra.ToString() + "'");
                }
                respuesta.Mensaje = "Servicio ejecutado correctamente.";
                respuesta.Resultado = true;
            }
            catch (Exception ex)
            {
                throw new Exception("MServicios.obtenerArchivo: " + ex.Message);
            }
            return respuesta;
        }
        public bool IsUsuarioValido(DTOUsuario usuario)
        {
            if (!usuario.Nombre.Equals(this._usuarioInternet))
            {
                return false;
            }
            if (!usuario.Password.Equals(this._passwordInternet))
            {
                return false;
            }
            return true;
        }

        public List<DTOFile> obtenerListadoInformes()
        {
            List<DTOFile> respuesta = new List<DTOFile>();
            List<string> archivos = new List<string>();
            DTOFile file;
            try
            {
                SFTP ftp = new SFTP();
                string carpeta = WebConfigurationManager.AppSettings["ftp_informes"];
                archivos = ftp.obtenerContenido(carpeta);
                foreach (string archivo in archivos)
                {
                    if (archivo.Contains(".pdf"))
                    {
                        file = new DTOFile();
                        try { file.NUMERO_INFORME = archivo.Split('_')[0]; } catch (Exception) { file.NUMERO_INFORME = "0"; }
                        try { file.NOMBRE_USUARIO = archivo.Split('_')[1]; } catch (Exception) { file.NOMBRE_USUARIO = ""; }
                        try { file.FECHA_ELBORACION = new DateTime(int.Parse(archivo.Split('_')[4]), int.Parse(archivo.Split('_')[3]), int.Parse(archivo.Split('_')[2])); } catch (Exception) { file.FECHA_ELBORACION = DateTime.Now; }
                        try { file.NOMBRE_ARCHIVO = archivo; } catch (Exception) { file.NOMBRE_ARCHIVO = ""; }

                        respuesta.Add(file);
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
