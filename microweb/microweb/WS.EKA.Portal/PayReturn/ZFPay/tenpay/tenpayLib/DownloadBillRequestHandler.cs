using System;
using System.Collections;
using System.Text;
using System.Web;

namespace WS.EKA.Portal.tenpay.tenpayLib
{
    /// <summary>
    /// RequestHandler 的摘要说明。
    /// </summary>
    public class DownloadBillRequestHandler:RequestHandler
    {

        public DownloadBillRequestHandler(HttpContext httpContext) : base(httpContext){
        
        }

        protected override void  createSign()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("spid=" + getParameter("spid") + "&");
            sb.Append("trans_time=" + getParameter("trans_time") + "&");
            sb.Append("stamp=" + getParameter("stamp") + "&");
            sb.Append("cft_signtype=" + getParameter("cft_signtype") + "&");
            sb.Append("mchtype=" + getParameter("mchtype") + "&");
            sb.Append("key=" + this.getKey());

            string sign = MD5Util.GetMD5(sb.ToString(), getCharset()).ToLower();

            this.setParameter("sign", sign);

            //debug信息
            this.setDebugInfo(sb.ToString() + " => sign:" + sign);

        }
    }
}
