using DAL.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EL.Entidades;
using EL.DTO;
using DAL.Repositorios;

namespace DAL
{
    public class UnitOfWork : IUnitOfWork
    {

        private readonly BaseDbContext context;
        private bool disposed = false;
        private DTOSessionUsuario sess { get; set; }

        private Repository<Cargo> _CargoRepo = null;
        public Repository<Cargo> CargoRepo { get { if (this._CargoRepo == null) this._CargoRepo = new Repository<Cargo>(this.context); return this._CargoRepo; } }
        private Repository<Cliente> _ClienteRepo = null;
        public Repository<Cliente> ClienteRepo { get { if (this._ClienteRepo == null) this._ClienteRepo = new Repository<Cliente>(this.context); return this._ClienteRepo; } }
        private Repository<Modulo> _ModuloRepo = null;
        public Repository<Modulo> ModuloRepo { get { if (this._ModuloRepo == null) this._ModuloRepo = new Repository<Modulo>(this.context); return this._ModuloRepo; } }
        private Repository<ModuloAsignado> _ModuloAsignadoRepo = null;
        public Repository<ModuloAsignado> ModuloAsignadoRepo { get { if (this._ModuloAsignadoRepo == null) this._ModuloAsignadoRepo = new Repository<ModuloAsignado>(this.context); return this._ModuloAsignadoRepo; } }
        private Repository<PersonalAsignado> _PersonalAsignadoRepo = null;
        public Repository<PersonalAsignado> PersonalAsignadoRepo { get { if (this._PersonalAsignadoRepo == null) this._PersonalAsignadoRepo = new Repository<PersonalAsignado>(this.context); return this._PersonalAsignadoRepo; } }
        private Repository<Proyecto> _ProyectoRepo = null;
        public Repository<Proyecto> ProyectoRepo { get { if (this._ProyectoRepo == null) this._ProyectoRepo = new Repository<Proyecto>(this.context); return this._ProyectoRepo; } }
        private Repository<Rubro> _RubroRepo = null;
        public Repository<Rubro> RubroRepo { get { if (this._RubroRepo == null) this._RubroRepo = new Repository<Rubro>(this.context); return this._RubroRepo; } }
        private Repository<Tarea> _TareaRepo = null;
        public Repository<Tarea> TareaRepo { get { if (this._TareaRepo == null) this._TareaRepo = new Repository<Tarea>(this.context); return this._TareaRepo; } }
        private Repository<Trabajador> _TrabajadorRepo = null;
        public Repository<Trabajador> TrabajadorRepo { get { if (this._TrabajadorRepo == null) this._TrabajadorRepo = new Repository<Trabajador>(this.context); return this._TrabajadorRepo; } }
        private Repository<Noticia> _NoticiaRepo = null;
        public Repository<Noticia> NoticiaRepo { get { if (this._NoticiaRepo == null) this._NoticiaRepo = new Repository<Noticia>(this.context); return this._NoticiaRepo; } }
        private Repository<NoticiaTexto> _NoticiaTextoRepo = null;
        public Repository<NoticiaTexto> NoticiaTextoRepo { get { if (this._NoticiaTextoRepo == null) this._NoticiaTextoRepo = new Repository<NoticiaTexto>(this.context); return this._NoticiaTextoRepo; } }
        private Repository<Archivo> _ArchivoRepo = null;
        public Repository<Archivo> ArchivoRepo { get { if (this._ArchivoRepo == null) this._ArchivoRepo = new Repository<Archivo>(this.context); return this._ArchivoRepo; } }
        private Repository<ArchivoTipo> _ArchivoTipoRepo = null;
        public Repository<ArchivoTipo> ArchivoTipoRepo { get { if (this._ArchivoTipoRepo == null) this._ArchivoTipoRepo = new Repository<ArchivoTipo>(this.context); return this._ArchivoTipoRepo; } }
        private Repository<ArchivoSubido> _ArchivoSubidoRepo = null;
        public Repository<ArchivoSubido> ArchivoSubidoRepo { get { if (this._ArchivoSubidoRepo == null) this._ArchivoSubidoRepo = new Repository<ArchivoSubido>(this.context); return this._ArchivoSubidoRepo; } }
        private Repository<Feriado> _FeriadoRepo = null;
        public Repository<Feriado> FeriadoRepo { get { if (this._FeriadoRepo == null) this._FeriadoRepo = new Repository<Feriado>(this.context); return this._FeriadoRepo; } }
        private Repository<TipoFeriado> _TipoFeriadoRepo = null;
        public Repository<TipoFeriado> TipoFeriadoRepo { get { if (this._TipoFeriadoRepo == null) this._TipoFeriadoRepo = new Repository<TipoFeriado>(this.context); return this._TipoFeriadoRepo; } }
        private Repository<Actividad> _ActividadRepo = null;
        public Repository<Actividad> ActividadRepo { get { if (this._ActividadRepo == null) this._ActividadRepo = new Repository<Actividad>(this.context); return this._ActividadRepo; } }
        private UsuarioRepo _UsuarioRepo = null;
        public UsuarioRepo UsuarioRepo { get { if (this._UsuarioRepo == null) this._UsuarioRepo = new UsuarioRepo(this.context); return this._UsuarioRepo; } }
        private Repository<Perfil> _PerfilRepo = null;
        public Repository<Perfil> PerfilRepo { get { if (this._PerfilRepo == null) this._PerfilRepo = new Repository<Perfil>(this.context); return this._PerfilRepo; } }
        private Repository<PerfilFuncionalidad> _PerfilFuncionalidadRepo = null;
        public Repository<PerfilFuncionalidad> PerfilFuncionalidadRepo { get { if (this._PerfilFuncionalidadRepo == null) this._PerfilFuncionalidadRepo = new Repository<PerfilFuncionalidad>(this.context); return this._PerfilFuncionalidadRepo; } }
        private Repository<Funcionalidad> _FuncionalidadRepo = null;
        public Repository<Funcionalidad> FuncionalidadRepo { get { if (this._FuncionalidadRepo == null) this._FuncionalidadRepo = new Repository<Funcionalidad>(this.context); return this._FuncionalidadRepo; } }
        private Repository<Permisos> _PermisosRepo = null;
        public Repository<Permisos> PermisosRepo { get { if (this._PermisosRepo == null) this._PermisosRepo = new Repository<Permisos>(this.context); return this._PermisosRepo; } }
        private Repository<UsuarioPermisos> _UsuarioPermisosRepo = null;
        public Repository<UsuarioPermisos> UsuarioPermisosRepo { get { if (this._UsuarioPermisosRepo == null) this._UsuarioPermisosRepo = new Repository<UsuarioPermisos>(this.context); return this._UsuarioPermisosRepo; } }
        private Repository<Log> _Log = null;
        public Repository<Log> Log { get { if (this._Log == null) this._Log = new Repository<Log>(this.context); return this._Log; } }

