using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using System.Net.Mail;
using System.Web.Configuration;

namespace BL.Utilidades
{
    public class Mail
    {

        private string mailEnvio { get; set; }
        private int puerto { get; set; }
        private string host { get; set; }
        private string mailEnvioPass { get; set; }

        public SmtpClient smtp { get; set; }

        public Mail()
        {

            mailEnvio = WebConfigurationManager.AppSettings["mailEnvio"];
            mailEnvioPass = WebConfigurationManager.AppSettings["mailEnvioPass"];
            host = WebConfigurationManager.AppSettings["host"];
            puerto = int.Parse(WebConfigurationManager.AppSettings["puerto"]);

        }

        public async Task Enviar(List<string> _para, string _asunto, string _mensaje)
        {

            MailAddress fromAddress = new MailAddress(mailEnvio);
            string fromPassword = mailEnvioPass;

            MailMessage mensaje = new MailMessage();

            foreach (string p in _para)
                mensaje.To.Add(p);

            mensaje.From = fromAddress;
            mensaje.Subject = _asunto;
            mensaje.Body = _mensaje;

            using (var smtp = new SmtpClient
            {
                Host = host,
                Port = puerto,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            })
            {
                await smtp.SendMailAsync(mensaje);
            }
        }

    }
}
