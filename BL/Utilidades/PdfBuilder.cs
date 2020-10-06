using iTextSharp.text;
using iTextSharp.text.pdf;
using RazorEngine;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace BL.Utilidades
{
    public class PdfBuilder<TEntity> where TEntity : class
    {

        private readonly TEntity _post;

        private readonly string _file;

        public PdfBuilder(TEntity post, string file)
        {
            _post = post;
            _file = file;
        }

        public FileContentResult GetPdf()
        {
            var html = GetHtml();
            Byte[] bytes;
            using (var ms = new MemoryStream())
            {
                using (var doc = new Document())
                {
                    using (var writer = PdfWriter.GetInstance(doc, ms))
                    {
                        doc.Open();
                        try
                        {
                            using (var msHtml = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(html)))
                            {
                                iTextSharp.tool.xml.XMLWorkerHelper.GetInstance()
                                    .ParseXHtml(writer, doc, msHtml, System.Text.Encoding.UTF8);
                            }
                        }
                        finally
                        {
                            doc.Close();
                        }
                    }
                }
                bytes = ms.ToArray();
            }
            return new FileContentResult(bytes, "application/pdf");
        }

        private string GetHtml()
        {
            
            var html = File.ReadAllText(_file);
            return Razor.Parse(html, _post);
        }

    }
}
