using EL.DTO;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.Utilidades
{
    public class Upload: DTORespuesta
    {

        private List<string> extensionesFotos = new List<string>();
        private List<string> extensionesDocumentos = new List<string>();
        public string Extension { get; set; }
        public string Ruta { get; set; }

        public Upload()
        {
            extensionesFotos.Add("jpg");
            extensionesFotos.Add("png");

            extensionesDocumentos.Add("pdf");
            extensionesDocumentos.Add("doc");
            extensionesDocumentos.Add("docx");
            extensionesDocumentos.Add("xls");
            extensionesDocumentos.Add("xlsx");
            extensionesDocumentos.Add("rar");

            this.Resultado = false;
        }

        public bool validarExtensionFoto(string ext)
        {

            bool valida = false;

            foreach (string item in extensionesFotos)
            {
                if (item.ToUpper() == ext.ToUpper())
                {
                    valida = true;
                }
            }

            return valida;

        }

        public bool validaExtensionDocumento(string ext)
        {

            bool valida = false;

            foreach (string item in extensionesDocumentos)
            {
                if (item.ToUpper() == ext.ToUpper())
                {
                    valida = true;
                }
            }

            return valida;

        }
        
        public static Stream GetFilesStream(string fileUrl)
        {
            return new FileStream(fileUrl, FileMode.Open);            
        }

    }
}
