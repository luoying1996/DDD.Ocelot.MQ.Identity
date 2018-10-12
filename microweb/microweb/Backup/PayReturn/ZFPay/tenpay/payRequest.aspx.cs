using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using WS.EKA.Portal.tenpay.tenpayLib;
using System.IO;
using System.Configuration;

namespace WS.EKA.Portal.tenpay
{
    public partial class payRequest : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //商户号
            string bargainor_id = ConfigurationManager.AppSettings["bargainor_id"].ToString();

            //密钥
            string key = ConfigurationManager.AppSettings["tenpay_key"].ToString();


            //创建请求对象
            RequestHandler reqHandler = new RequestHandler(Context);

            //通信对象
            TenpayHttpClient httpClient = new TenpayHttpClient();

            //应答对象
            ClientResponseHandler resHandler = new ClientResponseHandler();


            //当前时间 yyyyMMdd
            string domain_url = ConfigurationManager.AppSettings["domain_url"].ToString();
            string date = DateTime.Now.ToString("yyyyMMdd");
            string sp_billno = Request["order_no"];
            string product_name = Request["product_name"];
            string order_price = Request["order_price"]; ;
            string remarkexplain = Request["remarkexplain"];
            double money = 0;
            if (null == Request["order_price"])
            {
                Response.End();
                return;
            }
            try
            {
                money = Convert.ToDouble(order_price);
            }
            catch
            {
                //Response.Write("支付金额格式错误！");
                //Response.End();
                //return;
            }
            if (null == sp_billno)
            {
                //生成订单10位序列号，此处用时间和随机数生成，商户根据自己调整，保证唯一
                sp_billno = DateTime.Now.ToString("HHmmss") + TenpayUtil.BuildRandomStr(4);
            }
            else
            {
                sp_billno = Request["order_no"].ToString();
            }


            reqHandler.init();
            //设置密钥
            reqHandler.setKey(key);
            reqHandler.setGateUrl("https://wap.tenpay.com/cgi-bin/wappayv2.0/wappay_init.cgi");



            //-----------------------------
            //设置支付初始化参数
            //-----------------------------
            reqHandler.setParameter("ver", "2.0");
            reqHandler.setParameter("charset", "1");
            reqHandler.setParameter("bank_type", "0");
            reqHandler.setParameter("desc", "订单" + sp_billno);
            reqHandler.setParameter("bargainor_id", bargainor_id);
            reqHandler.setParameter("sp_billno", sp_billno);
            reqHandler.setParameter("total_fee", (money * 100).ToString());
            reqHandler.setParameter("fee_type", "1");
            reqHandler.setParameter("notify_url", domain_url + "/PayRetrun/ZFPay/tenpay/payNotifyUrl.aspx");
            reqHandler.setParameter("callback_url", domain_url + "/PayRetrun/ZFPay/tenpay/payCallbackUrl.aspx");
            reqHandler.setParameter("attach", "attach");

            string initRequestUrl = reqHandler.getRequestURL();
            //设置请求内容
            httpClient.setReqContent(initRequestUrl);
            //设置超时
            httpClient.setTimeOut(5);

            string rescontent = "";
            string payRequestUrl = "";
            //后台调用
            if (httpClient.call())
            {
                //获取结果
                rescontent = httpClient.getResContent();

                //设置结果参数
                resHandler.setContent(rescontent);

                string token_id = resHandler.getParameter("token_id");

                //成功，则token_id有只
                if (token_id != "")
                {
                    //生成支付请求
                    payRequestUrl = "https://wap.tenpay.com/cgi-bin/wappayv2.0/wappay_gate.cgi?token_id=" + TenpayUtil.UrlEncode(token_id, Request.ContentEncoding.BodyName);

                    //Get的实现方式
                    string a_link = "<script type='text/javascript'>window.location = '" + payRequestUrl + "';</script>";
                    Response.Write(a_link);

                }
                else
                {
                    //获取token_id调用失败 ，显示错误 页面
                    Response.Write("支付初始化错误:" + resHandler.getParameter("err_info") + "<br>");
                }

            }
            else
            {
                //后台调用通信失败
                Response.Write("call err:" + httpClient.getErrInfo() + "<br>" + httpClient.getResponseCode() + "<br>");
                //有可能因为网络原因，请求已经处理，但未收到应答。
            }


            //获取debug信息,建议把请求、应答内容、debug信息，通信返回码写入日志，方便定位问题
            /*
            Response.Write("http res:" + httpClient.getResponseCode() + "," + httpClient.getErrInfo() + "<br>");
            Response.Write("req url:" + initRequestUrl + "<br/>");
            Response.Write("req debug:" + reqHandler.getDebugInfo() + "<br/>");
            Response.Write("res content:" + Server.HtmlEncode(rescontent) + "<br/>");
            Response.Write("res debug:" + Server.HtmlEncode(resHandler.getDebugInfo()) + "<br/>");
            Response.Write("pay req url:" + payRequestUrl + "<br/>");
             */
        }
    }
}