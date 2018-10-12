window.MyRechargeView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyRecharge').html();
        this.MemLoginID = pageView.getCookieValue('uid');
    },

    events: {
        //绑定列表点击事件
        'click #ul_MyRechargePaylist li': 'PayMentListClick',
        //绑定支付按钮事件
        'click #btnConfirm': 'PayClick',

    },

    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),

        };
        var data = { title: "充值", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));

        //绑定充值数据列表(获取主站Wap支付方式)
        this.fetchMyRechargePayLi();

        return this;
    },
    fetchMyRechargePayLi: function () {
        $.ajax({
            url: "api/paymentForMaster/",
            data: {
            },
            async: false,
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    var template = $('#MyRechargePayLi').html();
                    $("#ul_MyRechargePaylist").html(Mustache.render(template, data, []));
                    var li = $("#ul_MyRechargePaylist li");
                    for (var i = 0; i < li.length; i++) {
                        var Name = li.eq(i).find("a").find("b").html().trim();
                        if (Name == "预存款支付") {
                            li.eq(i).css("display", "none");
                        }
                    }
                }

            }
        })
    },
    PayMentListClick: function (e) {
        var PayListLi = $(e.currentTarget);
        var li = $("#ul_MyRechargePaylist li");
        li.removeClass("cur");
        PayListLi.toggleClass("cur");
    },
    PayClick: function (e) {
        var li = $("#ul_MyRechargePaylist li");
        var RechargeMoney=$("#RechargeMoney").val().trim();//充值金额

        if(RechargeMoney==""||RechargeMoney==null)
        {
            alert("请填写充值金额");
            return;
        }
        else
        {
            
            if (RechargeMoney.replace(/^\d{1,6}\.?\d{0,2}$/g, '')) {
               
                alert("请填写正确的金额");
                return;
            }
            else {
                if (parseFloat(RechargeMoney) == "0") {
                    alert("请填写正确的金额");
                    return
                }
            }
        }

        var Guid;//选中支付方式的Guid
        var PayType;//选中支付方式的Type
        var Name;//选中支付方式的名称
        for (var i = 0; i < li.length; i++) {
            var className = li.eq(i).attr("class");
            if (className == "cur") {
                Guid = li.eq(i).attr("Guid").toLowerCase();
                PayType = li.eq(i).attr("PayType").toLowerCase();
                Name = li.eq(i).attr("NAME").toLowerCase();
            }
        }
        if (PayType == "" || PayType == null) {
            alert("请选择支付方式");
            return;
        }
        //插入充值记录
        var ordernamber;//充值记录的订单号
        $.ajax({
            url: "api/insertAdvancePaymentApplyLog/",
            data: {
                MemLoginID: this.MemLoginID,
                OperateMoney: RechargeMoney,
                PaymentGuid: Guid,
                PaymentName: Name,
            },
            async: false,
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    ordernamber = data.OrderNumber;
                }

            }
        })
        if (ordernamber == "" || ordernamber == null) {
            alert("系统错误");
            return;
        }
        if (PayType == "weixin.aspx") {
            var auth_code = "123456";
            var body = "充值";
            var device_info = "123456";
            var out_trade_no = ordernamber;
            var total_fee = $("#RechargeMoney").val().trim();
            var memid = this.MemLoginID;
            var openid = pageView.getCookieValue('wxOpenID');
            var url = "/PayReturn/CZPay/wxpay/CZ_Pay.aspx?auth_code=" + auth_code + "&body=" + body + "&device_info=" + device_info + "&out_trade_no=" + out_trade_no + "&total_fee=" + total_fee + "&memid=" + memid + "&openid=" + openid;
            window.location = url;
        }
        else if (PayType == "tenpay.aspx") {
            var order_no = ordernamber;
            var product_name = "充值";
            var order_price = $("#RechargeMoney").val().trim();
            var remarkexplain = "";

            var url = "/PayReturn/CZPay/tenpay/CZ_payRequest.aspx?order_no=" + order_no + "&product_name=" + product_name + "&order_price=" + order_price + "&remarkexplain=" + remarkexplain;

            window.location = url;
        }
        else {
            window.location = "/#page/MyOrder";
        }

    }

});
