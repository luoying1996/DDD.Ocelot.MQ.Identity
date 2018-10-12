using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using WS.EKA.Utilities.Consts;
using WS.EKA.Utilities.Extensions;

namespace WS.EKA.Portal.Helpers
{
    public class AdminUtil
    {
        #region 获取OpenID
        /// <summary>
        /// 获取OpenID
        /// </summary>
        public static string GetOpenID(string redirect_url, string code)
        {
            string AppID = ConfigurationManager.AppSettings["appid"].ToString();
            string AppSecret = ConfigurationManager.AppSettings["secret"].ToString();
            string openid = "";
            openid = GetOpenID(AppID, redirect_url, code, AppSecret);
            return openid;
        }
        #endregion

        #region 获取OpenId
        /// <summary>
        /// 获取OpenId
        /// </summary>
        public static string GetOpenID(string appid, string redirect_url, string code, string screct)
        {
            string strJson = "";
            if (string.IsNullOrEmpty(code))
            {
                redirect_url = HttpUtility.UrlEncode(redirect_url);
                HttpContext.Current.Response.Redirect(string.Format("https://open.weixin.qq.com/connect/oauth2/authorize?appid={0}&redirect_uri={1}&response_type=code&scope=snsapi_base&state={2}#wechat_redirect",
                  appid, redirect_url, new Random().Next(1000, 200000).ToString()));
                int sTimeOutHours = UserConsts.SessionTimeOutHours.ConfigValue().ToInt32();

                sTimeOutHours = 30 * 24;
                new CookieHelper().Set("openid", Tools.GetJsonValue(strJson, "openid"), sTimeOutHours);
            }
            else
            {
                strJson = HttpRequestUtil.RequestUrl(string.Format("https://api.weixin.qq.com/sns/oauth2/access_token?appid={0}&secret={1}&code={2}&grant_type=authorization_code",
                appid, screct, code));
            }
            return Tools.GetJsonValue(strJson, "openid");
        }
        #endregion


    }
    public static class WXModel
    {
        public static string access_token;
        public static string AppID;
        public static string AppSecret;
    }
    /// <summary>
    /// 工具类
    /// </summary>
    public class Tools
    {
        #region 获取Json字符串某节点的值
        /// <summary>
        /// 获取Json字符串某节点的值
        /// </summary>
        public static string GetJsonValue(string jsonStr, string key)
        {
            string result = string.Empty;
            if (!string.IsNullOrEmpty(jsonStr))
            {
                key = "\"" + key.Trim('"') + "\"";
                int index = jsonStr.IndexOf(key) + key.Length + 1;
                if (index > key.Length + 1)
                {
                    //先截逗号，若是最后一个，截“｝”号，取最小值
                    int end = jsonStr.IndexOf(',', index);
                    if (end == -1)
                    {
                        end = jsonStr.IndexOf('}', index);
                    }

                    result = jsonStr.Substring(index, end - index);
                    result = result.Trim(new char[] { '"', ' ', '\'' }); //过滤引号或空格
                }
            }
            return result;
        }
        #endregion

    }

    public class HttpRequestUtil
    {
        #region 请求Url，不发送数据
        /// <summary>
        /// 请求Url，不发送数据
        /// </summary>
        public static string RequestUrl(string url)
        {
            return RequestUrl(url, "POST");
        }
        #endregion

        #region 请求Url，不发送数据
        /// <summary>
        /// 请求Url，不发送数据
        /// </summary>
        public static string RequestUrl(string url, string method)
        {
            // 设置参数
            HttpWebRequest request = WebRequest.Create(url) as HttpWebRequest;
            CookieContainer cookieContainer = new CookieContainer();
            request.CookieContainer = cookieContainer;
            request.AllowAutoRedirect = true;
            request.Method = method;
            request.ContentType = "text/html";
            request.Headers.Add("charset", "utf-8");

            //发送请求并获取相应回应数据
            HttpWebResponse response = request.GetResponse() as HttpWebResponse;
            //直到request.GetResponse()程序才开始向目标网页发送Post请求
            Stream responseStream = response.GetResponseStream();
            StreamReader sr = new StreamReader(responseStream, Encoding.Default);
            //返回结果网页（html）代码
            string content = sr.ReadToEnd();
            return content;
        }
        #endregion
    }
}