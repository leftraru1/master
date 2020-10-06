Imports System.Web.UI.WebControls
Imports System.Web.UI
Imports System.ComponentModel

Namespace Seguridad

    <DefaultProperty("Ambientes"),
     ParseChildren(True, "Ambientes")>
    Public Class Login
        Inherits CompositeControl

        Private txtUser As TextBox
        Private txtPass As TextBox
        Private btnLogin As LinkButton
        Private btnCancelar As LinkButton
        Private imgLogo As Image
        Private drpAmbientes As DropDownList
        Private lblMensaje As Label

        Private lblPassExpired As Label
        Private txtNPass1 As TextBox
        Private txtNPass2 As TextBox

        Private vAmbientes As List(Of Ambiente)

        Public Property Usuario As Usuario
            Set(ByVal value As Usuario)
                ViewState("Usuario") = value
            End Set
            Get
                Usuario = ViewState("Usuario")
            End Get
        End Property

        Public Event IngresoValidado(ByVal sender As Object, ByVal user As Usuario)

        <Bindable(True),
         Category("QuellCode"),
         Description("URL de la imagen del logo. visible solo en modocambiopass=false.")>
        Public Property LogoImageURL As String
            Get
                EnsureChildControls()
                LogoImageURL = imgLogo.ImageUrl
            End Get
            Set(ByVal value As String)
                EnsureChildControls()
                imgLogo.ImageUrl = value
            End Set
        End Property

        <Bindable(True),
         Category("QuellCode"),
         Description("Clase CSS para la imagen del logo. visible solo en modocambiopass=false.")>
        Public Property LogoImageCssClass As String
            Get
                EnsureChildControls()
                LogoImageCssClass = imgLogo.CssClass
            End Get
            Set(ByVal value As String)
                EnsureChildControls()
                imgLogo.CssClass = value
            End Set
        End Property

        <Bindable(True),
         Category("QuellCode"),
         Description("Clase CSS para el boton de Aceptar.")>
        Public Property AceptarCssClass As String
            Get
                EnsureChildControls()
                AceptarCssClass = btnLogin.CssClass
            End Get
            Set(ByVal value As String)
                EnsureChildControls()
                btnLogin.CssClass = value
            End Set
        End Property

        <Bindable(True),
         Category("QuellCode"),
         Description("Clase CSS para el boton de Cancelar.")>
        Public Property CancelarCssClass As String
            Get
                EnsureChildControls()
                CancelarCssClass = btnCancelar.CssClass
            End Get
            Set(ByVal value As String)
                EnsureChildControls()
                btnCancelar.CssClass = value
            End Set
        End Property

        <Bindable(True),
         Category("QuellCode"),
         DefaultValue(False),
         Description("Permite ocultar el boton cancelar del control.")>
        Public Property CancelarDeshabilitado As Boolean
            Get
                EnsureChildControls()
                CancelarDeshabilitado = Not btnCancelar.Visible
            End Get
            Set(ByVal value As Boolean)
                EnsureChildControls()
                btnCancelar.Visible = Not value
            End Set
        End Property

        <Bindable(True),
         Category("QuellCode"),
         DefaultValue(False),
         Description("Permite mostrar un combo con los servidores disponibles establecidos en la propiedad Ambientes.")>
        Public Property UsarVariosAmbientes As Boolean
            Get
                UsarVariosAmbientes = ViewState("UsarVariosAmbientes")
            End Get
            Set(ByVal value As Boolean)
                ViewState("UsarVariosAmbientes") = value
            End Set
        End Property

        <Bindable(True),
         Category("QuellCode"),
         DefaultValue(False),
         Description("Permite mostrar el modo de cambio de password.")>
        Public Property ModoCambioPassword As Boolean
            Get
                EnsureChildControls()
                ModoCambioPassword = ViewState("ModoCambioPassword")
            End Get
            Set(ByVal value As Boolean)
                EnsureChildControls()
                ViewState("ModoCambioPassword") = value
                If value Then
                    btnCancelar.OnClientClick = ""
                Else
                    btnCancelar.OnClientClick = "window.close();"
                End If
            End Set
        End Property

        <Bindable(True),
         Category("QuellCode"),
         Description("Lista de los distintos servidores que se pueden acceder con la aplicación."),
         DesignerSerializationVisibility(DesignerSerializationVisibility.Content),
         Editor(GetType(AmbienteCollectionEditor), GetType(AmbienteCollectionEditor)), _
         PersistenceMode(PersistenceMode.InnerDefaultProperty)>
        Public ReadOnly Property Ambientes As List(Of Ambiente)
            Get
                If vAmbientes Is Nothing Then
                    vAmbientes = New List(Of Ambiente)
                End If
                Ambientes = vAmbientes
            End Get
        End Property

        <Bindable(True),
         Category("QuellCode"),
         Description("Establece el id del Sistema.")>
        Public Property IDSistema As Short
            Get
                IDSistema = ViewState("IDSistema")
            End Get
            Set(ByVal value As Short)
                ViewState("IDSistema") = value
            End Set
        End Property

        <Bindable(True),
         Category("QuellCode"),
         Description("Establece el id de la aplicación.")>
        Public Property IDAplicacion As Short
            Get
                IDAplicacion = ViewState("IDAplicacion")
            End Get
            Set(ByVal value As Short)
                ViewState("IDAplicacion") = value
            End Set
        End Property


        Protected Overrides Sub CreateChildControls()
            'Las propiedades por defecto.
            'UsarVariosAmbientes = False

            'Logo de login
            imgLogo = New Image
            imgLogo.ID = "imgLogo"
            Controls.Add(imgLogo)

            'Boton Aceptar
            btnLogin = New LinkButton
            With btnLogin
                .ID = "btnLogin"
                'Eventos
                AddHandler .Click, AddressOf Ingresar
            End With
            Controls.Add(btnLogin)

            'Boton cancelar
            btnCancelar = New LinkButton
            With btnCancelar
                .ID = "btnCancelar"
                .OnClientClick = "window.close();"
                'Eventos
                AddHandler .Click, AddressOf Cancelar
            End With
            Controls.Add(btnCancelar)
            'Propiedad dependiente del boton
            CancelarDeshabilitado = False


            'nombre del usuario
            txtUser = New TextBox()
            With txtUser
                .ID = "txtUser"
                .Width = Unit.Percentage(90)
            End With
            Controls.Add(txtUser)

            'clave del usuario
            txtPass = New TextBox()
            With txtPass
                .ID = "txtPass"
                .TextMode = TextBoxMode.Password
                .Width = Unit.Percentage(90)
                '.Attributes.Add("onkeypress", "if (e.keyCode == 13) {__doPostBack('" & btnLogin.ClientID & "', '');}")
                '.Attributes.Add("onkeypress", "checkKey(event);")
                .Attributes.Add("onkeypress", "if (event.keyCode == 13) {__doPostBack('" & btnLogin.ClientID.Replace("_", "$") & "', '');}")
            End With
            Controls.Add(txtPass)
            '  AddHandler .Click, AddressOf Ingresar



            'Ambientes
            drpAmbientes = New DropDownList
            With drpAmbientes
                .ID = "drpAmbientes"
                .Width = Unit.Percentage(90)
            End With
            Controls.Add(drpAmbientes)

            lblMensaje = New Label
            With lblMensaje
                .ID = "lblMensaje"
                .ForeColor = Drawing.Color.Red
                .Font.Italic = True
                .Visible = False
            End With
            Controls.Add(lblMensaje)

            



            'Label Password Expired
            lblPassExpired = New Label
            With lblPassExpired
                .ID = "lblPassExpired"
                .Visible = True
            End With
            Controls.Add(lblPassExpired)

            'Para el cambio de password
            txtNPass1 = New TextBox()
            With txtNPass1
                .ID = "txtNPass1"
                .TextMode = TextBoxMode.Password
                .Width = Unit.Percentage(100)
            End With
            Controls.Add(txtNPass1)

            txtNPass2 = New TextBox()
            With txtNPass2
                .ID = "txtNPass2"
                .TextMode = TextBoxMode.Password
                .Width = Unit.Percentage(100)
            End With
            Controls.Add(txtNPass2)

        End Sub





        Protected Overrides Sub RenderContents(ByVal writer As HtmlTextWriter)
            If ModoCambioPassword Then
                'fila
                writer.RenderBeginTag(HtmlTextWriterTag.Tr)
                writer.AddAttribute(HtmlTextWriterAttribute.Colspan, "2")
                writer.RenderBeginTag(HtmlTextWriterTag.Td)
                lblPassExpired.RenderControl(writer)
                writer.RenderEndTag() 'fin td
                writer.RenderEndTag() 'fin primera fila

                'Segunda Fila
                writer.RenderBeginTag(HtmlTextWriterTag.Tr)
                writer.RenderBeginTag(HtmlTextWriterTag.Td)
                writer.Write("Nueva Contraseña")
                writer.RenderEndTag() 'fin td
                writer.RenderBeginTag(HtmlTextWriterTag.Td)
                txtNPass1.RenderControl(writer)
                writer.RenderEndTag() 'fin td
                writer.RenderEndTag() 'fin Segunda fila


                'Tercera Fila
                writer.RenderBeginTag(HtmlTextWriterTag.Tr)
                writer.RenderBeginTag(HtmlTextWriterTag.Td)
                writer.Write("Repetir Contraseña")
                writer.RenderEndTag() 'fin td
                writer.RenderBeginTag(HtmlTextWriterTag.Td)
                txtNPass2.RenderControl(writer)
                writer.RenderEndTag() 'fin td
                writer.RenderEndTag() 'fin Tercera fila

            Else
                writer.RenderBeginTag(HtmlTextWriterTag.Tr) 'fila

                'El Logo
                writer.AddAttribute(HtmlTextWriterAttribute.Rowspan, "3")
                writer.RenderBeginTag(HtmlTextWriterTag.Td) 'en esta va la imagen

                
                If Not String.IsNullOrEmpty(LogoImageURL) Then
                    imgLogo.RenderControl(writer)
                End If
                writer.RenderEndTag()

                'La etiqueta nombre de usuario
                writer.RenderBeginTag(HtmlTextWriterTag.Td)
                'clausula for del hml de la etiqueta label
                writer.AddAttribute(HtmlTextWriterAttribute.For, txtUser.ID)
                writer.RenderBeginTag(HtmlTextWriterTag.Label)
                writer.Write("Usuario")
                writer.RenderEndTag() 'finaliza tag html label
                writer.RenderEndTag() 'finaliza tag html td
                'segunda columna aca se captara el nombre del usuario

                writer.AddAttribute(HtmlTextWriterAttribute.Style, "width:200px")
                writer.RenderBeginTag(HtmlTextWriterTag.Td)
                txtUser.RenderControl(writer) 'mostrar el control de texto
                writer.RenderEndTag()
                writer.RenderEndTag() 'fin de la primera fila

                'segunda fila de la tabla aca se mostrara la clave del usuario
                writer.RenderBeginTag(HtmlTextWriterTag.Tr)
                'clave del usuario
                writer.RenderBeginTag(HtmlTextWriterTag.Td)
                writer.AddAttribute(HtmlTextWriterAttribute.For, txtPass.ID)
                writer.RenderBeginTag(HtmlTextWriterTag.Label)
                writer.Write("Password")
                writer.RenderEndTag()
                writer.RenderEndTag()
                'captar clave del usuario
                writer.RenderBeginTag(HtmlTextWriterTag.Td)
                txtPass.RenderControl(writer)
                writer.RenderEndTag()
                writer.RenderEndTag() 'fin de la segunda fila

                'tercera fila de la tabla para el combo de seleccion de ambiente. si corresponde.
                writer.RenderBeginTag(HtmlTextWriterTag.Tr)
                'Servidor
                writer.RenderBeginTag(HtmlTextWriterTag.Td)
                writer.AddAttribute(HtmlTextWriterAttribute.For, drpAmbientes.ID)
                writer.RenderBeginTag(HtmlTextWriterTag.Label)
                If UsarVariosAmbientes Then
                    writer.Write("Servidor")
                Else
                    writer.Write("&nbsp;")
                End If
                writer.RenderEndTag()
                writer.RenderEndTag()
                'Combo de servidores
                writer.RenderBeginTag(HtmlTextWriterTag.Td)
                If UsarVariosAmbientes Then
                    drpAmbientes.DataSource = Ambientes
                    drpAmbientes.DataTextField = "Descripcion"
                    drpAmbientes.DataValueField = "Server"
                    drpAmbientes.DataBind()
                    drpAmbientes.RenderControl(writer)
                Else
                    writer.Write("&nbsp;")
                End If
                writer.RenderEndTag()
                writer.RenderEndTag() 'fin de la tercera fila

                'Cuarta fila. espacio solamente, o por ahora.
                writer.RenderBeginTag(HtmlTextWriterTag.Tr)
                writer.AddAttribute(HtmlTextWriterAttribute.Colspan, "3")
                writer.RenderBeginTag(HtmlTextWriterTag.Td)
                writer.Write("&nbsp;")
                writer.RenderEndTag()
                writer.RenderEndTag()
            End If

            'Quinta Fila. Mensajes
            writer.RenderBeginTag(HtmlTextWriterTag.Tr)
            writer.AddAttribute(HtmlTextWriterAttribute.Colspan, "3")
            writer.AddAttribute(HtmlTextWriterAttribute.Style, "text-align:center;")
            writer.RenderBeginTag(HtmlTextWriterTag.Td)
            lblMensaje.RenderControl(writer)
            writer.RenderEndTag()
            writer.RenderEndTag()

            'fila de la tabla para los botones
            writer.RenderBeginTag(HtmlTextWriterTag.Tr)
            writer.AddAttribute(HtmlTextWriterAttribute.Colspan, "3")
            writer.AddAttribute(HtmlTextWriterAttribute.Style, "text-align:right;padding:10px 0;")
            writer.RenderBeginTag(HtmlTextWriterTag.Td)

            'Aqui ponemos los botones
            btnLogin.RenderControl(writer)
            btnCancelar.RenderControl(writer)

            writer.RenderEndTag()
            writer.RenderEndTag() 'fin de la ultima fila

        End Sub

        Protected Overrides ReadOnly Property TagKey As HtmlTextWriterTag
            Get
                TagKey = HtmlTextWriterTag.Table
            End Get
        End Property

        Private Function ValidarLogin() As Boolean
            ValidarLogin = True

            ValidarLogin = ValidarLogin And Validador.ValidaVacia(txtUser, "Debe proveer un nombre de usuario.")
            ValidarLogin = ValidarLogin And Validador.ValidaVacia(txtPass, "Debe proveer una contraseña.")

        End Function

        Private Function ValidaCambioPass() As Boolean
            ValidaCambioPass = True

            ValidaCambioPass = ValidaCambioPass And Validador.ValidaVacia(txtNPass1, "Debe proveer una contraseña nueva.")
            ValidaCambioPass = ValidaCambioPass And Validador.ValidaVacia(txtNPass2, "La contraseña debe coincidir.")

            If ValidaCambioPass Then
                If txtNPass1.Text <> txtNPass2.Text Then
                    txtNPass2.BorderColor = Drawing.Color.Red
                    txtNPass2.ToolTip = "La contraseña debe coincidir."
                Else
                    Validador.LimpiarControl(txtNPass2)
                End If
            End If
        End Function

        Private Sub Ingresar(ByVal sender As Object, ByVal e As EventArgs)
            If ModoCambioPassword Then
                If ValidaCambioPass() Then
                    'Debemos guardar el cambio de contraseña
                    Try
                        Usuario.CambiarPassword(Usuario, txtNPass1.Text)
                    Catch ex As Exception
                        lblMensaje.Visible = True
                        lblMensaje.Text = ex.Message
                    End Try
                End If
            Else
                If ValidarLogin() Then
                    Try
                        If UsarVariosAmbientes Then
                            If drpAmbientes.SelectedIndex = -1 Then
                                Usuario = New Usuario(txtUser.Text, txtPass.Text, Ambientes(0))
                            Else
                                Usuario = New Usuario(txtUser.Text, txtPass.Text, Ambientes(drpAmbientes.SelectedIndex))
                            End If
                        Else
                            Usuario = New Usuario(txtUser.Text, txtPass.Text)
                        End If
                    Catch ex As Exception
                        lblMensaje.Visible = True
                        lblMensaje.Text = ex.Message
                    End Try
                    If Usuario IsNot Nothing Then
                        'Establecemos si es contabilidad    
                        Usuario.IdAplicacion = IDAplicacion
                        Select Case Usuario.EstadoUsuario
                            Case EstadoUsuario.Logeado
                                RaiseEvent IngresoValidado(Me, Usuario)
                            Case EstadoUsuario.NoLogeado
                                lblMensaje.Visible = True
                                lblMensaje.Text = "Ingreso no válido."
                            Case EstadoUsuario.PassExpirado
                                'En este caso debemos pedir que cambie el password.
                                ModoCambioPassword = True
                        End Select
                    End If
                End If
            End If
        End Sub

        Private Sub Cancelar(ByVal sender As Object, ByVal e As EventArgs)
            If ModoCambioPassword Then
                If Not CancelarDeshabilitado Then
                    'Tenemos que volver a modo login
                    ModoCambioPassword = False
                End If
            End If
        End Sub

    End Class

End Namespace
