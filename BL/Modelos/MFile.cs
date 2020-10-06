using System.Collections.Generic;
using EL.DTO;
using System.Linq;
using BL.Utilidades;
using System.Web.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;
namespace BL.Modelos
{
    public class MFile
    {
        private MServicios servicios;

        public MFile()
        {
            servicios = new MServicios();
        }
        public List<DTOFile> Buscar(DTOFile filtro)
        {
            return servicios.obtenerListadoInformes().Where(s =>
               (s.NUMERO_INFORME.Contains(filtro.NUMERO_INFORME == null ? "" : filtro.NUMERO_INFORME) || filtro.NUMERO_INFORME == null)
            && (s.NOMBRE_USUARIO.Contains(filtro.NOMBRE_USUARIO == null ? "" : filtro.NOMBRE_USUARIO) || filtro.NOMBRE_USUARIO == null)
            && (s.FECHA_ELBORACION == filtro.FECHA_ELBORACION || filtro.FECHA_ELBORACION == new System.DateTime(1, 1, 1))).ToList();
        }
        public byte[] obtenerInformeToByte(string nombreArchivo, string login)
        {
            SFTP ftp = new SFTP();
            try
            {
                string directorioRemoto = WebConfigurationManager.AppSettings["ftp_informes"];
                string directorioLocal = WebConfigurationManager.AppSettings["ruta_local_informes"];
                return ftp.obtenerArchivo(directorioRemoto, directorioLocal, nombreArchivo, login);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task eliminarArchivosByLoginAsync(string login)
        {
            string directorioLocal = WebConfigurationManager.AppSettings["ruta_local_informes"];
            try
            {
                System.IO.DirectoryInfo di = new DirectoryInfo(directorioLocal);

                foreach (FileInfo file in di.GetFiles())
                {
                    if (file.FullName.Contains("(" + login + ")"))
                        file.Delete();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetMimeType(string fileName)
        {
            string mimeType = "application/unknown";
            string ext = Path.GetExtension(fileName).ToLower();
            Microsoft.Win32.RegistryKey regKey = Microsoft.Win32.Registry.ClassesRoot.OpenSubKey(ext); // henter info fra windows registry
            if (regKey != null && regKey.GetValue("Content Type") != null)
                mimeType = regKey.GetValue("Content Type").ToString();
            else if (ext == ".png") // a couple of extra info, due to missing information on the server
                mimeType = "image/png";
            else if (ext == ".flv")
                mimeType = "video/x-flv";
            else if (ext == ".docx")
                mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            else if (ext == ".xlsx")
                mimeType = "application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            else if (ext == ".rar")
                mimeType = "application/x-rar-compressed";
            else if (ext == ".zip")
                mimeType = "application/zip, application/octet-stream";

            return mimeType;
        }

        public bool subirArchivos(DTOFileModel files)
        {
            try
            {
                SFTP ftp = new SFTP();
                string directorioRemoto = WebConfigurationManager.AppSettings["ftp_informes_firmados"];
                return ftp.subirArchivos(files, directorioRemoto);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }
}
