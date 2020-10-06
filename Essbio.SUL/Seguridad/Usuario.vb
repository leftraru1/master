Imports System.Data
Imports Devart.Data.Oracle
Namespace Seguridad

    Public Enum EstadoUsuario
        NoLogeado = 0
        Logeado = 1
        PassExpirado = 2
    End Enum

    Public Class Usuario

        Public Property IdAplicacion As Short
            Get
                Return _idAplicacion
            End Get
            Set(ByVal value As Short)
                _idAplicacion = value
            End Set
        End Property
        Private StringConexionBuilder As OracleConnectionStringBuilder

        Public Property StringConexion As String
        Public Property Usuario As String
        Public Property Clave As String
        Public Property AmbienteSeleted As String

        Private _idAplicacion As Short
        Private vEstado As EstadoUsuario
        Public P_ID_USUARIO As Integer
        Public P_DIAS_EXPIRACION As Integer
        Public P_MSJ_EXPIRACION As String
        Public P_HOST_SMTP As String
        Public P_NOMBRE_ROL As String
        Public P_CLAVE_ROL As String

        Sub New()
            Dim oraCSB As New Devart.Data.Oracle.OracleConnectionStringBuilder
            oraCSB.Direct = True
            oraCSB.Server = Web.Configuration.WebConfigurationManager.AppSettings("ServidorBD")
            oraCSB.Port = Web.Configuration.WebConfigurationManager.AppSettings("PuertoBD")
            oraCSB.Sid = Web.Configuration.WebConfigurationManager.AppSettings("SIDBD")
            oraCSB.MaxPoolSize = 150
            oraCSB.ConnectionTimeout = 30

            StringConexionBuilder = oraCSB
        End Sub
        Public ReadOnly Property EsContabilidad As Boolean            'BuscaPermiso  114
            Get
                EsContabilidad = BuscaPermiso(Me, 114, _idAplicacion)
            End Get
        End Property


        Public ReadOnly Property EstadoUsuario As EstadoUsuario
            Get
                EstadoUsuario = vEstado
            End Get
        End Property

        Public ReadOnly Property ID As Integer
            Get
                ID = P_ID_USUARIO
            End Get
        End Property

        Public ReadOnly Property DiasExpiracion As Integer
            Get
                DiasExpiracion = P_DIAS_EXPIRACION
            End Get
        End Property

        Public ReadOnly Property MensajeExpiracion As String
            Get
                MensajeExpiracion = P_MSJ_EXPIRACION
            End Get
        End Property

        Public ReadOnly Property HostSMTP As String
            Get
                HostSMTP = P_HOST_SMTP
            End Get
        End Property

        Public ReadOnly Property Rol As String
            Get
                Rol = P_NOMBRE_ROL
            End Get
        End Property

        Public ReadOnly Property ClaveRol As String
            Get
                ClaveRol = P_CLAVE_ROL
            End Get
        End Property

        Public Sub New(ByVal vUser As String, ByVal vPass As String, Optional ByVal vAmbiente As Ambiente = Nothing)
            Me.New()

            'Tenemos que crear el string de conexion primero
            StringConexionBuilder.UserId = vUser
            Usuario = vUser
            StringConexionBuilder.Password = vPass

            If vAmbiente IsNot Nothing Then
                StringConexionBuilder.Server = vAmbiente.Server
                StringConexionBuilder.Port = vAmbiente.Puerto
                StringConexionBuilder.Sid = vAmbiente.SID
                StringConexionBuilder.Pooling = False
                AmbienteSeleted = vAmbiente.Descripcion
            Else
                AmbienteSeleted = Web.Configuration.WebConfigurationManager.AppSettings("Ambiente")
            End If

            StringConexionBuilder.ServiceName = String.Empty

            StringConexion = StringConexionBuilder.ConnectionString

            'Ahora veremos si podemos ingresar.
            Dim vCon As New Conexion(Me)

            Try
                vCon.IniciarTransaccion()
            Catch ex As Exception
                Throw New Exception("No se pudo conectar a la base de datos.<br/>" & ex.Message)
            End Try

            Dim vParam As New Dictionary(Of String, Object)
            With vParam
                .Add("P_APLICACION", Web.Configuration.WebConfigurationManager.AppSettings("IdAplicacion"))
                .Add("P_USUARIO_RED", "") 'IN VARCHAR2,
                .Add("P_USUARIO_SISTEMA", vUser)

                .Add("P_ID_USUARIO", 0) 'OUT NUMBER,
                .Add("P_DIAS_EXPIRACION", 0) 'OUT NUMBER,
                .Add("P_HOST_SMTP", "") 'OUT VARCHAR2,
                .Add("P_MSJ_EXPIRACION", "") 'OUT VARCHAR2,
                .Add("P_NOMBRE_ROL", "") 'OUT VARCHAR2,
                .Add("P_CLAVE_ROL", "") 'OUT VARCHAR2,
            End With

            Try
                Dim vResp As Integer
                vResp = vCon.ExecNumber("SA.FX_CONECTAR", vParam)

                vEstado = vResp
                Select Case vEstado
                    Case EstadoUsuario.NoLogeado 'No pudo ingresar

                    Case EstadoUsuario.Logeado 'Acceso Correcto
                        P_NOMBRE_ROL = vParam("P_NOMBRE_ROL")
                        P_CLAVE_ROL = vParam("P_CLAVE_ROL")

                        P_ID_USUARIO = vParam("P_ID_USUARIO")
                        P_DIAS_EXPIRACION = vParam("P_DIAS_EXPIRACION")
                        P_HOST_SMTP = vParam("P_HOST_SMTP")

                    Case (EstadoUsuario.PassExpirado) 'Clave Expirada
                        P_MSJ_EXPIRACION = vParam("P_MSJ_EXPIRACION")
                End Select

                vCon.Confirmar()
            Catch ex As Exception
                Throw New Exception("No se pudo validar el inicio de sesión.<br/>" & ex.Message, ex)
            End Try
        End Sub

        Public Shared Sub CambiarPassword(ByVal vUser As Usuario, ByVal vNuevaPassword As String)
            Dim vCon As New Conexion(vUser)
            Dim vParam As New Dictionary(Of String, Object)
            'p_usuario varchar2, varchar2, result

            vParam.Add("RESULT", "") 'De salida
            vParam.Add("p_usuario", vUser.Usuario)
            vParam.Add("p_contrasena", vNuevaPassword)
            Try
                vCon.Ejecutar("SA.FX_CAMBIA_CONTRASENA_BACK", vParam)
            Catch ex As Exception
                Throw ex
            End Try

            If Not String.IsNullOrEmpty(vParam("RESULT")) Then
                'En este caso tenemos que procesar como si fuera un error
                Throw New Exception(vParam("RESULT"))
            End If

        End Sub

        Public Shared Function BuscaPermiso(ByVal vUser As Usuario,
                                            ByVal vNroPermiso As Integer,
                                            ByVal vNroAplicacion As Short) As Boolean
            Dim vCon As New Conexion(vUser)
            Dim vParam As New Dictionary(Of String, Object)
            vParam.Add("p_id_usuario", vUser.ID)
            vParam.Add("p_id_aplicacion", vNroAplicacion)
            vParam.Add("p_codigo", vNroPermiso)
            Try
                BuscaPermiso = vCon.ExecNumber("SA.FX_BUSCA_PERMISO", vParam) > 0
            Catch ex As Exception
                Throw New Exception("No se pudo realizar la búsqueda de permisos.", ex)
            End Try
        End Function

        Public Shared Function BuscaPermiso(ByVal vUser As Usuario,
                                            ByVal vNroAplicacion As Short) As DataTable
            Dim vCon As New Conexion(vUser)
            Dim vParam As New Dictionary(Of String, Object)
            vParam.Add("p_id_usuario", vUser.ID)
            vParam.Add("p_id_aplicacion", vNroAplicacion)
            Try
                BuscaPermiso = vCon.Ejecutar("SA.FX_BUSCA_PERMISO_USER", vParam)
            Catch ex As Exception
                Throw New Exception("No se pudo realizar la búsqueda de permisos.", ex)
            End Try
        End Function
    End Class

End Namespace
