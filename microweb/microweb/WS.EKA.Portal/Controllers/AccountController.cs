using System;
using System.Collections.Generic;
using System.Net;
using System.Web;
using System.Web.Security;
using WS.EKA.Portal.Filters;
using WS.EKA.Model;
using AttributeRouting.Web.Http;
using System.Security.Cryptography;
using System.Text;
using WS.EKA.Portal.Helpers;
using NLog;
using WS.EKA.Utilities.Consts;
using WS.EKA.Utilities.EncryptTool;
using WS.EKA.Utilities.Extensions;

namespace WS.EKA.Portal.Controllers
{
    [AuthencationFilter(true)]
    public class AccountController : ControllerBase
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        public AccountController()
        {
        }

        [GET("api/account/{loginid}")]
        public object Get(string loginid)
        {
            dynamic resultModel = CommonRequest.ApiAccountGet(loginid);
            if (resultModel != null)
            {
                return resultModel.AccoutInfo;
            }
            return null;
        }
        [GET("api/GetAgentList/")]
        public object Chooseagent()
        {
            var result = CommonRequest.ApiChooseagent();
            if (result != null)
            {
                return result;
            }
            return null;
        }
        [GET("api/account/setauth/{loginid}")]
        public HttpStatusCode GetUserAutoLogin(string loginid)
        {
            var user = CommonRequest.ApiAccountGet(loginid);
            if (user != null)
            {
                FormAuth(loginid);
                return HttpStatusCode.OK;
            }
            else
            {
                return HttpStatusCode.NotFound;
            }
        }

        /// <summary>
        /// 校验用户是否已经注册
        /// </summary>
        /// <param name="loginId">用户名</param>
        /// <param name="AgentID">站点</param>
        /// <returns></returns>
        [GET("api/account/userexist/{loginid}/{agentid}")]
        public Dictionary<string, Object> UserExist(string loginId,string agentid)
        {
            string AgentID = agentid;//GetAppSetting.GetAgentID();
            Dictionary<string, Object> dic = new Dictionary<string, object>();
            dynamic resultModel = CommonRequest.ApiAccountCheck(loginId, AgentID);
            return resultModel;
        }

        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="Account"></param>
        /// <returns></returns>
        [POST("api/account/login/")]
        public Dictionary<string, Object> Login(Account Account)
        {

            Dictionary<string, Object> dic = new Dictionary<string, object>();

            dynamic accountModel = CommonRequest.ApiAccountLogin(Account);
            if (accountModel != null && accountModel.Return == "202")
            {
                if (accountModel.AccoutInfo != null)
                {
                    var accoutInfo = Newtonsoft.Json.JsonConvert.DeserializeObject<Account>(accountModel.AccoutInfo.ToString());
                    //转换成Account类
                    SetAuthCookie(accoutInfo);
                    dynamic resultModel = CommonRequest.ApiCheckMemLoginIDIsBind(Account.MemLoginID);
                    if (resultModel != null && resultModel.IsBind)
                    {
                        //如果该账号已经被其它微信号绑定
                        dic.Add("RESULT", "303");
                    }
                    else
                    {
                        logger.Info("微信OpenID:" + accountModel.AccoutInfo.WxOpenID);
                        //绑定逻辑
                        if (accountModel != null && accountModel.AccoutInfo != null && accountModel.AccoutInfo.WxOpenID != null)
                        {
                            dynamic tempModel = CommonRequest.ApiBindAccount(accoutInfo);
                            if (tempModel != null && tempModel.IsOk == false)
                            {
                                dic.Add("RESULT", "305");
                            }
                            else
                            {

                                dic.Add("RESULT", "202");
                            }
                        }
                        else
                        {
                            dic.Add("RESULT", "202");
                        }

                    }
                }

            }
            else
            {
                dic.Add("RESULT", "404");
            }

            return dic;
        }

