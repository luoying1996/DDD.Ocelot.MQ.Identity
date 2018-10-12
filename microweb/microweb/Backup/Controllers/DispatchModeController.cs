using System;
using System.Collections.Generic;
using AttributeRouting.Web.Http;
using WS.EKA.Model;
using WS.EKA.Portal.Filters;
using System.Web.Http;
using System.IO;
using System.Net;
using System.Text;
using WS.EKA.Portal.Helpers;
using NLog;

namespace WS.EKA.Portal.Controllers
{
    [AuthencationFilter(true)]
    public class DispatchModeController : ApiController
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();

        public DispatchModeController()
        {
        }

        /// <summary>
        /// 按地区code和支付方式获取配送方式列表
        /// </summary>
        /// <param name="dataSMemberID">会员ID</param>
        /// <param name="dataSHGUID">收货地址GUID</param>
        /// <param name="dataZFGUID">支付方式ID(0.线上支付；1.货到付款；2.线下付款)</param>
        /// <returns></returns>
        [GET("api/dispatchmodelistbycode/")]
        public Dictionary<string, Object> GetListByCode(string dataSMemberID, string dataSHGUID, string dataZFGUID, string agentID, bool sbool)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();
                dynamic result = CommonRequest.ApiAccountGet(agentID);
                if (result != null && result.AccoutInfo != null && result.AccoutInfo.PaymentType != null)
                {
                    if (ChangePaymentType(result.AccoutInfo.PaymentType.ToString()))
                    {
                        dic = GetPingTaiListByCode(dataSMemberID, dataSHGUID, dataZFGUID, agentID, sbool);
                    }
                    else
                    {
                        dic = GetAgentListByCode(dataSMemberID, dataSHGUID, dataZFGUID, agentID, sbool);
                    }
                }
                return dic;
            }
            catch (Exception ex)
            {
                logger.Error("根据地区code获取配送方式列表接口异常:" + ex);
                return null;
            }
        }
        /// <summary>
        /// 分站的配送方式
        /// </summary>
        /// <param name="dataSMemberID"></param>
        /// <param name="dataSHGUID"></param>
        /// <param name="dataZFGUID"></param>
        /// <param name="agentID"></param>
        /// <param name="sbool"></param>
        /// <returns></returns>
        public Dictionary<string, Object> GetAgentListByCode(string dataSMemberID, string dataSHGUID, string dataZFGUID, string agentID, bool sbool)
        {
            Dictionary<string, Object> dic = new Dictionary<string, object>();
            try
            {
                Dictionary<string, object> resultModel = CommonRequest.ApiGetShoppingCartByMember(dataSMemberID, agentID);
                if (resultModel != null && resultModel.ContainsKey("Data"))
                {
                    decimal Strpuallpr = 0;//商品总价（商品价格*购买数量） 
                    int Strpuallcou = 0;//商品总件数 
                    decimal StrpuallW = 0;//商品总重量
                    List<ShoppingCart> cartList = Newtonsoft.Json.JsonConvert.DeserializeObject<List<ShoppingCart>>(resultModel["Data"].ToString());
                    foreach (ShoppingCart cart in cartList)
                    {
                        dynamic product = CommonRequest.ApiGetProductByID(cart.ProductGuid.ToString(), dataSMemberID, agentID, sbool);
                        Strpuallpr += cart.BuyPrice * cart.BuyNumber;
                        Strpuallcou += cart.BuyNumber;
                        decimal weight = Convert.ToDecimal(product.ProductInfo.Weight.ToString());
                        StrpuallW += weight * cart.BuyNumber;
                    }
                    dic = CommonRequest.ApiDispatchModelListByCode(dataSMemberID, dataSHGUID, dataZFGUID, Strpuallpr.ToString("F2"), Strpuallcou.ToString("F2"), StrpuallW.ToString("F2"), agentID, sbool);
                }

                return dic;
            }
            catch (Exception e)
            {
                logger.Error("GetListByCode接口异常:" + e.Message);
                return null;
            }
        }

        /// <summary>
        /// 主站的配送方式
        /// </summary>
        /// <param name="dataSMemberID"></param>
        /// <param name="dataSHGUID"></param>
        /// <param name="dataZFGUID"></param>
        /// <param name="agentID"></param>
        /// <param name="sbool"></param>
        /// <returns></returns>
        public Dictionary<string, Object> GetPingTaiListByCode(string dataSMemberID, string dataSHGUID, string dataZFGUID, string agentID, bool sbool)
        {
            Dictionary<string, Object> dic = new Dictionary<string, object>();
            try
            {
                Dictionary<string, object> resultModel = CommonRequest.ApiGetShoppingCartByMember(dataSMemberID, agentID);
                if (resultModel != null && resultModel.ContainsKey("Data"))
                {
                    decimal Strpuallpr = 0;//商品总价（商品价格*购买数量） 
                    int Strpuallcou = 0;//商品总件数 
                    decimal StrpuallW = 0;//商品总重量
                    List<ShoppingCart> cartList = Newtonsoft.Json.JsonConvert.DeserializeObject<List<ShoppingCart>>(resultModel["Data"].ToString());
                    foreach (ShoppingCart cart in cartList)
                    {
                        Strpuallpr += cart.BuyPrice * cart.BuyNumber;
                        dynamic product = CommonRequest.ApiGetProductByID(cart.ProductGuid.ToString(), dataSMemberID, agentID, sbool);
                        Strpuallcou += cart.BuyNumber;
                        decimal weight = Convert.ToDecimal((product.ProductInfo?.Weight == null ? 0 : product.ProductInfo?.Weight).ToString());
                        StrpuallW += weight * cart.BuyNumber;
                    }
                    dic = CommonRequest.ApiDispatchModelListByCode(dataSMemberID, dataSHGUID, dataZFGUID, Strpuallpr.ToString("F2"), Strpuallcou.ToString("F2"), StrpuallW.ToString("F2"));
                }

                return dic;
            }
            catch (Exception e)
            {
                logger.Error("GetListByCode接口异常:" + e.Message);
                return null;
            }
        }



        /// <summary>
        /// 判断是分站配送还是主站配送
        /// </summary>
        /// <param name="strPaymentType"></param>
        /// <returns></returns>
        public bool ChangePaymentType(string strPaymentType)
        {
            string st = GetAppSetting.Get_Http(string.Format("{0}/api/mobileCommonAPI.ashx?opreateType=AgentPayment", GetAppSetting.GetServerHost()), 30000);
            dynamic Data = null;
            if (!string.IsNullOrWhiteSpace(st))
            {
                Data = Newtonsoft.Json.JsonConvert.DeserializeAnonymousType(st, new object[] { new { AgentPayment = "0" } });
            }
            if (Data != null && Data[0].AgentPayment == "0")
            {
                return true;
            }
            else if (Data != null && Data[0].AgentPayment == "1")
            {
                return false;
            }
            else
            {
                if (strPaymentType == "0")
                {
                    return true;
                }
                else if (strPaymentType == "1")
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
        }

        /// <summary>
        /// 查看物流
        /// </summary>
        /// <returns></returns>
        [GET("api/GetExpressInfo/")]
        public Dictionary<string, Object> GetExpressInfo(string orderNumber)
        {
            Dictionary<string, Object> dic = new Dictionary<string, object>();
            dic = CommonRequest.ApiExpressInfo(orderNumber);
            return dic;
        }
    }
}