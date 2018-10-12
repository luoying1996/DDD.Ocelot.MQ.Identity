using System;
using System.Web.Http.Filters;
using System.Net.Http;
using System.Net;
using NLog;

namespace WS.EKA.Portal.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = false)]
    public class ExceptionAndLogFilter : ExceptionFilterAttribute 
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            var exception = actionExecutedContext.Exception;
            logger.Error(exception.Message, exception);
            actionExecutedContext.Result = new HttpResponseMessage(HttpStatusCode.InternalServerError);
            base.OnException(actionExecutedContext);
        }
    }
}