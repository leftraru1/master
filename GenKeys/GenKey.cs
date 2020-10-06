using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using BL.Utilidades;
namespace GenKeys
{
    public partial class GenKey : Form
    {
        public GenKey()
        {
            InitializeComponent();
        }

        private void btnGenerar_Click(object sender, EventArgs e)
        {
            this.txtUsuarioInternetEnc.Text = AESEncrytDecry.Encriptar(this.txtUsuarioInternetDes.Text);
            this.txtPasswordEnc.Text = AESEncrytDecry.Encriptar(this.txtPasswordDes.Text);
            this.txtUsuarioFTPEnc.Text = AESEncrytDecry.Encriptar(this.txtUsuarioFTPDes.Text);
            this.txtClaveUsuFTPEnc.Text = AESEncrytDecry.Encriptar(this.txtClaveUsuFTPDes.Text);

            this.txtUsuarioInternetDes.Refresh();
            this.txtClaveUsuFTPDes.Refresh();
            this.txtUsuarioFTPDes.Refresh();
            this.txtClaveUsuFTPDes.Refresh();

        }

        private void GenKey_Load(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            this.txtUsuarioInternetEnc.Text = AESEncrytDecry.Desencriptar(this.txtUsuarioInternetDes.Text);
            this.txtPasswordEnc.Text = AESEncrytDecry.Desencriptar(this.txtPasswordDes.Text);
            this.txtUsuarioFTPEnc.Text = AESEncrytDecry.Desencriptar(this.txtUsuarioFTPDes.Text);
            this.txtClaveUsuFTPEnc.Text = AESEncrytDecry.Desencriptar(this.txtClaveUsuFTPDes.Text);

            this.txtUsuarioInternetDes.Refresh();
            this.txtClaveUsuFTPDes.Refresh();
            this.txtUsuarioFTPDes.Refresh();
            this.txtClaveUsuFTPDes.Refresh();
        }
    }
}
