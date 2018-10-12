using System;
using System.Collections.Generic;
using System.Web.Http;
using AttributeRouting.Web.Http;
using WS.EKA.Model;
using WS.EKA.Portal.Filters;
using WS.EKA.Portal.Helpers;
using NLog;

namespace WS.EKA.Portal.Controllers
{
    [AuthencationFilter(true)]
    public class MemberAddressController : ControllerBase
    {
     
        private static Logger logger = LogManager.GetCurrentClassLogger();
        public MemberAddressController()
        {

        }

        /// <summary>
        /// 获取默认收货地址
        /// </summary>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [GET("api/getmemberaddressbyselected/")]
        public Dictionary<string, Object> GetMemberAddressBySelected(string MemLoginID)
        {
            try
            {
                Dictionary<string, object> dic = new Dictionary<string, object>();
                dic = CommonRequest.ApiDefaultAddress(MemLoginID);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取默认收货地址接口异常：" + e.Message);
                return null;
            }
        }

        /// <summary>
        /// 获取收货地址列表
        /// </summary>
        /// <param name="MemLoginID"></param>
        /// <returns></returns>
        [GET("api/getmemberaddresslist/")]
        public Dictionary<string, Object> GetMemberAddressList(string MemLoginID)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();

                var memberList = CommonRequest.ApiAddress(MemLoginID);
                dic.Add("Data", memberList);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取收货地址列表接口异常：" + e.Message);
                return null;
            }
        }

        [POST("api/address/")]
        public Dictionary<string, Object> Post(MemberAddress memberAddress)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();
                if (memberAddress.Guid.ToString() != "00000000-0000-0000-0000-000000000000")
                {
                    //更新
                    dic = CommonRequest.ApiAddressUpdate(memberAddress);
                }
                else
                {
                    dic = CommonRequest.ApiAddressAdd(memberAddress);
                }
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("添加或更新地址接口异常:" + e.Message);
                return null;
            }
        }


        /// <summary>
        /// 更新默认收货地址
        /// </summary>
        /// <param name="MemLoginID"></param>
        /// <returns></returns>
        [GET("api/updateisdefault/")]
        public Dictionary<string, Object> UpdateIsDefault(string MemLoginID, string Guid)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();

                dic = CommonRequest.ApiUpdateIsDefault(MemLoginID, Guid);


                return dic;
            }
            catch (Exception e)
            {
                logger.Error("设置默认收货地址异常:" + e.Message);
                return null;
            }
        }

        //删除收货地址
        [GET("api/addressdel/")]
        public Dictionary<string, Object> Remove(string memberAddressId)
        {
            var result = CommonRequest.ApiAddressDelete(memberAddressId);
            Dictionary<string, Object> dic = new Dictionary<string, object>();
            object returnValue = result.GetValue<Object>("return");
            if (returnValue != null && returnValue.ToString() == "202")
            {
                dic.Add("return", "ok");
            }
            else
            {
                dic.Add("return", "failure");
            }

            return dic;
        }

        /// <summary>
        /// 按ID获取收货地址
        /// </summary>
        /// <param name="memberAddressId"></param>
        /// <returns></returns>
        [GET("api/addressgetbyid/")]
        public Dictionary<string, Object> GetById(string memberAddressId)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiAddressInfo(memberAddressId);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取收货地址详情接口异常：" + e.Message);
                return null;
            }
        }
        /// <summary>
        /// Author:Mike
        /// Date:2015-10-20
        /// 根据Code获取省市区信息
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        [GET("api/GetAreaInfoByCode/")]
        public Dictionary<string, Object> GetAreaInfoByCode(string code)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiGetAreaByCode(code);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("根据Code获取省市区信息异常：" + e.Message);
                return null;
            }
        }
    }
}