window.ErrorPageView = Backbone.View.extend({
    el: '#jqt',
    initialize: function () {
        this.template = $('#ErrorPageTemplate').html();
    },

    render: function () {
        var partial = { header: $('#HeaderTemplate').html(), innerFooter: $('#InnerFooterTemplate').html() };
        this.$el.html(Mustache.render(this.template, [], partial));
        $('.maskgrey1').hide(50);
        return this;
    }
});

window.WeixinPageView = Backbone.View.extend({
    el: '#jqt',
    initialize: function () {
        this.template = $('#WeiXinPageTemplate').html();

    },

    render: function () {
		this.$el.html(Mustache.render(this.template, [], []));
		localStorage.setItem('weixinhao', localStorage.getItem('login'));

		var agentId = localStorage.getItem('agentid');
        if (localStorage.getItem("Sbool") != null && localStorage.getItem("Sbool") != undefined) {
			//$.ajax({
			//	url: '/api/WeiXinLogin/' + localStorage.getItem('login') + "/" + agentId + "/" + localStorage.getItem("Sbool"),
   //             dataType: 'json',
   //             async: false,
   //             success: function (resx) {
   //                 //if (resx != null) {
   //                 //    var Date0 = resx.Date0[0];
   //                 //    var Data1 = resx.Date1;
   //                 //    var Date2 = resx.Date2[0];
   //                 //    var Date3 = resx.Date3[0];
                       
   //                 //    //刘磊2014-05-12 改动
   //                 //    if (resx.Date0.toString() != '') {
   //                 //        if (Date0.ID > 0) {
   //                 //            localStorage.setItem('loginUrl', Date0.Value);
   //                 //        }
   //                 //        if (Data1.length > 0) {
   //                 //            localStorage.setItem('flash', JSON.stringify(Data1));
   //                 //        }
   //                 //        if (Date2.ID > 0) {
   //                 //            localStorage.setItem('weixinhao', Date2.Value);
   //                 //        }
   //                 //        if (Date3.ID > 0) {
   //                 //            localStorage.setItem('mobile', Date3.Value);
   //                 //        }
   //                 //    }
   //                 //    localStorage.setItem('ImageUrl', resx.ImageUrl);

   //                 //}
   //             }
   //         });
            return this;
        }

    }
});


var NavData = {};
NavData.Member = "/#page/MyOrder";
NavData.Cart = "/#page/MyCart";
NavData.Index = "/#page/Catalog";
NavData.Type = "/#page/FirstCategory";

