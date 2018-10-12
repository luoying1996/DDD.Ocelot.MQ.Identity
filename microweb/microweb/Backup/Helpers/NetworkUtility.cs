using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.IO;
using System.Text;

namespace WS.EKA.Portal.Helpers
{
    /// <summary>
    /// 网络连接工具
    /// </summary>
    public static class NetworkUtility
    {
        /// <summary>
        /// 默认编码
        /// </summary>
        private static Encoding defaultEncoding = Encoding.UTF8;

        private static string APIHost = GetAppSetting.GetAPIHost();
        public static string GetWebRequest(string url)
        {
            return GetWebRequest(url, null);
        }

        public static string GetWebRequest(string url, IDictionary<string, string> param)
        {
            if (param != null && param.Count > 0)
            {
                List<string> paraList = new List<string>();
                foreach (var item in param)
                {
                    paraList.Add(string.Format("{0}={1}", item.Key, item.Value));
                }

                string str = string.Join("&", paraList);
                if (url.Contains('?'))
                {
                    if (url.EndsWith("&"))
                    {
                        url = url + str;
                    }
                    else
                    {
                        url = url + "&" + str;
                    }
                }
                else
                {
                    url = url + "?" + str;
                }
            }
            string ApiUrl = string.Concat(new string[] { APIHost, url });
            HttpWebRequest webReq = (HttpWebRequest)HttpWebRequest.Create(new Uri(ApiUrl));
            webReq.KeepAlive = false;
            webReq.Method = "GET";
			try
			{
				using (HttpWebResponse response = (HttpWebResponse)webReq.GetResponse())
				{
					using (StreamReader sr = new StreamReader(response.GetResponseStream(), defaultEncoding))
					{
						return sr.ReadToEnd();
					}
				}
			}
			catch (Exception ee)
			{
				return ee.Message;
			}
        }

        /// <summary>
        /// POST请求
        /// </summary>
        /// <param name="postUrl"></param>
        /// <returns></returns>
        public static string PostWebRequest(string postUrl)
        {
            return PostWebRequest(postUrl, string.Empty);
        }

        /// <summary>
        /// POST请求，使用默认编码
        /// </summary>
        /// <param name="postUrl"></param>
        /// <param name="paramData"></param>
        /// <returns></returns>
        public static string PostWebRequest(string postUrl, IDictionary<string, string> param)
        {
            string paramData = string.Empty;
            if (param != null && param.Count > 0)
            {
                List<string> paraList = new List<string>();
                foreach (var item in param)
                {
                    string val = item.Value;
                    if (string.IsNullOrWhiteSpace(val))
                    {
                        val = "";
                    }
                    paraList.Add(string.Format("{0}={1}", item.Key, val));
                }

                paramData = string.Join("&", paraList);
            }
            return PostWebRequest(postUrl, paramData, defaultEncoding);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="postUrl"></param>
        /// <param name="paramData"></param>
        /// <returns></returns>
        public static string PostWebRequest(string postUrl, string paramData)
        {
            return PostWebRequest(postUrl, paramData, defaultEncoding);
        }

        /// <summary>
        /// POST请求
        /// </summary>
        /// <param name="postUrl"></param>
        /// <param name="paramData"></param>
        /// <param name="encoding"></param>
        /// <returns></returns>
        public static string PostWebRequest(string postUrl, string paramData, Encoding encoding)
        {
            string ApiUrl = string.Concat(new string[] { APIHost, postUrl });
            HttpWebRequest webReq = (HttpWebRequest)HttpWebRequest.Create(new Uri(ApiUrl));
            webReq.KeepAlive = false;
            webReq.Method = "POST";
            webReq.ContentType = "application/x-www-form-urlencoded";

            if (paramData != null && paramData.Trim() != "")
            {
                byte[] byteArray = encoding.GetBytes(paramData);
                webReq.ContentLength = byteArray.Length;

                using (Stream stream = webReq.GetRequestStream())
                {
                    stream.Write(byteArray, 0, byteArray.Length);
                }
            }

            using (HttpWebResponse response = (HttpWebResponse)webReq.GetResponse())
            {
                using (StreamReader sr = new StreamReader(response.GetResponseStream(), encoding))
                {
                    return sr.ReadToEnd();
                }
            }
        }
    }
}