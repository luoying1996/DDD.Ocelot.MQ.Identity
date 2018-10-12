using System;
using System.Collections.Generic;
using System.Web.Http;
using WS.EKA.Portal.Filters;
using AttributeRouting.Web.Http;
using NLog;
using WS.EKA.Portal.Helpers;

namespace WS.EKA.Portal.Controllers
{
    [AuthencationFilter(true)]
    public class ProductCatagoryController : ApiController
    {

        private static Logger logger = LogManager.GetCurrentClassLogger();
        public ProductCatagoryController()
        {
        }

        /// <summary>
        /// 获取商品分类
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [GET("api/productcatagory/{id}")]
        public Dictionary<string, Object> Get(int id, string agentID, bool sbool)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();
                dic = CommonRequest.ApiProductCatagory(id, agentID, sbool);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取商品分类接口异常：" + e.Message);
                return null;
            }
        }


        [GET("api/GetAnnouncementList/")]
        public Dictionary<string, Object> GetAnnouncementList(string AgentID)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();
                dic = CommonRequest.GetAnnouncementList(AgentID);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取首页公告接口异常：" + e.Message);
                return null;
            }
        }

    }
}