var route = [
{ pageId: "Login", viewClass: LoginView }
, { pageId: "Register", viewClass: RegisterView }
, { pageId: 'Agreement', viewClass: AgreementView }
, { pageId: "Catalog", viewClass: CatalogView }
, { pageId: "FirstCategory", viewClass: FirstCategoryView }
, { pageId: "ProductList", viewClass: ProductListView }
, { pageId: 'ProductDetail', viewClass: ProductDetailView }
, { pageId: 'MyCart', viewClass: MyCartView }
, { pageId: 'MyUserInfo', viewClass: UserInfoView }
, { pageId: 'OrderMake', viewClass: MakeOrderView }
, { pageId: 'MyCollect', viewClass: MyCollectView }
, { pageId: 'MyOrder', viewClass: MyOrderListView }
, { pageId: 'SearchList', viewClass: SearchListView }
, { pageId: 'MyFilter', viewClass: MyFilterView }
, { pageId: 'AddressList', viewClass: AddressListView }
, { pageId: 'PaymentList', viewClass: PaymentView }
, { pageId: 'DispatchModeList', viewClass: DispatchView }
, { pageId: 'MyInvoice', viewClass: InvoiceView }
, { pageId: 'CouponList', viewClass: CouponView }
, { pageId: 'GenerateOrder', viewClass: OrderGenerateView }
, { pageId: 'OrderDetail', viewClass: OrderDetailView }
, { pageId: 'PayOrder', viewClass: PayOrderView }
, { pageId: 'PayDetail', viewClass: PayDetailView }
, { pageId: 'ErrorPage', viewClass: ErrorPageView }
, { pageId: 'Type', viewClass: TypeProView }
, { pageId: 'weixin', viewClass: WeixinPageView }
, { pageId: 'RankList', viewClass: RankListView }
, { pageId: 'AddressList', viewClass: AddressListView }
, { pageId: 'AppendAddress', viewClass: AppendAddressView }
, { pageId: 'AgentRegist', viewClass: AgentRegistView }//注册
, { pageId: 'GetLostPassWord', viewClass: GetLostPassWordView }//忘记密码
, { pageId: 'MyInformation', viewClass: MyInformationView }//个人资料
, { pageId: 'MyName', viewClass: MyNameView }//修改昵称
, { pageId: 'MySex', viewClass: MySexView }//修改性别
, { pageId: 'MySetUp', viewClass: MySetUpView }//设置
, { pageId: 'MyLoginPassWord', viewClass: MyLoginPassWordView }//修改登录密码
, { pageId: 'MyBusinessPassWord', viewClass: MyBusinessPassWordView }//修改支付密码
, { pageId: 'MyScoreDetail', viewClass: MyScoreDetailView }//积分明细
, { pageId: 'MyScoreRankDetail', viewClass: MyScoreRankDetailView }//等级积分明细
, { pageId: 'MyAdvancePayment', viewClass: MyAdvancePaymentView }//预存款明细
, { pageId: 'MyCollection', viewClass: MyCollectionView }//个人收藏
, { pageId: 'MyMessage', viewClass: MyMessageView }//我的消息
, { pageId: 'MyDisplay', viewClass: MyDisplayView }//晒单列表页
, { pageId: 'ProductDisplay', viewClass: ProductDisplayView }//添加晒单
, { pageId: 'MyRebate', viewClass: MyRebateView }//我的团队
, { pageId: 'DevelopMember', viewClass: DevelopMemberView }//发展会员
, { pageId: 'QRCodeRegister', viewClass: QRCodeRegisterView }//扫面二维码注册会员
, { pageId: 'ProductSearch', viewClass: ProductSearchView }//商品搜索页面

, { pageId: 'BrandList', viewClass: BrandListView }//商品品牌

, { pageId: 'ProductTypeList', viewClass: ProductTypeListView }//商品类型列表
, { pageId: 'MyCash', viewClass: MyCashView }

, { pageId: 'MyCashBank', viewClass: MyCashBankView }

, { pageId: 'MyCashList', viewClass: MyCashListView }

, { pageId: 'MyCashAdd', viewClass: MyCashAddView }

, { pageId: 'MyCashEdit', viewClass: MyCashEditView }

, { pageId: 'ProductEvaluate', viewClass: ProductEvaluateView }

, { pageId: 'Mylogistics', viewClass: MylogisticsView }

, { pageId: 'MyReturnMoneyDetail', viewClass: MyReturnMoneyDetailView }

, { pageId: 'MyReturnOrder', viewClass: MyReturnOrderView }

, { pageId: 'MyReturnGoodsDetail', viewClass: MyReturnGoodsDetailView }

, { pageId: 'MyReturnGoodsDetailAddress', viewClass: MyReturnGoodsDetailAddressView }

, { pageId: 'MyRecharge', viewClass: MyRechargeView }
, { pageId: 'Chooseagent', viewClass: Chooseagentview }
];

window.Page = Backbone.Model.extend({
    defaults: {
        pageId: "Login",
        viewClass: LoginView
    }
});

window.PageCollection = Backbone.Collection.extend({
    model: Page
});

