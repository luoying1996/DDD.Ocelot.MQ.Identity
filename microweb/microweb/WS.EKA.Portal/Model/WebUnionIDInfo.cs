using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WS.EKA.Portal.Model
{
    /// <summary>
    /// 只包含OpenId的用户信息
    /// </summary>
    public class WeiXinUserSampleInfo
    {
        public string Access_Token { get; set; }
        public string Expires_In { get; set; }
        public string Refresh_Token { get; set; }
        public string OpenId { get; set; }

        public string Scope { get; set; }

        public string UnionId { get; set; }
    }
    public  class WebUnionIDInfo
    {
        public int subscribe { get; set; }
        public string openid { get; set; }
        public string nickname { get; set; }
        public int sex { get; set; }
        public string language { get; set; }
        public string city { get; set; }
        public string province { get; set; }
        public string country { get; set; }

        public string headimgurl { get; set; }
        public int subscribe_time { get; set; }
        public string unionid { get; set; }
        public string remark { get; set; }

        public int groupid { get; set; }

        public int[] tagid_list { get; set; }
    }
}