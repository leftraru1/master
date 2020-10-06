namespace GenKeys
{
    partial class GenKey
    {
        /// <summary>
        /// Variable del diseñador requerida.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Limpiar los recursos que se estén utilizando.
        /// </summary>
        /// <param name="disposing">true si los recursos administrados se deben eliminar; false en caso contrario, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Código generado por el Diseñador de Windows Forms

        /// <summary>
        /// Método necesario para admitir el Diseñador. No se puede modificar
        /// el contenido del método con el editor de código.
        /// </summary>
        private void InitializeComponent()
        {
            this.btnGenerar = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.txtUsuarioInternetDes = new System.Windows.Forms.TextBox();
            this.txtClaveUsuFTPDes = new System.Windows.Forms.TextBox();
            this.txtUsuarioFTPDes = new System.Windows.Forms.TextBox();
            this.txtPasswordDes = new System.Windows.Forms.TextBox();
            this.txtUsuarioInternetEnc = new System.Windows.Forms.TextBox();
            this.txtPasswordEnc = new System.Windows.Forms.TextBox();
            this.txtUsuarioFTPEnc = new System.Windows.Forms.TextBox();
            this.txtClaveUsuFTPEnc = new System.Windows.Forms.TextBox();
            this.button1 = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // btnGenerar
            // 
            this.btnGenerar.Location = new System.Drawing.Point(318, 233);
            this.btnGenerar.Name = "btnGenerar";
            this.btnGenerar.Size = new System.Drawing.Size(88, 37);
            this.btnGenerar.TabIndex = 0;
            this.btnGenerar.Text = "Encriptar";
            this.btnGenerar.UseVisualStyleBackColor = true;
            this.btnGenerar.Click += new System.EventHandler(this.btnGenerar_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(12, 39);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(82, 13);
            this.label1.TabIndex = 1;
            this.label1.Text = "Usuario Internet";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(12, 87);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(92, 13);
            this.label2.TabIndex = 2;
            this.label2.Text = "Password Internet";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(12, 139);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(66, 13);
            this.label3.TabIndex = 3;
            this.label3.Text = "Usuario FTP";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(12, 191);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(96, 13);
            this.label4.TabIndex = 4;
            this.label4.Text = "Clave Usuario FTP";
            // 
            // txtUsuarioInternetDes
            // 
            this.txtUsuarioInternetDes.Location = new System.Drawing.Point(15, 55);
            this.txtUsuarioInternetDes.Name = "txtUsuarioInternetDes";
            this.txtUsuarioInternetDes.Size = new System.Drawing.Size(240, 20);
            this.txtUsuarioInternetDes.TabIndex = 5;
            // 
            // txtClaveUsuFTPDes
            // 
            this.txtClaveUsuFTPDes.Location = new System.Drawing.Point(15, 207);
            this.txtClaveUsuFTPDes.Name = "txtClaveUsuFTPDes";
            this.txtClaveUsuFTPDes.Size = new System.Drawing.Size(240, 20);
            this.txtClaveUsuFTPDes.TabIndex = 6;
            // 
            // txtUsuarioFTPDes
            // 
            this.txtUsuarioFTPDes.Location = new System.Drawing.Point(15, 155);
            this.txtUsuarioFTPDes.Name = "txtUsuarioFTPDes";
            this.txtUsuarioFTPDes.Size = new System.Drawing.Size(240, 20);
            this.txtUsuarioFTPDes.TabIndex = 7;
            // 
            // txtPasswordDes
            // 
            this.txtPasswordDes.Location = new System.Drawing.Point(15, 103);
            this.txtPasswordDes.Name = "txtPasswordDes";
            this.txtPasswordDes.Size = new System.Drawing.Size(240, 20);
            this.txtPasswordDes.TabIndex = 8;
            // 
            // txtUsuarioInternetEnc
            // 
            this.txtUsuarioInternetEnc.BackColor = System.Drawing.Color.Gainsboro;
            this.txtUsuarioInternetEnc.Location = new System.Drawing.Point(261, 55);
            this.txtUsuarioInternetEnc.Name = "txtUsuarioInternetEnc";
            this.txtUsuarioInternetEnc.ReadOnly = true;
            this.txtUsuarioInternetEnc.Size = new System.Drawing.Size(240, 20);
            this.txtUsuarioInternetEnc.TabIndex = 9;
            // 
            // txtPasswordEnc
            // 
            this.txtPasswordEnc.BackColor = System.Drawing.Color.Gainsboro;
            this.txtPasswordEnc.Location = new System.Drawing.Point(261, 103);
            this.txtPasswordEnc.Name = "txtPasswordEnc";
            this.txtPasswordEnc.ReadOnly = true;
            this.txtPasswordEnc.Size = new System.Drawing.Size(240, 20);
            this.txtPasswordEnc.TabIndex = 10;
            // 
            // txtUsuarioFTPEnc
            // 
            this.txtUsuarioFTPEnc.BackColor = System.Drawing.Color.Gainsboro;
            this.txtUsuarioFTPEnc.Location = new System.Drawing.Point(261, 155);
            this.txtUsuarioFTPEnc.Name = "txtUsuarioFTPEnc";
            this.txtUsuarioFTPEnc.ReadOnly = true;
            this.txtUsuarioFTPEnc.Size = new System.Drawing.Size(240, 20);
            this.txtUsuarioFTPEnc.TabIndex = 11;
            // 
            // txtClaveUsuFTPEnc
            // 
            this.txtClaveUsuFTPEnc.BackColor = System.Drawing.Color.Gainsboro;
            this.txtClaveUsuFTPEnc.Location = new System.Drawing.Point(261, 207);
            this.txtClaveUsuFTPEnc.Name = "txtClaveUsuFTPEnc";
            this.txtClaveUsuFTPEnc.ReadOnly = true;
            this.txtClaveUsuFTPEnc.Size = new System.Drawing.Size(240, 20);
            this.txtClaveUsuFTPEnc.TabIndex = 12;
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(413, 233);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(88, 37);
            this.button1.TabIndex = 13;
            this.button1.Text = "Desenciptar";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // GenKey
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(521, 298);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.txtClaveUsuFTPEnc);
            this.Controls.Add(this.txtUsuarioFTPEnc);
            this.Controls.Add(this.txtPasswordEnc);
            this.Controls.Add(this.txtUsuarioInternetEnc);
            this.Controls.Add(this.txtPasswordDes);
            this.Controls.Add(this.txtUsuarioFTPDes);
            this.Controls.Add(this.txtClaveUsuFTPDes);
            this.Controls.Add(this.txtUsuarioInternetDes);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.btnGenerar);
            this.Name = "GenKey";
            this.Text = "Generador de Claves";
            this.Load += new System.EventHandler(this.GenKey_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnGenerar;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox txtUsuarioInternetDes;
        private System.Windows.Forms.TextBox txtClaveUsuFTPDes;
        private System.Windows.Forms.TextBox txtUsuarioFTPDes;
        private System.Windows.Forms.TextBox txtPasswordDes;
        private System.Windows.Forms.TextBox txtUsuarioInternetEnc;
        private System.Windows.Forms.TextBox txtPasswordEnc;
        private System.Windows.Forms.TextBox txtUsuarioFTPEnc;
        private System.Windows.Forms.TextBox txtClaveUsuFTPEnc;
        private System.Windows.Forms.Button button1;
    }
}

