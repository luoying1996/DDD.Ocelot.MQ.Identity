using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using UWay.CASP.Lib.Log;

namespace WS.EKA.Portal.Model
{
    public static class WeiXinHelper
    {
        /// <summary>
        /// 根据用户Code获取用户信息（包括OpenId的简单信息）
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        public static WeiXinUserSampleInfo GetUserSampleInfo(string code)
        {
            string url = string.Format(WeiXinConst.WeiXin_User_OpenIdUrl, code);
            WeiXinUserSampleInfo info = HttpClientHelper.GetResponse<WeiXinUserSampleInfo>(url);
            try
            {
                HttpContext.Current.Session["openid"] = info.OpenId;
                //HttpCookie txtcookie = new HttpCookie("openid", info.OpenId);
                //DateTime dt = new DateTime();
                //dt = DateTime.Now;
                //TimeSpan ts = new TimeSpan(0, 1, 1, 0);
                //txtcookie.Expires = dt.Add(ts);
                //HttpContext.Current.Response.SetCookie(txtcookie);
                //LogApp.Log4Net.Info("cookie：" + HttpContext.Current.Request.Cookies["openid"]);
                LogApp.Log4Net.Info("openid3：" + HttpContext.Current.Session["openid"]);
            }
            catch (Exception ex)
            {
                LogApp.Log4Net.Info("ex：" + ex);
            }
            return info;
        }

        /// <summary>
        /// 根据用户Code获取用户信息（包括OpenId的简单信息）
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        public static string GetUserOpenId(string code)
        {
            return GetUserSampleInfo(code).OpenId;
        }
        /// <summary>
        /// 根据用户Code获取用户信息（包括OpenId的简单信息）
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        public static WeiXinUserSampleInfo GetnxcUserSampleInfo(string code)
        {
            string url = string.Format(WeiXinConst.WeiXin_User_OpenIdUrl,
                System.Configuration.ConfigurationManager.AppSettings["appid"],
                System.Configuration.ConfigurationManager.AppSettings["secret"], code);
            WeiXinUserSampleInfo info = HttpClientHelper.GetResponse<WeiXinUserSampleInfo>(url);
            return info;
        }
        /// <summary>
        /// 根据用户Code获取用户信息（包括OpenId的简单信息）
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        public static WebUnionIDInfo GetnxcWebUnionIDInfo(string access_token, string openid)
        {
            string url = string.Format(WeiXinConst.WeiXin_User_GetInfoUrl, access_token, openid);
            WebUnionIDInfo info = HttpClientHelper.GetResponse<WebUnionIDInfo>(url);
            return info;
        }
        //public static string GetOAuthUrlByOpenID(string appID, string URL, string status)
        //{
        //    string url = string.Format(WeiXinConst.WeiXin_User_OAuthUrl, appID, URL, status);
        //    return url;
        //}
    }
}