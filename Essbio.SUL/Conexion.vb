Imports Devart.Data.Oracle

Public Class Conexion

    Public ReadOnly Property Conexion As OracleConnection
        Get
            Conexion = _Con

        End Get

    End Property

    Private _ConnectionString As String
    Private _Con As OracleConnection
    Private _Tran As OracleTransaction
    Private vTranInterna As Boolean
    Private vNivelRecursivo As Integer
    Private Const TimeoutConexion As Integer = 90
    Private vUser As Seguridad.Usuario

    ''' <summary>
    ''' Constructor de la conexion.
    ''' </summary>
    ''' <remarks></remarks>
    Public Sub New(ByVal vUsuario As Seguridad.Usuario)
        If vUsuario Is Nothing Then
            Throw New Exception("No se puede crear la conexión porque no se ha provisto una cadena de conexión válida.")
        Else
            vUser = vUsuario
            _Con = New OracleConnection(vUser.StringConexion)
            vNivelRecursivo = 0
        End If
    End Sub

    Protected Overloads Overrides Sub Finalize()
        If _Tran IsNot Nothing Then 'como hay transaccion
            If _Con.State = Data.ConnectionState.Open Then
                Deshacer()
            Else
                _Tran = Nothing
            End If
        End If
        If _Con IsNot Nothing AndAlso _Con.State = System.Data.ConnectionState.Open Then
            Try
                _Con.Close()
                _Con.Dispose()
                _Con = Nothing
            Catch ex As Exception

            End Try
        End If
    End Sub

    ''' <summary>
    ''' Ejecuta funcion que retorna numero con parametros de entrada sin parametros de salida.
    ''' </summary>
    ''' <param name="vProcAlmacenado"></param>
    ''' <param name="vParaMetros"></param>
    ''' <param name="vTimeoutConexion"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Function ExecNumber(ByVal vProcAlmacenado As String, _
                               Optional ByVal vParaMetros As Dictionary(Of String, Object) = Nothing, _
                               Optional ByVal vTimeoutConexion As Integer = TimeoutConexion,
                               Optional ByRef vPErrMsg As String = Nothing) As Decimal
        Dim cmdTmp As OracleCommand

        cmdTmp = New OracleCommand(vProcAlmacenado)
        cmdTmp.ParameterCheck = True
        cmdTmp.CommandType = System.Data.CommandType.StoredProcedure
        cmdTmp.Connection = _Con

        'Aqui abriremos la conexion. Cuando vNivelRecursivo  es cero es porque esta es la ejecucion que se nos ordenó.
        'Toda ejecucion extra es nuestra, ya que somos nosotros los que necesitamos hacerla,
        'y como usaremos la misma funcion para ejecutar, revisaremos tambien el nivel de recursividad para evitar 
        'cerrar la conexion a la base de datos y asi mantener la transacción.
        'Así, la vez que nos solicitan ejecutar el procedimiento SP_X por ejemplo
        'tendremos un nivel de llamada recursiva, luego al asignar el rol tendremos un nivel=2.
        vNivelRecursivo += 1

        If _Tran Is Nothing Then
            IniciarTransaccion(True)
        End If
        cmdTmp.Transaction = _Tran
        cmdTmp.CommandTimeout = vTimeoutConexion
        Try
            'OracleCommandBuilder.DeriveParameters(cmdTmp)
            cmdTmp.Prepare()
        Catch ex As Exception
            Deshacer()
            Throw New Exception("No se pudo obtener informacion del procedimiento almacenado. Nombre SP: " & vProcAlmacenado, ex)
        End Try

        If vParaMetros IsNot Nothing Then
            'tenemos argumentos que preparar para el sp.
            For Each vClave As String In vParaMetros.Keys
                Dim vClaveMay As String
                vClaveMay = vClave.ToUpper
                If cmdTmp.Parameters(vClaveMay).Direction = Data.ParameterDirection.Input Or
                   cmdTmp.Parameters(vClaveMay).Direction = Data.ParameterDirection.InputOutput Then _
                    cmdTmp.Parameters(vClaveMay).Value = vParaMetros(vClave)
            Next
        End If

        Try
            cmdTmp.ExecuteNonQuery()
            ExecNumber = cmdTmp.Parameters("RESULT").Value()

            'Procesaremos todos los parametros que sean de salida.
            For Each vParam As OracleParameter In cmdTmp.Parameters
                If vParam.Direction = Data.ParameterDirection.Output Or
                   vParam.Direction = Data.ParameterDirection.InputOutput Then
                    If vParaMetros.ContainsKey(vParam.ParameterName) Then
                        vParaMetros(vParam.ParameterName) = vParam.Value
                    End If
                End If
            Next

            'Esto procesa el mensaje de Salida 
            If Not String.IsNullOrEmpty(vPErrMsg) Then
                'Estamos preguntando por el valor de retorno de este parametro
                If String.IsNullOrEmpty(cmdTmp.Parameters(vPErrMsg).Value.ToString) _
                OrElse cmdTmp.Parameters(vPErrMsg).Value.ToString.ToUpper = "NULL" Then
                    vPErrMsg = String.Empty
                Else
                    vPErrMsg = cmdTmp.Parameters(vPErrMsg).Value.ToString
                End If
                'else no importa ya que no nos pidieron perguntar por él.
            End If

            'En este punto realizaremos el commit solo y solo si estamos en el nivel uno de recursividad.
            If vTranInterna And vNivelRecursivo = 1 Then Confirmar()
            'Luego disminuiremos un nivel de recursividad antes de retornar
            vNivelRecursivo -= 1
        Catch ex As Exception
            Deshacer()
            Throw New ApplicationException("No se pudo realizar la operacion.", ex)
        End Try
    End Function

    Public Function Ejecutar(ByVal vProcAlmacenado As String, _
                             Optional ByVal vParaMetros As Dictionary(Of String, Object) = Nothing, _
                             Optional ByVal vTimeoutConexion As Integer = TimeoutConexion,
                             Optional ByRef vPErrMsg As String = Nothing,
                             Optional ByVal vEsProcedimiento As Boolean = True) As System.Data.DataTable
        Dim cmdTmp As OracleCommand
        Dim dt As New System.Data.DataTable

        cmdTmp = New OracleCommand(vProcAlmacenado)
        cmdTmp.Connection = _Con

        'Aqui abriremos la conexion. Cuando vNivelRecursivo  es cero es porque esta es la ejecucion que se nos ordenó.
        'Toda ejecucion extra es nuestra, ya que somos nosotros los que necesitamos hacerla,
        'y como usaremos la misma funcion para ejecutar, revisaremos tambien el nivel de recursividad para evitar 
        'cerrar la conexion a la base de datos y asi mantener la transacción.
        'Así, la vez que nos solicitan ejecutar el procedimiento SP_X por ejemplo
        'tendremos un nivel de llamada recursiva, luego al asignar el rol tendremos un nivel=2.
        vNivelRecursivo += 1

        If _Tran Is Nothing Then
            IniciarTransaccion(True)
        End If
        cmdTmp.Transaction = _Tran
        cmdTmp.CommandTimeout = vTimeoutConexion

        If vEsProcedimiento Then
            cmdTmp.ParameterCheck = True
            cmdTmp.CommandType = System.Data.CommandType.StoredProcedure
            Try
                OracleCommandBuilder.DeriveParameters(cmdTmp)
                'cmdTmp.Prepare()
            Catch ex As Exception
                Deshacer()
                Throw New Exception(String.Format("No se pudo obtener informacion del procedimiento almacenado. Nombre SP: {0}.:::.{1}",
                                                  vProcAlmacenado,
                                                  ex.Message),
                                    ex)
            End Try

            If vParaMetros IsNot Nothing Then
                'tenemos argumentos que preparar para el sp.
                For Each vClave As String In vParaMetros.Keys
                    If cmdTmp.Parameters(vClave).Direction = Data.ParameterDirection.Input Or
                       cmdTmp.Parameters(vClave).Direction = Data.ParameterDirection.InputOutput Then _
                        cmdTmp.Parameters(vClave).Value = vParaMetros(vClave)
                Next
            End If
        Else
            cmdTmp.CommandType = System.Data.CommandType.Text
        End If

        Try
            Dim dtd As New OracleDataAdapter(cmdTmp)
            dtd.Fill(dt)

            'Procesaremos todos los parametros que sean de salida.
            For Each vParam As OracleParameter In cmdTmp.Parameters
                If vParam.Direction = Data.ParameterDirection.Output Or
                   vParam.Direction = Data.ParameterDirection.InputOutput Then
                    If vParaMetros.ContainsKey(vParam.ParameterName) Then
                        vParaMetros(vParam.ParameterName) = vParam.Value
                    End If
                End If
            Next

            'Esto procesa el mensaje de Salida 
            If Not String.IsNullOrEmpty(vPErrMsg) Then
                'Estamos preguntando por el valor de retorno de este parametro
                If String.IsNullOrEmpty(cmdTmp.Parameters(vPErrMsg).Value.ToString) _
                OrElse cmdTmp.Parameters(vPErrMsg).Value.ToString.ToUpper = "NULL" Then
                    vPErrMsg = String.Empty
                Else
                    vPErrMsg = cmdTmp.Parameters(vPErrMsg).Value.ToString
                End If
                'else no importa ya que no nos pidieron perguntar por él.
            End If

            'En este punto realizaremos el commit solo y solo si estamos en el nivel uno de recursividad.
            If vTranInterna And vNivelRecursivo = 1 Then Confirmar()
            'Luego disminuiremos un nivel de recursividad antes de retornar
            vNivelRecursivo -= 1

            Return dt
        Catch ex As Exception
            Deshacer()
            Throw New ApplicationException("Error al ejecutar " & vProcAlmacenado & ". " & ex.Message, ex)
        End Try
    End Function

    Public Sub IniciarTransaccion(Optional ByVal vTransaccionInterna As Boolean = False)
        _Con.Open() 'Abrimos la conexion, importante que no se cierre hasta despues del commit o del rollback.
        _Tran = _Con.BeginTransaction(System.Data.IsolationLevel.ReadCommitted)
        vTranInterna = vTransaccionInterna

        If vUser IsNot Nothing AndAlso Not String.IsNullOrEmpty(vUser.Rol) Then
            Ejecutar("SET ROLE " & vUser.Rol & " IDENTIFIED BY " & vUser.ClaveRol, vEsProcedimiento:=False)
        End If
    End Sub

    Public Sub Deshacer()
        Try
            _Tran.Rollback()
            _Con.Close()
        Catch ex As Exception
            'algo salio mal, filo por ahora.
            'Es probable que se haya realizado ya la llamda a esta rutina por
            'lo que el rollback y el close ya se realizaron.
        Finally
            _Tran = Nothing
        End Try
    End Sub

    Public Sub Confirmar()
        Try
            _Tran.Commit()
            _Con.Close()
        Catch ex As Exception
            'Algo salio mal.
            If _Con.State <> Data.ConnectionState.Closed Then
                _Con.Close()
            End If
        Finally
            _Tran = Nothing
        End Try
    End Sub

End Class
