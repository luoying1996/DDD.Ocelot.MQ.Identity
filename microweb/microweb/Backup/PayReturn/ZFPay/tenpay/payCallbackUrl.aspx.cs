using System;
using System.Configuration;
using WS.EKA.Portal.Helpers;
using WS.EKA.Portal.tenpay.tenpayLib;

namespace WS.EKA.Portal.tenpay
{
    public partial class ZF_payCallbackUrl : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //密钥
            string key = ConfigurationManager.AppSettings["tenpay_key"].ToString();

            //创建ResponseHandler实例
            WapPayPageResponseHandler resHandler = new WapPayPageResponseHandler(Context);
            resHandler.setKey(key);

            //判断签名
            if (resHandler.isTenpaySign())
            {

                //支付结果
                string pay_result = resHandler.getParameter("pay_result");
                //商户订单号
                string sp_billno = resHandler.getParameter("sp_billno");
                //财付通订单号
                string transaction_id = resHandler.getParameter("transaction_id");
                //金额,以分为单位
                string total_fee = resHandler.getParameter("total_fee");

                if ("0".Equals(pay_result))
                {

                    dynamic orderInfo = CommonRequest.ApiGetOrderInfo(sp_billno);
                    if (orderInfo != null && orderInfo.Orderinfo != null)
                    {
                        if (orderInfo.Orderinfo.PaymentStatus < 2)
                        {
                            var dic = CommonRequest.ApiUpdateOrderStausByWeiXin(sp_billno, "手机财付通支付");

                            if (dic != null && dic.ContainsKey("return") && dic["return"].ToString() == "202")
                            {
                                Response.Write("success");
                            }
                            else
                            {
                                Response.Write("fail");
                            }
                        }
                    }
                }
                else
                {
                    //当做不成功处理
                    Response.Write("支付失败");
                }

            }
            else
            {
                Response.Write("认证签名失败");

            }

            //获取debug信息,建议把debug信息写入日志，方便定位问题
            //string debuginfo = resHandler.getDebugInfo();
            //Response.Write("<br/>debuginfo:" + debuginfo + "<br/>");

        }
    }
}