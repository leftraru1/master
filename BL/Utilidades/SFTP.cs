using System;
using System.Collections.Generic;
using System.Web.Configuration;
using Renci.SshNet;
using System.IO;
using System.Threading.Tasks;
using EL.DTO;
namespace BL.Utilidades
{
    public class SFTP
    {
        public string Usuario { get { return this._Usuario; } }
        public string Password { get { return this._Password; } }
        public string URI { get { return this._URI; } }

        private readonly string _Usuario;
        private readonly string _Password;
        private readonly string _URI;

        public SFTP()
        {
            this._Usuario = AESEncrytDecry.Desencriptar(WebConfigurationManager.AppSettings["ftp_usuario"]);
            this._Password = AESEncrytDecry.Desencriptar(WebConfigurationManager.AppSettings["ftp_password"]);
            this._URI = WebConfigurationManager.AppSettings["ftp_uri"]; ;
        }

        public List<string> obtenerContenido(string directorio)
        {
            List<string> result = new List<string>();
            try
            {
                using (SftpClient sftp = new SftpClient(this._URI, this._Usuario, this._Password))
                {
                    sftp.Connect();

                    var files = sftp.ListDirectory(directorio);

                    foreach (var file in files)
                    {
                        // /informes/1313504_comercia_20_7_2018_16_26_30.pdf
                        if (!file.FullName.Split('/')[2].Equals("..") && !file.FullName.Split('/')[2].Equals("."))
                        {
                            result.Add(file.FullName.Split('/')[2]);
                        }
                    }
                    sftp.Disconnect();

                    if (result.Count == 0)
                    {
                        throw new Exception("ERROR: No se encontró contenido para el directorio especificado. (" + directorio + ")");
                    }
                    return result;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("FTP.obtenerContenido:" + ex.Message);
            }
        }

        public byte[] obtenerArchivo(string directorioRemoto, string directorioLocal, string nombreArchivo, string login)
        {
            try
            {
                using (SftpClient sftp = new SftpClient(this._URI, this._Usuario, this._Password))
                {
                    sftp.Connect();
                    bool exists = System.IO.Directory.Exists(directorioLocal);

                    if (!exists)
                        System.IO.Directory.CreateDirectory(directorioLocal);

                    string fullLocalPath = directorioLocal + "\\(" + login + ")" + nombreArchivo;

                    using (Stream fileStream = File.Create(@fullLocalPath))
                    {
                        sftp.DownloadFile(directorioRemoto + "/" + nombreArchivo, fileStream);
                        fileStream.Close();
                    }
                    byte[] fileBytes = System.IO.File.ReadAllBytes(fullLocalPath);
                    return fileBytes;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        
        public bool subirArchivos(DTOFileModel files, string directorioRemoto)
        {
            directorioRemoto = "/" + directorioRemoto + "/";
            try
            {
                using (SftpClient sftp = new SftpClient(this._URI, this._Usuario, this._Password))
                {
                    sftp.Connect();
                    sftp.ChangeDirectory(directorioRemoto);
                    foreach (var file in files.files)
                    {
                        sftp.UploadFile(file.InputStream,file.FileName);
                    }
                    return true;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
