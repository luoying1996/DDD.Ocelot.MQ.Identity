using System;
using System.Net;
using WS.EKA.Portal.Filters;
using AttributeRouting.Web.Http;
using WS.EKA.Portal.Helpers;
using System.Collections.Generic;
using NLog;

namespace WS.EKA.Portal.Controllers
{
    [AuthencationFilter(true)]
    public class CollectController : ControllerBase
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        public CollectController()
        {


        }
        /// <summary>
        /// Kenny 2016-4-7
        /// 收藏商品
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageCount"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [GET("api/collectadd/")]
        public Dictionary<string, Object> CollectProduct(Guid productGuid, string memLoginID, string agentID)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiCollectAdd(productGuid, memLoginID, agentID);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("收藏商品接口异常：" + e.Message);
            }
            return null;
        }
        /// <summary>
        /// Kenny 2016-4-7
        /// 获取我的收藏列表
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageCount"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [GET("api/collectlist/{loginId}")]
        public Dictionary<string, Object> GetMessageByMember(string loginId,string AgentID, int pageIndex, int pageCount)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiCollectList(loginId,AgentID, pageIndex, pageCount);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取产品列表接口异常：" + e);
                return null;
            }
        }

        /// <summary>
        /// Kenny 2016-4-7
        /// 删除收藏
        /// </summary>
        /// <param name="msgId"></param>
        /// <param name="memLoginID"></param>
        /// <returns></returns>
        [POST("api/collectdelete/")]
        public Dictionary<string, Object> DellCollectByGuid(Guid collectId, string memLoginID, string AgentID)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiCollectDelete(collectId, memLoginID, AgentID);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("删除收藏接口异常：" + e.Message);
            }
            return null;

        }
        /// <summary>
        /// 判断商品是否收藏
        /// </summary>
        /// <param name="MemLoginID"></param>
        /// <param name="produtGuid"></param>
        /// <param name="AppSign"></param>
        /// <returns></returns>
        [GET("api/CheckIsCollected/")]
        public Dictionary<string, Object> CheckIsCollected(Guid productGuid, string MemLoginID, string agentID)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiCheckIsCollected(productGuid, MemLoginID, agentID);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("判断商品是否收藏接口异常：" + e.Message);
            }
            return null;
        }


        //// POST api/collect
        //public HttpStatusCode Post(Guid productGuid, string memLoginID)
        //{
        //    dynamic resutlModel = CommonRequest.ApiCollectAdd(memLoginID, productGuid);
        //    return Enum.Parse(typeof(HttpStatusCode), resutlModel.@return);
        //}

        //// DELETE api/collect/5
        //[DELETE("api/collect/{CollectId}")]
        //public HttpStatusCode Delete(Guid CollectId, string MemLoginID)
        //{
        //    dynamic resutlModel = CommonRequest.ApiCollectDelete(CollectId, MemLoginID);
        //    return Enum.Parse(typeof(HttpStatusCode), resutlModel.@return);
        //}
    }
}
