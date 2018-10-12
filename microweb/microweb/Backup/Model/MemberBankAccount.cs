using System.ComponentModel.DataAnnotations;
using System;
using Newtonsoft;


namespace WS.EKA.Model
{
    public class MemberBankAccount:BaseModel
    {
        [Key]
        /// <summary>
        /// Guid
        /// </summary>
        public Guid Guid { get; set; }

        /// <summary>
        /// 会员名
        /// </summary>
        public string MemLoginID { get; set; }

        /// <summary>
        /// 银行名称
        /// </summary>
        public string BankName { get; set; }



        /// <summary>
        /// 开户人真实姓名
        /// </summary>
        public string BankAccountName { get; set; }
        /// <summary>
        /// 银行卡号
        /// </summary>
        public string BankAccountNumber { get; set; }

        /// <summary>
        /// 创建人
        /// </summary>
        public string CreateUser { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }

        /// <summary>
        /// 修改人
        /// </summary>
        public string ModifyUser { get; set; }

        /// <summary>
        /// 修改时间
        /// </summary>
        public DateTime ModifyTime { get; set; }

        /// <summary>
        /// 是否删除
        /// </summary>
        public int IsDeleted { get; set; }

    }
}