        //微信用户登录
        [GET("api/WeiXinLogin/{MemLoginID}/{AgentID}/{Sbool}")]
        public Dictionary<string, Object> Login(string MemLoginID, string AgentID, string Sbool)
        {
            try
            {
                logger.Info("进入微信登录");
                logger.Info("MemLoginID:" + MemLoginID);
                logger.Info("AgentID:" + AgentID);
                logger.Info("Sbool:" + Sbool);
                if (MemLoginID.Length == 3)
                {
                    new CookieHelper().Remove("wxOpenID");
                    new CookieHelper().Remove("AgentID");
                    SetAuthCookie("AgentID", AgentID);
                    SetAuthCookie("wxOpenID", MemLoginID);
                }
                var LoginId = CommonRequest.ApiCheckWXOpenIDIsBind(MemLoginID);
                if (LoginId != "")
                {
                    dynamic resultModel = CommonRequest.ApiAccountGet(LoginId);
                    if (resultModel != null)
                    {
                        Account myaccount = Newtonsoft.Json.JsonConvert.DeserializeObject<Account>(resultModel.AccoutInfo.ToString());
                        SetAuthCookie(myaccount);
                    }
                }
                else
                {
                    RemoveCookie();
                }

                return CommonRequest.ApiWeiXinLogin("shopnum1_administrators");
            }
            catch (Exception e)
            {
                logger.Error("\r\n---微信登录接口异常:" + e);
            }
            return null;
        }

        //修改用户信息
        [POST("api/UpdateAccount")]
        public HttpStatusCode Get(Account Account)
        {
            string httpStatusCode = CommonRequest.ApiUpdateAccount(Account);
            if (!string.IsNullOrWhiteSpace(httpStatusCode))
            {
                var code = (HttpStatusCode)Enum.Parse(typeof(HttpStatusCode), httpStatusCode);
                return code;
            }
            else
            {
                return HttpStatusCode.NotFound;
            }
        }

        /// <summary>
        /// 注册
        /// </summary>
        /// <param name="account"></param>
        /// <returns></returns>
        [POST("api/account/Regist/")]
        public Dictionary<string, Object> Regist(Account account)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();
                string httpStatusCode = CommonRequest.ApiAccountRegist(account);

                if (httpStatusCode == "202")
                {
                    //绑定逻辑
                    if (!string.IsNullOrEmpty(account.WxOpenID))
                    {
                        dynamic resultModel = CommonRequest.ApiBindAccount(account);
                        if (resultModel == null || !resultModel.IsOk)
                        {
                            logger.Debug("注册时[api/account/Regist/]微信和账号绑定失败");
                        }
                    }

                    SetAuthCookie(account);
                    dic.Add("RESULT", "202");
                }
                else
                {
                    dic.Add("RESULT", "404");
                }

