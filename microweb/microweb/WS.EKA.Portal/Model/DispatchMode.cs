using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace WS.EKA.Model
{
    [Table("V_DispatchMode")]
    public class DispatchMode : BaseModel
    {
        public DispatchMode()
        {
            IsPayArrived = 0;
            SafeCost = 0;
        }
        [Key]
        public Guid Guid { get; set; }
        public string NAME { get; set; }
        /// <summary>
        /// 0表示不支持,1表示支持
        /// </summary>
        public int IsPayArrived { get; set; }
        public decimal SafeCost { get; set; }
        public string Formula { get; set; }
        public int OrderID { get; set; }

        /// <summary>
        /// 统一配送区域0，特殊配送区域为1
        /// </summary>
        public int DispatchType { get; set; }

        /// <summary>
        /// 配送费用
        /// </summary>
        [NotMapped]
        public decimal peipr { get; set; }

        /// <summary>
        /// 保价费用
        /// </summary>
        [NotMapped]
        public decimal baopr { get; set; }
    }
}
