using WS.EKA.Portal.Filters;
using System.Web.Http.Filters;

namespace WS.EKA.Portal.App_Start
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new ExceptionAndLogFilter());
            filters.Add(new AuthencationFilter());
        }
    }
}