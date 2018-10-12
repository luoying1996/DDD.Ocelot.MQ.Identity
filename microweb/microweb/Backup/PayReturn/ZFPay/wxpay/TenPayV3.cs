using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Text;
using System.IO;

namespace WS.EKA.Portal.wxpay
{
    public class TenPayV3
    {
        /// <summary>
        /// POST提交数据
        /// </summary>
        /// <param name="jsonStr"></param>
        /// <param name="url"></param>
        /// <returns></returns>
        public static string Unifiedorder(string xmlStr, string url)
        {
            WebRequest request = WebRequest.Create(url);

            request.Method = "POST";

            string postData = xmlStr;

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
    }
}