using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;
using System.Net;
using System.Text;
using System.IO;
using System.Security.Cryptography;
using System.Xml.Linq;
using NLog;


namespace WS.EKA.Portal.wxpay
{
    public partial class pay : System.Web.UI.Page
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        public string appid = string.Empty;
        public string paySign = string.Empty;
        public string timeStamp = string.Empty;
        public string nonceStr = string.Empty;
        public string package = string.Empty;
        public string signType = string.Empty;

        public string out_trade_no = string.Empty;
        public string total_fee = string.Empty;
        public string cardid = string.Empty;
        public string cardpwd = string.Empty;
        public string memid = string.Empty;

        protected void Page_Load(object sender, EventArgs e)
        {
            //登录用户名
            memid = Request.QueryString["memid"] ?? "";
            //微信方提供的APPID，从config配置文件中获取
            appid = ConfigurationManager.AppSettings["appid"].ToString();
            //接口文档里的参数（目前不知用处）
            string auth_code = Request.QueryString["auth_code"] ?? "";
            //商品描述
            string body = Request.QueryString["body"] ?? "";
            //微信支付分配的终端设备号
            string device_info = Request.QueryString["device_info"] ?? "";
            //微信方提供的mch_id，从config配置文件中获取
            string mch_id = ConfigurationManager.AppSettings["mch_id"].ToString();
            //随机字符串
            string nonce_str = TenpayUtil.getNoncestr();
            //通知地址，从config配置文件中获取
            string notify_url = ConfigurationManager.AppSettings["domain_url"].ToString() + "/PayRetrun/ZFPay/wxpay/WeiXinNotifyUrl.aspx";
            //订单号
            out_trade_no = Request.QueryString["out_trade_no"] ?? "";
            body = "ORDER" + out_trade_no;
            //用户OPENID
            string openid = Request.QueryString["openid"] ?? "";
            //IP
            string spbill_create_ip = Request.UserHostAddress;
            //金额
            total_fee = Request.QueryString["total_fee"] ?? "";
            total_fee = Convert.ToInt32((Convert.ToDecimal(total_fee) * 100)).ToString();//微信的单位为分，所以乘100

            //附加数据原样返回
            string attach = string.Format("memid|{0}", memid);

            cardid = Request.QueryString["cardid"] ?? "";
            cardpwd = Request.QueryString["cardpwd"] ?? "";

            //获取package包

            //商户密钥，从config配置文件中获取
            string key = ConfigurationManager.AppSettings["key"].ToString();

            Random rd = new Random();

            //创建支付应答对象
            RequestHandler packageReqHandler = new RequestHandler(Context);
            //初始化
            packageReqHandler.init();

            packageReqHandler.setParameter("appid", appid);
            packageReqHandler.setParameter("body", body);
            packageReqHandler.setParameter("mch_id", mch_id);
            packageReqHandler.setParameter("nonce_str", nonce_str.ToLower());
            packageReqHandler.setParameter("notify_url", notify_url);
            packageReqHandler.setParameter("openid", openid);
            packageReqHandler.setParameter("out_trade_no", out_trade_no + rd.Next(1000, 9999).ToString());//这里为了重复提交的时候订单号不重复，后面跟随机字符串
            packageReqHandler.setParameter("spbill_create_ip", "192.168.1.1");
            packageReqHandler.setParameter("total_fee", total_fee);//商品金额,以分为单位(money * 100).ToString()
            packageReqHandler.setParameter("trade_type", "JSAPI");

            string sign = packageReqHandler.createMd5Sign("key", key);
            packageReqHandler.setParameter("sign", sign);

            string data = packageReqHandler.parseXML();
               //openid
            using (StreamWriter sw = new StreamWriter(@"D:/log/log.txt"))
            {
                sw.WriteLine("Time:" + DateTime.Now);
                sw.WriteLine("appid:" + appid);
                sw.WriteLine("mch_id:" + mch_id);
                sw.WriteLine("appid:" + appid);
                sw.WriteLine("openID:" + openid);

            } ;



            var result = TenPayV3.Unifiedorder(data, "https://api.mch.weixin.qq.com/pay/unifiedorder");
            var res = XDocument.Parse(result);



            //			< xml >
            //  < return_code >< ![CDATA[SUCCESS]] ></ return_code >
            //  < return_msg >< ![CDATA[OK]] ></ return_msg >
            //  < appid >< ![CDATA[wx256bc347404257df]] ></ appid >
            //  < mch_id >< ![CDATA[1480613602]] ></ mch_id >
            //  < nonce_str >< ![CDATA[HH1a6ptNUQ78XqJh]] ></ nonce_str >
            //  < sign >< ![CDATA[AF533139575A177665B8B81B7E4BA2A2]] ></ sign >
            //  < result_code >< ![CDATA[SUCCESS]] ></ result_code >
            //  < prepay_id >< ![CDATA[wx20171020173609dd72165a850347375915]] ></ prepay_id >
            //  < trade_type >< ![CDATA[JSAPI]] ></ trade_type >
            //</ xml >

            logger.Info("---------------------------------日志开始----------------------------------------");
            logger.Info("appid:" + appid);
            logger.Info("body:" + body);
            logger.Info("mch_id:" + mch_id);
            logger.Info("nonce_str:" + nonce_str);
            logger.Info("openid:" + openid);
            logger.Info("notify_url:" + notify_url);
            logger.Info("out_trade_no:" + out_trade_no);
            logger.Info("spbill_create_ip:" + spbill_create_ip);
            logger.Info("total_fee:" + total_fee);
            logger.Info("trade_type:" + "JSAPI");
            logger.Info("XMLValue:" + res.Element("xml").Element("return_code").Value);
            logger.Info("XMLValue:" + res.Element("xml").Element("return_msg").Value);
            logger.Info("---------------------------------日志结束----------------------------------------");

            string prepay_id = res.Root.Elements().FirstOrDefault(item=>item.Name== "prepay_id").Value;

            try
            {

                if (res.Element("xml").Element("return_code").Value == "SUCCESS")
                {

                    prepay_id = res.Element("xml").Element("prepay_id").Value;
                }
            }
            catch (Exception)
            {

            }

            //调起微信支付签名
            timeStamp = TenpayUtil.getTimestamp();
            nonceStr = TenpayUtil.getNoncestr().ToLower();
            signType = "MD5";
            package = string.Format("prepay_id={0}", prepay_id);

            //设置支付参数
            RequestHandler paySignReqHandler = new RequestHandler(Context);

            paySignReqHandler.setParameter("appId", appid);
            paySignReqHandler.setParameter("timeStamp", timeStamp);
            paySignReqHandler.setParameter("nonceStr", nonceStr);
            paySignReqHandler.setParameter("package", package);
            paySignReqHandler.setParameter("signType", "MD5");

			paySign = paySignReqHandler.createMd5Sign("key", key);

            //获取debug信息,建议把请求和debug信息写入日志，方便定位问题
            //string pakcageDebuginfo = packageReqHandler.getDebugInfo();
            //Response.Write("<br/>pakcageDebuginfo:" + pakcageDebuginfo + "<br/>");
            //string paySignDebuginfo = paySignReqHandler.getDebugInfo();
            //Response.Write("<br/>paySignDebuginfo:" + paySignDebuginfo + "<br/>");
        }
    }
}