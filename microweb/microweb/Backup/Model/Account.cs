using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WS.EKA.Model
{
    [Table("V_Member")]
    public class Account : BaseModel
    {
        [Key]
        public System.Guid Guid { get; set; }

        [Required]

        [StringLength(100, MinimumLength = 6)]
        public string MemLoginID { get; set; }

        [Required]

        [StringLength(50, MinimumLength = 6)]
        public string Pwd { get; set; }

        public string Email { get; set; }

        public decimal? AdvancePayment { get; set; }

        public string LevelName { get; set; }

        public int? Score { get; set; }
        public int? RankScore { get; set; }

        public string AgentID { get; set; }
        public string Photo { get; set; }
        [NotMapped]
        public decimal? Discount { get; set; }

        public Nullable<Guid> MemberRankGuid { get; set; }
        [NotMapped]
        public bool RememberMe { get; set; }

        public string RealName { get; set; }
        public string QQ { get; set; }

        public string Mobile { get; set; }
        [NotMapped]
        public string WxOpenID { get; set; }

        public string CommendPeople { get; set; }

        public int Sex { get; set; }

        public int Tshou { get; set; }

    }
}
