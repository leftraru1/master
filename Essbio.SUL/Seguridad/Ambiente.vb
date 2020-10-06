Imports System.ComponentModel


Namespace Seguridad

    <TypeConverter(GetType(ExpandableObjectConverter))>
    Public Class Ambiente

        Public Sub New()
            Me.New(String.Empty, String.Empty, 1521, String.Empty)
        End Sub

        Public Sub New(ByVal vDe As String, ByVal vSe As String, ByVal vPu As Integer, ByVal vSi As String)
            Descripcion = vDe
            Server = vSe
            Puerto = vPu
            SID = vSi
        End Sub

        <Category("QuellCode"),
         DefaultValue(""),
         Description("Texto que se mostrará en el combo"),
         NotifyParentProperty(True)>
        Public Property Descripcion As String

        <Category("Behavior"),
         DefaultValue(""),
         Description("Servidor al que se contectará. Puede ser una IP o bien un nombre de servidor."),
         NotifyParentProperty(True)>
        Public Property Server As String

        <Category("Behavior"),
         DefaultValue(1521),
         Description("Nro del puerto por el que se conectará"),
         NotifyParentProperty(True)>
        Public Property Puerto As Integer

        <Category("Behavior"),
         DefaultValue(""),
         Description("SID de la base de datos."),
         NotifyParentProperty(True)>
        Public Property SID As String

    End Class

End Namespace
