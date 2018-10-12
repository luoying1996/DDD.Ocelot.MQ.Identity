using System;
using System.Collections.Generic;
using System.IO;
using System.Xml;
using WS.EKA.Portal.Helpers;
using NLog;
using System.Net;
using System.Web.Script.Serialization;
using System.Text;


namespace WS.EKA.Portal.wxpay
{
    public partial class WeiXinNotifyUrl : System.Web.UI.Page
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                logger.Info("------------------------------֧���ص���������ʼ------------------------------------");
                #region ��ȡ����
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
                    //΢����Ϣ����xml
                    OpenId = rootElement.SelectSingleNode("openid").InnerText;
                    AppId = rootElement.SelectSingleNode("appid").InnerText;
                    IsSubscribe = rootElement.SelectSingleNode("is_subscribe").InnerText;
                    TimeStamp = rootElement.SelectSingleNode("time_end").InnerText;
                    return_code = rootElement.SelectSingleNode("return_code").InnerText;
                    out_trade_no = rootElement.SelectSingleNode("out_trade_no").InnerText;
                    total_fee = rootElement.SelectSingleNode("total_fee").InnerText;
                }

                #endregion

                #region �������ҵ���߼�����

                if (return_code == "SUCCESS")
                {
                    out_trade_no = out_trade_no.Substring(0, out_trade_no.Length - 4);
                    logger.Info("out_trade_no��" + out_trade_no);
                    dynamic orderInfo = CommonRequest.ApiGetOrderInfo(out_trade_no);
                    if (orderInfo != null && orderInfo.Orderinfo != null)
                    {
                        if (orderInfo.Orderinfo.PaymentStatus < 2 && Convert.ToDecimal((orderInfo.Orderinfo.ShouldPayPrice * 100)) == Convert.ToDecimal(total_fee))
                        {
                            var dic = CommonRequest.ApiUpdateOrderStausByWeiXin(out_trade_no, "΢��֧��");

                            if (dic != null && dic.ContainsKey("return") && dic["return"].ToString() == "202")
                            {
                                Response.Write("success");
                                logger.Info("������������success");
                            }
                            else
                            {
                                Response.Write("fail");
                                logger.Info("������������fail");
                            }
                        }
                    }
                }
                #endregion
                logger.Info("------------------------------֧���ص������������------------------------------------");
            }
            catch (Exception ex)
            {
                logger.Error("�ص��쳣:" + ex);
            }

        }



        #region tool

        /// <summary>
        /// ��ȡpost������������
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
        /// POST�ύ����
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
        /// ��ȡToken
        /// </summary>
        /// <param name="appid"></param>
        /// <param name="secret"></param>
        /// <returns></returns>
        public string GetToken(string appid, string secret)
        {
            string url = string.Format("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={0}&secret={1}", appid, secret);

            WebRequest req = WebRequest.Create(url);
            req.Method = "GET";   //ָ���ύ��Method������ΪPOST��GET��һ��Ҫ��д  

            WebResponse res = req.GetResponse();

            System.Text.Encoding resEncoding = System.Text.Encoding.GetEncoding("utf-8");//���յı���  
            StreamReader reader = new StreamReader(res.GetResponseStream(), resEncoding);

            string html = reader.ReadToEnd();     //���յ�Html  

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
        /// ����JSON�ַ���
        /// </summary>
        /// <param name="dic"></param>
        /// <returns></returns>
        public string ToJson(Dictionary<string, string> dic)
        {
            System.Web.Script.Serialization.JavaScriptSerializer javaScriptSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            System.Collections.ArrayList arrayList = new System.Collections.ArrayList();
            arrayList.Add(dic); //ArrayList��������Ӽ�ֵ

            return javaScriptSerializer.Serialize(arrayList);
        }

        /// <summary>
        /// DateTimeʱ���ʽת��ΪUnixʱ�����ʽ
        /// </summary>
        /// <param name=��time��></param>
        /// <returns></returns>
        private int ConvertDateTimeInt(System.DateTime time)
        {
            System.DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1));
            return (int)(time - startTime).TotalSeconds;
        }

        #endregion
    }
}