using System;
using System.Collections.Generic;
using System.Web.Http;
using AttributeRouting.Web.Http;
using WS.EKA.Portal.Filters;
using WS.EKA.Portal.Helpers;
using NLog;

namespace WS.EKA.Portal.Controllers
{
    [AuthencationFilter(true)]
    public class ShoppingCartController : ApiController
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        public ShoppingCartController()
        {
        }

        /// <summary>
        /// 按用户名获取购物车列表
        /// </summary>
        /// <param name="loginId"></param>
        /// <returns></returns>
        [GET("api/shoppingcart/{loginId}")]
        public Dictionary<string, Object> GetByMember(string loginId, string agentID)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiGetShoppingCartByMember(loginId, agentID);
                return dic;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        /// <summary>
        /// 获取选中的购物车
        /// </summary>
        /// <param name="MemLoginID"></param>
        /// <returns></returns>
        [GET("api/getcartbyselected/")]
        public Dictionary<string, Object> GetCartBySelected(string MemLoginID, string agentID, int IsSelected)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.GetIsSelectByMember(MemLoginID, agentID, IsSelected);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("getcartbyselected接口异常:" + e.Message);
                return null;
            }
        }

        /// <summary>
        /// 添加购物车 
        /// </summary>
        /// <param name="cart"></param>
        /// <returns></returns>
        [POST("api/shoppingcart/")]
        public Dictionary<string, Object> Post(string cart)
        {
            Dictionary<string, Object> dic = CommonRequest.ApiPostShoppingCartAdd(cart);
            return dic;
        }

        /// <summary>
        /// 更新购物车购买数量
        /// </summary>
        /// <returns></returns>
        [GET("api/updatecartbuynumber/")]
        public Dictionary<string, Object> UpdateCartBuyNumber(string numStr, string agentID, string MemLoginID)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.UpdateManyShoppingCartNum(numStr, agentID, MemLoginID);
                return dic;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        /// <summary>
        /// 删除购物车
        /// </summary>
        /// <returns></returns>
        [GET("api/removecart/")]
        public Dictionary<string, Object> RemoveCart(string ids)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();

                dic = CommonRequest.ApiGetShoppingCartDelete(ids);
                return dic;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        /// <summary>
        /// 清除购物车选中状态
        /// </summary>
        /// <param name="MemLoginID"></param>
        /// <returns></returns>
        [GET("api/clearcartselected/")]
        public Dictionary<string, Object> ClearCartSelected(string MemLoginID, string agentID)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiUpdateNoIsSelected(MemLoginID, agentID);
                return dic;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        /// <summary>
        /// 获取产品的安全购买数量
        /// 例如:限购多少,规格库存多少,库存多少
        /// Author:Mike
        /// Date:2015-11-2
        /// </summary>
        /// <param name="memLoginID">登录ID</param>
        /// <param name="detailSpec">规格详情</param>
        /// <param name="productGuid">产品GUID</param>
        /// <returns></returns>
        [GET("api/ProductSafetyCount/")]
        public Dictionary<string, Object> GetProductSafetyCount(string detailSpec, string productGuid)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiGetProductSafetyCount(detailSpec, productGuid);
                return dic;
            }
            catch (Exception e)
            {
                return null;
            }
        }
    }
}
