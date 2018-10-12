using System;
using System.Collections.Generic;
using AttributeRouting.Web.Http;
using WS.EKA.Model;
using WS.EKA.Portal.Filters;
using System.Web;
using WS.EKA.Portal.Helpers;
using NLog;

namespace WS.EKA.Portal.Controllers
{
    [AuthencationFilter(true)]
    public class ProductController : ControllerBase
    {

        private static Logger logger = LogManager.GetCurrentClassLogger();
        public ProductController()
        {

        }

        [GET("api/product/namelist")]
        public object GetProductNameList()
        {
            return null;
        }


        /// <summary>
        /// 根据分类,AgentID,是否开启产品线来获取分页产品
        /// </summary>
        /// <param name="ProductCategoryID">分类ID</param>
        /// <param name="pageIndex">当前页</param>
        /// <param name="pageCount">每页显示数量</param>
        /// <param name="sorts">排序</param>
        /// <param name="isASC">是否正序</param>
        /// <param name="agentID">分销商ID</param>
        /// <param name="sbool">是否开启产品线</param>
        /// <returns></returns>
        [GET("api/product/list/{ProductCategoryID}")]
        public Dictionary<string, Object> GetProductList2(int ProductCategoryID, int pageIndex, int pageCount, string sorts, bool isASC, string agentID, bool sbool)
        {
            try
            {
                Dictionary<string, Object> result = CommonRequest.ApiGetProductListByCategoryId(ProductCategoryID, pageIndex, pageCount, sorts, isASC, agentID, sbool);
                return result;
            }
            catch (Exception e)
            {
                logger.Error("获取产品列表接口异常：" + e);
                return null;
            }

        }
        //产品推荐，新品，热销
        [GET("api/product/type/")]
        public Dictionary<string, Object> GetProductList(int type, int pageIndex, int pageCount, string sorts, bool isASC, string agentID, bool sbool)
        {
            agentID = HttpUtility.UrlDecode(agentID, System.Text.UnicodeEncoding.GetEncoding("utf-8"));
            try
            {
                //1 新品 2 热销 3 促销 4 推荐商品
                var result = CommonRequest.ApiGetProductListByType(type, pageIndex, pageCount, sorts, isASC, agentID, sbool);
                return result;
            }
            catch (Exception e)
            {
                logger.Error("根据推荐类型获取产品列表接口异常：" + e);
                return null;
            }
        }

