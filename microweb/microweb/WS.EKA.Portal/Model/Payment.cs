using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace WS.EKA.Model
{
    [Table("V_Payment")]
    public class Payment : BaseModel
    {
        [Key]
        public Guid Guid { get; set; }
        /// <summary>
        /// Xpay.aspx----易付通
        /// Alipay.aspx-----支付宝
        /// Allbuy.aspx----好购
        /// Yeepay.aspx-----易宝
        /// YeepaySZX.aspx----易宝神州行
        /// TenpayMed.aspx----财付通中介保护
        /// </summary>


        public string PaymentType { get; set; }
        public string NAME { get; set; }
        public string MerchantCode { get; set; }
        /// <summary>
        /// 0不支持,1支持
        /// </summary>
        public int IsCOD { get; set; }
        public int ForAdvancePayment { get; set; }

        public int OrderID { get; set; }
        public int IsPercent { get; set; }
        public decimal Charge { get; set; }

        public string Public_Key { get; set; }
        public string Private_Key { get; set; }
        public string SecretKey { get; set; }
        public string Partner { get; set; }

        public string Email { get; set; }
    }

    public class PayType
    {
        public string TypeName { get; set; }
        public int TypeValue { get; set; }
    }
}
