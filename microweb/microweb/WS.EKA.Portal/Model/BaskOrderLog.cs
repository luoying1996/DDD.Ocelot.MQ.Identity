using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WS.EKA.Model;

namespace WS.EKA.Portal.Models
{

    /// <summary>
    /// 晒单记录表
    /// </summary>
    public class BaskOrderLog : BaseModel
    {
        /// <summary>
        /// Guid
        /// </summary>

        public Guid Guid { get; set; }

        /// <summary>
        /// 会员名
        /// </summary>
        public string MemLoginID { get; set; }

        /// <summary>
        /// 商品标识
        /// </summary>
        public Guid? ProductGuid { get; set; }

        /// <summary>
        /// 订单号
        /// </summary>
        public string OrderNumber { get; set; }

        /// <summary>
        /// 商品名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 图片
        /// </summary>
        public string Image { get; set; }

        /// <summary>
        /// 是否审核
        /// </summary>
        public int? IsAudit { get; set; }

        /// <summary>
        /// 添加人
        /// </summary>
        public DateTime? CreateTime { get; set; }

        /// <summary>
        /// 添加时间
        /// </summary>
        public string CreateUser { get; set; }

        /// <summary>
        /// 最后修改人
        /// </summary>
        public string ModifyUser { get; set; }

        /// <summary>
        /// 最后修改时间
        /// </summary>
        public DateTime? ModifyTime { get; set; }

        /// <summary>
        /// 是否删除
        /// </summary>
        public int? IsDeleted { get; set; }

        /// <summary>
        /// 是否是分销商
        /// </summary>
        public string IsAgentId { get; set; }
        //public List<OrderProduct> ProductItem { get; set; }
    }
}
