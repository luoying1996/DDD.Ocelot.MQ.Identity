using AttributeRouting.Web.Http;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using WS.EKA.Portal.Helpers;

namespace WS.EKA.Portal.Controllers
{
    public class KeyWordsController : ControllerBase
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        public KeyWordsController() { }
        /// <summary>
        /// 获取热门搜索关键字
        /// </summary>
        /// <returns></returns>
        [GET("api/getKeyWords/")]
        public Dictionary<string, Object> GetKeyWordsListByCategoryId(string agentId)
        {
            try
            {
                Dictionary<string, Object> result = CommonRequest.ApiGetKeyWordsList(agentId);
                return result;
            }
            catch (Exception e)
            {
                logger.Error("获取产品列表接口异常：" + e);
                return null;
            }

        }

        /// <summary>
        /// 根据keywords  查询数据库有没有这这个关键字
        /// </summary>
        /// <param name="keywords"></param>
        /// <returns>有数据返回model  没有返回null</returns>
        [GET("api/keywordsexist/")]
        public Dictionary<string, Object> GetKeyWordsListByKeyWord(string keywords,string agentId)
        {
            try
            {
                Dictionary<string, Object> result = CommonRequest.GetKeyWordsListByKeyWord(keywords,agentId);
                return result;
            }
            catch (Exception e)
            {
                logger.Error("获取产品列表接口异常：" + e);
                return null;
            }

        }

        /// <summary>
        /// 修改搜索的次数
        /// </summary>
        /// <param name="guid">guid</param>
        /// <param name="count">次数</param>
        /// <returns></returns>
        [POST("api/UpdateKeyWordsCountByGuid/")]
        public HttpStatusCode UpdateKeyWordsCountByGuid(string guid, string count,string agentId)
        {
            string httpStatusCode = CommonRequest.UpdateKeyWordsCountByGuid(guid, count,agentId);
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
        /// 添加keywords
        /// </summary>
        /// <param name="guid"></param>
        /// <param name="count"></param>
        /// <returns></returns>
        [POST("api/AddKeyWords/")]
        public HttpStatusCode AddKeyWords(string keyWords, string memLoginId,string agentId)
        {
            string httpStatusCode = CommonRequest.AddKeyWords(keyWords, memLoginId,agentId);
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
    }
}