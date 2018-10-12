using Castle.Components.DictionaryAdapter;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using WS.EKA.Model;

namespace WS.EKA.Portal.Model
{
   // [Table("V_Member")]
    public class Weixin_ShopMember : BaseModel
    {
        /// <summary>
        /// 自增ID
        /// </summary>
        //[Key]
        public int ID { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ShopMemLoginId { get; set; }
        /// <summary>
        /// 登录ID
        /// </summary>
        public string MemLoginId { get; set; }
        /// <summary>
        /// 组名
        /// </summary>
        public int Group { get; set; }
        /// <summary>
        /// 昵称
        /// </summary>
        public string nickname { get; set; }
        /// <summary>
        /// 性别
        /// </summary>
        public int sex { get; set; }
        /// <summary>
        /// 语言
        /// </summary>
        public string language { get; set; }
        /// <summary>
        /// 城市
        /// </summary>
        public string city { get; set; }
        /// <summary>
        /// 省份
        /// </summary>
        public string province { get; set; }
        /// <summary>
        /// 国家
        /// </summary>
        public string country { get; set; }
        /// <summary>
        /// 头像
        /// </summary>
        public string headimgurl { get; set; }
        /// <summary>
        /// 添加时间
        /// </summary>
        public string subscribe_time { get; set; }
        /// <summary>
        /// openid
        /// </summary>
        public string openid { get; set; }
    }
}