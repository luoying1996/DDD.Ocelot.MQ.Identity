/*
订单支付用到JS
*/

window.OrderGenerateView = Backbone.View.extend({
    el: '#jqt',
    initialize: function () {
        this.template = $('#GenerateOrderTemplate').html();
        this.OrderNumber = localStorage.getItem('OrderNumber');
    },
    events: {
    },
    render: function () {
        var partial = {
            header: $('#HeaderTemplate').html(),
            footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html()
        };

        var data = { title: "", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };
        this.$el.html(Mustache.render(this.template, data, partial));

        this.LoadOrderGenerate();

        return this;
    },
    LoadOrderGenerate: function () {
        OrderGenerateShow(this.OrderNumber);
    }
});

//订单支付详情展示
function OrderGenerateShow(OrderNumber) {
    if (OrderNumber == undefined || OrderNumber == "") {
        return;
    }

    $.ajax({

        type: "GET",

        url: "/api/order/" + OrderNumber,

        data: {},

        dataType: "json",

        success: function (result) {
            if (result.toString() != "") {
                result.Orderinfo.ShouldPayPrice = result.Orderinfo.ShouldPayPrice.toFixed(2);

                var template = $('#GenerateOrderSuccessTemplate').html();
                var str = Mustache.render(template, result, []);
                $("#orderinfodetaildiv").html(str);

                GetPayment();
            }
        }
    });
}

//获取支付方式
function GetPayment() {
    $.ajax({

        type: "GET",

        url: "/api/payment/",

        data: { AgentID: pageView.getCookieValue('AgentID') },

        dataType: "json",

        success: function (data) {
            if (data.toString() != "") {
                var template = $('#MakePaymentTemplate').html();
                var str = Mustache.render(template, data, []);
                $("#MakePayment").html(str);
            }
        }
    });
}

var LockaddPayment = true;

//更新订单支付方式
function addPayment() {
    var OrderNumber = $("#txt_OrderNumber").val();
    var PaymentGuid = $("#MakePayment").find("option:selected").attr("guid");
    var PaymentName = $("#MakePayment").find("option:selected").text();
    var MemLoginID = pageView.getCookieValue('uid');

    $.ajax({
        type: "GET",
        url: 'api/order/UpdatePayment/' + OrderNumber + '/' + PaymentGuid + '/' + PaymentName + '/' + MemLoginID,
        data: {},
        dataType: "json",
        success: function (data) {
            if (data != null && data.Data == "202") {
                GoPay();
            }
            else {
                alert("修改支付方式失败");
            }
        }
    });
}

//付款
function GoPay() {
    var username = pageView.getCookieValue('uid');
    var paymenttype = $("#MakePayment").val();
    var ordernamber = $("#txt_OrderNumber").val();
    var ShouldPayPrice = $("#txt_ShouldPayPrice").val();
    var PaymentName = $("#MakePayment").find("option:selected").text()
    var PaymentGuid = $("#MakePayment option:selected").attr("guid");
    if (ShouldPayPrice > 0 && ordernamber > 0 && username != '') {
        if (paymenttype == "PreDeposits.aspx") {

            $.ajax({
                url: '/api/account/' + username + '',
                dataType: 'json',
                async: false,
                success: function (resx) {
                    if (resx != null) {
                        AdvancePayment = resx.AdvancePayment;
                    }
                    var data = { hasBack: true, title: '取消', btnListR: [{ name: 'avatar' }, { name: 'home' }], ShouldPayPrice: ShouldPayPrice, AdvancePayment: AdvancePayment };
                    $('#jqt').html(Mustache.render($('#PayzfTemplate').html(), data, []));
                    $("#PayzfBtn").live("click", function () {
                        $("#PayPwdvalueError").html();
                        var flag = true;
                        var PayPwd = $("#PayPwdvalue").val();
                        if (PayPwd == "") { $("#PayPwdvalueError").html("支付密码不能为空"); flag = false; }
                        if (parseFloat(AdvancePayment) < parseFloat(ShouldPayPrice)) { $("#PayPwdvalueError").html("预存款不足"); flag = false; };

                        if (flag) {
                            $.ajax({
                                url: '/api/order/BuyAdvancePayment/' + username + '?OrderNumber=' + ordernamber + '&PayPwd=' + PayPwd,
                                dataType: 'json',
                                error: function (err) { $("#PayPwdvalueError").html("支付错误。"); },
                                async: false,
                                success: function (data) {
                                    if (data != null && data.sbool) {
                                        $("#PayPwdvalueError").html("支付成功。");
                                        localStorage.setItem('orderCode', ordernamber);
                                        pageView.goTo('OrderDetail');
                                    }
                                    else {
                                        $("#PayPwdvalueError").html("支付密码错误。");
                                    }
                                }
                            });
                        }
                    });
                }
            });

            pageView.goTo('PayOrder');//预存款支付
        }
        else if (paymenttype.toLowerCase() == "alipay.aspx") {
            var ProductName = "订单：" + ordernamber;
            // var ProductName = this.model.get("ProductList").OrderProduct.NAME;
            //ShouldPayPrice = 0.01;
            //订单号，名称，金额
            var out_trade_no = ordernamber, subject = ProductName + "...", total_fee = ShouldPayPrice;
            var iframe = "/PayReturn/ZFPay/alipay/default.aspx?out_trade_no=" + out_trade_no + "&subject=" + subject + "&total_fee=" + total_fee;
            location.href = iframe;
        }
        else if (paymenttype.toLowerCase() == "wxpay.aspx") {
            var auth_code = "123456";
            var body = "recharge";
            var device_info = "123456";
            var out_trade_no = ordernamber;
            var total_fee = ShouldPayPrice;
            var memid = username;
            var openid = pageView.getCookieValue('wxOpenID');

            var url = "/PayReturn/ZFPay/wxpay/pay.aspx?auth_code=" + auth_code + "&body=" + body + "&device_info=" + device_info + "&out_trade_no=" + out_trade_no + "&total_fee=" + total_fee + "&memid=" + memid + "&openid=" + openid;

            window.location = url;
        }
        else if (paymenttype.toLowerCase() == "tenpay.aspx") {
            var order_no = ordernamber;
            var product_name = "";
            var order_price = ShouldPayPrice;
            var remarkexplain = "";

            var url = "/PayReturn/ZFPay/tenpay/payRequest.aspx?order_no=" + order_no + "&product_name=" + product_name + "&order_price=" + order_price + "&remarkexplain=" + remarkexplain;

            window.location = url;
        }
        else if (paymenttype.toLowerCase() == "jdpay.aspx") {
            $.ajax({
                url: "api/ApiHost/",
                dataType: 'json',
                success: function (result) {
                    if (result != null && result != undefined) {
                        var url = result.Data + "JDPay/WePay/PayIndex.aspx?order=" + ordernamber;
                        window.location = url;
                    }
                }
            });
        }
        else {
            window.location = "/#page/MyOrder";
        }
    }
    else {
        alert("此页面已过期。");
    }
}