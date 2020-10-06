using PL.Models;
using System.Web.Mvc;

namespace PL.Controllers
{
    [AutorizeSession]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Detalle(int? id)
        {
            return View();
        }
    }
}