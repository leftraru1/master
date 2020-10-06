using EL.DTO;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.Utilidades
{
    public class Download : DTORespuesta
    {

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

    }
}
