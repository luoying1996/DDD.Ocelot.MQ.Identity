using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace WS.EKA.Model
{
    [Table("V_OrderProduct")]
    public class OrderProduct : BaseModel
    {
        [Key]
        public Guid Guid { get; set; }
        public Guid ProductGuid { get; set; }

        public string Attributes { get; set; }
        public string ExtensionAttriutes { get; set; }

        public string NAME { get; set; }
        public int BuyNumber { get; set; }
        public decimal BuyPrice { get; set; }
        public int IsShipment { get; set; }
        public int IsJoinActivity { get; set; }
        public int IsPresent { get; set; }

        public Guid OrderInfoGuid { get; set; }

        public string OriginalImge { get; set; }

        public string DetailedSpecifications { get; set; }

        [NotMapped]
        public int? PayType { get; set; }

        //public string MemLoginID { get; set; }

        //public string ShopID { get; set; }
        //public string ProductImg { get; set; }


        //public string SpecificationName { get; set; }
        //public string SpecificationValue { get; set; }
    }
}
