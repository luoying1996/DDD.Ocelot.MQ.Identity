using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace WS.EKA.Model
{
    [Table("V_MemberAddress")]
    public class MemberAddress : BaseModel
    {
        public MemberAddress()
        {
            Postalcode = string.Empty;
            Tel = string.Empty;
            Mobile = string.Empty;
            IsDefault = 0;
        }
        [Key]
        public Guid Guid { get; set; }
        public string NAME { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Postalcode { get; set; }
        public string Tel { get; set; }
        public string Mobile { get; set; }
        public int IsDefault { get; set; }
        public string MemLoginID { get; set; }
        public string CreateUser { get; set; }
        public DateTime CreateTime { get; set; }
        public string ModifyUser { get; set; }
        public DateTime ModifyTime { get; set; }
        public string Code { get; set; }

        public string IsDefaultCss { get; set; }

        [NotMapped]
        public int ProvinceId { get; set; }

        [NotMapped]
        public int CityId { get; set; }

        [NotMapped]
        public int AreaId { get; set; }
    }
}
