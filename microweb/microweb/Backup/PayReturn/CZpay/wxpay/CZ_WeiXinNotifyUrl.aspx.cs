using System;
using System.Collections.Generic;
using System.IO;
using System.Xml;
using WS.EKA.Portal.Helpers;
using NLog;
using System.Net;
using System.Web.Script.Serialization;
using System.Text;

namespace WS.EKA.Portal.PayRetrun.CZpay.wxpay
{
    public partial class CZ_WeiXinNotifyUrl : System.Web.UI.Page
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                logger.Info("------------------------------支付回调订单处理开始------------------------------------");
                #region 获取参数
                string OpenId = string.Empty;
                string AppId = string.Empty;
                string IsSubscribe = string.Empty;
                string TimeStamp = string.Empty;
                string NonceStr = string.Empty;
                string AppSignature = string.Empty;
                string SignMethod = string.Empty;
                string return_code = string.Empty;
                string out_trade_no = string.Empty;
                string total_fee = string.Empty;
                string postStr = PostInput();


                if (!string.IsNullOrEmpty(postStr))
                {
                    XmlDocument doc = new XmlDocument();
                    doc.LoadXml(postStr);
                    XmlElement rootElement = doc.DocumentElement;
                    //微信信息请求xml
                    OpenId = rootElement.SelectSingleNode("openid").InnerText;
                    AppId = rootElement.SelectSingleNode("appid").InnerText;
                    IsSubscribe = rootElement.SelectSingleNode("is_subscribe").InnerText;
                    TimeStamp = rootElement.SelectSingleNode("time_end").InnerText;
                    return_code = rootElement.SelectSingleNode("return_code").InnerText;
                    out_trade_no = rootElement.SelectSingleNode("out_trade_no").InnerText;
                    total_fee = rootElement.SelectSingleNode("total_fee").InnerText;
                }

                #endregion

                #region 订单相关业务逻辑处理

                if (return_code == "SUCCESS")
                {
                    var dic = CommonRequest.ApiUpdateRechargeByOrderNumber(out_trade_no);
                }
                #endregion
                logger.Info("------------------------------支付回调订单处理结束------------------------------------");
            }
            catch (Exception ex)
            {
                logger.Error("回调异常:" + ex);
            }

        }



        #region tool

        /// <summary>
        /// 获取post返回来的数据
        /// </summary>
        /// <returns></returns>
        private string PostInput()
        {
            System.IO.Stream s = System.Web.HttpContext.Current.Request.InputStream;
            byte[] b = new byte[s.Length];
            s.Read(b, 0, (int)s.Length);
            return System.Text.Encoding.UTF8.GetString(b);
        }

        /// <summary>
        /// POST提交数据
        /// </summary>
        /// <param name="jsonStr"></param>
        /// <param name="url"></param>
        /// <returns></returns>
        public string GoFaHuo(string jsonStr, string url)
        {
            WebRequest request = WebRequest.Create(url);

            request.Method = "POST";

            string postData = jsonStr;

            byte[] byteArray = Encoding.UTF8.GetBytes(postData);

            request.ContentType = "application/x-www-form-urlencoded";

            request.ContentLength = byteArray.Length;

            Stream dataStream = request.GetRequestStream();

            dataStream.Write(byteArray, 0, byteArray.Length);

            dataStream.Close();

            WebResponse response = request.GetResponse();

            dataStream = response.GetResponseStream();

            StreamReader reader = new StreamReader(dataStream);

            string responseFromServer = reader.ReadToEnd();

            reader.Close();
            dataStream.Close();
            response.Close();

            return responseFromServer;
        }

        /// <summary>
        /// 获取Token
        /// </summary>
        /// <param name="appid"></param>
        /// <param name="secret"></param>
        /// <returns></returns>
        public string GetToken(string appid, string secret)
        {
            string url = string.Format("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={0}&secret={1}", appid, secret);

            WebRequest req = WebRequest.Create(url);
            req.Method = "GET";   //指定提交的Method，可以为POST和GET，一定要大写  

            WebResponse res = req.GetResponse();

            System.Text.Encoding resEncoding = System.Text.Encoding.GetEncoding("utf-8");//接收的编码  
            StreamReader reader = new StreamReader(res.GetResponseStream(), resEncoding);

            string html = reader.ReadToEnd();     //接收的Html  

            reader.Close();
            res.Close();


            JavaScriptSerializer jss = new JavaScriptSerializer();
            var obj = jss.DeserializeObject(html);

            Dictionary<string, object> dic = (Dictionary<string, object>)obj;

            if (dic != null && dic.Count > 0 && dic.ContainsKey("access_token"))
            {
                return dic["access_token"].ToString();
            }
            return "";
        }

        /// <summary>
        /// 生成JSON字符串
        /// </summary>
        /// <param name="dic"></param>
        /// <returns></returns>
        public string ToJson(Dictionary<string, string> dic)
        {
            System.Web.Script.Serialization.JavaScriptSerializer javaScriptSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            System.Collections.ArrayList arrayList = new System.Collections.ArrayList();
            arrayList.Add(dic); //ArrayList集合中添加键值

            return javaScriptSerializer.Serialize(arrayList);
        }

        /// <summary>
        /// DateTime时间格式转换为Unix时间戳格式
        /// </summary>
        /// <param name=”time”></param>
        /// <returns></returns>
        private int ConvertDateTimeInt(System.DateTime time)
        {
            System.DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1));
            return (int)(time - startTime).TotalSeconds;
        }

        #endregion
    }
}