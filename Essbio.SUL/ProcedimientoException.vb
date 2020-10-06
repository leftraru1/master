

Public Class ProcedimientoException
    Inherits Exception

    Public Property Procedimiento As String
    Public Property Parametros As Dictionary(Of String, Object)
    Public Property StringConexion As String

    Public Sub New(Optional vMensaje As String = Nothing,
                   Optional vInner As Exception = Nothing,
                   Optional vProcedimiento As String = Nothing,
                   Optional vParametros As Dictionary(Of String, Object) = Nothing,
                   Optional vStrConexion As String = Nothing)
        MyBase.New(vMensaje, vInner)
        Procedimiento = vProcedimiento
        Parametros = vParametros
        StringConexion = vStrConexion
    End Sub

End Class
