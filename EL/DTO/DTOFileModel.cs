using System.ComponentModel.DataAnnotations;
using System.Web;

namespace EL.DTO
{
    public class DTOFileModel
    {
        [Required(ErrorMessage = "Debe seleccionar al menos un archivo.")]
        [Display(Name = "Seleccione el o los archivos a cargar.")]
        public HttpPostedFileBase[] files { get; set; }

    }
}