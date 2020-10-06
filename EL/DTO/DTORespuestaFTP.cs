using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
namespace EL.DTO
{
    public class DTORespuestaFTP
    {
        public bool Resultado { get; set; }

        public string Mensaje { get; set; }

        public List<string> Rutas { get; set; }

        public DTORespuestaFTP()
        {
            this.Rutas = new List<string>();
        }
    }
}
