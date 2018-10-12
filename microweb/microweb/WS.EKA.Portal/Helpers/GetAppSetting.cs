using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using NLog;
using System.Net;
using System.IO;
using System.Text;

namespace WS.EKA.Portal.Helpers
{

    public class GetAppSetting
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        /// <summary>
        /// 获取微信AppSign
        /// </summary>
        /// <returns></returns>
        public static string GetAppSign()
        {
            try
            {
                return System.Configuration.ConfigurationManager.AppSettings["AppSign"].ToString();
            }
            catch (Exception ex)
            {
                logger.Error("获取AppSign异常：" + ex.Message);
                return string.Empty;
            }

        }

        /// <summary>
        /// 获取微信调用接口HOST
        /// </summary>
        /// <returns></returns>
        public static string GetAPIHost()
        {
            try
            {
                return System.Configuration.ConfigurationManager.AppSettings["APIHost"].ToString();
            }
            catch (Exception ex)
            {
                logger.Error("获取APIHost异常：" + ex.Message);
                return string.Empty;
            }

        }

        /// <summary>
        /// 获取服务器Server域名
        /// </summary>
        /// <returns></returns>
        public static string GetServerHost()
        {
            try
            {
                return System.Configuration.ConfigurationManager.AppSettings["ServerHost"].ToString();
            }
            catch (Exception ex)
            {
                logger.Error("获取ServerHost异常：" + ex.Message);
                return string.Empty;
            }

        }
        /// <summary>
        /// 获取站点名称
        /// </summary>
        /// <returns></returns>
        public static string GetAgentID()
        {
            try
            {
                return System.Configuration.ConfigurationManager.AppSettings["agentId"].ToString();
            }
            catch (Exception ex)
            {
                logger.Error("获取AgentID异常：" + ex.Message);
                return string.Empty;
            }

        }

        /// <summary>
        /// 获取远程服务器ATN结果
        /// </summary>
        /// <param name="strUrl">指定URL路径地址</param>
        /// <param name="timeout">超时时间设置</param>
        /// <returns>服务器ATN结果</returns>
        public static string Get_Http(string strUrl, int timeout)
        {
            string strResult;
            try
            {
                HttpWebRequest myReq = (HttpWebRequest)HttpWebRequest.Create(strUrl);
                myReq.Timeout = timeout;
                HttpWebResponse HttpWResp = (HttpWebResponse)myReq.GetResponse();
                Stream myStream = HttpWResp.GetResponseStream();
                StreamReader sr = new StreamReader(myStream, Encoding.Default);
                StringBuilder strBuilder = new StringBuilder();
                while (-1 != sr.Peek())
                {
                    strBuilder.Append(sr.ReadLine());
                }

                strResult = strBuilder.ToString();
            }
            catch (Exception exp)
            {
                strResult = "错误：" + exp.Message;
            }

            return strResult;
        }
    }
}