using System.Web;
using System.Web.Security;
using Newtonsoft.Json;
using System.Web.Http;

namespace WS.EKA.Portal.Controllers
{
    public class ControllerBase : ApiController
    {
        protected string GetCurrentUser()
        {
            string userName = HttpContext.Current.User.Identity.Name;
            if (string.IsNullOrEmpty(userName))
                throw new HttpRequestValidationException("User Not Login!");
            return userName;
        }
        protected bool IsAutenticated
        {
            get
            {
                return HttpContext.Current.User.Identity.IsAuthenticated;
            }
        }
    }
}