using AutoMapper;
using EL.DTO;
using System.Collections.Generic;

namespace BL.Modelos
{
    public class MFuncionalidad
    {

        private static IMapper mapper { get; set; }

        public MFuncionalidad()
        {
            mapper = BL.Utilidades.AutoMapperConfiguration.Configure();
        }

        public List<DTOFuncionalidad> GetFuncionalidadesByLogin(string login)
        {
            List<DTOFuncionalidad> funcionalidades = new List<DTOFuncionalidad>();
            funcionalidades.Add(new DTOFuncionalidad() { FUN_ID = 1, FUN_NOMBRE = "Inicio", FUN_PADRE_ID = null, FUN_CONTROLLER = "home", FUN_ACTION = "Index", FUN_ORDEN = 1, FUN_TIPO = 2, FUN_CLASE = "fa-home" });
            funcionalidades.Add(new DTOFuncionalidad() { FUN_ID = 2, FUN_NOMBRE = "Descargar Informe", FUN_PADRE_ID = null, FUN_CONTROLLER = "Informes", FUN_ACTION = "Download", FUN_ORDEN = 2, FUN_TIPO = 2, FUN_CLASE = "fa-download" });
            funcionalidades.Add(new DTOFuncionalidad() { FUN_ID = 3, FUN_NOMBRE = "Subir Informe", FUN_PADRE_ID = null, FUN_CONTROLLER = "Informes", FUN_ACTION = "Upload", FUN_ORDEN = 3, FUN_TIPO = 2, FUN_CLASE = "fa-upload" });
            return funcionalidades;
        }

    }
}
