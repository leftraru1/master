using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EL.Entidades;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.ModelConfiguration;
using System.Data.Entity.ModelConfiguration.Conventions;
using EL.Interfaces;
using Newtonsoft.Json;
using EL.DTO;

namespace DAL
{

    //public class BaseDbContext : IdentityDbContext
    public class BaseDbContext : DbContext
    {

        public static string conn = ConfigurationManager.ConnectionStrings["conn"].ToString();

        public virtual DbSet<Cargo> Cargo { get; set; }
        public virtual DbSet<Cliente> Cliente { get; set; }
        public virtual DbSet<Modulo> Modulo { get; set; }
        public virtual DbSet<ModuloAsignado> ModuloAsignado { get; set; }
        public virtual DbSet<PersonalAsignado> PersonalAsignado { get; set; }
        public virtual DbSet<Proyecto> Proyecto { get; set; }
        public virtual DbSet<Rubro> Rubro { get; set; }
        public virtual DbSet<Tarea> Tarea { get; set; }
        public virtual DbSet<Trabajador> Trabajador { get; set; }
        public virtual DbSet<Noticia> Noticia { get; set; }
        public virtual DbSet<NoticiaTexto> NoticiaTexto { get; set; }
        public virtual DbSet<Archivo> Archivo { get; set; }
        public virtual DbSet<ArchivoTipo> ArchivoTipo { get; set; }
        public virtual DbSet<ArchivoSubido> ArchivoSubido { get; set; }
        public virtual DbSet<Feriado> Feriado { get; set; }
        public virtual DbSet<TipoFeriado> TipoFeriado { get; set; }
        public virtual DbSet<Actividad> Actividad { get; set; }
        public virtual DbSet<Usuario> Usuario { get; set; }
        public virtual DbSet<Perfil> Perfil { get; set; }
        public virtual DbSet<PerfilFuncionalidad> PerfilFuncion { get; set; }
        public virtual DbSet<Funcionalidad> Funcionalidad { get; set; }
        public virtual DbSet<Permisos> Permisos { get; set; }
        public virtual DbSet<UsuarioPermisos> UsuarioPermisos { get; set; }
        public virtual DbSet<Log> Log { get; set; }

        public virtual DbSet<Sede> Sede { get; set; }
        public virtual DbSet<Edificio> Edificio { get; set; }
        public virtual DbSet<TipoServicio> TipoServicio { get; set; }
        public virtual DbSet<Servicio> Servicio { get; set; }
        public virtual DbSet<Evaluacion> Evaluacion { get; set; }

        public BaseDbContext()
            : base(conn)
        {
            Database.SetInitializer<BaseDbContext>(null);
            this.Configuration.LazyLoadingEnabled = false;
            this.Configuration.ProxyCreationEnabled = false;
        }

        public Task<int> SaveChangesAsync(DTOSessionUsuario _sess)
        {
            Auditar(_sess);
            return base.SaveChangesAsync();
        }

        //public override int SaveChanges()
        //{
        //    Auditar(new DTOSessionUsuario());
        //    return base.SaveChanges();
        //}

        private void Auditar(DTOSessionUsuario _sess)
        {
            var modifiedEntries = ChangeTracker.Entries().Where(x => x.Entity is IAuditable && (x.State == System.Data.Entity.EntityState.Added
             || x.State == System.Data.Entity.EntityState.Modified || x.State == System.Data.Entity.EntityState.Deleted));

            foreach (var entry in modifiedEntries)
            {
                IAuditable entity = entry.Entity as IAuditable;
                if (entity != null)
                {

                    Log log = new Log() {
                        USU_ID = (int)_sess.Usuario.USU_ID,
                        LOG_FECHA = DateTime.Now,
                        LOG_LLAMADA = _sess.llamada,
                        LOG_OPERACION = (entry.State == EntityState.Added) ? "insercion" : ((entry.State == EntityState.Modified) ? "modificacion" : "eliminacion"),
                        LOG_DATOS = JsonConvert.SerializeObject(entry.Entity, Formatting.Indented)                
                    };

                    this.Set<Log>().Add(log);

                }
            }

        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);

            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();

            modelBuilder.Properties<string>().Configure(c => c.HasColumnType("varchar"));
            modelBuilder.Properties<decimal>().Configure(c => c.HasColumnType("numeric"));
            modelBuilder.Properties<decimal>().Configure(c => c.HasPrecision(12, 0));            

        }

    }

}
