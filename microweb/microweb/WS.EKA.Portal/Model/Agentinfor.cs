using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using WS.EKA.Model;

namespace WS.EKA.Portal.Model
{
    [Table("V_AgentUrl")]
    public class Agentinfor : BaseModel
    {
        [Key]
        public System.Guid Guid { get; set; }

        public string Email { get; set; }
        //public string MemLoginID { get; set; }
        //public string AgentOtherUrl { get; set; }
    }
}