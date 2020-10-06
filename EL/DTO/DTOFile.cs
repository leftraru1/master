using System;

namespace EL.DTO
{
    public class DTOFile
    {
        public string NOMBRE_USUARIO { get; set; }
        public string NUMERO_INFORME { get; set; }
        public DateTime FECHA_ELBORACION { get; set; }
        public string FECHA_ELBORACION_TO_STRING { get { return this.FECHA_ELBORACION.ToShortDateString(); } }
        public string NOMBRE_ARCHIVO { get; set; }
    }
}
