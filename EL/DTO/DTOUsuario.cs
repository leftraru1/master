﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EL.DTO
{
    public class DTOUsuario
    {
        public string Nombre { get; set; }
        public string Password { get; set; }
        public int USU_ID_USUARIO { get; set; }

        public int USU_RUT { get; set; }

        [MaxLength(1)]
        public string USU_DV_RUT { get; set; }

        [MaxLength(50)]
        public string USU_NOMBRE_COMPLETO { get; set; }

        [MaxLength(30)]
        public string USU_LOGIN { get; set; }

        public bool USU_VIGENTE { get; set; }

        public bool? USU_PERF_ADMINISTRADOR { get; set; }

        public int USU_PERF_ID_PERFIL { get; set; }

        public int? USU_SED_ID_SEDE { get; set; }

        private string _USU_RUT_COMPLETO;

        [MaxLength(12)]
        public string USU_RUT_COMPLETO { get; set; }

    }
}
