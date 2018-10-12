using System;
using System.Collections.Generic;
using AttributeRouting.Web.Http;
using WS.EKA.Model;
using WS.EKA.Portal.Filters;
using System.Web.Script.Serialization;
using WS.EKA.Portal.Helpers;
using NLog;
using WS.EKA.Portal.Models;

namespace WS.EKA.Portal.Controllers
{
    [AuthencationFilter(true)]
    public class OrderController : ControllerBase
    {
        static object locker = new object();

        private static Logger logger = LogManager.GetCurrentClassLogger();
        public OrderController()
        {
        }


        //更新退货信息        
        [POST("api/updatereturngoodsinfo/")]
        public Dictionary<string, Object> UpdateReturnGoodsInfo(string model)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();

                dic = CommonRequest.ApiUpdateReturnGoods(model);

                return dic;
            }
            catch (Exception e)
            {
                logger.Error("更新退货信息接口异常：" + e.Message);
                return null;
            }
        }


        /// <summary>
        /// 获取退货信息
        /// </summary>
        /// <returns></returns>
        [GET("api/getreturnorderlist/")]
        public Dictionary<string, Object> GetReturnInfo(string MemLoginID, string OrderGuid)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiGetReturnInfo(MemLoginID, OrderGuid);

                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取退货信息接口异常：" + e.Message);
                return null;
            }
        }


        //提交退货信息        
        [POST("api/addreturnorder/")]
        public Dictionary<string, Object> ReturnGoodsInfo(string model)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();

                JavaScriptSerializer jsonSerialize = new JavaScriptSerializer();

                dic = CommonRequest.ApiReturnGoodsInsert(model);

                return dic;
            }
            catch (Exception e)
            {
                logger.Error("提交退货信息接口异常：" + e.Message);
                return null;
            }
        }


        /// <summary>
        /// 获取订单编号
        /// </summary>
        /// <returns></returns>
        [GET("api/getorderno")]
        public Dictionary<string, Object> GetOrderNumber()
        {
            lock (locker)
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();

                dic.Add("OrderNumber", DateTime.Now.ToString("yyyyMMddmmssfff"));

                return dic;
            }
        }

        /// <summary>
        /// 按订单编号获取订单
        /// </summary>
        /// <param name="orderCode"></param>
        /// <returns></returns>
        [GET("api/order/{orderCode}")]
        public Dictionary<string, Object> GetOrder(string orderCode)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiGetOrder(orderCode);

                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取订单详情接口异常：" + e.Message);
                return null;
            }
        }

        //订单列表
        [GET("api/order/member/{loginId}")]
        public Dictionary<string, Object> GetOrderByMember(int pageIndex, int pageCount, string loginId, int t, int OderStatus, int ShipmentStatus, int PaymentStatus, int refundStatus, string memLoginID, string agentID)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiPageOrderList(pageIndex, pageCount, loginId, t, agentID);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取订单列表接口异常：" + e.Message);
            }
            return null;

        }

        //取消订单
        [GET("api/order/OrderUpdate/{id}")]
        public Dictionary<string, Object> Put(Guid id)
        {
            Dictionary<string, Object> dic = CommonRequest.ApiOrderCancel(id.ToString());
            return dic;
        }

        //订单退款
        [GET("api/memberepairs/")]
        public Dictionary<string, Object> memberepairs(string OrderID, string MemLoginID, string ReturnMoney, string ApplyReason,string AgentID)
        {
            Dictionary<string, Object> dic = CommonRequest.ApiReturnMoney(OrderID, MemLoginID, ReturnMoney, ApplyReason,AgentID);
            return dic;
        }


        //预存款支付
        [GET("api/order/BuyAdvancePayment/{MemLoginID}")]
        public Dictionary<string, Object> GETAdvancePayment(string MemLoginID, string OrderNumber, string PayPwd)
        {
            Dictionary<string, Object> dic = CommonRequest.ApiAdvancePayment(MemLoginID, OrderNumber, PayPwd);
            return dic;
        }


        //收货
        [GET("api/order/Shipment/UpdateShipmentStatus")]
        public Dictionary<string, Object> Shipment(Guid orderGuid)
        {
            Dictionary<string, Object> dic = CommonRequest.ApiOrderShipment(orderGuid.ToString());
            return dic;
        }

        //提交订单
        //返回值还需要处理
        [POST("api/order")]
        public Dictionary<string, Object> Post(string model)
        {
            Dictionary<string, Object> dic = new Dictionary<string, object>();

            JavaScriptSerializer jsonSerialize = new JavaScriptSerializer();
            Order info = jsonSerialize.Deserialize<Order>(model);

            var userName = info.MemLoginID;
            info.Guid = Guid.NewGuid();
            info.CreateUser = userName;
            info.MemLoginID = userName;
            info.BuyType = 8; //微信下单
            info.PayType = 1; //在线支付

            dic = CommonRequest.ApiOrderInsert(info);
            if (dic != null)
            {
                if (dic["return"].ToString() == "202")
                {
                    dic["return"] = info.OrderNumber;
                }
                else
                {
                    dic["return"] = "failure";
                }
            }
            else
            {
                dic.Add("return", "failure");
            }



            return dic;
        }

        //运费计算
        [POST("api/order/price/caculate")]
        public Dictionary<string, Object> CaculatePrice(string order)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();

                JavaScriptSerializer jsonSerialize = new JavaScriptSerializer();
                Order info = jsonSerialize.Deserialize<Order>(order);

                if (info.ProductList == null || info.ProductList.Count == 0)
                {
                    return null;
                }
                dic = CommonRequest.ApiOrderCaculatePrice(info);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("运费计算接口异常：" + e.Message);
                return null;
            }
        }

        //修改支付方式
        [GET("api/order/UpdatePayment/{OrderNumber}/{PaymentGuid}/{PaymentName}/{MemLoginID}")]
        public Dictionary<string, Object> Shipment(string OrderNumber, Guid PaymentGuid, string PaymentName, string MemLoginID)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiOrderUpdatePayMent(OrderNumber, PaymentGuid, PaymentName, MemLoginID);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("修改支付方式接口异常：" + e.Message);
                return null;
            }

        }

        /// <summary>
        /// 获取待发货订单和待收货订单数量
        /// </summary>
        /// <param name="MemLoginID"></param>
        /// <returns></returns>
        [GET("api/getfahuoandshouhuocount/")]
        public Dictionary<string, Object> GetFaHuoAndShouHuoCount(string MemLoginID, string agentID)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();
                var resultModel = CommonRequest.ApiFaHuoAndShouHuoCount(MemLoginID, agentID);
                dic.Add("Data", resultModel);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取待发货订单数量接口异常：" + e.Message);
                return null;
            }
        }

        /// <summary>
        /// 微信支付成功更新订单状态
        /// </summary>
        /// <param name="order"></param>
        /// <returns></returns>
        [GET("api/weixinorderupdatepayment/")]
        public Dictionary<string, Object> WeiXinOrderUpdatePayment(string id)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();

                dic = CommonRequest.ApiUpdateOrderStausByWeiXin(id, "手机微信支付");
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("微信支付成功更新订单状态接口异常：" + e.Message);
                return null;
            }
        }

        [GET("api/ApiHost/")]
        public Dictionary<string, Object> GetApiHost()
        {
            Dictionary<string, object> dic = new Dictionary<string, object>();
            string apiHost = System.Configuration.ConfigurationManager.AppSettings["APIHost"];
            if (!string.IsNullOrEmpty(apiHost))
            {
                dic.Add("Data", apiHost);
                return dic;
            }
            return null;
        }

        /// <summary>
        /// Kenny 2016-4-8 
        /// 按商品ID和订单编号验证该订单商品是否已晒单
        /// </summary>
        /// <param name="ProductGuid"></param>
        /// <param name="OrderNumber"></param>
        /// <returns></returns>
        [GET("api/CheckIsLog/")]
        public Dictionary<string, Object> CheckIsLog(string productGuid, string orderNumber)
        {
            try
            {
                Dictionary<string, Object> result = CommonRequest.CheckIsLog(productGuid, orderNumber);

                return result;
            }
            catch (Exception e)
            {
                logger.Error("验证该订单商品是否已晒单状态接口异常：" + e.Message);
                return null;
            }
        }


        /// <summary>
        /// Kenny 2016-4-8 
        /// 添加晒图记录
        /// </summary>
        /// <param name="productDisplay"></param>
        /// <returns></returns>
        [POST("api/addBaskorderlog/")]
        public Dictionary<string, Object> Get(BaskOrderLog productDisplay)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiAddBaskorderlog(productDisplay);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("添加晒图接口异常：" + e.Message);
                return null;
            }
        }
    }
}