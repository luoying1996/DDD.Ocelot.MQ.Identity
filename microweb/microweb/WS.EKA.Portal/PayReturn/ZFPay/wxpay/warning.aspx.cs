using System;
using System.Collections.Generic;

using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;

namespace WS.EKA.Portal.wxpay
{
    public partial class warning : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //告警通知URL

            string msg = Request["HTTP_RAW_POST_DATA"];
            File.AppendAllText(System.Web.HttpContext.Current.Server.MapPath("~/warning.txt"), e.ToString());

            Response.Write("success");
            Response.End();
        }
    }
}