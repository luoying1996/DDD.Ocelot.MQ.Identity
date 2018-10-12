<%@ WebHandler Language="C#" Class="api_weixin" %>
 
using System;
using System.Web;
using ShopNum1.WeiXinInterface;
using ShopNum1.WeiXinBusinessLogic;
using ShopNum1.WeiXinCommon;
using ShopNum1.WeiXinCommon.Enum;
using System.Xml;
using System.Collections.Generic;
using System.IO;
using System.Data;
using System.Configuration;
using ShopNum1.Common;
using System.Net;
using System.Text;
using ShopNum1.WeiXinCommon.model;
using ShopNum1.Factory;
using ShopNum1.BusinessLogic;
using ShopNum1.BusinessEntity;
using ShopNum1.DataAccess;

public class api_weixin : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string ShopOwner = context.Request.QueryString["shopowner"]; //与微信平台那边填写的token一致

        if (!string.IsNullOrEmpty(ShopOwner))
        {

            //查询店铺 Token
            IShopNum1_Weixin_ShopWeiXinConfig_Active shopnum1_weixin_shopweixinconfig_active = new ShopNum1_Weixin_ShopWeiXinConfig_Active();
            System.Data.DataTable dt = shopnum1_weixin_shopweixinconfig_active.GetWeixinConfigByUrl(ShopOwner);
            string Token = dt.Rows.Count == 0 ? string.Empty : dt.Rows[0]["Token"].ToString();
            //File.AppendAllText(HttpContext.Current.Server.MapPath("~/log/log.txt"),"token:"+Token+"||"+context.Request.HttpMethod.ToLower())
            // string test = @"<xml><ToUserName><![CDATA[gh_beb713756c6d]]></ToUserName>
            //<FromUserName><![CDATA[o3NJ_jroGob6gXyIJc_yriG1meZ0]]></FromUserName>
            //<CreateTime>1384422960</CreateTime>
            //<MsgType><![CDATA[text]]></MsgType>
            //<Content><![CDATA[123]]></Content>
            //<MsgId>5946051337031517997</MsgId>
            //</xml>";
            //            RepMsg_Content(test, dt);
            if (!string.IsNullOrEmpty(Token))
            {
                if (context.Request.HttpMethod.ToLower() == "post")
                {

                    //获取post提交的数据
                    string postStr = PostInput();

                    if (!string.IsNullOrEmpty(postStr))
                    {
                        string result = RepMsg_Content(postStr, dt);

                        WriteLogFile(result);
                        //回复消息
                        context.Response.Write(result);
                        context.Response.End();
                    }
                }
                else
                {
                    Valid(Token, context);
                    context.Response.Write("接口验证!错误码：error:00000");
                    context.Response.End();
                }
            }
            else
            {
                context.Response.Write("接口参数不正确!错误码：error:00002");
                context.Response.End();
            }
        }
        else
        {
            context.Response.Write("接口参数不正确!错误码：error:00001");
            context.Response.End();
        }
    }

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
    /// 验证微信签名
    /// </summary>
    /// * 将token、timestamp、nonce三个参数进行字典序排序
    /// * 将三个参数字符串拼接成一个字符串进行sha1加密
    /// * 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信。
    /// <returns></returns>
    private bool CheckSignature(string Token, HttpContext context)
    {
        string signature = context.Request.QueryString["signature"];
        string timestamp = context.Request.QueryString["timestamp"];
        string nonce = context.Request.QueryString["nonce"];
        string[] ArrTmp = { Token, timestamp, nonce };
        Array.Sort(ArrTmp);     //字典排序
        string tmpStr = string.Join("", ArrTmp);
        tmpStr = System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(tmpStr, "SHA1");
        tmpStr = tmpStr.ToLower();
        if (tmpStr == signature)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /// <summary>
    /// *校验签名,当填入的信息提交之后页面有提示“你已成功成为公众平台开发者，
    /// *可以使用公众平台的开发功能”这个的时候，接下来你就需要注释掉这个校验的方法，
    /// *使得后面的消息回复得以正常运作
    /// </summary>
    private void Valid(string Token, HttpContext context)
    {
        string echoStr = context.Request.QueryString["echoStr"];
        if (CheckSignature(Token, context))
        {
            if (!string.IsNullOrEmpty(echoStr))
            {
                context.Response.Write(echoStr);
                context.Response.End();
            }
        }
    }

    /// <summary>
    /// 加载请求的数据
    /// </summary>
    /// <param name="postStr">微信推送的消息xml</param>
    public string RepMsg_Content(string postStr, DataTable dt)
    {

        XmlDocument doc = new XmlDocument();
        doc.LoadXml(postStr);
        XmlElement rootElement = doc.DocumentElement;

        //微信信息请求xml
        RequestModel requestXML = new RequestModel();
        requestXML.ToUserName = rootElement.SelectSingleNode("ToUserName").InnerText;
        requestXML.FromUserName = rootElement.SelectSingleNode("FromUserName").InnerText;
        requestXML.CreateTime = rootElement.SelectSingleNode("CreateTime").InnerText;
        requestXML.MsgType = rootElement.SelectSingleNode("MsgType").InnerText;



        //根据返回的xml消息类型，解析xml
        switch (requestXML.MsgType)
        {
            //文字
            case "text":
                requestXML.Content = rootElement.SelectSingleNode("Content").InnerText;
                requestXML.MsgId = rootElement.SelectSingleNode("MsgId").InnerText;
                break;
            //地理
            case "location":
                requestXML.Location_X = rootElement.SelectSingleNode("Location_X").InnerText;
                requestXML.Location_Y = rootElement.SelectSingleNode("Location_Y").InnerText;
                requestXML.Scale = rootElement.SelectSingleNode("Scale").InnerText;
                requestXML.Label = rootElement.SelectSingleNode("Label").InnerText;
                requestXML.MsgId = rootElement.SelectSingleNode("MsgId").InnerText;
                break;
            //图片
            case "image":
                requestXML.PicUrl = rootElement.SelectSingleNode("PicUrl").InnerText;
                requestXML.MsgId = rootElement.SelectSingleNode("MsgId").InnerText;
                break;
            //链接
            case "link":
                requestXML.Title = rootElement.SelectSingleNode("Title").InnerText;
                requestXML.Description = rootElement.SelectSingleNode("Description").InnerText;
                requestXML.Url = rootElement.SelectSingleNode("Url").InnerText;
                requestXML.MsgId = rootElement.SelectSingleNode("MsgId").InnerText;
                break;
            //事件推送
            case "event":
                requestXML.Wxevent = rootElement.SelectSingleNode("Event").InnerText;
                requestXML.EventKey = rootElement.SelectSingleNode("EventKey").InnerText;
                break;
        }

        return ReplyMsg(requestXML, dt, requestXML.FromUserName);
    }



    /// <summary>
    /// 消息回复
    /// </summary>
    /// <param name="requestmodel"></param>
    /// <returns></returns>
    private String ReplyMsg(RequestModel requestXML, DataTable dt, string username)
    {

        IShopNum1_Weixin_ReplyRule_Active shopnum1_weixin_replyrule_active = new ShopNum1_Weixin_ReplyRule_Active();
        IShopNum1_Weixin_ShopMember_Active shopnum1_weixin_shopmember_active = new ShopNum1_Weixin_ShopMember_Active();
        IShopNum1_Weixin_ReplyRuleContent_Active shopnum1_weixin_replyrulecontent_active = new ShopNum1_Weixin_ReplyRuleContent_Active();
        #region   处理在更新微信商城前已经关注平台的用户
        //int i = shopnum1_weixin_shopmember_active.GetMemberByUserName(username);
        //if (i < 0)
        //{
        //    UserModel userinfo = new UserModel();
        //    try
        //    {

        //        userinfo = GetUserInfo(dt.Rows[0]["ShopMemLoginId"].ToString(), requestXML.FromUserName);

        //    }
        //    catch (Exception ex)
        //    {
        //        WriteLogFile(ex.Message);
        //    }

        //    try
        //    {
        //        bool b = shopnum1_weixin_shopmember_active.AddWeiXinMember(dt.Rows[0]["ShopMemLoginId"].ToString(), requestXML.FromUserName, requestXML.ToUserName, userinfo);
        //        //System.IO.File.AppendAllText(HttpContext.Current.Server.MapPath("~/log/log.txt"),b+ string.Format("当前时间为【{0}】", DateTime.Now) + "/r/n");

        //    }
        //    catch (Exception ex)
        //    {

        //        WriteLogFile(ex.Message);
        //    }
        //}

        #endregion




        string ReturnVal = String.Empty;

        MsgXml msgxml = new MsgXml(requestXML);

        try
        {
            switch (requestXML.MsgType)
            {
                //文字
                case "text":
                    //查询关键字，根据关键字自动回复
                    string key = requestXML.Content.Trim();

                    ReturnVal = KeyContent(dt, key, msgxml, username);

                    //如果关键子不存在，查询无关键字回复
                    if (string.IsNullOrEmpty(ReturnVal))
                    {
                        //是否开启无关键字自动回复
                        if (Convert.ToBoolean(dt.Rows[0]["IsOpenNotFindKey"]))
                        {
                            //无关键字自动回复
                            key = dt.Rows[0]["NotFindKeys"].ToString();

                            ReturnVal = KeyContent(dt, key, msgxml, username);
                        }
                    }

                    break;
                //地理
                case "location":
                    //ReturnVal = msgxml.ReplyTxt("你发过来的是地理消息");
                    break;
                //图片
                case "image":
                    //ReturnVal = msgxml.ReplyTxt("你发过来的是图片消息");
                    break;
                //链接
                case "link":
                    //ReturnVal = msgxml.ReplyTxt("你发过来的是链接消息");
                    break;
                //事件推送
                case "event":

                    switch (requestXML.Wxevent)
                    {
                        //订阅
                        case "subscribe":
                            //查询是否开启关注自动回复
                            if (Convert.ToBoolean(dt.Rows[0]["IsOpenAtten"]))
                            {
                                ReturnVal = "感谢您的关注!";
                                //关注自动回复关键字
                                string keys_atten = dt.Rows[0]["AttenRepKeys"].ToString();
                                if (!string.IsNullOrEmpty(keys_atten))
                                {
                                    ReturnVal = KeyContent(dt, keys_atten, msgxml, username);
                                }
                            }
                            //创建用户信息
                            //获取主动请求接口的用户信息，并自动创建上商城用户
                            UserModel userinfo = new UserModel();
                            try
                            {
                                userinfo = GetUserInfo(dt.Rows[0]["ShopMemLoginId"].ToString(), requestXML.FromUserName);

                            }
                            catch (Exception ex)
                            {
                                WriteLogFile(ex.Message);
                            }

                            try
                            {
                                //取消分销商城添加微信用户
                                //bool b = shopnum1_weixin_shopmember_active.AddWeiXinMember(dt.Rows[0]["ShopMemLoginId"].ToString(), requestXML.FromUserName, requestXML.ToUserName, userinfo);
                                //System.IO.File.AppendAllText(HttpContext.Current.Server.MapPath("~/log/log.txt"),b+ string.Format("当前时间为【{0}】", DateTime.Now) + "/r/n");

                            }
                            catch (Exception ex)
                            {
                                // System.IO.File.AppendAllText(HttpContext.Current.Server.MapPath("~/log/log.txt"), ex.Message + string.Format("当前时间为【{0}】", DateTime.Now) + "/r/n");

                                WriteLogFile(ex.Message);
                            }


                            break;
                        //取消订阅
                        case "unsubscribe":
                            //shopnum1_weixin_shopmember_active.ChangeVipGroup(dt.Rows[0]["ShopMemLoginId"].ToString(), requestXML.FromUserName, (int)ShopVipGroup.CancelAtten);
                            try
                            {
                                int resule = RDeleteIsFlo(requestXML.FromUserName);

                                if (resule>0)
                                {
                                    System.IO.File.AppendAllText(HttpContext.Current.Server.MapPath("~/log/log.txt")," deltrue \r\n ");
                                }
                            }
                            catch (Exception ex)
                            {
                                WriteLogFile(ex.Message);
                                System.IO.File.AppendAllText(HttpContext.Current.Server.MapPath("~/log/log.txt"), ex.Message + " del \r\n ");
                                throw;
                            }                               
                            break;
                        //自定义菜单点击事件
                        case "CLICK":

                            string menukey = requestXML.EventKey;

                            ReturnVal = KeyContent(dt, menukey, msgxml, username);

                            break;
                    }
                    break;
            }
        }
        catch (Exception ex)
        {
            WriteLogFile(ex.Message);
        }
        return ReturnVal;
    }



    /// <summary>
    /// 消息xml
    /// </summary>
    /// <param name="contentmsg"></param>
    /// <param name="msgxml"></param>
    /// <param name="ShopOwner"></param>
    /// <returns></returns>
    private string KeyContent(DataTable dt, string keys_atten, MsgXml msgxml, string username)
    {

        IShopNum1_Weixin_ReplyRule_Active shopnum1_weixin_replyrule_active = new ShopNum1_Weixin_ReplyRule_Active();
        IShopNum1_Weixin_ReplyRuleContent_Active shopnum1_weixin_replyrulecontent_active = new ShopNum1_Weixin_ReplyRuleContent_Active();

        bool productLine = bool.Parse(ShopSettings.GetValue("AgentProductLine"));
        string ReturnVal = string.Empty;

        //获取所有关键字
        DataTable keys_dt = shopnum1_weixin_replyrule_active.Select_AllKeys(dt.Rows[0]["ShopMemLoginId"].ToString());


        //符合条件的规则
        DataTable ruleids = keys_dt.Clone();

        foreach (string item_key in keys_atten.Split(' '))
        {
            if (!string.IsNullOrEmpty(item_key))
            {
                foreach (DataRow dr in keys_dt.Rows)
                {
                    if (Convert.ToInt32(dr["Matching"]) == (int)MatchType.accurate && dr["keyword"].ToString() == item_key)
                    {
                        ruleids.Rows.Add(dr.ItemArray);
                    }
                    else if (Convert.ToInt32(dr["Matching"]) == (int)MatchType.vague && dr["keyword"].ToString().IndexOf(item_key) != -1)
                    {
                        ruleids.Rows.Add(dr.ItemArray);
                    }
                }
            }
        }

        if (ruleids.Rows.Count != 0)
        {
            Random ra = new Random();
            //随机取一条
            int index = ra.Next(0, ruleids.Rows.Count);

            DataTable contentdt = shopnum1_weixin_replyrulecontent_active.Select_ContentByRuleId(Convert.ToInt32(ruleids.Rows[index]["ruleid"]), Convert.ToInt32(ruleids.Rows[index]["RepMsgType"]));

            if (contentdt.Rows.Count != 0)
            {
                //店铺ID
                //string shopid = Common.GetNameById("ShopId", "shopnum1_shopinfo", string.Format(" and memloginid='{0}'", dt.Rows[0]["ShopMemLoginId"].ToString()));
                string shopid = dt.Rows[0]["ShopMemLoginId"].ToString();
                shopid = HttpUtility.UrlEncode(shopid, System.Text.UnicodeEncoding.GetEncoding("utf-8"));
                //文字回复
                if (Convert.ToInt32(ruleids.Rows[index]["RepMsgType"]) == (int)MsgType.TxtMsg)
                {
                    string Msg = contentdt.Rows[0]["RepMsgContent"].ToString();

                    //替换超链接字符
                    Msg = Msg.Replace("&lt;", "<").Replace("&gt;", ">");

                    //System.IO.File.AppendAllText(HttpContext.Current.Server.MapPath("~/log/log.txt"), "0\r\n");
                    //System.IO.File.AppendAllText(HttpContext.Current.Server.MapPath("~/log/log.txt"), username + "\r\n");
                    //System.IO.File.AppendAllText(HttpContext.Current.Server.MapPath("~/log/log.txt"), HttpUtility.UrlEncode(username, System.Text.UnicodeEncoding.GetEncoding("utf-8")) + "\r\n");
                    //System.IO.File.AppendAllText(HttpContext.Current.Server.MapPath("~/log/log.txt"), "------------------\r\n");
                    //如果是微信商城连接
                    if (shopid.Equals("shopnum1_administrators"))  //主站
                    {
                        Msg = Msg.Replace("{0}", HttpUtility.UrlEncode(username, System.Text.UnicodeEncoding.GetEncoding("utf-8")));
                    }
                    else
                    {    //分站
                        Msg = Msg.Replace("{0}", HttpUtility.UrlEncode(username, System.Text.UnicodeEncoding.GetEncoding("utf-8"))).Replace("{1}", shopid).Replace("{2}", productLine.ToString());
                    }
                    // System.IO.File.AppendAllText(HttpContext.Current.Server.MapPath("~/log/log.txt"), "URL:" + Msg + string.Format("当前时间为【{0}】；1", DateTime.Now) + "/r/n");
                    ReturnVal = msgxml.ReplyTxt(Msg);

                    WriteLogFile(Msg);
                }
                else
                {
                    List<ReplyInfoModel> replyinfomodels = new List<ReplyInfoModel>();
                    ReplyInfoModel replyinfomodel = new ReplyInfoModel();
                    DataRow main = contentdt.Select(string.Format("ruleid='{0}'", Convert.ToInt32(ruleids.Rows[index]["ruleid"])))[0];

                    replyinfomodel.Title = main["Title"].ToString();
                    replyinfomodel.Description = main["Description"].ToString();
                    replyinfomodel.ImgSrc = string.Format("http://{0}{1}", HttpContext.Current.Request.Url.Host, main["ImgSrc"].ToString());

                    //获取详细内容
                    DataTable artidt = shopnum1_weixin_replyrule_active.SelectArticle(main["ID"].ToString());
                    if (artidt.Rows.Count != 0)
                    {
                        if (Convert.ToInt32(artidt.Rows[0]["Type"]) == (int)ArticleType.link)
                        {

                            if (shopid.Equals("shopnum1_administrators"))
                            {                                
                                replyinfomodel.Url = string.Format(ConfigurationManager.AppSettings["wap_urlhost1"].ToString(), username, HttpUtility.UrlEncode(artidt.Rows[0]["ArticleContent"].ToString()));
                            }
                            else
                            {
                                replyinfomodel.Url = string.Format(ConfigurationManager.AppSettings["wap_urlhost2"].ToString().Replace("{3}", ""), username, shopid, productLine, HttpUtility.UrlEncode(artidt.Rows[0]["ArticleContent"].ToString()));

                            }
                        }
                        else
                        {
                            replyinfomodel.Url = string.Format("http://{0}/Admin/W_ShopArticle.aspx?id={1}", HttpContext.Current.Request.Url.Host, artidt.Rows[0]["ID"].ToString());

                        }
                    }

                    replyinfomodels.Add(replyinfomodel);

                    foreach (DataRow dr in contentdt.Select(string.Format("ruleid<>'{0}'", Convert.ToInt32(ruleids.Rows[index]["ruleid"]))))
                    {
                        replyinfomodel = new ReplyInfoModel();
                        replyinfomodel.Title = dr["Title"].ToString();
                        replyinfomodel.Description = dr["Description"].ToString();
                        replyinfomodel.ImgSrc = string.Format("http://{0}{1}", HttpContext.Current.Request.Url.Host, dr["ImgSrc"].ToString());

                        artidt = shopnum1_weixin_replyrule_active.SelectArticle(dr["ID"].ToString());
                        if (artidt.Rows.Count != 0)
                        {
                            if (Convert.ToInt32(artidt.Rows[0]["Type"]) == (int)ArticleType.link)
                            {

                                if (shopid.Equals("shopnum1_administrators"))
                                {
                                    replyinfomodel.Url = string.Format(ConfigurationManager.AppSettings["wap_urlhost1"].ToString(), username,HttpUtility.UrlEncode(artidt.Rows[0]["ArticleContent"].ToString()));
                                }
                                else
                                {
                                    replyinfomodel.Url = string.Format(ConfigurationManager.AppSettings["wap_urlhost2"].ToString().Replace("{3}", ""), username, shopid, productLine, HttpUtility.UrlEncode(artidt.Rows[0]["ArticleContent"].ToString()));

                                }
                                
                            }
                            else
                            {
                                replyinfomodel.Url = string.Format("http://{0}/Admin/W_ShopArticle.aspx?id={1}", HttpContext.Current.Request.Url.Host, artidt.Rows[0]["ID"].ToString());

                            }
                        }

                        replyinfomodels.Add(replyinfomodel);
                    }

                    if (replyinfomodels.Count == 1)
                    {
                        ReturnVal = msgxml.ReplyImg(replyinfomodel);
                    }
                    else
                    {
                        ReturnVal = msgxml.ReplyImg(replyinfomodels);
                    }
                }
            }
        }

        return ReturnVal;
    }

    private string api_getuserinfo = "https://api.weixin.qq.com/cgi-bin/user/info?access_token={0}&openid={1}";
    /// <summary>
    /// 获取用户微信信息
    /// </summary>
    /// <param name="shopmemloginid"></param>
    /// <param name="openid"></param>
    /// <returns></returns>
    private UserModel GetUserInfo(string shopmemloginid, string openid)
    {
        UserModel user = new UserModel();

        //自定义菜单接口
        string posturl = string.Empty;
        //微信接口Access_token
        string access_token = GetAccess_token(shopmemloginid);


        StreamReader sr = null;
        HttpWebResponse response = null;
        HttpWebRequest request = null;
        Encoding encoding = Encoding.UTF8;
        string content = string.Empty;

        posturl = string.Format(api_getuserinfo, access_token, openid);
        try
        {
            request = WebRequest.Create(posturl) as HttpWebRequest;
            request.Method = "GET";
            response = (HttpWebResponse)request.GetResponse();
            sr = new StreamReader(response.GetResponseStream(), Encoding.UTF8);
            content = sr.ReadToEnd();
            sr.Close();

            user = StringHelper.ReturnModelFromJson<UserModel>(content);
            
            //ShopNum1_Member_Action memberAction1 = (ShopNum1_Member_Action)LogicFactory.CreateShopNum1_Member_Action();
            int find_Resule = RFindFlo(user.openid);
            int resule = 0;
            
            if (find_Resule == 0)
            {
                System.IO.File.AppendAllText(HttpContext.Current.Server.MapPath("~/log/log.txt"), " 用户已存在 " + user.nickname);
            }
            else
            {
                resule = RAddWXActive(user.openid, user.nickname, user.headimgurl);
            }
            
        }
        catch (Exception ex)
        {
            System.IO.File.AppendAllText(HttpContext.Current.Server.MapPath("~/log/log.txt"), ex.Message + "\r\n");
        }


        return user;
    }

    /// <summary>
    /// 获取微信接口Access_token
    /// </summary>
    /// <returns></returns>
    private string GetAccess_token(string shopmemloginid)
    {
        //查询店铺 Token
        IShopNum1_Weixin_ShopWeiXinConfig_Active shopnum1_weixin_shopweixinconfig_active = new ShopNum1_Weixin_ShopWeiXinConfig_Active();
        System.Data.DataTable dt = shopnum1_weixin_shopweixinconfig_active.GetWeixinConfig(shopmemloginid);

        //微信接口AppId
        string appid = dt.Rows[0]["AppId"].ToString();
        //微信接口AppSecret
        string secret = dt.Rows[0]["AppSecret"].ToString(); ;

        string url = string.Format("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={0}&secret={1}", appid, secret);

        HttpWebRequest myRequest = (HttpWebRequest)WebRequest.Create(url);
        myRequest.Method = "GET";
        HttpWebResponse myResponse = (HttpWebResponse)myRequest.GetResponse();
        StreamReader reader = new StreamReader(myResponse.GetResponseStream(), Encoding.UTF8);
        string content = reader.ReadToEnd();
        reader.Close();
        return content.Split(',')[0].Split(':')[1].Replace("\"", "");
    }



    ///〈summary〉  /// 写入日志文件  
    ///〈/summary〉  
    /// 〈param name="input"〉〈/param〉  
    private void WriteLogFile(string input)
    {

        //指定日志文件的目录  

        string fname = HttpContext.Current.Server.MapPath("~/logfile.txt");


        //定义文件信息对象  

        FileInfo finfo = new FileInfo(fname);

        //判断文件是否存在以及是否大于2K  

        if (finfo.Exists && finfo.Length > 2048)
        {

            //删除该文件 

            finfo.Delete();

        }

        //创建只写文件流  

        using (FileStream fs = finfo.OpenWrite())
        {

            //根据上面创建的文件流创建写数据流  

            StreamWriter w = new StreamWriter(fs);

            //设置写数据流的起始位置为文件流的末尾  

            w.BaseStream.Seek(0, SeekOrigin.End);

            //写入“Log Entry : ”  

            w.Write("\nLog Entry : {0}----{1} \r\n", input, DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"));

            //清空缓冲区内容，并把缓冲区内容写入基础流  

            w.Flush();

            //关闭写数据流  

            w.Close();

        }

    }

    //删除微信活动
    public int RDeleteIsFlo(string memloginid)
    {
        string strSql = string.Empty;
        strSql = "Delete  ShopNum1_WeiXinActive  WHERE OpenID='" + memloginid + "'";
        return DatabaseExcetue.RunNonQuery(strSql);
    }

    //添加微信活动
    public int RAddWXActive(string id, string nick, string img)
    {
        string strSql = string.Empty;
        strSql = "Insert Into ShopNum1_WeiXinActive (OpenID,IsFollow,Pic,WXNick) values ('" + id + "','1','" + img + "','" + nick + "')";
        return DatabaseExcetue.RunNonQuery(strSql);
    }

    //查询微信活动
    public int RFindFlo(string loginID)
    {
        int resule = 0;
        string strSql = string.Empty;
        strSql = "SELECT IsFollow FROM ShopNum1_WeiXinActive WHERE OpenID='" + loginID + "'";
        DataTable dt = DatabaseExcetue.ReturnDataTable(strSql);
        if (dt.Rows.Count > 0)
        {
            resule = 0;
        }
        else
        {
            resule = 1;
        }

        return resule;
    }
    
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}