        private Repository<Sede> _SedeRepo = null;
        public Repository<Sede> SedeRepo { get { if (this._SedeRepo == null) this._SedeRepo = new Repository<Sede>(this.context); return this._SedeRepo; } }

        private Repository<Edificio> _EdificioRepo = null;
        public Repository<Edificio> EdificioRepo { get { if (this._EdificioRepo == null) this._EdificioRepo = new Repository<Edificio>(this.context); return this._EdificioRepo; } }

        private Repository<TipoServicio> _TipoServicioRepo = null;
        public Repository<TipoServicio> TipoServicioRepo { get { if (this._TipoServicioRepo == null) this._TipoServicioRepo = new Repository<TipoServicio>(this.context); return this._TipoServicioRepo; } }

        private Repository<Servicio> _ServicioRepo = null;
        public Repository<Servicio> ServicioRepo { get { if (this._ServicioRepo == null) this._ServicioRepo = new Repository<Servicio>(this.context); return this._ServicioRepo; } }

        private EvaluacionRepo _EvaluacionRepo = null;
        public EvaluacionRepo EvaluacionRepo { get { if (this._EvaluacionRepo == null) this._EvaluacionRepo = new EvaluacionRepo(this.context); return this._EvaluacionRepo; } }

        public UnitOfWork()
        {
            if (this.context == null)
                this.context = new BaseDbContext();
        }

        public UnitOfWork(DTOSessionUsuario _sess)
        {
            sess = _sess;
            if (this.context == null)
                this.context = new BaseDbContext();
        }

        public async Task Save()
        {
            try
            {
                await this.context.SaveChangesAsync(sess);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
                if (disposing)
                    context.Dispose();

            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
