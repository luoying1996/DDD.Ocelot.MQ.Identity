using Newtonsoft.Json.Converters;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using WS.EKA.Model;
using WS.EKA.Portal.Model;
using WS.EKA.Portal.Models;


namespace WS.EKA.Portal.Helpers
{
    public class CommonRequest
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        public static object ApiChooseagent()
        {
            try
            {
                var result = NetworkUtility.GetWebRequest("api/GetAgentList/");
                if (!string.IsNullOrWhiteSpace(result))
                {
                    //var objectModel = new { Agenti = new object { } };
                    var agent = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result); //Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, objectModel);
                    return agent;
                }
                else
                {
                    logger.Info("接口[api/GetAgentList/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/GetAgentList/]异常：" + ex);
                return null;
            }
        }
        /// <summary>
        /// 请求[20]/API/AccountGet/接口的公用方法
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <returns></returns>
        public static object ApiAccountGet(string memLoginID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", memLoginID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/accountget/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    var objectModel = new { AccoutInfo = new object { } };
                    Account a = new Account();
                    a.WxOpenID = "oyq49xHuVDrBgytdGPQuCM0mbFUw";
                    var account = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, objectModel);

                    return account;
                }
                else
                {
                    logger.Info("接口[api/accountget/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/accountget/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// 请求[20]/API/AccountGet/接口的公用方法
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <returns></returns>
        public static object ApiAccountOpenid()
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                //dic.Add("MemLoginID", memLoginID);
                //dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/GetWxopenId/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    var objectModel = new { AccoutInfo = new object { } };
                    //Account a = new Account();
                    //a.WxOpenID = "oyq49xHuVDrBgytdGPQuCM0mbFUw";
                    var account = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, objectModel);

                    return account;
                }
                else
                {
                    logger.Info("接口[api/accountget/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/accountget/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// 请求[41]/Api/AccountLogin/
        /// </summary>
        /// <param name="account"></param>
        /// <returns></returns>
        public static object ApiAccountLogin(Account account)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", account.MemLoginID);
                dic.Add("WxOpenID", account.WxOpenID ?? "");
                dic.Add("AgentID", account.AgentID ?? "");
                dic.Add("Pwd", account.Pwd);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/accountlogin/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    var objectModel = new { AccoutInfo = new object { }, Return = "" };
                    dynamic resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, objectModel);
                    if (resultModel.AccoutInfo.WxOpenID == null)
                    {
                        resultModel.AccoutInfo.WxOpenID = account.WxOpenID;
                    }
                    return resultModel;
                }
                else
                {
                    logger.Info("接口[api/accountlogin/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/accountlogin/]异常：" + ex);
                return null;
            }
        }



        /// <summary>
        /// Author:Jim
        /// Date:2016-3-8
        /// 充值成功更新订单状态
        /// [116]
        /// [GET("api/UpdateAdvancePayMentLog/")]
        /// </summary>
        /// <param name="OrderNumber"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiUpdateRechargeByOrderNumber(string OrderNumber)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("OrderNumber", OrderNumber);
                var result = NetworkUtility.PostWebRequest("api/UpdateAdvancePayMentLog/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/UpdateAdvancePayMentLog/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/UpdateAdvancePayMentLog/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/UpdateAdvancePayMentLog/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// [100]请求/Api/CheckMemLoginIDIsBind/接口
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <returns></returns>
        public static object ApiCheckMemLoginIDIsBind(string memLoginID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", memLoginID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/CheckMemLoginIDIsBind/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, new { IsBind = false });
                    if (resultModel != null)
                    {
                        return resultModel;
                    }

                    else
                    {
                        logger.Info("接口[api/CheckMemLoginIDIsBind/]返回值为Null");
                        return null;
                    }
                }
                else
                {
                    logger.Info("接口[api/CheckMemLoginIDIsBind/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口异常：" + ex);
                return null;
            }
        }
        /// <summary>
        /// [101]请求/Api/BindAccount/接口
        /// </summary>
        /// <param name="account"></param>
        /// <returns></returns>
        public static object ApiBindAccount(Account account)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", account.MemLoginID);
                dic.Add("wxOpenID", account.WxOpenID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());

                logger.Info("绑定时微信ID:" + account.WxOpenID);

                var result = NetworkUtility.GetWebRequest("api/BindAccount/", dic);
                logger.Info("result:" + result);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, new { IsOk = false });
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        return null;
                    }
                }
                else
                {
                    logger.Info("接口[api/BindAccount/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/BindAccount/]异常：" + ex);
                return null;
            }
        }
        /// <summary>
        /// [102]请求/Api/UpdateAccount/接口
        /// </summary>
        /// <param name="account"></param>
        /// <returns></returns>
        public static string ApiUpdateAccount(Account account)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", account.MemLoginID);
                dic.Add("Email", account.Email);
                dic.Add("RealName", account.RealName);
                dic.Add("QQ", account.QQ);
                var result = NetworkUtility.PostWebRequest("api/UpdateAccount/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, new { HttpStatusCode = "" });
                    if (resultModel != null)
                    {
                        return resultModel.HttpStatusCode;
                    }
                    else
                    {
                        logger.Info("接口[api/UpdateAccount/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/UpdateAccount/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/BindAccount/]异常：" + ex);
                return null;
            }
        }
        /// <summary>
        /// [103]请求/Api/CheckWXOpenIDIsBind/接口
        /// </summary>
        /// <param name="account"></param>
        /// <returns></returns>
        public static string ApiCheckWXOpenIDIsBind(string wxOpenID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("wxOpenID", wxOpenID);

                var result = NetworkUtility.GetWebRequest("api/CheckWXOpenIDIsBind/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, new { MemLoginID = "" });
                    if (resultModel != null)
                    {
                        return resultModel.MemLoginID;
                    }
                    else
                    {
                        logger.Info("接口[api/CheckWXOpenIDIsBind/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/CheckWXOpenIDIsBind/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/CheckWXOpenIDIsBind/]异常：" + ex);
                return null;
            }
        }
        /// <summary>
        /// [104]请求/api/WeiXinLogin/接口获取微信登录配置的数据
        /// </summary>
        /// <param name="shopID"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiWeiXinLogin(string shopID)
        {
            try
            {
                logger.Info("店铺：" + shopID);
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("ShopID", shopID);

                var result = NetworkUtility.GetWebRequest("api/WeiXinLogin/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/WeiXinLogin/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/WeiXinLogin/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/WeiXinLogin/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// [24]请求/api/accountregist/接口
        /// 注册用户
        /// </summary>
        /// <param name="account"></param>
        /// <returns></returns>
        public static string ApiAccountRegist(Account account)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", account.MemLoginID);
                dic.Add("Pwd", account.Pwd);
                dic.Add("Email", account.Email);
                dic.Add("Mobile", account.Mobile);
                dic.Add("AgentID", account.AgentID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                dic.Add("CommendPeople", account.CommendPeople);

                var result = NetworkUtility.GetWebRequest("api/accountregist/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, new { @return = "" });
                    if (resultModel != null)
                    {
                        return resultModel.@return;
                    }
                    else
                    {
                        logger.Info("接口[api/accountregist/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/accountregist/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/accountregist/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// [24]请求/api/accountregist/接口
        /// 注册用户
        /// </summary>
        /// <param name="account"></param>
        /// <returns></returns>
        public static string ApiWXAccountRegist(Weixin_ShopMember account)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("ShopMemLoginId", account.ShopMemLoginId);
                dic.Add("MemLoginId", account.MemLoginId);
                dic.Add("Group", account.Group.ToString());
                dic.Add("nickname", account.nickname);
                dic.Add("sex", account.sex.ToString());
                dic.Add("language", account.language);
                dic.Add("city", account.city);
                dic.Add("province", account.province);
                dic.Add("country", account.country);
                dic.Add("headimgurl", account.headimgurl);
                dic.Add("subscribe_time", account.subscribe_time);
                dic.Add("openid", account.openid);

                var result = NetworkUtility.GetWebRequest("api/wxaccountregist/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, new { @return = "" });
                    if (resultModel != null)
                    {
                        return resultModel.@return;
                    }
                    else
                    {
                        logger.Info("接口[api/wxaccountregist/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/wxaccountregist/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/wxaccountregist/]异常：" + ex);
                return null;
            }
        }
        /// <summary>
        /// [105]
        /// 请求/api/CheckMemLoginIDRepeat/接口
        /// 验证登录名是否重复
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <returns></returns>
        public static object ApiCheckMemLoginIDRepeat(string memLoginID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", memLoginID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());

                var result = NetworkUtility.GetWebRequest("api/CheckMemLoginIDRepeat/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, new { Result = false });
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/CheckMemLoginIDRepeat/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Info("接口[api/CheckMemLoginIDRepeat/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/CheckMemLoginIDRepeat/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// [106]
        /// Author:Mike
        /// Date:2015-10-15
        /// 请求/api/AddAgentAccount/接口
        /// 注册分销商
        /// </summary>
        /// <param name="Email">邮件地址</param>
        /// <param name="MemLoginID">登录ID</param>
        /// <param name="RealName">真实姓名</param>
        /// <param name="Pwd">密码</param>
        /// <param name="Area">省市区</param>
        /// <param name="AreaCode">省市区Code</param>
        /// <returns></returns>
        public static object ApiAddAgentAccount(string Email, string MemLoginID, string RealName, string Pwd, string Area, string AreaCode)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("Email", Email);
                dic.Add("MemLoginID", MemLoginID);
                dic.Add("RealName", RealName);
                dic.Add("Pwd", Pwd);
                dic.Add("Area", Area);
                dic.Add("AreaCode", AreaCode);
                dic.Add("AppSign", GetAppSetting.GetAppSign());

                var result = NetworkUtility.PostWebRequest("api/AddAgentAccount/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, new { Result = false });
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/AddAgentAccount/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Info("接口[api/AddAgentAccount/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/AddAgentAccount/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// [42]
        /// 请求/api/getWeixinShopConfigList/接口
        /// 获取微信首页广告轮播图
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <returns></returns>
        public static object ApiGetWeixinShopConfigList(string shopID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("shopID", shopID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());

                var result = NetworkUtility.GetWebRequest("api/getWeixinShopConfigList/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var model = new { Result = new object[] { } };
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, model);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/getWeixinShopConfigList/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Info("接口[api/getWeixinShopConfigList/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/getWeixinShopConfigList/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-16
        /// [23]
        /// 请求/api/collectlist/获取收藏列表
        /// </summary>
        /// <param name="memLoginID">登录ID</param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiCollectList(string memLoginID, string AgentID, int pageIndex, int pageCount)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("memLoginID", memLoginID);
                dic.Add("AgentID", AgentID);
                dic.Add("pageIndex", pageIndex.ToString());
                dic.Add("pageCount", pageCount.ToString());
                dic.Add("AppSign", GetAppSetting.GetAppSign());

                var result = NetworkUtility.GetWebRequest("api/collectlist/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);

                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/collectlist/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Debug("接口[api/collectlist/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/collectlist/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-16
        /// [40]
        /// 请求/api/collectadd/收藏产品
        /// </summary>
        /// <param name="memLoginID">登录ID</param>
        /// <param name="productGuid">产品GUID</param>
        /// <returns>HttpStatusCode</returns>
        public static Dictionary<string, Object> ApiCollectAdd(Guid productGuid, string memLoginID, string agentID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("productGuid", productGuid.ToString());
                dic.Add("memLoginID", memLoginID);
                dic.Add("agentID", agentID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/collectadd/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/collectadd/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/collectadd/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/collectadd/]异常：" + ex);
                return null;
            }
        }


        // <summary>
        /// Author:Kenny
        /// Date:2016-4-7
        /// [24]
        /// 判断产品是否收藏
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <param name="productGuid"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiCheckIsCollected(Guid productGuid, string memLoginID, string agentID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("memLoginID", memLoginID);
                dic.Add("productGuid", productGuid.ToString());
                dic.Add("agentID", agentID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());

                var result = NetworkUtility.GetWebRequest("api/CheckIsCollected/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var model = new { @return = "", AppSign = "" };
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/CheckIsCollected/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Debug("接口[api/CheckIsCollected/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/CheckIsCollected/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-16
        /// [24]
        /// 请求/api/collectdelete/收藏产品删除
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <param name="productGuid"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiCollectDelete(Guid productGuid, string MemLoginID, string AgentID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", MemLoginID);
                dic.Add("productGuid", productGuid.ToString());
                dic.Add("AgentID", AgentID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());

                var result = NetworkUtility.GetWebRequest("api/collectdeleteByProduct/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var model = new { @return = "", AppSign = "" };
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/collectdelete/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Debug("接口[api/collectdelete/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/collectdelete/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-16
        /// [60]
        /// 请求/api/dispatchmodelist/接口
        /// 获取配送方式列表
        /// 
        /// </summary>
        /// <returns></returns>
        [Obsolete("该方法已经弃用")]
        public static Dictionary<string, Object> ApiDispatchModeList()
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("AppSign", GetAppSetting.GetAppSign());

                var result = NetworkUtility.GetWebRequest("api/dispatchmodelist/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/dispatchmodelist/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Info("接口[api/dispatchmodelist/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/dispatchmodelist/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// Author:Mike
        /// Date:2015-10-16
        /// [8]
        /// 请求/api/shoppingcartget/购物车列表
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <param name="productGuid"></param>
        /// <returns></returns>
        public static object ApiShoppingCartList(string memLoginID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("loginId", memLoginID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());

                var result = NetworkUtility.GetWebRequest("api/shoppingcartget/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var model = new { Data = new List<ShoppingCart> { }, AppSign = "" };
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, model);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/shoppingcartget/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Info("接口[api/shoppingcartget/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/shoppingcartget/]异常：" + ex);
                return null;
            }
        }





        /// <summary>
        /// Author:Mike
        /// Date:2015-10-16
        /// [5]
        /// 请求/api/product/获取产品详细
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <param name="productGuid"></param>
        /// <returns></returns>
        public static object ApiGetProductInfo(string memLoginID, string productGuid)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("memLoginID", memLoginID);
                dic.Add("id", productGuid);
                dic.Add("AppSign", GetAppSetting.GetAppSign());

                var result = NetworkUtility.GetWebRequest("api/product/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var model = new { ProductInfo = new object { }, AppSign = "" };
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, model);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/product/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Info("接口[api/product/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/product/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-19
        /// [61]请求/api/dispatchmodelistbycode/
        /// 获取分站的配送方式
        /// </summary>
        /// <param name="shopID"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiDispatchModelListByCode(string dataSMemberID, string dataSHGUID, string dataZFGUID, string Strpuallpr, string Strpuallcou, string StrpuallW, string agentID, bool sbool)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("dataSMemberID", dataSMemberID);
                dic.Add("dataSHGUID", dataSHGUID);
                dic.Add("Strpuallpr", Strpuallpr);
                dic.Add("Strpuallcou", Strpuallcou);
                dic.Add("StrpuallW", StrpuallW);
                dic.Add("dataZFGUID", dataZFGUID);
                dic.Add("agentID", agentID);
                dic.Add("sbool", sbool.ToString());
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/AgentDispatchListByCode/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/AgentDispatchListByCode/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/AgentDispatchListByCode/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/AgentDispatchListByCode/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// Author:Mike
        /// Date:2015-10-19
        /// [61]请求/api/dispatchmodelistbycode/
        /// 获取主站的配送方式
        /// </summary>
        /// <param name="shopID"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiDispatchModelListByCode(string dataSMemberID, string dataSHGUID, string dataZFGUID, string Strpuallpr, string Strpuallcou, string StrpuallW)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("dataSMemberID", dataSMemberID);
                dic.Add("dataSHGUID", dataSHGUID);
                dic.Add("Strpuallpr", Strpuallpr);
                dic.Add("Strpuallcou", Strpuallcou);
                dic.Add("StrpuallW", StrpuallW);
                dic.Add("dataZFGUID", dataZFGUID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/dispatchmodelistbycode/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/dispatchmodelistbycode/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/dispatchmodelistbycode/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/dispatchmodelistbycode/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// Author:Mike
        /// Date:2015-10-19
        /// [108]请求/Api/DefaultAddress/
        /// 获取默认收货地址
        /// </summary>
        /// <param name="memLoginId">登录ID</param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiDefaultAddress(string memLoginId)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("memLoginId", memLoginId);
                dic.Add("isDefault", "1");
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/DefaultAddress/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/DefaultAddress/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/DefaultAddress/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/DefaultAddress/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-19
        /// [108]请求/Api/Address/
        /// 获取收货地址列表
        /// </summary>
        /// <param name="memLoginId">登录ID</param>
        /// <returns></returns>
        public static List<MemberAddress> ApiAddress(string memLoginId)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("memLoginId", memLoginId);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/address/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, new { Data = new List<MemberAddress>() });
                    if (resultModel != null)
                    {
                        var addressModel = resultModel.Data.Where(r => r.IsDefault == 1).SingleOrDefault();
                        if (addressModel != null)
                        {
                            addressModel.IsDefaultCss = "<dt class=\"fd-orange\">[默认]</dt>";
                        }
                        return resultModel.Data;
                    }
                    else
                    {
                        logger.Info("接口[api/address/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/address/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/address/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-19
        /// [38]请求/api/addressadd/
        /// 添加收货地址
        /// </summary>
        /// <param name="memLoginId">登录ID</param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiAddressAdd(MemberAddress memberAddress)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", memberAddress.MemLoginID);
                dic.Add("NAME", memberAddress.NAME);
                dic.Add("Email", memberAddress.Email);
                dic.Add("Address", memberAddress.Address);
                dic.Add("Postalcode", memberAddress.Postalcode);
                dic.Add("Mobile", memberAddress.Mobile);
                dic.Add("Tel", memberAddress.Tel);
                dic.Add("Code", memberAddress.Code);
                dic.Add("Guid", memberAddress.Guid.ToString());

                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.PostWebRequest("api/addressadd/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/addressadd/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/addressadd/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/addressadd/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-19
        /// [38]请求/api/addressupdate/
        /// 编辑收货地址
        /// </summary>
        /// <param name="memLoginId">登录ID</param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiAddressUpdate(MemberAddress memberAddress)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", memberAddress.MemLoginID);
                dic.Add("NAME", memberAddress.NAME);
                dic.Add("Email", memberAddress.Email);
                dic.Add("Address", memberAddress.Address);
                dic.Add("Postalcode", memberAddress.Postalcode);
                dic.Add("Mobile", memberAddress.Mobile);
                dic.Add("Tel", memberAddress.Tel);
                dic.Add("Code", memberAddress.Code);
                dic.Add("Guid", memberAddress.Guid.ToString());

                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.PostWebRequest("api/addressupdate/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/addressupdate/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/addressupdate/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/addressupdate/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-19
        /// [109]请求/api/AddressIsDeafult/
        /// 设置默认收货地址
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <param name="guid"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiUpdateIsDefault(string memLoginID, string guid)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", memLoginID);
                dic.Add("Guid", guid);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.PostWebRequest("api/AddressIsDeafult/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/AddressIsDeafult/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/AddressIsDeafult/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/AddressIsDeafult/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-20
        /// [48]请求/api/addressdelete/
        /// 删除收货地址
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <param name="guid"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiAddressDelete(string guid)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("Guid", guid);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/addressdelete/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/addressdelete/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/addressdelete/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/addressdelete/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-20
        /// [110]请求/api/AddressInfo/
        /// 获取单个收货地址详情
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <param name="guid"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiAddressInfo(string guid)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("Guid", guid);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/AddressInfo/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/AddressInfo/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/AddressInfo/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/AddressInfo/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// Author:Mike
        /// Date:2015-10-20
        /// [111]请求/api/GetAreaByCode/
        /// 根据code获取省市区信息
        /// </summary>
        /// <param name="code">收货地址Code</param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetAreaByCode(string code)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("code", code);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/GetAreaByCode/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/ApiGetAreaByCode/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/ApiGetAreaByCode/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/ApiGetAreaByCode/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// Mike
        /// 动态获取模式返回Object可以使用dymic来接收
        /// </summary>
        /// <param name="OrderNumber"></param>
        /// <returns></returns>
        public static object ApiGetOrderInfo(string OrderNumber)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("OrderNumber", OrderNumber);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/orderget/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, new { Orderinfo = new object { } });
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/orderget/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/orderget/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/orderget/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// Author:Mike
        /// Date:2015-10-20
        /// [13]请求/api/orderget/
        /// 获取订单详情
        /// </summary>
        /// <param name="OrderNumber"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetOrder(string OrderNumber)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("OrderNumber", OrderNumber);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/orderget/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/orderget/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/orderget/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/orderget/]异常：" + ex);
                return null;
            }
        }



        /// <summary>
        /// Author:Jim
        /// Date:2016-03-15
        /// [112]
        /// api/updatereturngoodsinfo/
        /// 下单
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiUpdateReturnGoods(string model)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("ReturnInfo", model);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.PostWebRequest("api/updatereturngoodsinfo1/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/updatereturngoodsinfo/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/updatereturngoodsinfo/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/updatereturngoodsinfo/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Jim
        /// Date:2016-3-16
        /// [13]请求api/getreturnorderlist/
        /// 获取订单详情
        /// </summary>
        /// <param name="OrderNumber"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetReturnInfo(string MemLoginID, string OrderGuid)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", MemLoginID);
                dic.Add("OrderGuid", OrderGuid);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/getreturnorderlist/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/getreturnorderlist/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/getreturnorderlist/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/getreturnorderlist/]异常：" + ex);
                return null;
            }
        }



        /// <summary>
        /// Author:Jim
        /// Date:2016-03-15
        /// [112]
        /// api/addreturnorder/
        /// 下单
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiReturnGoodsInsert(string model)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("ReturnGoodsInfo", model);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.PostWebRequest("api/addreturnorder1/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/addreturnorder/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/addreturnorder/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/addreturnorder/]异常：" + ex);
                return null;
            }
        }



        /// <summary>
        /// Author:Mike
        /// Date:2015-10-21
        /// [12]
        /// api/order/member/OrderList/
        /// 获取用户订单列表(分页)
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageCount"></param>
        /// <param name="memLoginID"></param>
        /// <param name="t"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiPageOrderList(int pageIndex, int pageCount, string memLoginID, int type, string agentID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("pageIndex", pageIndex.ToString());
                dic.Add("t", type.ToString());
                dic.Add("pageCount", pageCount.ToString());
                dic.Add("memLoginID", memLoginID);
                dic.Add("agentID", agentID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/order/member/OrderList/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/order/member/OrderList/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/order/member/OrderList/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/order/member/OrderList/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-21
        /// [15]
        /// api/ordercancel/
        /// 取消订单
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageCount"></param>
        /// <param name="memLoginID"></param>
        /// <param name="t"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiOrderCancel(string guid)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("id", guid);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/ordercancel/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/ordercancel/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/ordercancel/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/ordercancel/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// Author:Jim
        /// Date:2015-10-21
        /// [15]
        /// api/memberepairs/ 
        /// 订单退款
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageCount"></param>
        /// <param name="memLoginID"></param>
        /// <param name="t"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiReturnMoney(string OrderID, string MemLoginID, string ReturnMoney, string ApplyReason, string AgentID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("OrderID", OrderID);
                dic.Add("MemLoginID", MemLoginID);
                dic.Add("ReturnMoney", ReturnMoney);
                dic.Add("ApplyReason", ApplyReason);
                dic.Add("AgentID", AgentID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.PostWebRequest("api/memberepairs/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/memberepairs/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/memberepairs/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/memberepairs/]异常：" + ex);
                return null;
            }
        }




        /// <summary>
        /// Author:Mike
        /// Date:2015-10-21
        /// [47]
        /// api/order/BuyAdvancePayment/{MemLoginID}
        /// 预存款支付
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageCount"></param>
        /// <param name="memLoginID"></param>
        /// <param name="t"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiAdvancePayment(string MemLoginID, string OrderNumber, string PayPwd)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("OrderNumber", OrderNumber);
                dic.Add("PayPwd", PayPwd);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest(string.Format("api/order/BuyAdvancePayment/{0}", MemLoginID), dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/order/BuyAdvancePayment/{MemLoginID}]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/order/BuyAdvancePayment/{MemLoginID}]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/order/BuyAdvancePayment/{MemLoginID}]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-21
        /// [33]
        /// api/order/UpdateShipmentStatus/
        /// 确认收货
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageCount"></param>
        /// <param name="memLoginID"></param>
        /// <param name="t"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiOrderShipment(string guid)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("id", guid);
                dic.Add("AppSign", GetAppSetting.GetAppSign());

                var result = NetworkUtility.GetWebRequest("api/order/UpdateShipmentStatus/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/order/UpdateShipmentStatus/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/order/UpdateShipmentStatus/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/order/UpdateShipmentStatus/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// Author:Mike
        /// Date:2015-10-21
        /// [112]
        /// api/orderInsert/
        /// 下单
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiOrderInsert(Order model)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("orderJson", Newtonsoft.Json.JsonConvert.SerializeObject(model));
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.PostWebRequest("api/orderInsert/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/orderInsert/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/orderInsert/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/orderInsert/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-21
        /// [113]
        /// 请求/api/ordercaculate/
        /// 订单运费计算
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiOrderCaculatePrice(Order model)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("orderJson", Newtonsoft.Json.JsonConvert.SerializeObject(model));
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.PostWebRequest("api/ordercaculate/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/ordercaculate/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/ordercaculate/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/ordercaculate/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-21
        /// [114]
        /// 请求[POST("api/UpdatePayMent/")]
        /// 修改订单的支付方式
        /// </summary>
        /// <param name="OrderNumber">订单号</param>
        /// <param name="PaymentGuid">支付方式GUID</param>
        /// <param name="PaymentName">支付方式名称</param>
        /// <param name="MemLoginID">登录ID</param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiOrderUpdatePayMent(string OrderNumber, Guid PaymentGuid, string PaymentName, string MemLoginID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("OrderNumber", OrderNumber);
                dic.Add("PaymentGuid", PaymentGuid.ToString());
                dic.Add("PaymentName", PaymentName);
                dic.Add("MemLoginID", MemLoginID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.PostWebRequest("api/UpdatePayMent/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/UpdatePayMent/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/UpdatePayMent/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/UpdatePayMent/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-22
        /// [115]
        /// 请求[GET("api/GetOrderCount")]
        /// 获取待发货待收货订单数量
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <returns></returns>
        public static object ApiFaHuoAndShouHuoCount(string memLoginID, string agentID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("memLoginID", memLoginID);
                dic.Add("agentID", agentID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/GetAllOrderCount/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, new { all = "", fukuan = "", shouhuo = "", fahuo = "", pingjia = "", tuikuanhuo = "" });
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/GetOrderCount/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/GetOrderCount/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/GetOrderCount/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-22
        /// 微信商城支付更新订单状态
        /// [116]
        /// [GET("api/UpdateOrderStausByWeiXin/")]
        /// </summary>
        /// <param name="OrderNumber"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiUpdateOrderStausByWeiXin(string OrderNumber, string memo)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("OrderNumber", OrderNumber);
                dic.Add("memo", memo);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/UpdateOrderStausByWeiXin/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/UpdateOrderStausByWeiXin/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/UpdateOrderStausByWeiXin/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/UpdateOrderStausByWeiXin/]异常：" + ex);
                return null;
            }
        }
        /// <summary>
        /// Author:Mike
        /// Date:2015-10-22
        /// [117]
        ///[GET("api/PayMentList/")]
        ///新版获取支付方式列表
        ///备注:需要传递获取支付方式的来源
        /// IOS,Android,WeiXin,Wap 四种来源
        /// </summary>
        /// <param name="Source"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetPayMentList(string Source, string agentID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("Source", Source);
                dic.Add("AgentID", agentID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/PayMentList/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/PayMentList/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/PayMentList/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/PayMentList/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// Author:Jim
        /// Date:2016-4-18
        /// [117]
        ///[GET("api/PayMentListForMaster/")]
        ///新版获取支付方式列表
        ///备注:需要传递获取支付方式的来源
        /// IOS,Android,WeiXin,Wap 四种来源
        /// </summary>
        /// <param name="Source"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetPayMentListForMaster(string Source)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("Source", Source);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/PayMentListForMaster/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/PayMentListForMaster/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/PayMentListForMaster/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/PayMentListForMaster/]异常：" + ex);
                return null;
            }
        }








        /// <summary>
        /// Author:Jim
        /// Date:2016-03-24
        /// [112]
        /// api/GetCashListByMemLoginID/
        /// 获取绑定银行卡列表
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetCashList(string MemLoginID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", MemLoginID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/GetCashListByMemLoginID/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/GetCashListByMemLoginID/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Debug("接口[api/GetCashListByMemLoginID/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/GetCashListByMemLoginID/]异常：" + ex);
                return null;
            }
        }



        /// <summary>
        /// Author:Jim
        /// Date:2016-03-25
        /// [112]
        /// api/SumbitCash/
        /// 提现
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiSumbitCash(AdvancePaymentApplyLog advancePaymentApplyLog)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("OperateMoney", advancePaymentApplyLog.OperateMoney.ToString());
                dic.Add("Memo", advancePaymentApplyLog.Memo);
                dic.Add("MemLoginID", advancePaymentApplyLog.MemLoginID);
                dic.Add("Bank", advancePaymentApplyLog.Bank);
                dic.Add("TrueName", advancePaymentApplyLog.TrueName);
                dic.Add("Account", advancePaymentApplyLog.Account);

                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.PostWebRequest("api/SumbitCash/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/SumbitCash/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Debug("接口[api/SumbitCash/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/SumbitCash/]异常：" + ex);
                return null;
            }
        }
        /// <summary>
        /// Author:Jim
        /// Date:2016-03-25
        /// [112]
        /// api/CashAdd/
        /// 添加银行卡
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiCashAdd(MemberBankAccount model)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", model.MemLoginID);
                dic.Add("BankName", model.BankName);
                dic.Add("BankAccountName", model.BankAccountName);
                dic.Add("BankAccountNumber", model.BankAccountNumber);
                dic.Add("CreateUser", model.CreateUser);
                dic.Add("ModifyUser", model.ModifyUser);

                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.PostWebRequest("api/CashAdd/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/CashAdd/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Debug("接口[api/CashAdd/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/CashAdd/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// Author:Jim
        /// Date:2016-03-25
        /// [112]
        /// api/CashDelete/
        /// 删除银行卡
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiCashDelete(string Guid)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("Guid", Guid);

                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/CashDelete/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/CashDelete/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Debug("接口[api/CashDelete/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/CashDelete/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Jim
        /// Date:2016-03-24
        /// [112]
        /// api/GetAdvancePaymentApplyLogByMemLoginID/
        /// 获取提现明细列表
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetAppLogList(string pageIndex, string pageCount, string MemLoginID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("pageIndex", pageIndex);
                dic.Add("pageCount", pageCount);
                dic.Add("MemLoginID", MemLoginID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/GetAdvancePaymentApplyLogByMemLoginID/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/GetAdvancePaymentApplyLogByMemLoginID/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Debug("接口[api/GetAdvancePaymentApplyLogByMemLoginID/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/GetAdvancePaymentApplyLogByMemLoginID/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// 请求api/insertAdvancePaymentApplyLog/接口，插入充值记录
        /// </summary>
        /// <param name="MemLoginID"></param>
        /// <param name="OperateMoney"></param>
        /// <param name="PaymentGuid"></param>
        /// <param name="PaymentName"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiInsertAdvancePaymentApplyLog(string MemLoginID, float OperateMoney, string PaymentGuid, string PaymentName)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();

                dic.Add("MemLoginID", MemLoginID);
                dic.Add("OperateMoney", OperateMoney.ToString());
                dic.Add("PaymentGuid", PaymentGuid);
                dic.Add("PaymentName", PaymentName);

                var result = NetworkUtility.GetWebRequest("api/insertAdvancePaymentApplyLog/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/insertAdvancePaymentApplyLog/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/insertAdvancePaymentApplyLog/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/insertAdvancePaymentApplyLog/]异常：" + ex);
                return null;
            }
        }



        /// <summary>
        /// 首页公告列表
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, Object> GetAnnouncementList(string AgentID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                dic.Add("agentID", AgentID);
                var result = NetworkUtility.GetWebRequest("api/GetAnnouncementList/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/GetAnnouncementList/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/GetAnnouncementList/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/GetAnnouncementList/]异常：" + ex);
                return null;
            }
        }



        /// <summary>
        /// Author:Mike
        /// Date:2015-10-22
        /// [3]
        /// [GET("api/productcatagory/")]
        /// 获取产品分类
        /// </summary>
        /// <param name="Source"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiProductCatagory(int id, string agentID, bool sbool)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("id", id.ToString());
                dic.Add("agentID", agentID);
                dic.Add("sbool", sbool.ToString());
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/productcatagory/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/productcatagory/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/productcatagory/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/productcatagory/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Miek
        /// Date:2015-10-22
        /// [4]
        /// [GET("api/product2/list/")]
        /// 根据分类ID获取产品列表
        /// </summary>
        /// <param name="ProductCategoryID"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageCount"></param>
        /// <param name="sorts"></param>
        /// <param name="isASC"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetProductListByCategoryId(int ProductCategoryID, int pageIndex, int pageCount, string sorts, bool isASC, string agentID, bool sbool)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("ProductCategoryID", ProductCategoryID.ToString());
                dic.Add("pageIndex", pageIndex.ToString());
                dic.Add("pageCount", pageCount.ToString());
                dic.Add("sorts", sorts);
                dic.Add("isASC", isASC.ToString());
                dic.Add("AgentID", agentID.ToString());
                dic.Add("sbool", sbool.ToString());
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/product2/list/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/product2/list/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/product2/list/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/product2/list/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-23
        /// [1]
        /// [GET("api/product2/type/")]
        /// 根据推荐类别获取产品列表
        /// </summary>
        /// <param name="type">推荐类别 1：新品 2：推荐 3：热卖 4：精品</param>
        /// <param name="pageIndex">当前页</param>
        /// <param name="pageCount">每页显示数量</param>
        /// <param name="sorts">排序  ModifyTime:时间   Price：价格  SaleNumber：销售量</param>
        /// <param name="isASC">True：升序  false：降序</param>
        /// <param name="agentID">分销商ID</param>
        /// <param name="sbool">True：开启产品线  false：不开启产品线</param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetProductListByType(int type, int pageIndex, int pageCount, string sorts, bool isASC, string agentID, bool sbool)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("type", type.ToString());
                dic.Add("pageIndex", pageIndex.ToString());
                dic.Add("pageCount", pageCount.ToString());
                dic.Add("sorts", sorts);
                dic.Add("isASC", isASC.ToString());
                dic.Add("agentID", agentID);
                dic.Add("sbool", sbool.ToString());
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/product2/type/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/product2/type/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/product2/type/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/product2/type/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-23
        /// [6]
        /// [GET("api/SpecificationList/")]
        /// 根据产品GUID获取产品规格
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetSpecificationList(string guid)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("id", guid);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/SpecificationList/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/SpecificationList/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/SpecificationList/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/SpecificationList/]异常：" + ex);
                return null;
            }
        }
        /// <summary>
        /// Author:Mike
        /// Date:2015-10-23
        /// [7]
        /// [GET("api/Specification/")]
        /// 规格查询价格
        /// </summary>
        /// <param name="guid"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetSpecificationProduct(string Detail, Guid productGuid, string memLoginID, string agentID, bool sbool)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("Detail", Detail);
                dic.Add("productGuid", productGuid.ToString());
                dic.Add("MemLoginID", memLoginID);
                dic.Add("agentID", agentID);
                dic.Add("sbool", sbool.ToString());
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/Specification/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/Specification/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/Specification/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/Specification/]异常：" + ex);
                return null;
            }
        }
        /// <summary>
        /// Author:Mike
        /// Date:2015-10-23
        /// [5]
        /// 获取产品详情
        /// </summary>
        /// <param name="productGuid">产品GUID</param>
        /// <param name="MemLoginID">用户ID</param>
        /// <returns></returns>
        public static object ApiGetProductByID(string productGuid, string MemLoginID, string agentID, bool sbool)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("id", productGuid);
                dic.Add("MemLoginID", MemLoginID);
                dic.Add("agentID", agentID);
                dic.Add("sbool", sbool.ToString());
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/product/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var model = new { ProductInfo = new object { }, AppSign = "" };
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, model);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/product/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/product/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/product/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-23
        /// [2]
        /// [GET("api/product2/search/")]
        /// 搜索产品
        /// </summary>
        /// <param name="ProductCategoryID">分类ID</param>
        /// <param name="pageIndex">当前页</param>
        /// <param name="pageCount">当前页显示数量</param>
        /// <param name="sorts">排序字段</param>
        /// <param name="isASC">升降排序 True False</param>
        /// <param name="name">产品名称</param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiSerachProduct(int ProductCategoryID, int pageIndex, int pageCount, string sorts, bool isASC, string name, string agentID, bool sbool, string BrandGuid)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("ProductCategoryID", ProductCategoryID.ToString());
                dic.Add("sorts", sorts);
                dic.Add("pageCount", pageCount.ToString());
                dic.Add("pageIndex", pageIndex.ToString());
                dic.Add("name", name);
                dic.Add("isASC", isASC.ToString());
                dic.Add("agentID", agentID);
                dic.Add("sbool", sbool.ToString());
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                dic.Add("BrandGuid", BrandGuid);
                var result = NetworkUtility.GetWebRequest("api/product2/search/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/product2/search/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/product2/search/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/product2/search/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-23
        /// [27]
        /// [GET("api/product/commentlist/")]
        /// 获取商品评论列表
        /// </summary>
        /// <param name="startPage"></param>
        /// <param name="pageSize"></param>
        /// <param name="productID"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetProductCommentList(int startPage, int pageSize, Guid productID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("productID", productID.ToString());
                dic.Add("pageSize", pageSize.ToString());
                dic.Add("startPage", startPage.ToString());
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/product/commentlist/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/product/commentlist/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/product/commentlist/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/product/commentlist/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-23
        /// [118]
        /// 根据分类ID获取品牌列表
        /// [GET("api/product/brandlist/{productCategoryID}")]
        /// </summary>
        /// <param name="productCategoryID">产品分类ID</param>
        /// <returns></returns>
        public static object ApiGetProductBrand(int productCategoryID, string agentID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                dic.Add("agentID", agentID);
                var result = NetworkUtility.GetWebRequest(string.Format("api/product/brandlist/{0}", productCategoryID), dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, new object[] { });
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/product/brandlist/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/product/brandlist/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/product/brandlist/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// Author:Jim
        /// Date:2016-03-22
        /// [112]
        /// api/addProductComment
        /// 评论
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiSubmitEvaluate(string model)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("model", model);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.PostWebRequest("api/addProductComment1", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/addProductComment]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Debug("接口[api/addProductComment]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/addProductComment]异常：" + ex);
                return null;
            }
        }



        /// <summary>
        /// Author:Mike
        /// Date:2015-10-23
        /// [119]
        /// 根据价格获取优惠券列表
        /// [GET("api/promotionbyprice/{shopingCartPrice}")]
        /// </summary>
        /// <param name="shopingCartPrice"></param>
        /// <returns></returns>
        public static object ApiGetPromotionByPrice(decimal shopingCartPrice)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest(string.Format("api/promotionbyprice/{0}", shopingCartPrice.ToString()), dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, new object[] { });
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/promotionbyprice/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/promotionbyprice/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/promotionbyprice/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-23
        /// [120]
        /// 验证优惠券是否正确
        /// api/FavourTicketVerify/{userName}
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="ticketCode"></param>
        /// <returns></returns>
        public static object ApiVerifyFavourTicket(string userName, string ticketCode)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("ticketCode", ticketCode);
                var result = NetworkUtility.GetWebRequest(string.Format("api/FavourTicketVerify/{0}", userName), dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, new { });
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/FavourTicketVerify/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/FavourTicketVerify/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/FavourTicketVerify/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-23
        /// [121]
        /// [GET("api/province/")]
        /// 获取所有省列表
        /// </summary>
        /// <returns></returns>
        public static object ApiGetProvinceList()
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                var result = NetworkUtility.GetWebRequest("api/province/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, new object[] { });
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/province/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/province/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/province/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-23
        /// 根据父ID获取市区
        /// [39]
        /// [GET("api/region/")]
        /// </summary>
        /// <param name="parentId">父ID</param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetByParentId(int parentId)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                dic.Add("parentId", parentId.ToString());
                var result = NetworkUtility.GetWebRequest("api/region/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/region/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/region/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/region/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-23
        /// [122]
        /// 根据子类ID获取父类省市区code
        /// [GET("api/region/parentcode/get/")]
        /// </summary>
        /// <param name="childCode"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetParentCode(string childCode)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                dic.Add("childCode", childCode);
                var result = NetworkUtility.GetWebRequest("api/region/parentcode/get/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/region/parentcode/get/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/region/parentcode/get/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/region/parentcode/get/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-23
        /// [8]
        /// [GET("api/shoppingcartget/")]
        /// 根据用户名获取购物车列表
        /// </summary>
        /// <param name="loginId"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetShoppingCartByMember(string loginId, string agentID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                dic.Add("loginId", loginId);
                dic.Add("agentID", agentID);
                var result = NetworkUtility.GetWebRequest("api/shoppingcartget/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/shoppingcartget/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/shoppingcartget/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/shoppingcartget/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// Author:Jim
        /// Date:2016-03-30
        /// [60]
        /// 请求api/GetExpressInfo/接口
        /// 获取配送方式列表
        /// 
        /// </summary>
        /// <returns></returns>  
        public static Dictionary<string, Object> ApiExpressInfo(string orderNumber)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("orderNumber", orderNumber);
                dic.Add("AppSign", GetAppSetting.GetAppSign());

                var result = NetworkUtility.GetWebRequest("api/GetExpressInfo/" + orderNumber, dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/GetExpressInfo/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Debug("接口[api/GetExpressInfo/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/GetExpressInfo/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// Author:Mike
        /// [9]
        /// Date:2015-10-23
        /// 添加购物车方法(传递cartInfo JSON字符串)
        /// [POST("api/AddCartInfo/")]
        /// </summary>
        /// <param name="shoppingCart"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiPostShoppingCartAdd(string cartInfo)
        {
            try
            {
                dynamic shoppingCart = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(cartInfo, new object { });
                shoppingCart.Guid = Guid.NewGuid();
                shoppingCart.CreateTime = DateTime.Now;

                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                IsoDateTimeConverter timeFormat = new IsoDateTimeConverter();
                timeFormat.DateTimeFormat = "yyyy-MM-dd HH:mm:ss";
                string cartTempStr = Newtonsoft.Json.JsonConvert.SerializeObject(shoppingCart, Newtonsoft.Json.Formatting.Indented, timeFormat);
                dic.Add("cartInfo", cartTempStr);
                var result = NetworkUtility.PostWebRequest("api/AddCartInfo/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        resultModel.Add("id", shoppingCart.Guid);
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/AddCartInfo/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/AddCartInfo/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/AddCartInfo/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-23
        /// [123]
        /// 已选择的购物车列表
        /// [GET("api/IsSelectShoppingCart/")]
        /// </summary>
        /// <param name="loginId"></param>
        /// <param name="isSelect"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> GetIsSelectByMember(string loginId, string agentID, int isSelect)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                dic.Add("loginId", loginId);
                dic.Add("agentID", agentID);
                dic.Add("isSelect", isSelect.ToString());
                var result = NetworkUtility.GetWebRequest("api/IsSelectShoppingCart/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/IsSelectShoppingCart/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/IsSelectShoppingCart/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/IsSelectShoppingCart/]异常：" + ex);
                return null;
            }
        }



        /// <summary>
        /// Author:Mike
        /// Date:2015-10-24
        /// [11]
        /// 删除购物车产品
        /// [GET("api/shoppingcartdelete/")]
        /// </summary>
        /// <param name="MemLoginID"></param>
        /// <param name="Guid"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetShoppingCartDelete(string guids)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("guids", guids);
                var result = NetworkUtility.GetWebRequest("api/DeleteShoppingCartMany/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/shoppingcartdelete/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/shoppingcartdelete/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/shoppingcartdelete/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-24
        /// [10]
        /// 修改购物车商品数量
        /// [GET("api/shoppingcartput/")]
        /// </summary>
        /// <param name="guids"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiUpdateShoppingCartNumber(string Guid, string MemLoginID, string agentID, int BuyNumber, int IsSelected)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();


                dic.Add("Guid", Guid);
                dic.Add("MemLoginID", MemLoginID);
                dic.Add("BuyNumber", BuyNumber.ToString());
                dic.Add("agentID", agentID);
                dic.Add("IsSelected", IsSelected.ToString());
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/shoppingcartput/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/shoppingcartput/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/shoppingcartput/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/shoppingcartput/]异常：" + ex);
                return null;
            }
        }
        /// <summary>
        /// 更新购物车产品数量
        /// Author:Mike
        /// Date:2015-10-24
        /// </summary>
        /// <param name="numStr"></param>
        /// <param name="MemLoginID"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> UpdateManyShoppingCartNum(string numStr, string agentID, string MemLoginID)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();
                string[] numArr = numStr.Split('|');
                int resultCount = 0;
                for (int i = 0; i < numArr.Length; i++)
                {
                    string[] arr = numArr[i].Split(',');
                    string cartGuid = arr[0];
                    int BuyNumber = Convert.ToInt32(arr[1]);
                    int IsSelected = 1;
                    var result = ApiUpdateShoppingCartNumber(cartGuid, MemLoginID, agentID, BuyNumber, IsSelected);
                    if (result != null && result.ContainsKey("return") && result["return"].ToString() == "202")
                    {
                        resultCount++;
                    }
                }
                if (resultCount > 0)
                {
                    dic.Add("Data", 202);
                }
                else
                {
                    dic.Add("Data", 404);
                }
                return dic;
            }
            catch (Exception ex)
            {

                logger.Error("更新多件商品购物车数量异常：" + ex);
                return null;
            }

        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-24
        /// [125]
        /// [GET("api/UpdateNoIsSelected/")]
        /// 取消当前用户购物车的选中状态
        /// </summary>
        /// <param name="MemLoginID"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiUpdateNoIsSelected(string MemLoginID, string agentID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", MemLoginID);
                dic.Add("agentID", agentID);
                var result = NetworkUtility.GetWebRequest("api/UpdateNoIsSelected/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/UpdateNoIsSelected/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/UpdateNoIsSelected/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/UpdateNoIsSelected/]异常：" + ex);
                return null;
            }
        }
        /// <summary>
        /// Author:Mike
        /// Date:2015-10-24
        /// 根据paymentType获取支付方式列表
        /// [126]
        /// [GET("api/GetPayMentListByPaymentType/")]
        /// </summary>
        /// <param name="PaymentType"></param>
        /// <returns></returns>
        public static List<Payment> ApiGetPaymentForWap(string PayMentType)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("PayMentType", PayMentType);
                var result = NetworkUtility.GetWebRequest("api/GetPayMentListByPaymentType/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {

                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return Newtonsoft.Json.JsonConvert.DeserializeObject<List<Payment>>(resultModel["Data"].ToString());
                    }
                    else
                    {
                        logger.Info("接口[api/GetPayMentListByPaymentType/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/GetPayMentListByPaymentType/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/GetPayMentListByPaymentType/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Mike
        /// Date:2015-10-26
        /// 支付宝支付更改订单状态
        /// [127]
        /// [GET("api/AlipayPay/")]
        /// </summary>
        /// <param name="orderNumber"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiAlipayPay(string orderNumber)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("orderNumber", orderNumber);
                var result = NetworkUtility.GetWebRequest("api/AlipayPay/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Info("接口[api/AlipayPay/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Info("接口[api/AlipayPay/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/AlipayPay/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// 获取产品的安全购买数量
        /// 例如:限购多少,规格库存多少,库存多少
        /// Author:Mike
        /// Date:2015-11-2
        /// [128]
        /// [GET("api/ProductSafetyCount/")]
        /// </summary>
        /// <param name="memLoginID">登录ID</param>
        /// <param name="detailSpec">规格详情</param>
        /// <param name="productGuid">产品GUID</param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetProductSafetyCount(string detailSpec, string productGuid)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("detailSpec", detailSpec);
                dic.Add("productGuid", productGuid);
                var result = NetworkUtility.GetWebRequest("api/ProductSafetyCount/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/ProductSafetyCount/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/ProductSafetyCount/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/ProductSafetyCount/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        ///Author:Kenny
        ///获取手机验证码 
        /// </summary>
        /// <param name="shopID"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetMobileCode(string mobile)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("Mobile", mobile);
                dic.Add("AppSign", GetAppSetting.GetAppSign());

                var result = NetworkUtility.GetWebRequest("api/GetMobileCode/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/GetMobileCode/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Debug("接口[api/GetMobileCode/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/GetMobileCode/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Kenny
        /// 校验用户是否存在
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <returns></returns>
        public static object ApiAccountCheck(string memLoginID, string AgentID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", memLoginID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                dic.Add("AgentID", AgentID);
                var result = NetworkUtility.GetWebRequest("api/accountuserexist/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    var account = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    return account;
                }
                else
                {
                    logger.Info("接口[api/accountuserexist/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/accountuserexist/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// 校验微信用户是否存在
        /// </summary>
        /// <param name="openid"></param>
        /// <param name="AgentID"></param>
        /// <returns></returns>
        public static object ApiWXAccountCheck(string openid, string AgentID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("openid", openid);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                dic.Add("AgentID", AgentID);
                var result = NetworkUtility.GetWebRequest("api/wxaccountuserexist/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    var account = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    return account;
                }
                else
                {
                    logger.Info("接口[api/wxaccountuserexist/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/wxaccountuserexist/]异常：" + ex);
                return null;
            }
        }
        /// <summary>
        /// Author:Kenny
        /// Date:2016-4-6
        /// 重置密码
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <param name="newPwd"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiResetPassWrod(string memLoginID, string newPwd)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", memLoginID);
                dic.Add("NewPassWord", newPwd);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/ResetPassWrod/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/ResetPassWrod/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/ResetPassWrod/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/ResetPassWrod/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Kenny
        /// Date:2016-4-6
        /// 修改登录密码
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <param name="newPwd"></param>
        /// <param name="oldPwd"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiUpdateLoginPwd(string memLoginID, string newPwd, string oldPwd)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", memLoginID);
                dic.Add("NewPwd", newPwd);
                dic.Add("OldPwd", oldPwd);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/updateloginpwd/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/updateloginpwd/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/updateloginpwd/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/updateloginpwd/]异常：" + ex);
                return null;
            }
        }
        /// <summary>
        /// Author:Kenny
        /// Date:2016-04-6
        /// 修改性别
        /// </summary>
        /// <param name="account"></param>
        /// <returns></returns>
        public static string ApiUpdateSex(Account account)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();

                dic.Add("MemLoginID", account.MemLoginID);
                dic.Add("Sex", account.Sex.ToString());
                var result = NetworkUtility.PostWebRequest("api/account/updatesex/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, new { HttpStatusCode = "" });
                    if (resultModel != null)
                    {
                        return resultModel.HttpStatusCode;
                    }
                    else
                    {
                        logger.Debug("接口[api/account/updatesex/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/account/updatesex/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/account/updatesex/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Kenny
        /// Date:2016-04-6 
        /// 修改姓名
        /// </summary>
        /// <param name="account"></param>
        /// <returns></returns>
        public static string ApiUpdateRealName(Account account)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", account.MemLoginID);
                dic.Add("RealName", account.RealName);
                var result = NetworkUtility.PostWebRequest("api/account/updaterealname/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, new { HttpStatusCode = "" });
                    if (resultModel != null)
                    {
                        return resultModel.HttpStatusCode;
                    }
                    else
                    {
                        logger.Debug("接口[api/account/updaterealname/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/account/updaterealname/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/account/updaterealname/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// Author:Kenny
        /// Date:2016-04-6 
        /// 获取支付密码
        /// </summary>
        /// <param name="MemLoginID"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetPaypwd(string MemLoginID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();

                dic.Add("MemLoginID", MemLoginID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/getpaypwd/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/getpaypwd/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/getpaypwd/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/getpaypwd/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// Author:Kenny
        /// Date:2016-04-6
        /// 修改支付密码
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <param name="newPayPwd"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiUpdatePayPwd(string memLoginID, string newPayPwd)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", memLoginID);
                dic.Add("PayPwd", newPayPwd);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/updatepaypwd/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/updateloginpwd/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/updateloginpwd/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/updateloginpwd/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Kenny
        /// Date:2016-04-6
        ///验证支付密码 
        /// </summary>
        /// <param name="shopID"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> GetIsPayPwd(string MemLoginID, string PayPwd)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", MemLoginID);
                dic.Add("PayPwd", PayPwd);
                dic.Add("AppSign", GetAppSetting.GetAppSign());

                var result = NetworkUtility.GetWebRequest("api/checkequalpaypwd/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/checkequalpaypwd/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Debug("接口[api/checkequalpaypwd/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/checkequalpaypwd/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// Author:Kenny
        /// Date:2016-04-6
        /// 更新用户头像
        /// </summary>
        /// <param name="MemLoginID"></param>
        /// <param name="Photo"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiUpdateAccountPhoto(string MemLoginID, string Photo)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();

                dic.Add("MemLoginID", MemLoginID);
                dic.Add("Photo", Photo);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/updatephoto/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/updatephoto/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/updatephoto/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/updatephoto/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// 首页公告列表
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, Object> GetDefaultADList(int banerPostion, int W_Type, string shopID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                dic.Add("BanerPostion", banerPostion.ToString());
                dic.Add("W_Type", W_Type.ToString());
                dic.Add("ShopID", shopID.ToString());
                var result = NetworkUtility.GetWebRequest("api/GetDefaultAd/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/GetDefaultAd/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/GetDefaultAd/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/GetDefaultAd/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// Author:Kenny
        /// Date:2016-04-6
        /// 获取积分明细
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiMyScoreDetail(string memLoginID, string pageIndex, string pageCount)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", memLoginID);
                dic.Add("pageIndex", pageIndex.ToString());
                dic.Add("pageCount", pageCount.ToString());
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/getscoremodifylogList/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/getscoremodifylog/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Debug("接口[api/getscoremodifylog/]返回值为空");
                    return null;
                }
            }
            catch (Exception ex)
            {
                logger.Error("接口[api/getscoremodifylog/]异常：" + ex);
                return null;
            }
        }
        /// <summary>
        /// Author:Kenny
        /// Date:2016-04-6
        /// 获取等级积分明细
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiMyScoreRankDetail(string memLoginID, string pageIndex, string pageCount)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", memLoginID);
                dic.Add("pageIndex", pageIndex.ToString());
                dic.Add("pageCount", pageCount.ToString());
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/getscorerankdetail/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/getscoremodifylog/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Debug("接口[api/getscoremodifylog/]返回值为空");
                    return null;
                }
            }
            catch (Exception ex)
            {
                logger.Error("接口[api/getscoremodifylog/]异常：" + ex);
                return null;
            }
        }
        /// <summary>
        /// Author:Kenny
        /// Date:2016-04-6
        /// 获取积分明细
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiMyAdvancePayment(string memLoginID, string pageIndex, string pageCount)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", memLoginID);
                dic.Add("pageIndex", pageIndex.ToString());
                dic.Add("pageCount", pageCount.ToString());
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/getAdvancePaymentModifyLog/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/getAdvancePaymentModifyLog/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Debug("接口[api/getAdvancePaymentModifyLog/]返回值为空");
                    return null;
                }
            }
            catch (Exception ex)
            {
                logger.Error("接口[api/getAdvancePaymentModifyLog/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// 请求api/membermessagedelete/接口，删除用户消息
        /// Kenny 2016-4-8
        /// </summary>     
        public static Dictionary<string, Object> ApiDellMyMessage(Guid msgId, string memLoginID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("msgId", msgId.ToString());
                dic.Add("memLoginID", memLoginID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/membermessagedelete/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/membermessagedelete/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/membermessagedelete/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/membermessagedelete/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// 请求api/membermessagelist/接口，获取用户消息列表
        /// Kenny 2016-4-8
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageCount"></param>
        /// <param name="memLoginID"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiPageMyMessage(int pageIndex, int pageCount, string memLoginID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("receiveMemLoginID", memLoginID);
                dic.Add("pageIndex", pageIndex.ToString());
                dic.Add("pageCount", pageCount.ToString());
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/membermessagelist/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/membermessagelist/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/membermessagelist/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/membermessagelist/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// 按商品ID和订单编号验证该订单商品是否已晒单
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> CheckIsLog(string productGuid, string orderNumber)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("ProductGuid", productGuid);
                dic.Add("OrderNumber", orderNumber);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/CheckIsLog/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    return resultModel;
                }
                else
                {
                    logger.Debug("接口[api/CheckIsLog/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/CheckIsLog/]异常：" + ex);
                return null;
            }
        }



        /// <summary>
        /// Kenny 2016-4-8 
        /// 添加晒单记录
        /// </summary>
        /// <param name="account"></param>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiAddBaskorderlog(BaskOrderLog model)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("MemLoginID", model.MemLoginID);
                dic.Add("ProductGuid", model.ProductGuid.ToString());
                dic.Add("OrderNumber", model.OrderNumber);
                dic.Add("Name", model.Name);
                dic.Add("Title", model.Title);
                dic.Add("Content", model.Content);
                dic.Add("Image", model.Image);
                dic.Add("IsAudit", "0");
                dic.Add("CreateUser", model.CreateUser);
                dic.Add("ModifyUser", model.ModifyUser);
                dic.Add("IsDeleted", "0");
                dic.Add("IsAgentId", model.IsAgentId);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.PostWebRequest("api/addBaskorderlog/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/UpdateAccount/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/UpdateAccount/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/BindAccount/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// 请求/api/getdistributor/接口
        /// 获取三级分销返利数据
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <returns></returns>
        public static object ApiGetMyRebateList(string memLoginID)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("memLoginID", memLoginID);
                dic.Add("AppSign", GetAppSetting.GetAppSign());

                var result = NetworkUtility.GetWebRequest("api/getdistributor/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var model = new { Data = new object { } };
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, model);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/getdistributor/]返回值有误");
                        return null;
                    }
                }
                else
                {
                    logger.Debug("接口[api/getdistributor/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/getdistributor/]异常：" + ex);
                return null;
            }
        }


        /// <summary>
        /// 获取热门搜索关键字
        /// Kenny:2-16-4-11
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetKeyWordsList(string agentId)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("AgentID", agentId);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/keywordlist/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/keywordlist/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/keywordlist/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/keywordlist/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// 根据keywords获取molde
        ///  Kenny:2-16-4-11
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, Object> GetKeyWordsListByKeyWord(string keywords, string agentId)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("KeyWords", keywords);
                dic.Add("AgentID", agentId);
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                var result = NetworkUtility.GetWebRequest("api/keywordsexist/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/keywordsexist/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/keywordsexist/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/keywordsexist/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// 修改搜索的次数
        ///  Kenny:2-16-4-11
        /// </summary>
        /// <param name="guid">guid</param>
        /// <param name="count">次数</param>
        /// <returns></returns>
        public static string UpdateKeyWordsCountByGuid(string guid, string count, string agentId)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();

                dic.Add("Guid", guid);
                dic.Add("Count", count);
                dic.Add("AgentID", agentId);
                var result = NetworkUtility.PostWebRequest("api/UpdateKeyWordsCountByGuid/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, new { HttpStatusCode = "" });
                    if (resultModel != null)
                    {
                        return resultModel.HttpStatusCode;
                    }
                    else
                    {
                        logger.Debug("接口[api/UpdateKeyWordsCountByGuid/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/UpdateKeyWordsCountByGuid/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/UpdateKeyWordsCountByGuid/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// 添加搜索的关键字
        ///  Kenny:2-16-4-11
        /// </summary>
        /// <param name="name"></param>
        /// <param name="memLoginId"></param>
        /// <returns></returns>
        public static string AddKeyWords(string keyWords, string memLoginId, string agentId)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();

                dic.Add("KeyWords", keyWords);
                dic.Add("MemLoginId", memLoginId);
                dic.Add("AgentID", agentId);
                var result = NetworkUtility.PostWebRequest("api/AddKeyWords/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(result, new { HttpStatusCode = "" });
                    if (resultModel != null)
                    {
                        return resultModel.HttpStatusCode;
                    }
                    else
                    {
                        logger.Debug("接口[api/AddKeyWords/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/AddKeyWords/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/AddKeyWords/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// 获取品牌列表
        /// Kenny:2016-4-11
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetBrandList(string agentId)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                dic.Add("agentID", agentId);

                var result = NetworkUtility.GetWebRequest("api/productbrandlist/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/productbrandlist/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/productbrandlist/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/productbrandlist/]异常：" + ex);
                return null;
            }
        }

        /// <summary>
        /// 获取推荐大牌列表
        /// Kenny:2016-4-11
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, Object> ApiGetRecommondBrandList(string agentId)
        {
            try
            {
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("AppSign", GetAppSetting.GetAppSign());
                dic.Add("agentID", agentId);
                dic.Add("IsRecommend", "1");
                var result = NetworkUtility.GetWebRequest("api/productbrandlistisrecommend/", dic);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    string returnValue = string.Empty;
                    var resultModel = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, Object>>(result);
                    if (resultModel != null)
                    {
                        return resultModel;
                    }
                    else
                    {
                        logger.Debug("接口[api/productbrandlistisrecommend/]返回值有误");
                        return null;
                    }

                }
                else
                {
                    logger.Debug("接口[api/productbrandlistisrecommend/]返回值为空");
                    return null;
                }

            }
            catch (Exception ex)
            {
                logger.Error("接口[api/productbrandlistisrecommend/]异常：" + ex);
                return null;
            }
        }
    }
}