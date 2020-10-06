#region Using

using PL.Filters;
using System.Web.Mvc;

#endregion

namespace PL
{
    public static class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new JsonHandlerAttribute());
        }
    }
}