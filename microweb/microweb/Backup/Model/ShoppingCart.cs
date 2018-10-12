using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace WS.EKA.Model
{
    [Table("V_ShoppingCart")]
    public class ShoppingCart : BaseModel
    {
        [Key]
        public Guid Guid { get; set; }
        public string MemLoginID { get; set; }
        public Guid ProductGuid { get; set; }
        public string OriginalImge { get; set; }
        public string Name { get; set; }
        public string RepertoryNumber { get; set; }
        public string Attributes { get; set; }
        public string ExtensionAttriutes { get; set; }
        public int BuyNumber { get; set; }
        public decimal MarketPrice { get; set; }
        public decimal BuyPrice { get; set; }
        public int IsJoinActivity { get; set; }
        public int IsPresent { get; set; }
        public DateTime CreateTime { get; set; }


        public string DetailedSpecifications { get; set; }
        public int? RepertoryCount { get; set; }
        public int? RepertoryCount2 { get; set; }

        public string AgentID { get; set; }
        [NotMapped]
        public string SpecificationValue { get; set; }
    }
}
