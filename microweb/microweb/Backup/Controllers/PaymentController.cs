using System;
using System.Collections.Generic;
using AttributeRouting.Web.Http;
using WS.EKA.Portal.Filters;
using System.Web.Http;
using WS.EKA.Portal.Helpers;
using NLog;
using WS.EKA.Model;

namespace WS.EKA.Portal.Controllers
{
    [AuthencationFilter(true)]
    public class PaymentController : ApiController
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        public PaymentController()
        {
        }

        [GET("api/payment/")]
        public Dictionary<string, Object> Get(string agentID)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();
                dic = CommonRequest.ApiGetPayMentList("WeiXin", agentID);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取支付方式接口异常：" + e.Message);
                return null;
            }
        }

        [GET("api/paymentForMaster/")]
        public Dictionary<string, Object> Get()
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();
                dic = CommonRequest.ApiGetPayMentListForMaster("WeiXin");
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取主站支付方式接口异常：" + e.Message);
                return null;
            }
        }






        [GET("api/GetCashListByMemLoginID/")]
        public Dictionary<string, Object> GetCashList(string MemLoginID)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();
                dic = CommonRequest.ApiGetCashList(MemLoginID);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取用户提现方式接口异常：" + e.Message);
                return null;
            }
        }

        /// <summary>
        /// 提现申请接口
        /// </summary>
        /// <param name="MemLoginID"></param>
        /// <returns></returns>
        [POST("api/SumbitCash/")]
        public Dictionary<string, Object> SumbitCash(AdvancePaymentApplyLog advancePaymentApplyLog)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();
                dic = CommonRequest.ApiSumbitCash(advancePaymentApplyLog);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("提现申请接口异常：" + e.Message);
                return null;
            }
        }

        /// <summary>
        /// 添加银行卡
        /// </summary>
        /// <param name="MemLoginID"></param>
        /// <returns></returns>
        [POST("api/CashAdd/")]
        public Dictionary<string, Object> CashAdd(MemberBankAccount model)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();
                dic = CommonRequest.ApiCashAdd(model);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("添加银行卡接口异常：" + e.Message);
                return null;
            }
        }


        /// <summary>
        /// 删除银行卡
        /// </summary>
        /// <param name="MemLoginID"></param>
        /// <returns></returns>
        [GET("api/CashDelete/")]
        public Dictionary<string, Object> CashDelete(string Guid)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();
                dic = CommonRequest.ApiCashDelete(Guid);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("删除银行卡接口异常：" + e.Message);
                return null;
            }
        }


        [GET("api/GetAdvancePaymentApplyLogByMemLoginID/")]
        public Dictionary<string, Object> GetAppLogList(string pageIndex, string pageCount, string MemLoginID)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();
                dic = CommonRequest.ApiGetAppLogList(pageIndex, pageCount, MemLoginID);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取用户提现明细接口异常：" + e.Message);
                return null;
            }
        }

        /// <summary>
        /// 插入充值记录
        /// </summary>
        /// <param name="productGuid"></param>
        /// <param name="memLoginID"></param>
        /// <returns></returns>
        [GET("api/insertAdvancePaymentApplyLog/")]
        public Dictionary<string, Object> InsertAdvancePaymentApplyLog(string MemLoginID, float OperateMoney, string PaymentGuid, string PaymentName)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiInsertAdvancePaymentApplyLog(MemLoginID, OperateMoney, PaymentGuid, PaymentName);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("插入充值记录接口异常：" + e.Message);
            }
            return null;
        }

    }
}