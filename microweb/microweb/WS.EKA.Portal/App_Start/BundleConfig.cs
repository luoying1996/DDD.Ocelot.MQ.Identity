using System.Web;
using System.Web.Optimization;

namespace WS.EKA.Portal.App_Start
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add((new StyleBundle("~/Content/application.css")).Include(
                    "~/Content/flexslider.css",
                    "~/Content/css/style.css",
                    "~/Content/css/index.css"
                ));
            bundles.Add(new ScriptBundle("~/Scripts/application.js").Include(
                "~/Scripts/jquery-1.7.js",
                "~/Scripts/bootstrap.min.js",
                "~/Scripts/iscroll.js",
                "~/Scripts/json2.js",
                "~/Scripts/mustache.js",
                "~/Scripts/underscore.js",
                "~/js/banner.js",
                "~/js/touch.js",
                "~/Scripts/plugin/jquery.autocomplete.min.js",

                "~/Scripts/jqtouch-jquery.min.js",
                "~/Scripts/plugin/jquery.flexslider.js",
                "~/Scripts/plugin/plugin.paging.js",
                "~/Scripts/plugin/plugin.search.js",
                "~/Scripts/plugin/jquery.md5.js",
                "~/Scripts/jquery.form.js",//处理上传图片
                "~/Scripts/jqtouch.js",
                "~/Scripts/backbone-0.9.2.js",
                "~/Scripts/models/login.js",
                "~/Scripts/models/register.js",
                "~/Scripts/models/agreement.js",
                "~/Scripts/models/catalog.js",
                "~/Scripts/models/category.js",
                "~/Scripts/models/productList.js",
                "~/Scripts/models/Type.js",
                "~/Scripts/models/productDetail.js",
                "~/Scripts/models/myCart.js",
                "~/Scripts/models/myInfo.js",
                "~/Scripts/models/myCollect.js",
                "~/Scripts/models/myOrder.js",
                "~/Scripts/models/myFilter.js",
                //"~/Scripts/models/myMessage.js",
                "~/Scripts/models/searchList.js",
                "~/Scripts/models/order/address.js",
                "~/Scripts/models/order/payment.js",
                "~/Scripts/models/order/dispatchMode.js",
                "~/Scripts/models/order/invoice.js",
                "~/Scripts/models/order/coupon.js",
                "~/Scripts/models/order/orderMake.js",
                "~/Scripts/models/order/orderDetail.js",
                "~/Scripts/models/order/orderGenerate.js",
                "~/Scripts/models/order/appnedAddress.js",
                "~/Scripts/models/RankList.js",
                "~/Scripts/models/AgentRegist.js",
                "~/Scripts/models/GetLostPassWord.js",//忘记密码
                "~/Scripts/models/myInformation.js",// 个人资料
                "~/Scripts/models/myName.js",//修改昵称
                "~/Scripts/models/mySex.js",//修改性别
                "~/Scripts/models/MySetUp.js",//设置
                "~/Scripts/models/MyLoginPassWord.js",//修改登录密码
                "~/Scripts/models/MyBusinessPassWord.js",//修改登录密码
                "~/Scripts/models/myScoreDetail.js",//积分明细
                "~/Scripts/models/myScoreRankDetail.js",//等级积分明细
                "~/Scripts/models/myAdvancePayment.js",//预存款明细
                "~/Scripts/models/myCollection.js",//个人收藏
                "~/Scripts/models/myMessage.js",//个人收藏
                "~/Scripts/models/myDisplay.js",//我的晒单
                "~/Scripts/models/productDisplay.js",//提交晒单
                "~/Scripts/models/myRebate.js",//我的团队
                "~/Scripts/models/developMember.js",//发展会员
                "~/Scripts/models/QRCodeRegister.js",//扫描二维码注册会员
                "~/Scripts/models/productSearch.js",//商品搜索

                "~/Scripts/models/brandList.js",//商品品牌

                "~/Scripts/models/productTypeList.js",//商品类型列表
                "~/Scripts/models/myCash.js",

                "~/Scripts/models/myCashBank.js",

                "~/Scripts/models/myCashList.js",//提现明细

                "~/Scripts/models/myCashAdd.js",//新增提现账户

                "~/Scripts/models/myCashEdit.js",//编辑提现账户

                "~/Scripts/models/productEvaluate.js",//商品评价

                "~/Scripts/models/mylogistics.js",//查看物流

                "~/Scripts/models/myReturnMoneyDetail.js",

                "~/Scripts/models/myReturnOrder.js",

                "~/Scripts/models/myReturnGoodsDetail.js",

                "~/Scripts/models/myReturnGoodsDetailAddress.js",

                "~/Scripts/models/myRecharge.js",
                "~/Scripts/models/Chooseagent.js",















                "~/Scripts/models/page.js"
                ));
        }
    }
}