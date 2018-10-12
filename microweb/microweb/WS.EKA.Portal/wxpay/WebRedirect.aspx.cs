using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Serialization;
using System.Configuration;
using System.Net;
using System.IO;
using System.Text;
using WS.EKA.Utilities.Consts;

namespace WS.EKA.Portal.wxpay
{
    public partial class WebRedirect : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string openid = string.Empty;
            string code = Request.QueryString["code"] ?? "";
            
            string backUrl = Request.QueryString["url"] ?? "";

            string appid = ConfigurationManager.AppSettings["appid"].ToString();
            string secret = ConfigurationManager.AppSettings["secret"].ToString();

            if (code != "")
            {
                

                string url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + secret + "&code=" + code + "&grant_type=authorization_code";

                string weixinStr = ReadUrl(url);

                JavaScriptSerializer jsonSerialize = new JavaScriptSerializer();
                JsonClass json = jsonSerialize.Deserialize<JsonClass>(weixinStr);
                if (json != null)
                {
                    openid = json.openid;
                }
            }

            File.AppendAllText(System.Web.HttpContext.Current.Server.MapPath("~/weixin.txt"), code + "|" + secret + "|" + backUrl + "|" + openid + "\r\n");

            if (!string.IsNullOrEmpty(openid))
            {
                SetCookie("openid", openid, 30 * 24);

                HttpContext.Current.Response.Redirect("http://cswx.6868xp.com/");
                if (!string.IsNullOrEmpty(backUrl))
                {

                    Response.Redirect(backUrl);
                }
            }


        }

        public static void SetCookie(string key, string value, int timeoutHours)
        {
            HttpCookie cookie = new HttpCookie(key, value.ToString());
            cookie.Expires = DateTime.Now.AddHours(timeoutHours);
            HttpContext.Current.Response.Cookies.Add(cookie);
        }

        public static string ReadUrl(string url)
        {
            try
            {
                string str = string.Empty;

                WebRequest request = WebRequest.Create(url); //WebRequest.Create方法，返回WebRequest的子类HttpWebRequest
                WebResponse response = request.GetResponse(); //WebRequest.GetResponse方法，返回对 Internet 请求的响应
                Stream resStream = response.GetResponseStream(); //WebResponse.GetResponseStream 方法，从 Internet 资源返回数据流。
                Encoding enc = Encoding.GetEncoding("utf-8"); // 如果是乱码就改成 utf-8 / GB2312
                StreamReader sr = new StreamReader(resStream, enc); //命名空间:System.IO。 StreamReader 类实现一个 TextReader (TextReader类，表示可读取连续字符系列的读取器)，使其以一种特定的编码从字节流中读取字符。
                str = sr.ReadToEnd(); //输出(HTML代码)，ContentHtml为Multiline模式的TextBox控件
                resStream.Close();
                sr.Close();

                return str;
            }
            catch (Exception)
            {
                return "";
            }
        }
    }
}