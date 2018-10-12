using System.ComponentModel.DataAnnotations;
using System;
using Newtonsoft;


namespace WS.EKA.Model
{
    public class AdvancePaymentApplyLog : BaseModel
    {
        [Key]
        /// <summary>
        /// Guid
        /// </summary>
        public Guid Guid { get; set; }

        /// <summary>
        /// 会员名
        /// </summary>
        public string OrderNumber { get; set; }

        /// <summary>
        /// 商品标识
        /// </summary>


        /// <summary>
        /// 订单号
        /// </summary>
        public string OperateType { get; set; }

        /// <summary>
        /// 商品名称
        /// </summary>
        public decimal? CurrentAdvancePayment { get; set; }

        /// <summary>
        /// 标题
        /// </summary>
        public decimal? OperateMoney { get; set; }

        /// <summary>
        /// 内容
        /// </summary>
        public DateTime? Date { get; set; }

        /// <summary>
        /// 图片
        /// </summary>
        public int OperateStatus { get; set; }

        /// <summary>
        /// 是否审核
        /// </summary>
        public string Memo { get; set; }

        /// <summary>
        /// 添加人
        /// </summary>
        public string UserMemo { get; set; }

        /// <summary>
        /// 添加时间
        /// </summary>
        public string MemLoginID { get; set; }
        public Guid PaymentGuid { get; set; }
        /// <summary>
        /// 最后修改人
        /// </summary>
        public string PaymentName { get; set; }

        /// <summary>
        /// 最后修改时间
        /// </summary>
        public int IsDeleted { get; set; }

        /// <summary>
        /// 是否删除
        /// </summary>
        public string Bank { get; set; }

        /// <summary>
        /// 是否是分销商
        /// </summary>
        public string TrueName { get; set; }
        public string Account { get; set; }
        public string OperateMember { get; set; }

    }
}
