
using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
namespace WS.EKA.Model
{
    [Table("V_Product")]
    public class Product
    {
        [Key]
        public Guid Guid { get; set; }
        public string Name { get; set; }
        public string OriginalImge { get; set; }
        public string ThumbImage { get; set; }
        public string SmallImage { get; set; }
        public string RepertoryNumber { get; set; }
        public decimal Weight { get; set; }
        public int RepertoryCount { get; set; }
        public int RepertoryAlertCount { get; set; }
        public string UnitName { get; set; }
        public int PresentScore { get; set; }
        public int PresentRankScore { get; set; }
        public int SocreIntegral { get; set; }
        public int LimitBuyCount { get; set; }
        public decimal MarketPrice { get; set; }
        public decimal ShopPrice { get; set; }
        public string Brief { get; set; }
        public string Detail { get; set; }
        public int ClickCount { get; set; }
        public int CollectCount { get; set; }
        public int BuyCount { get; set; }
        public int CommentCount { get; set; }
        public int ReferCount { get; set; }
        public int SaleNumber { get; set; }
        /// <summary>
        /// 如果为上架,则为上架时间
        /// </summary>
        public DateTime ModifyTime { get; set; }
        /// <summary>
        /// 0表示未上架,1表示已上架
        /// 是否只显示上架状态的商品？
        /// </summary>
        public int IsSaled { get; set; }
        public int IsBest { get; set; }
        public int IsNew { get; set; }
        public int IsHot { get; set; }
        public int IsReal { get; set; }
        public int IsRecommend { get; set; }

        /// <summary>
        /// 0表示只能作为配件销售,1表示可作为商品销售和配件销售
        /// </summary>
        public int IsOnlySaled { get; set; }
        /// <summary>
        /// 详细页标题
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// 详细页描述
        /// </summary>
        public string Description { get; set; }
        public string Keywords { get; set; }
        public int OrderID { get; set; }
        public string BrandName { get; set; }
        /// <summary>
        /// 商品分类
        /// </summary>
        public int ProductCategoryID { get; set; }
        public string ActiveImage { get; set; }
        public string SupplierLoginID { get; set; }
        public int? BaskOrderLogCount { get; set; }
       

        [NotMapped]
        public List<string> Images { get; set; }

        public string MobileDetail { get; set; }

        public string AgentID { get; set; }

        /// <summary>
        /// 品牌ID
        /// </summary>
        public Guid BrandGuid { get; set; }

        /// <summary>
        /// 积分抵用金额
        /// </summary>
        [NotMapped]
        public string SocrePrice { get; set; }

        //------------------------------------------------------------------

        [NotMapped]
        public decimal OriginalPrice { get; set; }
        [NotMapped]
        public string PCUrl { get; set; }
    }
}
