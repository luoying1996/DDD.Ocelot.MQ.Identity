using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WS.EKA.Portal.wxpay
{
    public partial class QrCode1 : System.Web.UI.Page
    {
        public string auth_code = string.Empty;
        public string body = string.Empty;
        public string device_info = string.Empty;
        public string out_trade_no = string.Empty;
        public string total_fee = string.Empty;
        public string memid = string.Empty;

        protected void Page_Load(object sender, EventArgs e)
        {
            auth_code = Request.QueryString["auth_code"] ?? "";
            body = Request.QueryString["body"] ?? "";
            device_info = Request.QueryString["device_info"] ?? "";
            out_trade_no = Request.QueryString["out_trade_no"] ?? "";
            total_fee = Request.QueryString["total_fee"] ?? "";
            memid = Request.QueryString["memid"] ?? "";
        }
    }
}