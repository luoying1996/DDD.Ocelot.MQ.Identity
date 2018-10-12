using System;
using System.Configuration;
using System.Web;
using System.Web.Mvc;
using UWay.CASP.Lib.Log;
using WS.EKA.Portal.Helpers;

namespace WS.EKA.Portal.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {

            ViewBag.agentId = ConfigurationManager.AppSettings["agentId"].ToString();
            try
            {
                if (Session["openid"] != null)
                {
                    HttpCookie txtcookie = new HttpCookie("openid", Session["openid"].ToString());
                    DateTime dt = new DateTime();
                    dt = DateTime.Now;
                    TimeSpan ts = new TimeSpan(0, 1, 1, 0);
                    txtcookie.Expires = dt.Add(ts);
                    Response.SetCookie(txtcookie);
                    LogApp.Log4Net.Info("cookie：" + Session["openid"].ToString());
                }
                else
                {
                   // Response.Redirect("");
                }
            }
            catch (Exception ex)
            {
                LogApp.Log4Net.Info("ex：" + ex);
            }
            return View();
        }
    }
}
