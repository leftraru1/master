Imports System.Web.UI.WebControls

Public Class Validador

    Public Shared Function ValidaVacia(ByVal vDrp As DropDownList, ByVal vMensaje As String) As Boolean
        If vDrp.Items.Count = 0 Then
            vDrp.BorderColor = Drawing.Color.Red
            vDrp.ToolTip = vMensaje
            ValidaVacia = False
        Else
            vDrp.BorderColor = Drawing.Color.Empty
            vDrp.ToolTip = String.Empty
            ValidaVacia = True
        End If
    End Function

    Public Shared Function ValidaVacia(ByVal vCaja As TextBox, ByVal vMensaje As String) As Boolean
        If String.IsNullOrEmpty(vCaja.Text) Then
            vCaja.BorderColor = Drawing.Color.Red
            vCaja.ToolTip = vMensaje
            ValidaVacia = False
        Else
            LimpiarControl(vCaja, vCaja.Text)
            ValidaVacia = True
        End If
    End Function

    Public Shared Sub LimpiarControl(ByVal vTxt As TextBox, Optional ByVal vDefault As String = Nothing)
        vTxt.Text = vDefault
        vTxt.ToolTip = String.Empty
        vTxt.BorderColor = Drawing.Color.Empty
    End Sub

    Public Shared Sub LimpiarControl(ByVal vDrp As DropDownList)
        vDrp.SelectedIndex = -1
        vDrp.ToolTip = String.Empty
        vDrp.BorderColor = Drawing.Color.Empty
    End Sub

End Class
