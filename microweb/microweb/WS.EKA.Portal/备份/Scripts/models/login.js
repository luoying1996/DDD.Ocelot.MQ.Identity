window.User = Backbone.Model.extend({
    defaults: {
        MemLoginID: "",
        Pwd: "",
        WxOpenID: ""
    }
});
window.AutoLoginModel = User.extend({
    urlRoot: 'api/WeiXinLogin/',
    url: function () {
        return this.urlRoot + pageView.getCookieValue('uid');
    }
});

window.LoginModel = User.extend({
    urlRoot: 'api/account/login/',
    url: function () {
        return this.urlRoot;
    }
});

window.LoginView = Backbone.View.extend({
    el: "#jqt",
    events: {
        'click #loginBtn': 'authencation'
    },

    initialize: function () {
        this.model = new LoginModel();
        this.template = $('#LoginTemplate').html();
    },

    render: function () {
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html()
        };

        var data = { title: "", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };
        this.$el.html(Mustache.render(this.template, data, partial));

        //已经登录了 直接跳转到我的订单页面
        if (pageView.getCookieValue('uid') != null) {
            pageView.goTo("MyOrder");
        }


        $('#UserName').val(localStorage.getItem('username'));
        $(".maskgrey1").hide();
        return this;
    },

    checkCookieTimeout: function () {
        if (!pageView.getCookieValue('uid')) {
            alert('session超时,请重新登录');
        }
    },

    validation: function () {
        if (this.$el.find('#UserName').val() === "") {
            alert('用户名不能为空');
            return false;
        }
        if (this.$el.find('#Password').val() === "") {
            alert('密码不能为空');
            return false;
        }
        return true;
    },

    checkUserExisted: function () {
        var username = $('#UserName').val();
        var flag = true;
        $.ajax({
            url: 'api/account/userexist/' + username,
            dataType: 'json',
            async: false,
            success: function (res) {
                if (res != null && !res.return) {
                    alert('用户名不存在！');
                    flag = false;
                }
            }
        });
        return flag;
    },

    encryptPassword: function (value) {
        $('#Password').val(
            $.md5(value)
        );
    },

    authencation: function () {
        var that = this;
        if (this.validation()) {
            if (this.checkUserExisted()) {
                that.model.set({
                    MemLoginID: this.$el.find('#UserName').val(),
                    Pwd: this.$el.find('#Password').val(),
                    WxOpenID: pageView.getCookieValue('wxOpenID'),
                    AgentID: pageView.getCookieValue('AgentID')
                });
                that.model.save('', '', {
                    success: function (model, res) {
                        if (res != null && res.RESULT == "202") {
                            that.model.set(res);
                            var loginfrom = localStorage.getItem('loginfrom');
                            if (loginfrom) {
                                LoginView.loginAfterAction(loginfrom).call();
                            }
                            else {
                                location.href = "/#page/MyOrder";
                            }
                        }
                        else if (res != null && res.RESULT == "303") {
                            if (!confirm("由于您所登录的账号已经和他人的微信号进行了绑定，故无法为您的微信号进行绑定。点击“确定”将不进行绑定，直接前往个人中心。如想进行绑定，请点击“取消”登录其它会员账号!")) {
                                LoginOut();
                            }
                            else {
                                location.href = "/#page/MyOrder";
                            }
                        }
                        else if (res != null && res.RESULT == "305") {
                            if (!confirm("由于您的微信号和他人的账号进行了绑定，故无法为您的微信号进行绑定。点击“确定”将不进行绑定，直接前往个人中心。如想进行绑定，请点击“取消”登录其它会员账号!")) {
                                LoginOut();
                            }
                            else {
                                location.href = "/#page/MyOrder";
                            }
                        }
                        else if (res != null && res.RESULT == "404") {
                            alert('账号或密码错误！请重新登录');
                        }
                    }
                });
            }
        }
    }
}, {
    loginAfterAction: function (key) {
        var action = function () { };
        switch (key) {
            case 'fetchCart': action = function () {
                pageView.goTo('MyCart');
            }; break;
            case 'addCart': action = function () {
                var product = JSON.parse(localStorage.getItem('productDetail'));
                MyCartView.addToCarts(product['productid'], product['price'], 1, function () {
                    pageView.goTo('MyCart');
                });
            }; break;
            case 'myCollect': action = function () {
                pageView.goTo('MyCollect');
            }; break;
            case 'myMessage': action = function () {
                pageView.goTo('MyMessage');
            }; break;
            case 'myOrder': action = function () {
                pageView.goTo('MyOrder');
            }; break;
            case 'addCollect': action = function () {
                MyCollectView.addToMyCollect(function () {
                    pageView.goTo('MyCollect');
                });

            }; break;
        }
        return action;
    }
});

//登出
function LoginOut() {
    localStorage.clear();

    $.ajax({

        type: "GET",

        url: "/api/accountlogout/",

        data: {},

        dataType: "json",

        success: function (res) {
            if (res != null && res.RESULT == "202") {
                location.href = "/#page/MyOrder";
            }
        }
    });
}