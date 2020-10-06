using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EL.DTO
{
    public class DTOLogin
    {
        [MaxLength(20)]
        public string USU_USERNAME { get; set; }
        [MaxLength(20)]
        public string USU_PASS { get; set; }
    }
}
