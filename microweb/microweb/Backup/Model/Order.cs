using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;
using WS.EKA.Model;

namespace WS.EKA.Model
{
    [Table("V_Order")]
    public class Order : BaseModel
    {
        [Key]
        public Guid Guid { get; set; }
        public string MemLoginID { get; set; }
        public string OrderNumber { get; set; }
        /// <summary>
        /// 0，未确认；1，已确认；2.作废
        ///（2，已取消；3，无效—— 无效）
        ///5完成
        /// </summary>
        public int OderStatus { get; set; }
        /// <summary>
        /// 0，未发货；1，已发货；
        ///2，已收货；3，配货中,4，已退货；
        /// </summary>
        public int ShipmentStatus { get; set; }
        /// <summary>
        /// 0 未付款;1 付款中;2 已付款;3 退款
        /// </summary>
        public int PaymentStatus { get; set; }

        /// <summary>
        /// 收货人姓名
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 收货人电子邮件
        /// </summary>
        public string Email { get; set; }
        public string Address { get; set; }
        public string Postalcode { get; set; }
        public string Tel { get; set; }
        public string Mobile { get; set; }

        public Guid DispatchModeGuid { get; set; }
        public Guid PaymentGuid { get; set; }
        public Guid PackGuid { get; set; }
        public Guid BlessCardGuid { get; set; }

        [NotMapped]
        public DispatchMode DispatchMode { get; set; }
        [NotMapped]
        public Payment Payment { get; set; }
        
        public decimal ProductPrice { get; set; }
        public decimal DispatchPrice { get; set; }
        public decimal InsurePrice { get; set; }
        public decimal PaymentPrice { get; set; }
        public decimal PackPrice { get; set; }
        public decimal BlessCardPrice { get; set; }
        public decimal AlreadPayPrice { get; set; }
        public decimal SurplusPrice { get; set; }
        public int UseScore { get; set; }
        public decimal ScorePrice { get; set; }
        public decimal ShouldPayPrice { get; set; }

        public DateTime CreateTime { get; set; }
        public DateTime? ConfirmTime { get; set; }
        public DateTime? PayTime { get; set; }
        public DateTime? DispatchTime { get; set; }
        /// <summary>
        /// 发货单号
        /// </summary>
        public string ShipmentNumber { get; set; }
        /// <summary>
        /// 付款备注
        /// </summary>
        public string PayMemo { get; set; }

        /// <summary>
        /// SalesPromotion.Guid
        /// </summary>
        public Guid ActivityGuid { get; set; }
        /// <summary>
        /// 发票类型
        /// </summary>
        public string InvoiceType { get; set; }
        public string InvoiceTitle { get; set; }
        public string InvoiceContent { get; set; }
        /// <summary>
        /// 缺货处理方式:
        /// 等待所有商品备齐后再发；
        /// 取消订单；
        /// 与店主协商;
        /// </summary>
        public string OutOfStockOperate { get; set; }
        public string ClientToSellerMsg { get; set; }
        /// <summary>
        /// 发票税额
        /// </summary>
        public decimal InvoiceTax { get; set; }
        /// <summary>
        /// 折扣金额
        /// </summary>
        public decimal Discount { get; set; }
        /// <summary>
        /// 保证金
        /// </summary>
        public decimal Deposit { get; set; }
        public int IsPayDeposit { get; set; }

        public string CreateUser { get; set; }
        public string ModifyUser { get; set; }
        public DateTime ModifyTime { get; set; }
        /// <summary>
        /// 配送区域编码
        /// </summary>
        public string RegionCode { get; set; }
        /// <summary>
        /// -1表示无活动，0送积分，1赠送优惠券
        /// </summary>
        public int JoinActiveType { get; set; }
        /// <summary>
        /// 赠送值
        /// </summary>
        public string ActvieContent { get; set; }
        /// <summary>
        /// 使用优惠券ID
        /// </summary>
        public string UsedFavourTicket { get; set; }
        /// <summary>
        /// 物流公司编码
        /// </summary>
        public string LogisticsCompanyCode { get; set; }

        public List<OrderProduct> ProductList { get; set; }
        //public virtual ICollection<OrderProduct> ProductList { get; set; }

        public string AgentID { get; set; }

        /// <summary>
        /// 0货到付款 1在线支付 2线下支付
        /// </summary>
        public int? PayType { get; set; }

        [NotMapped]
        public string PayTypeName { get; set; }

        public string PaymentName { get; set; }

        /// <summary>
        /// 订单状态名称
        /// </summary>
        [NotMapped]
        public string StatusName { get; set; }

        public int BuyType { get; set; }
    }
}