        //规格
        [GET("api/SpecificationList/")]
        public Dictionary<string, Object> GetSpecificationList(string ProductGuid)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiGetSpecificationList(ProductGuid);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取产品规格接口异常：" + e);
                return null;
            }
        }


        //查询规格的价格
        [GET("api/Specification/{productGuid}")]
        public object GetSpecification(string Detail, Guid productGuid, string memLoginID, string agentID, bool sbool)
        {
            var result = CommonRequest.ApiGetSpecificationProduct(Detail, productGuid, memLoginID, agentID, sbool);
            if (result != null && result.ContainsKey("Specification"))
            {
                return result["Specification"];
            }
            return null;
        }

        #region 扩展属性
        ////扩展属性
        //[GET("api/ProductAttibute/{id}")]
        //public StringContent GetProductAttibuteList(Guid id, string callback)
        //{
        //    var json = "";
        //    List<ProductAttribute> Spe = product.GetProductAttibuteList(id);

        //    if (Spe.Count > 0)
        //    {
        //        //进行分组
        //        var query = from l in Spe
        //                    group l by new { l.Name } into g
        //                    select new
        //                    {
        //                        Names = g.Key.Name,
        //                    };

        //        //循环分组内容 
        //        foreach (var q in query)
        //        {
        //            json += "{Attibute1: [";
        //            string strName = q.Names;
        //            foreach (var item in Spe)
        //            {
        //                if (strName == item.Name)
        //                {
        //                    json += "{Guid:\"" + item.Guid + "\",Name:\"" + item.Name + "\",AttrValue:\"" + System.Web.HttpContext.Current.Server.UrlEncode(item.AttrValue) + "\",";
        //                    json += "AtrributeValue:\"" + System.Web.HttpContext.Current.Server.UrlEncode(item.AtrributeValue) + "\",";
        //                    json += "AttributePrice:\"" + item.AttributePrice + "\",ProductGuid:\"" + item.ProductGuid + "\"},";
        //                }
        //            }

        //            json = json.TrimEnd(',');
        //            json += "],";
        //            json += "AttibuteName:\"" + q.Names + "\"},";
        //        }
        //        json = json.TrimEnd(',');
        //    }

        //    return new StringContent(callback + "([" + json + "])");
        //}
        //[GET("api/product/baskorderlog/{productID}")]
        //public Dictionary<string, Object> GetBaskOrderLogs(int startPage, int pageSize, Guid productID)
        //{
        //    var result = baskOrderLog.GetBaskOrderLogs(startPage, pageSize, productID);
        //    return result;
        //}

        //[GET("api/product/baskorderlogdetail/{baskOrderLogID}")]
        //public BaskOrderLogAndComments GetBaskOrderLogAndComments(Guid baskOrderLogID)
        //{
        //    var result = baskOrderLog.GetBaskOrderLogAndComments(baskOrderLogID);
        //    return result;
        //}

        //[GET("api/product/filter/{ProductCategoryID}")]
        //public Dictionary<string, Object> GetProductListByFilter(int ProductCategoryID, int pageIndex, int pageCount,
        //    string sorts, bool isASC, decimal minPrice, decimal maxPrice, string brand)
        //{
        //    if (minPrice == 0 && maxPrice == 0 && string.IsNullOrEmpty(brand))
        //    {
        //        StringBuilder sb = new StringBuilder();
        //        sb.Append(GetCurrentUser() + ":");
        //        sb.Append("price zone and brand name must not be null at the same time when filtering.");
        //        throw new Exception(sb.ToString());
        //    }
        //    return product.GetProductListByPriceZoneAndBrand(ProductCategoryID, pageIndex, pageCount,
        //        StrongQuickEnum<ProductSort>.Parse(sorts, true), isASC, minPrice, maxPrice, brand);
        //}
        #endregion

        /// <summary>
        /// 获取商品详情
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [GET("api/product/")]
        public object GetProductByID(Guid id, string MemLoginID, string agentID, bool sbool)
        {
            try
            {
                dynamic result = CommonRequest.ApiGetProductByID(id.ToString(), MemLoginID, agentID, sbool);
                if (result != null && result.ProductInfo != null)
                {
                    return result.ProductInfo;
                }
                return null;
            }
            catch (Exception e)
            {
                logger.Error("获取产品详情接口异常：" + e);
                return null;
            }
        }


        /// <summary>
        /// 按商品名称搜索商品
        /// </summary>
        /// <param name="ProductCategoryID"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageCount"></param>
        /// <param name="sorts"></param>
        /// <param name="isASC"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        [GET("api/productsearch/{ProductCategoryID}")]
        public Dictionary<string, Object> GetProductListBySerach(int ProductCategoryID, int pageIndex, int pageCount, string sorts, bool isASC, string name, string agentID, bool sbool,string BrandGuid)
        {
            try
            {
                agentID = HttpUtility.UrlDecode(agentID, System.Text.UnicodeEncoding.GetEncoding("utf-8"));
                Dictionary<string, Object> dic = CommonRequest.ApiSerachProduct(ProductCategoryID, pageIndex, pageCount, sorts, isASC, HttpContext.Current.Server.UrlDecode(name), agentID, sbool, BrandGuid);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("产品搜索接口异常：" + e);
                return null;
            }
        }

        /// <summary>
        /// 根据产品查询评论列表
        /// </summary>
        /// <param name="startPage"></param>
        /// <param name="pageSize"></param>
        /// <param name="productID"></param>
        /// <returns></returns>
        [GET("api/product/comment/{productID}")]
        public Dictionary<string, Object> GetProductCommentList(int startPage, int pageSize, Guid productID)
        {
            var dic = CommonRequest.ApiGetProductCommentList(startPage, pageSize, productID);
            return dic;
        }


        [GET("api/product/brandlist/{productCategoryID}")]
        public object GetProductBrand(int productCategoryID, string agentID)
        {
            var result = CommonRequest.ApiGetProductBrand(productCategoryID, agentID);
            return result;
        }
         /// <summary>
        /// 获取推荐品牌和所有品牌列表
        /// </summary>
        /// <param name="memLoginID"></param>
        /// <returns></returns>
        [GET("api/GetBrandList/")]
        public Dictionary<string, Object> GetBrandList(string agentId)
        {
            try
            {
                Dictionary<string, Object> dic = new Dictionary<string, object>();
                var resultModel = CommonRequest.ApiGetBrandList(agentId);
                if (resultModel != null)
                {
                    dic.Add("AllBrand", resultModel["data"]);
                }
                var recommondBrand = CommonRequest.ApiGetRecommondBrandList(agentId);
                if (recommondBrand != null)
                {
                    dic.Add("CommondBrand", recommondBrand["data"]);
                }

                return dic;
            }
            catch (Exception e)
            {
                logger.Error("获取推荐品牌和所有品牌列表接口异常:" + e.Message);
                return null;
            }
        }
        
         [POST("api/addProductComment/")]
        public Dictionary<string, Object> SubmitEvaluate(string model)
        {
            try
            {
                Dictionary<string, Object> dic = CommonRequest.ApiSubmitEvaluate(model);
                return dic;
            }
            catch (Exception e)
            {
                logger.Error("添加商品评论接口异常：" + e);
                return null;
            }
        }
    }
}
