using AttributeRouting.Web.Http;
using NLog;
using System;
using System.Collections.Generic;
using WS.EKA.Portal.Filters;
using WS.EKA.Portal.Helpers;

namespace WS.EKA.Portal.Controllers
{
    [AuthencationFilter(true)]
    public class MemberMessageController : ControllerBase
    {
        //private IMemberMessage memberMessage;
        private static Logger logger = LogManager.GetCurrentClassLogger();
        public MemberMessageController()
        {
            //this.memberMessage = memberMessage;
        }

        /// <summary>
        /// 获取消息列表
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageCount"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [GET("api/membermessagelist/{loginId}")]
        public Dictionary<string, Object> GetMessageByMember(int pageIndex, int pageCount, string loginId)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiPageMyMessage(pageIndex, pageCount, loginId);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取用户消息列表接口异常：" + e.Message);
            }
            return null;
        }
        /// <summary>
        /// 删除消息
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageCount"></param>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [GET("api/membermessagedelete/")]
        public Dictionary<string, Object> DellMessageByGuid(Guid msgId, string memLoginID)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiDellMyMessage(msgId, memLoginID);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("删除用户消息接口异常：" + e.Message);
            }
            return null;
        }


        //// GET api/membermessage/list/{pageIndex}
        //[GET("api/membermessage/list/{pageIndex}")]
        //public Dictionary<string, object> Get(int pageIndex)
        //{
        //    Dictionary<string, object> dic = new Dictionary<string, object>();

        //    int recordTotal=0;
        //    List<MemberMessage> list = memberMessage.Get(GetCurrentUser(), pageIndex, out recordTotal);
        //    dic.Add(PagerConst.Count, recordTotal);
        //    dic.Add(PagerConst.Data, list);
        //    return dic;
        //}

        //// PUT api/membermessage/5
        //public HttpStatusCode Put(Guid id)
        //{
        //    int result = memberMessage.IsReaded(id, GetCurrentUser());
        //    if (result>0)
        //    {
        //        return HttpStatusCode.Accepted;
        //    }
        //    return HttpStatusCode.InternalServerError;
        //}

        //[DELETE("api/membermessage/delete/{msgId}")]
        //public HttpStatusCode Delete(Guid msgId)
        //{
        //    int result = memberMessage.Delete(msgId, GetCurrentUser());
        //    if (result > 0)
        //    {
        //        return HttpStatusCode.Accepted;
        //    }
        //    return HttpStatusCode.InternalServerError;
        //}
    }
}
