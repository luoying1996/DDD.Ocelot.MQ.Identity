using System;
using System.Collections.Generic;
using WS.EKA.Portal.Filters;
using AttributeRouting.Web.Http;
using WS.EKA.Portal.Helpers;

namespace WS.EKA.Portal.Controllers
{
    [AuthencationFilter(true)]
    public class RegionController : ControllerBase
    {
        public RegionController()
        {
        }
        /// <summary>
        /// 获取所有省列表
        /// </summary>
        /// <returns></returns>
        [GET("api/province/")]
        public object GetProvinceList()
        {
            var result = CommonRequest.ApiGetProvinceList();
            return result;
        }

        /// <summary>
        /// Get Region by OrderID(FatherID)
        /// </summary>
        /// <param name="parentId">OrderID</param>
        /// <returns></returns>
        [GET("api/region/{parentId}")]
        public Dictionary<string, Object> GetByParentId(int parentId)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiGetByParentId(parentId);
                return dic;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        /// <summary>
        /// Get Parent Region Code by child code
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        /// 
        [GET("api/region/parentcode/get/")]
        public Dictionary<string, Object> GetParentCode(string childCode)
        {
            var result = CommonRequest.ApiGetParentCode(childCode);
            return result;
        }
    }
}
