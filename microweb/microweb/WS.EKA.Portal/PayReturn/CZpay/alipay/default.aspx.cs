using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;
using System.Text;
using System.IO;
using System.Xml;
using Com.Alipay;
using NLog;

namespace WS.EKA.Portal.alipay
{
    public partial class _default1 : System.Web.UI.Page
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                PayAlipay();
            }
        }

        private void PayAlipay()
        {

            try
            {
                ////////////////////////////////////////////请求参数////////////////////////////////////////////
                //支付类型
                string payment_type = "1";
                //必填，不能修改
                //服务器异步通知页面路径
                string notify_url = ConfigurationManager.AppSettings["notify_url"].ToString();
                //需http://格式的完整路径，不能加?id=123这类自定义参数

                //页面跳转同步通知页面路径
                string return_url = ConfigurationManager.AppSettings["call_back_url"].ToString();
                //需http://格式的完整路径，不能加?id=123这类自定义参数，不能写成http://localhost/

                //商户订单号
                string out_trade_no = Request.QueryString["out_trade_no"].ToString();
                //商户网站订单系统中唯一订单号，必填

                //订单名称
                string subject = Request.QueryString["subject"].ToString();
                //必填

                //付款金额
                string total_fee = Request.QueryString["total_fee"];
                //必填

                ////////////////////////////////////////////////////////////////////////////////////////////////

                //把请求参数打包成数组
                SortedDictionary<string, string> sParaTemp = new SortedDictionary<string, string>();
                sParaTemp.Add("partner", Config.Partner);
                sParaTemp.Add("seller_id", Config.Seller_id);
                sParaTemp.Add("_input_charset", Config.Input_charset.ToLower());
                sParaTemp.Add("service", "alipay.wap.create.direct.pay.by.user");
                sParaTemp.Add("payment_type", payment_type);
                sParaTemp.Add("notify_url", notify_url);
                sParaTemp.Add("return_url", return_url);
                sParaTemp.Add("out_trade_no", out_trade_no);
                sParaTemp.Add("subject", subject);
                sParaTemp.Add("total_fee", total_fee);
                logger.Info("partner:" + Config.Partner);
                logger.Info("seller_id:" + Config.Seller_id);
                logger.Info("_input_charset:" + Config.Input_charset.ToLower());
                logger.Info("payment_type:" + payment_type);
                logger.Info("notify_url:" + notify_url);
                logger.Info("return_url:" + return_url);
                logger.Info("out_trade_no:" + out_trade_no);
                logger.Info("subject:" + subject);
                logger.Info("total_fee:" + total_fee);
                //建立请求
                string sHtmlText = Submit.BuildRequest(sParaTemp, "get", "确认");
                Response.Write(sHtmlText);
            }
            catch (Exception ex)
            {
                logger.Error("Default页面异常:" + ex);

            }

        }
    }
}