using System;
using System.Collections.Generic;

using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Configuration;
using System.Net;
using System.Text;
using System.Xml;
using System.Xml.Linq;

namespace WS.EKA.Portal.wxpay
{
    public partial class WeiXinNotifyUrl : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                string result = string.Empty;

                string log = string.Empty;

                string postStr = PostInput();

                log += postStr;

                var res = XDocument.Parse(postStr);

                result = CreateXmlStr("SUCCESS", "OK");

                //if (res.Element("xml").Element("return_code").Value == "SUCCESS")
                //{
                //    string out_trade_no = res.Element("xml").Element("out_trade_no").Value;
                //    out_trade_no = out_trade_no.Split('|')[0];
                //    if (!string.IsNullOrEmpty(out_trade_no))
                //    {
                //        log += out_trade_no;
                //        //这里处理订单的逻辑
                //    }

                //    result = CreateXmlStr("SUCCESS", "OK");
                //}
                //else
                //{
                //    result = CreateXmlStr("FAIL", "");
                //}

                

                log += "------------------------------------------------------------------------------------------------------";

                //写入日志
                File.AppendAllText(System.Web.HttpContext.Current.Server.MapPath("~/WeiXinNotifyUrl.txt"), log);




                Response.Write(result);
                Response.End();
            }
            catch (Exception ex)
            {
                File.AppendAllText(System.Web.HttpContext.Current.Server.MapPath("~/WeiXinNotifyUrlException.txt"), ex.ToString());
            }
        }

        public string CreateXmlStr(string return_code,string return_msg)
        {
            string str = string.Empty;
            str += "<xml>";
            str += string.Format("<return_code><![CDATA[{0}]]></return_code>", return_code);
            str += string.Format("<return_msg><![CDATA[{0}]]></return_msg>", return_msg);
            str += "</xml>";

            return str;
        }

        /// <summary>
        /// 获取post返回来的数据
        /// </summary>
        /// <returns></returns>
        private string PostInput()
        {
            System.IO.Stream s = System.Web.HttpContext.Current.Request.InputStream;
            byte[] b = new byte[s.Length];
            s.Read(b, 0, (int)s.Length);
            return System.Text.Encoding.UTF8.GetString(b);
        }
    }
}