window.PageView = Backbone.View.extend({
    el: "#jqt",
    model: Page,

    events: {
        'click .registerLink,.foot_register': 'renderRegister',
        'click .foot_login,.link-btn[action="avatar"],.list li[action="myhome"],.foot_user': 'renderMyInfo',
        'click .columnSc .toolbar .active': 'renderDefaultPage',
        'click .list li[action="categorys"],.link-btn[action="sort"]': 'renderFirstCategory',
        'click .list li[action="collect"]': 'renderMyCollect',
        'click .unsupport .icon .wtCart': 'renderMyCart',
        'click .list li[action="message"]': 'renderMyMessage',
        'click .unsupport .icon .userLogo': 'renderMyOrder',
        'click .foot_exit': 'logout',
        'click .header .back': 'goBack',
        'click .unsupport a': 'renderFirstCategory',
        'click .plusbtn': 'plusbtnFunction',
        'click .newMap': 'renderNearShop'

    },
    render: function () {
        var pageId = this.model.get("pageId");
        if (pageId == 'Catalog') {
            var t_agentid = localStorage.getItem('agentid');
            if (typeof (t_agentid) == "undefined" || !t_agentid) {
                pageId = "Chooseagent";
                $('#hagentId').val("兴义站");
                this.goTo('Chooseagent');
            }
            else
            {
                $('#hagentId').val(t_agentid);
                pageId = this.model.get("pageId") + '?' + t_agentid;
            }
               
        }
        if (pageId == 'ProductDetail') {
            pageId = this.model.get("pageId") + '?' + localStorage.getItem('productid');
        }
        else if (pageId == 'FirstCategory') {
            pageId = this.model.get("pageId") + '?0';
        }
        else if (pageId == 'SecondCategory') {
            pageId = this.model.get("pageId") + '?' + localStorage.getItem('nextid_1');
        }
        else if (pageId == 'ThirdCategory') {
            pageId = this.model.get("pageId") + '?' + localStorage.getItem('nextid_2');
        }
        else if (pageId == 'ProductList') {
            pageId = this.model.get("pageId") + '?' + localStorage.getItem('productcategoryid');
        }
		else if (pageId == "weixin") {
			var agentId = localStorage.getItem('agentid');
			pageId = 'weixin?' + localStorage.login + '&' + agentId + "&" + localStorage.Sbool;
            this.goTo('Catalog');
        }
        else if (pageId == "Type") {
            pageId = this.model.get("pageId") + '?' + localStorage.getItem('TypePro');
        }
        else if (pageId == "RankList") {
            pageId = this.model.get("pageId") + '?' + localStorage.getItem('RankType');
        }
        else if (pageId == "AddressList") {
            pageId = this.model.get("pageId") + '?' + localStorage.getItem('FromOrderMake');
        }
        else if (pageId == "AppendAddress") {
            pageId = this.model.get("pageId") + '?' + localStorage.getItem('FromOrderMake');
        }
        else if (pageId == "GenerateOrder") {
            pageId = this.model.get("pageId") + '?' + localStorage.getItem('OrderNumber');
        }
        else if (pageId == "SearchList") {
            pageId = this.model.get("pageId") + '?' + localStorage.getItem('SearchKey');
        }
        else if (pageId == 'ProductDisplay') {
            pageId = this.model.get("pageId") + '?' + localStorage.getItem('ProductGuid');
        }
        else if (pageId == 'QRCodeRegister') {
            pageId = this.model.get("pageId") + '?' + localStorage.getItem('CommendPeople');
        }
        else if (pageId == 'ProductTypeList') {
            pageId = this.model.get("pageId") + '?' + localStorage.getItem('ProductType');
        }
        pageRoute.navigate('page/' + pageId);

        return this;
    },

    renderContent: function (viewType) {
        var pageId = this.model.get('pageId');

        if (this.$el.find('#' + pageId).length > 0) {
            $('#' + pageId).remove();
        }
        if (viewType && typeof viewType === "function") {
            var view = new viewType({ id: pageId + '12' });
            view.render();
        } //append div into jqt

        this.render(); //register route
    },
    renderNearShop: function () {
        if (ConfigLogin()) {
            wx.getLocation({
                success: function (res) {
                    Latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    Longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    //window.location = "/map.aspx?Latitude=" + Latitude + "&Longitude=" + Longitude;

                    var map = new BMap.Map("allmap");//创建地图
                    var point = new BMap.Point(Longitude, Latitude)//新增坐标点
                    translateCallback = function (point) {
                        var marker = new BMap.Marker(point);
                        window.location = "/map.aspx?Latitude=" + point.lat + "&Longitude=" + point.lng;
                    }

                    setTimeout(function () {
                        BMap.Convertor.translate(point, 0, translateCallback);     //真实经纬度转成百度坐标
                    }, 2000);

                    //var speed = res.speed; // 速度，以米/每秒计
                    //var accuracy = res.accuracy; // 位置精度
                }
            });
        }
    },
    renderDefaultPage: function () {
        this.goTo('Catalog');
    },

    renderMyInfo: function () {
        this.goTo('MyUserInfo');
    },
    plusbtnFunction: function () {
        var display = $(".lsplus .circle").css("display");

        if (display == "none") {
            $(".plusbtn i").addClass("iconplus");
            $(".lsplus .circle").show(200);

        }
        else {
            $(".plusbtn i").removeClass("iconplus");
            $(".lsplus .circle").hide(150);

        }
    },

    renderFirstCategory: function () {
        this.goTo('FirstCategory');
    },

    renderRegister: function () {
        this.goTo('Register');
    },

    renderMyCart: function () {
        this.goTo('MyCart');
    },

    renderMyCollect: function () {
        this.goTo('MyCollect');
    },

    renderMyMessage: function () {
        localStorage.setItem('messagePageIndex', 1);
        this.goTo('MyMessage');
    },

    renderMyOrder: function () {
        localStorage.setItem('t', 1);
        this.goTo('MyOrder');
    },

    goTo: function (pageId) {

		if (pageView.getCookieValue("Sbool") == null || pageView.getCookieValue("Sbool") == undefined || pageView.getCookieValue("Sbool") == "") {
			var agentId = localStorage.getItem('agentid');
            $.ajax({
				url: "api/GetSbool/",
				data: { AgentID: agentId },
                async: false,
                success: function (data) {
                    localStorage.setItem('Sbool', pageView.getCookieValue("Sbool"));
                }
            });
        }
        else {
            localStorage.setItem('Sbool', pageView.getCookieValue("Sbool"));
        }

        var pageId3 = pageId;
        var pageId2 = pageId;
        var pageIdp = pageId;
        pageId = pageId.split('&')[0];

        var str = pageId.split('?');
        pageId3 = pageId3.split('&');

        if (str[0] == 'ProductDetail') { pageId = str[0]; localStorage.setItem('productid', str[1]); }
        else if (str[0] == 'FirstCategory') { pageId = str[0]; }
        else if (str[0] == 'SecondCategory') { pageId = str[0]; localStorage.setItem('nextid_1', str[1]); }
        else if (str[0] == 'ThirdCategory') { pageId = str[0]; localStorage.setItem('nextid_2', str[1]); }
        else if (str[0] == 'ProductList') { pageId = str[0]; localStorage.setItem('productcategoryid', str[1]); }
		else if (str[0] == 'weixin') { 
			pageId = str[0];
			var agentId = localStorage.getItem('agentid');
			localStorage.setItem('login', str[1]);
			localStorage.setItem("weixinhao", str[1]);
			localStorage.setItem("wxOpenID", str[1]); 
			localStorage.setItem('url', "");
			localStorage.setItem('AgentID', agentId);
            localStorage.setItem('Is_First_Load', "0");
        }
        else if (str[0] == 'Type') {
            pageId = str[0]; localStorage.setItem('TypePro', str[1]);
        }
        else if (str[0] == 'RankList') {
            localStorage.removeItem('RankType');
            pageId = str[0];
            localStorage.setItem('RankType', str[1]);
        }
        else if (str[0] == 'AddressList') {
            localStorage.removeItem('FromOrderMake');
            pageId = str[0];
            localStorage.setItem('FromOrderMake', str[1]);
        }
        else if (str[0] == 'AppendAddress') {
            localStorage.removeItem('FromOrderMake');
            pageId = str[0];
            localStorage.setItem('FromOrderMake', str[1]);
        }
        else if (str[0] == 'GenerateOrder') {
            localStorage.removeItem('OrderNumber');
            pageId = str[0];
            localStorage.setItem('OrderNumber', str[1]);
        }
        else if (str[0] == 'SearchList') {
            localStorage.removeItem('SearchKey');
            pageId = str[0];
            localStorage.setItem('SearchKey', str[1]);
        } else if (str[0] == 'ProductDisplay') {
            localStorage.removeItem('ProductGuid');
            pageId = str[0];
            localStorage.setItem('ProductGuid', str[1]);
        } else if (str[0] == 'QRCodeRegister') {
            localStorage.removeItem('CommendPeople');
            pageId = str[0];
            localStorage.setItem('CommendPeople', str[1]);
        }else if (str[0] == 'ProductTypeList') {
            localStorage.removeItem('ProductType');
            pageId = str[0];
            localStorage.setItem('ProductType', str[1]);
        }

        var p = _.find(pageList.toArray(), function (model) {
            return model.get('pageId') === pageId;
        });
        page.set(p.toJSON());

        var viewType = page.get('viewClass');

        this.renderContent(viewType);

        var fromPage = this.$el.find('.current');

        var toPage = $('#' + pageId);
        var animation = { name: 'slideleft', selector: '.slideleft, .slide, #jqt > * > ul li a' };

        if (fromPage.length !== 0) {
            jQT.doNavigation(fromPage, toPage, animation);
        }

        toPage.addClass('current');

        this.changeFoot();

        this.changeCartIcon();

    },

    goBack: function () {
        window.history.back();
    },

    logout: function () {
        localStorage.clear();
        var username = this.getCookieValue('uid');
        localStorage.setItem('username', username);
        $.post('api/account/LogOut', { id: this.getCookieValue('uid') }, function () {
            pageView.goTo('Catalog');
        }, 'json');
    },
    changeFoot: function () {
        var loginid = this.getCookieValue('uid');
        if (loginid) {
            $('.footer').find('.foot_1').removeClass('foot_login').addClass('foot_user').text(loginid);
            $('.footer').find('.foot_2').removeClass('foot_register').addClass('foot_exit').text('退出');
        } else {
            $('.footer').find('.foot_1').removeClass('foot_user').addClass('foot_login').text('登录');
            $('.footer').find('.foot_2').removeClass('foot_exit').addClass('foot_register').text('注册');
        }
    },

    changeCartIcon: function () {
        var hasCarts = localStorage.getItem('hasCarts'),
            icon = hasCarts == 'true' ? 'cartm' : 'cart';
        $('.header a[action="cart"]>img').attr('src', '/Content/Images/header/' + icon + '.png');
    },

    getCookieValue: function (key) {
        var cookie = document.cookie;
        if (navigator.cookieEnabled && cookie) {
            if (cookie.length == 0) return undefined;
            var value = _.find(cookie.split(';'), function (cook) {
                return cook.trim().split('=')[0] == key;
            });

            if (value != undefined) {
                var uid = '';
                if (value != '' && value.indexOf('=') > -1) {
                    uid = value.trim().split('=')[1];
                }

                return decodeURI(uid);
            }

        } else return undefined;
    }
    ,

    cookieTimeoutAutoLogin: function () {

    }
});

