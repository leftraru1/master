namespace EL.Entidades
{
    public class Usuario
    {
        public int USU_ID_USUARIO { get; set; }

        public int USU_RUT { get; set; }

        public string USU_DV_RUT { get; set; }

        public string USU_NOMBRE_COMPLETO { get; set; }

        public string USU_LOGIN { get; set; }

        public bool USU_VIGENTE { get; set; }

        public int USU_PERF_ID_PERFIL { get; set; }

        public int? USU_SED_ID_SEDE { get; set; }
    }
}