                return dic;
            }
            catch (Exception e)
            {
                logger.Error("注册接口异常:" + e.Message);
                return null;
            }

        }

        /// <summary>
        /// Logout
        /// </summary>
        /// <param name="id"></param>
        [GET("api/accountlogout/")]
        public Dictionary<string, Object> LogOut()
        {
            Dictionary<string, Object> dic = new Dictionary<string, object>();

            new CookieHelper().Remove("uid");
            FormsAuthentication.SignOut();

            dic.Add("Result", "202");

            return dic;
        }


        /// <summary>
        /// 验证用户名是否重复
        /// </summary>
        /// <param name="MemLoginID"></param>
        /// <returns></returns>
        [GET("api/checkmemloginIdrepeat/")]
        public Dictionary<string, Object> CheckMemLoginIDRepeat(string MemLoginID)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();

                dynamic resultModel = CommonRequest.ApiCheckMemLoginIDRepeat(MemLoginID);
                if (resultModel != null && resultModel.Result)
                {
                    dic.Add("Result", "202");
                }
                else
                {
                    dic.Add("Result", "404");
                }

                return dic;
            }
            catch (Exception e)
            {
                logger.Error("验证用户名是否重复接口异常:" + e.Message);
            }
            return null;
        }

        /// <summary>
        /// 注册分销商
        /// </summary>
        /// <param name="Email"></param>
        /// <param name="MemLoginID"></param>
        /// <param name="RealName"></param>
        /// <param name="Pwd"></param>
        /// <param name="Area"></param>
        /// <param name="AreaCode"></param>
        /// <returns></returns>
        [GET("api/addagent/")]
        public Dictionary<string, Object> AddAgent(string Email, string MemLoginID, string RealName, string Pwd, string Area, string AreaCode)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();

                dynamic resultModel = CommonRequest.ApiAddAgentAccount(Email, MemLoginID, RealName, Pwd, Area, AreaCode);
                if (resultModel != null && resultModel.Result)
                {
                    dic.Add("RESULT", "202");
                }
                else
                {
                    dic.Add("RESULT", "404");
                }

                return dic;
            }
            catch (Exception e)
            {
                logger.Error("注册分销商接口异常：" + e);
            }
            return null;
        }

        #region 调用微信接口相关

        //public static string Decode(string strDecode)
        //{
        //    string hexValues = strDecode;
        //    string[] hexValuesSplit = hexValues.Split(',');
        //    string stringValue = "";
        //    foreach (String hex in hexValuesSplit)
        //    {
        //        int value = Convert.ToInt32(hex, 16);
        //        stringValue += Char.ConvertFromUtf32(value);
        //    }

        //    return stringValue;
        //}

        ////获取微信分享配置参数
        //[GET("api/weixinshare/{sendurl}")]
        //public string GetParament(string sendurl)
        //{
        //    string url = Decode(sendurl);
        //    string appId = ConfigurationManager.AppSettings["appid"].ToString();
        //    string timestamp = getTimestamp();
        //    string nonceStr = getNoncestr();
        //    string secret = ConfigurationManager.AppSettings["secret"].ToString();
        //    string jsapi_ticket = string.Empty;

        //    if (Cache["jsapi_ticket"] != null)
        //    {
        //        jsapi_ticket = Cache["jsapi_ticket"].ToString();
        //    }
        //    else
        //    {
        //        string access_token = GetAccessToken(appId, secret);

        //        if (!string.IsNullOrEmpty(access_token))
        //        {
        //            jsapi_ticket = GetTicket(access_token);

        //            Cache.Add("jsapi_ticket", jsapi_ticket, null, DateTime.Now.AddHours(1), TimeSpan.Zero, CacheItemPriority.High, null);
        //        }
        //    }

        //    System.IO.File.AppendAllText(HttpContext.Current.Server.MapPath("~/bug.txt"), url.ToString());
        //    string signature = GetSignature(jsapi_ticket, nonceStr, timestamp, url);

        //    return appId + "," + timestamp + "," + nonceStr + "," + signature;
        //}

        //public static string GetTicket(string access_token)
        //{
        //    string ticket = string.Empty;

        //    string url = string.Format("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token={0}&type=jsapi", access_token);

        //    string weixinStr = ReadUrl(url);

        //    System.Web.Script.Serialization.JavaScriptSerializer jsonSerialize = new System.Web.Script.Serialization.JavaScriptSerializer();
        //    WeiXinTicket json = jsonSerialize.Deserialize<WeiXinTicket>(weixinStr);
        //    if (json != null)
        //    {
        //        ticket = json.ticket;
        //    }

        //    return ticket;
        //}

        //public static string GetAccessToken(string appid, string secret)
        //{
        //    string access_token = string.Empty;

        //    string url = string.Format("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={0}&secret={1}", appid, secret);

        //    string weixinStr = ReadUrl(url);

        //    System.Web.Script.Serialization.JavaScriptSerializer jsonSerialize = new System.Web.Script.Serialization.JavaScriptSerializer();
        //    WeiXinToken json = jsonSerialize.Deserialize<WeiXinToken>(weixinStr);
        //    if (json != null)
        //    {
        //        access_token = json.access_token;
        //    }

        //    return access_token;
        //}

        //public string getNoncestr()
        //{
        //    Random random = new Random();
        //    return MD5Util.GetMD5(random.Next(1000).ToString(), "GBK");
        //}

        //public static string ReadUrl(string url)
        //{
        //    try
        //    {
        //        string str = string.Empty;

        //        WebRequest request = WebRequest.Create(url); //WebRequest.Create方法，返回WebRequest的子类HttpWebRequest
        //        WebResponse response = request.GetResponse(); //WebRequest.GetResponse方法，返回对 Internet 请求的响应
        //        Stream resStream = response.GetResponseStream(); //WebResponse.GetResponseStream 方法，从 Internet 资源返回数据流。
        //        Encoding enc = Encoding.GetEncoding("utf-8"); // 如果是乱码就改成 utf-8 / GB2312
        //        StreamReader sr = new StreamReader(resStream, enc); //命名空间:System.IO。 StreamReader 类实现一个 TextReader (TextReader类，表示可读取连续字符系列的读取器)，使其以一种特定的编码从字节流中读取字符。
        //        str = sr.ReadToEnd(); //输出(HTML代码)，ContentHtml为Multiline模式的TextBox控件
        //        resStream.Close();
        //        sr.Close();

        //        return str;
        //    }
        //    catch (Exception)
        //    {
        //        return "";
        //    }
        //}

        ///// <summary>
        ///// 生成签名
        ///// </summary>
        ///// <param name="jsapi_ticket"></param>
        ///// <param name="noncestr"></param>
        ///// <param name="timestamp"></param>
        ///// <param name="url"></param>
        ///// <returns></returns>
        //public static string GetSignature(string jsapi_ticket, string noncestr, string timestamp, string url)
        //{
        //    string tmpStr = "jsapi_ticket=" + jsapi_ticket + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" + url;

        //    return FormsAuthentication.HashPasswordForStoringInConfigFile(tmpStr, "SHA1");
        //}

        //public string getTimestamp()
        //{
        //    TimeSpan ts = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        //    return Convert.ToInt64(ts.TotalSeconds).ToString();
        //}

        ////查找用户是否关注
        //[GET("api/account/findisfollow/{menloginid}")]
        //public string FindIsFollow(string menloginid)
        //{
        //    SqlDB sqlhelper = new SqlDB();
        //    return sqlhelper.IsFollow(menloginid);
        //}

        //[GET("api/WeiXinLoginPeddle/{AgentID}")]
        //public int PeddleLogin(string AgentID)
        //{
        //    Account account = new Account();
        //    string utf8value = HttpUtility.UrlEncode(AgentID, UTF8Encoding.UTF8);
        //    account.AgentID = utf8value;
        //    SetAuthCookie("AgentID", account.AgentID);
        //    return 1;
        //}

        #endregion

        /// <summary>
        /// 获取首页轮播图
        /// </summary>
        /// <param name="ShopID"></param>
        /// <returns></returns>
        [GET("api/getshopconfiglist/")]
        public Dictionary<string, Object> GetShopConfigList(string ShopID)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();
                dynamic resultModel = CommonRequest.ApiGetWeixinShopConfigList(ShopID);
                if (resultModel != null)
                {
                    dic.Add("Data", resultModel.Result);
                    return dic;
                }
                return null;
            }
            catch (Exception e)
            {
                logger.Error("获取首页轮播图接口异常:" + e.Message);
                return null;
            }
        }

        [GET("api/GetSbool/")]
        public object GetSbool(string agentID)
        {
            string sbool = GetAppSetting.Get_Http(string.Format("{0}/api/mobileCommonAPI.ashx?opreateType=AgentProductLine", GetAppSetting.GetServerHost()), 3000);
            if (!string.IsNullOrEmpty(sbool))
            {

                dynamic Data = null;
                if (!string.IsNullOrWhiteSpace(sbool))
                {
                    Data = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(sbool, new object[] { new { AgentProductLine = true } });
                }
                if (Data != null && Data[0].AgentProductLine == true)
                {
                    new CookieHelper().Remove("Sbool");
                    SetAuthCookie("Sbool", "true");
                    return true;
                }
                else
                {
                    new CookieHelper().Remove("Sbool");
                    SetAuthCookie("Sbool", "false");
                    return false;
                }
            }
            return false;

        }


        /// <summary>
        /// Kenny:2016-4-5
        /// 获取手机短信验证码
        /// </summary>
        /// <param name="mobile"></param>
        /// <returns></returns>
        [GET("api/getmobilecode/{phone}")]
        public Dictionary<string, Object> GetMobileCode(string phone)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();
                dic = CommonRequest.ApiGetMobileCode(phone);
                return dic;

            }
            catch (Exception e)
            {
                logger.Error("获取手机短信验证码:" + e.Message);
                return null;
            }
        }

        /// <summary>
        /// Kenny:2016-4-6
        /// 重置密码
        /// </summary>
        /// <param name="memLoginId"></param>
        /// <param name="newPwd"></param>
        /// <returns></returns>
        [POST("api/ResetPassWrod/")]
        public Dictionary<string, Object> ResetPassWrod(string memLoginId, string newPwd)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiResetPassWrod(memLoginId, newPwd);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("修改支付方式接口异常：" + e.Message);
                return null;
            }

        }
        /// <summary>
        /// Kenny:2016-4-6
        /// 修改登录密码
        /// </summary>
        /// <param name="memLoginId"></param>
        /// <param name="newPwd"></param>
        /// <param name="oldPwd"></param>
        /// <returns></returns>
        [POST("api/updateloginpwd/")]
        public Dictionary<string, Object> UpdateLoginPwd(string memLoginId, string newPwd, string oldPwd)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiUpdateLoginPwd(memLoginId, newPwd, oldPwd);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("修改支付方式接口异常：" + e.Message);
                return null;
            }

        }

        /// <summary>
        /// Kenny:2016-4-6
        /// 修改性别
        /// </summary>
        /// <param name="Account"></param>
        /// <returns></returns>
        [POST("api/account/updatesex/")]
        public HttpStatusCode UpdateAccountSex(Account Account)
        {
            string httpStatusCode = CommonRequest.ApiUpdateSex(Account);
            if (!string.IsNullOrWhiteSpace(httpStatusCode))
            {
                var code = (HttpStatusCode)Enum.Parse(typeof(HttpStatusCode), httpStatusCode);
                return code;
            }
            else
            {
                return HttpStatusCode.NotFound;
            }
        }

        /// <summary>
        /// Kenny:2016-4-6
        /// 修改姓名
        /// </summary>
        /// <param name="Account"></param>
        /// <returns></returns>
        [POST("api/account/updaterealname/")]
        public HttpStatusCode UpdateAccountName(Account Account)
        {
            string httpStatusCode = CommonRequest.ApiUpdateRealName(Account);
            if (!string.IsNullOrWhiteSpace(httpStatusCode))
            {
                var code = (HttpStatusCode)Enum.Parse(typeof(HttpStatusCode), httpStatusCode);
                return code;
            }
            else
            {
                return HttpStatusCode.NotFound;
            }
        }

        /// <summary>
        /// 获取支付密码
        /// Kenny:2016-4-6
        /// </summary>
        /// <param name="MemLoginID"></param>
        /// <returns></returns>
        [GET("api/getpaypwd/")]
        public Dictionary<string, Object> GetPaypwd(string MemLoginID)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiGetPaypwd(MemLoginID);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取支付密码接口异常：" + e.Message);
            }
            return null;
        }

        /// <summary>
        /// 修改支付密码
        ///Kenny:2016-4-6
        /// </summary>
        /// <param name="memLoginId"></param>
        /// <param name="newPayPwd"></param>
        /// <returns></returns>
        [POST("api/updatepaypwd/")]
        public Dictionary<string, Object> UpdatePayPwd(string memLoginId, string newPayPwd)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiUpdatePayPwd(memLoginId, newPayPwd);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("修改支付方式接口异常：" + e.Message);
                return null;
            }

        }

        /// <summary>
        /// 验证支付密码
        /// Kenny:2016-4-6
        /// </summary>
        /// <param name="mobile"></param>
        /// <returns></returns>
        [GET("api/checkequalpaypwd/")]
        public Dictionary<string, Object> GetIsPayPwd(string MemLoginID, string PayPwd)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();
                dic = CommonRequest.GetIsPayPwd(MemLoginID, PayPwd);
                return dic;

            }
            catch (Exception e)
            {
                logger.Error("验证支付密码:" + e.Message);
                return null;
            }
        }


        /// <summary>
        /// Kenny:2016-4-6
        /// 修改图像 
        /// </summary>
        /// <param name="Account"></param>
        /// <returns></returns>
        [GET("api/updatephoto/")]
        public Dictionary<string, Object> UpdateAccountPhoto(string MemLoginID, string Photo)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiUpdateAccountPhoto(MemLoginID, Photo);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("修改图像接口异常：" + e.Message);
            }
            return null;
        }

        /// <summary>
        /// Kenny:2016-4-6
        /// 获取积分明细
        /// </summary>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [GET("api/getscoremodifylog/{memLoginId}")]
        public Dictionary<string, Object> GetMyScoreDetail(string memLoginId, string pageIndex, string pageCount)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiMyScoreDetail(memLoginId, pageIndex, pageCount);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取积分明细列表接口异常：" + e.Message);
            }
            return null;
        }
        /// <summary>
        /// Kenny:2016-4-6
        /// 获取等级积分明细
        /// </summary>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [GET("api/getscorerankdetail/{memLoginId}")]
        public Dictionary<string, Object> GetMyScoreRankDetail(string memLoginId, string pageIndex, string pageCount)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiMyScoreRankDetail(memLoginId, pageIndex, pageCount);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取积分明细列表接口异常：" + e.Message);
            }
            return null;
        }
        /// <summary>
        /// 获取首页轮播图
        /// </summary>
        /// <param name="ShopID"></param>
        /// <returns></returns>
        [GET("api/GetDefaultAD/")]
        public Dictionary<string, Object> GetDefaultADList(int banerPostion, int W_Type, string shopID)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();
                dic = CommonRequest.GetDefaultADList(banerPostion, W_Type, shopID);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取首页轮播图接口异常:" + e.Message);
                return null;
            }

        }


        /// <summary>
        /// Kenny:2016-4-6
        /// 获取预存款明细
        /// </summary>
        /// <param name="memLoginId"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageCount"></param>
        /// <returns></returns>
        [GET("api/getAdvancePaymentModifyLog/{memLoginId}")]
        public Dictionary<string, Object> ApiMyAdvancePayment(string memLoginId, string pageIndex, string pageCount)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiMyAdvancePayment(memLoginId, pageIndex, pageCount);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取预存款明细接口异常：" + e.Message);
            }
            return null;
        }

        /// <summary>
        /// Kenny:2016-4-6
        /// 获取返利收益
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <returns></returns>
        [GET("api/getdistributor/")]
        public Dictionary<string, Object> GetDistributor(string memLoginID)
        {
            try
            {
                if (!string.IsNullOrEmpty(memLoginID))
                {
                    Dictionary<string, Object> dic = new Dictionary<string, object>();
                    dynamic resultModel = CommonRequest.ApiGetMyRebateList(memLoginID);
                    if (resultModel != null)
                    {
                        dic.Add("Data", resultModel.Data);
                        return dic;
                    }
                }

                return null;
            }
            catch (Exception e)
            {
                logger.Error("获取返利收益接口异常:" + e.Message);
                return null;
            }
        }

        #region Cookie
        /// <summary>
        /// MD5加密
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static string GetMd5Hash(string input)
        {
            MD5CryptoServiceProvider md5Hasher = new MD5CryptoServiceProvider();

            byte[] data = md5Hasher.ComputeHash(Encoding.Default.GetBytes(input));
            StringBuilder sBuilder = new StringBuilder();

            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }
            return sBuilder.ToString();
        }
        private void SetAuthCookie(Account account)
        {
            string userName = account.MemLoginID;
            userName = HttpUtility.UrlEncode(userName, UTF8Encoding.UTF8);

            int sTimeOutHours = UserConsts.SessionTimeOutHours.ConfigValue().ToInt32();
            string userNameHash = EncryptFactory.Create().ToMD5(userName + UserConsts.WSMobile.ConfigValue());
            //user info
            if (account.RememberMe)
            {
                sTimeOutHours = 30 * 24;
            }
            else
            {
                sTimeOutHours = 30 * 24;
            }
            new CookieHelper().Set(UserConsts.LoginId, userName, sTimeOutHours);
            FormAuth(userName);
        }




        private void FormAuth(string userName)
        {
            FormsAuthentication.SetAuthCookie(userName, false, FormsAuthentication.FormsCookiePath);
        }

        private void SetAuthCookieWeiXin(string wxOpenID)
        {
            int sTimeOutHours = UserConsts.SessionTimeOutHours.ConfigValue().ToInt32();

            sTimeOutHours = 30 * 24;
            new CookieHelper().Set("wxOpenID", wxOpenID, sTimeOutHours);
            FormAuth(wxOpenID);
        }

        private void SetAuthCookie(string key, string value)
        {
            value = HttpUtility.UrlEncode(value, UTF8Encoding.UTF8);

            int sTimeOutHours = UserConsts.SessionTimeOutHours.ConfigValue().ToInt32();

            sTimeOutHours = 30 * 24;

            new CookieHelper().Set(key, value, sTimeOutHours);
            FormAuth(value);
        }

        private void RemoveCookie()
        {
            new CookieHelper().Remove(UserConsts.LoginId);
        }

        #endregion
    }
}
