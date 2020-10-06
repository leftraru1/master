using AutoMapper;
using EL.DTO;
using EL.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.Utilidades
{
    public static class AutoMapperConfiguration
    {

        public static IMapper Configure()
        {
            var config = new MapperConfiguration(cfg =>
            {

                cfg.CreateMap<Usuario, DTOUsuario>();
                cfg.CreateMap<DTOUsuario, Usuario>();
                cfg.CreateMap<DTOUsuario, DTOLogin>();
                cfg.CreateMap<DTOLogin, DTOUsuario>();

                cfg.CreateMap<Funcionalidad, DTOFuncionalidad>();
                cfg.CreateMap<DTOFuncionalidad, Funcionalidad>();
            });

            return config.CreateMapper();

        }

    }
}
