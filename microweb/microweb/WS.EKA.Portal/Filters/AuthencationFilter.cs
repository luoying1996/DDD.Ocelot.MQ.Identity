using System.Web.Http.Filters;
using System.Web.Http.Controllers;
using System.Web;
using System;
using System.Net.Http;

namespace WS.EKA.Portal.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = false)]
    public class AuthencationFilter : ActionFilterAttribute
    {
        private bool isExclude { get; set; }
        public AuthencationFilter()
        {
        }
        public AuthencationFilter(bool isExclude)
        {
            this.isExclude = isExclude;
        }
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            if (isExclude)
            {
                base.OnActionExecuting(actionContext);
                return;
            }
            if (!HttpContext.Current.Request.IsAuthenticated)
            {
                base.OnActionExecuting(actionContext);
                // IllegalRequestOperation(actionContext);
                return;
            }
            if (string.IsNullOrEmpty(HttpContext.Current.User.Identity.Name) ||
                !HttpContext.Current.User.Identity.IsAuthenticated)
            {
                IllegalRequestOperation(actionContext);
                return;
            }
          

            base.OnActionExecuting(actionContext);
        }

        private void IllegalRequestOperation(HttpActionContext actionContext)
        {

            actionContext.Response = new HttpResponseMessage(System.Net.HttpStatusCode.Forbidden)
            {
                Content = new StringContent("Illegal request")
            };
        }
    }
}