window.PageRoute = Backbone.Router.extend({
    routes: {
        "page/:pageId": "loadPage",
        "": "home"
    },
    home: function () {

        //render login content
        pageView.cookieTimeoutAutoLogin();
        pageView.renderDefaultPage();
    },
    loadPage: function (pageId) {

        pageView.goTo(pageId);
    }
});

var pageList = new PageCollection(route);
function getCookieValueFun(key) {
    var cookie = document.cookie;
    if (navigator.cookieEnabled && cookie) {
        if (cookie.length == 0) return undefined;
        var value = _.find(cookie.split(';'), function (cook) {
            return cook.trim().split('=')[0] == key;
        });
        return value && value.trim().split('=')[1];
    } else return undefined;
}

function stringToHex(str) {
    var val = "";
    var subStr = str.substring(0, str.indexOf('#') - 1);
    for (var i = 0; i < subStr.length; i++) {

        if (val == "")
            val = subStr.charCodeAt(i).toString(16);
        else
            val += "," + subStr.charCodeAt(i).toString(16);
    }
    return val;
}

function getTrueUrl(url) {
    var resurl = "";
    if (url.indexOf('?from') > -1) {
        resurl = url.substring(0, url.indexOf('?from'));
    }
    else {
        resurl = url.substring(0, url.indexOf('#page'));
    }

    return resurl;
}
