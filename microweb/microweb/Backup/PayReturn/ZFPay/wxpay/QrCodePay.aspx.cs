using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml.Linq;
using System.Configuration;
using com.google.zxing;
using com.google.zxing.common;
using System.Drawing;
using System.IO;

namespace WS.EKA.Portal.wxpay
{
    /// <summary>
    /// 二维码微信支付
    /// </summary>
    public partial class QrCodePay : System.Web.UI.Page
    {
        public string appid = string.Empty;
        public string paySign = string.Empty;
        public string timeStamp = string.Empty;
        public string nonceStr = string.Empty;
        public string package = string.Empty;
        public string signType = string.Empty;

        public string out_trade_no = string.Empty;
        public string total_fee = string.Empty;

        protected void Page_Load(object sender, EventArgs e)
        {
            //登录用户名
            string memid = Request.QueryString["memid"] ?? "";
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
            string notify_url = ConfigurationManager.AppSettings["domain_url"].ToString() + "/wxpay/WeiXinNotifyUrl.aspx";
            //订单号
            out_trade_no = Request.QueryString["out_trade_no"] ?? "";
            //IP
            string spbill_create_ip = Request.UserHostAddress;
            //金额
            total_fee = Request.QueryString["total_fee"] ?? "";
            total_fee = Convert.ToInt32((Convert.ToDecimal(total_fee) * 100)).ToString();//微信的单位为分，所以乘100

            //附加数据原样返回
            string attach = string.Format("memid={0}|orderid={1}", memid, out_trade_no);

            //由于二维码支付每次发起支付的订单ID都要唯一,所以这里使用时间字段接在订单末尾获取时截取掉
            out_trade_no =out_trade_no + "|"+ DateTime.Now.ToString("yyyyMMddHHmmss");

            //获取package包

            //商户密钥，从config配置文件中获取
            string key = ConfigurationManager.AppSettings["key"].ToString();

            //创建支付应答对象
            RequestHandler packageReqHandler = new RequestHandler(Context);
            //初始化
            packageReqHandler.init();

            packageReqHandler.setParameter("appid", appid);
            packageReqHandler.setParameter("body", body);
            packageReqHandler.setParameter("mch_id", mch_id);
            packageReqHandler.setParameter("nonce_str", nonce_str.ToLower());
            packageReqHandler.setParameter("notify_url", notify_url);
            
            packageReqHandler.setParameter("out_trade_no", out_trade_no);
            packageReqHandler.setParameter("spbill_create_ip", spbill_create_ip);
            packageReqHandler.setParameter("total_fee", total_fee);//商品金额,以分为单位(money * 100).ToString()
            packageReqHandler.setParameter("trade_type", "NATIVE");
            packageReqHandler.setParameter("product_id", out_trade_no);

            string sign = packageReqHandler.createMd5Sign("key", key);
            packageReqHandler.setParameter("sign", sign);

            string data = packageReqHandler.parseXML();

            var result = TenPayV3.Unifiedorder(data, "https://api.mch.weixin.qq.com/pay/unifiedorder");
            var res = XDocument.Parse(result);

            string code_url = string.Empty;

            try
            {
                if (res.Element("xml").Element("return_code").Value == "SUCCESS")
                {
                    code_url = res.Element("xml").Element("code_url").Value;
                }
            }
            catch (Exception)
            {

            }

            if (!string.IsNullOrEmpty(code_url))
            {
                //生成二维码图片

                MultiFormatWriter mutiWriter = new com.google.zxing.MultiFormatWriter();
                ByteMatrix bm = mutiWriter.encode(code_url, com.google.zxing.BarcodeFormat.QR_CODE, 300, 300);
                Bitmap img = bm.ToBitmap();
                MemoryStream ms = new MemoryStream();
                img.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                HttpContext.Current.Response.ClearContent(); //需要输出图象信息 要修改HTTP头 
                HttpContext.Current.Response.ContentType = "image/jpeg";
                HttpContext.Current.Response.BinaryWrite(ms.ToArray());
                img.Dispose();
                ms.Dispose();
                HttpContext.Current.Response.End();
            }
        }
    }
}