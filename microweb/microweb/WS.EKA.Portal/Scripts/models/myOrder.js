window.Order = Backbone.Model.extend({
    urlRoot: 'api/order/',
    url: function () {
        return this.urlRoot + localStorage.getItem('orderCode');
    },
    parse: function (model) {
        eachjson(model);
        return model;
    }
});

window.OrderList = Backbone.Collection.extend({
    model: Order,
    urlRoot: 'api/order/member/',
    url: function () {
        return this.urlRoot + pageView.getCookieValue('uid');
    }

});

window.MyOrderListView = Backbone.View.extend({
    el: '#jqt',
    dfhNumber: "0",
    initialize: function () {
        this.template = $('#MyOrderTemplate').html();
        this.collection = new OrderList();
    },
    events: {
        'click #Myordersul img': 'goToOrderDetail',
        'click li #showordera': 'goToOrderDetail',
        'click li #cancelorder': 'QXorder',
        'click .muneli li': 'muneli_li',
        'click li #payorder': 'GenerateOrder',
        'click #makesureOrder': 'SHOrder',
        'click #btnEvaluate': 'GoToMyOrderEvaluation',
        'click #readlogistics': 'GoToreadlogistics',
        'click #applyReturnMoney': 'ReturnMoney',
        'click #applyReturnGoods': 'ReturnGoods',
        'click #applyReturnGoodsAddress': 'ReturnGoodsAddress'
    },
    render: function () {
        var partial = { header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(), innerFooter: $('#InnerFooterTemplate').html() };
        var data = { title: "订单列表", weixinhao: localStorage.getItem('weixinhao'), loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile'), Loginid: pageView.getCookieValue('uid') };
        this.$el.html(Mustache.render(this.template, data, partial));


        var orderType = localStorage.getItem("orderType");
        if (orderType != undefined && orderType != null && orderType != "") {
            $(".muneli li").each(function () {
                if ($(this).attr("t") == orderType) {
                    $(this).click();
                }
            });
        }
        else {
            localStorage.setItem('pageIndex', 1);
            localStorage.setItem('t', 0);
            localStorage.setItem('OderStatus', 0);
            localStorage.setItem('ShipmentStatus', 0);
            localStorage.setItem('PaymentStatus', 0);
            localStorage.setItem('refundStatus', 0);
        }
        localStorage.setItem('addressid_page', "AddressList");
        if (pageView.getCookieValue('uid') == undefined || pageView.getCookieValue('uid') == null) {
            window.location = "/#page/Login";
            return;
        }


		this.fetchOrders();
		var agentId = localStorage.getItem('agentid');

		GetFaHuoAndShouHuoCount(pageView.getCookieValue('uid'), agentId);
        //this.setNumber();
        $('.maskgrey1').hide(50);
        return this;
    },

    fetchOrders: function () {//加载订单列表
		var that = this;
		var agentId = localStorage.getItem('agentid');
        this.collection.fetch({
            data: {
                pageIndex: localStorage.getItem('pageIndex'),
                pageCount: 5,
                t: localStorage.getItem('t'),
                OderStatus: localStorage.getItem('OderStatus'),
                ShipmentStatus: localStorage.getItem('ShipmentStatus'),
                PaymentStatus: localStorage.getItem('PaymentStatus'),
                refundStatus: localStorage.getItem('refundStatus'),
				memLoginID: pageView.getCookieValue('uid'),
				agentID: agentId
            },
            success: function () {
                var products = that.collection.models[0].get('Data'),
                    allCount = that.collection.models[0].get('Count');

                $.each(products, function (index, d) {
                    eachjson(d);
                    $.each(d.ProductList, function (index, c) {
                        c.BuyPrice = c.BuyPrice.toFixed(2);
                    });
                });
                var ordertype = localStorage.getItem("t");
                if (ordertype == "4") {
                    template = $("#MyOrderEvaluateModelli").html();
                    var data = { orders: products };
                    $('#Myordersul').html(Mustache.render(template, data, []));
                    $(".iscomment").each(function () {
                        if ($(this).attr("iscomment") == "true") {
                            var btn = " <a  class='btn1'>已评价</a>";
                            $(this).append(btn);
                        }
                        else {
                            var btn = " <a id='btnEvaluate' class='btn1'>去评价</a>";
                            $(this).append(btn);
                        }
                    })
                    return;
                }
                else {
                    var template;
                    if (that.collection.length == 0 || products.length == 0 || allCount == 0) {
                        template = $('#EmptyOrderTemplate').html();
                        $('#Myordersul').html(Mustache.render(template, [], []));
                        $(".nav-page").html("");
                    } else {
                        template = $('#OrderListTemplate').html();
                        var data = { orders: products };
                        $('#Myordersul').html(Mustache.render(template, data, []));
                        //加载订单列表
                        var all = 0, waitpay = 0;
                        $("li #buttonlistdiv").each(function () {
                            $(this).children().remove();
                            var statusName = $(this).siblings("p").text();
                            if (statusName == "已完成" || statusName == "已付款") {
                                var btn = " <a class='btn1' id='readlogistics'>查看物流</a><a class='btn1' id='showordera'>查看订单</a>";
                                $(this).append($(btn));
                            }
                            if (statusName == "待发货") {
                                var btn = " <a class='btn1' id='applyReturnMoney'>申请退款</a>";
                                $(this).append($(btn));
                            }
                            if (statusName == "待收货") {
                                var btn = " <a class='btn1' id='applyReturnGoods'>申请退货</a><a class='btn1' id='readlogistics'>查看物流</a><a class='btn1' id='makesureOrder'>确认收货</a>";
                                $(this).append($(btn));
                            }
                            if (statusName == "同意退货") {
                                var btn = "<a class='btn1' id='applyReturnGoodsAddress'>提交运单号</a>"
                                $(this).append($(btn));
                            }
                            if (statusName == "待付款" || statusName == "已确认") {
                                waitpay++;
                                var btn = " <a class='btn1' id='payorder'>付款</a> <a class='btn1' id='cancelorder'>取消</a>";
                                $(this).append($(btn));
                            }
                            all++;
                        });

                        if (products.length > 0 && allCount > 0) {
                            new Plugins.PagingPlugin('.nav-page', {
                                allCount: allCount,
                                prevCall: function (e) { that.fetchPrev(e); },
                                nextCall: function (e) { that.fetchNext(e) },
                                numberClickCall: function (e) { that.fetchSpecific(e) }
                            });
                        }

                    }



                }


                setTimeout("CloseBtn()", 500);


            }
        });
    },
    fetchPrev: function (e) {//上一页
        if ($(e.currentTarget).hasClass('disable')) return;
        var pageIndex = localStorage.getItem('pageIndex');
        localStorage.setItem('pageIndex', +pageIndex - 1);
        this.fetchOrders();
    },

    setNumber: function () {
        var that = this;
        this.collection.fetch({
            data: {
                pageIndex: 1,
                pageCount: 100000,
                t: 2,
                OderStatus: 1,
                ShipmentStatus: 0,
                PaymentStatus: 1,
                refundStatus: 0,
                memLoginID: pageView.getCookieValue('uid')
            },
            success: function () {
                var allCount = that.collection.models[0].get('Count');
                if (allCount > 0) {
                    $("#dfhtxt").text(allCount);
                }
                else {
                    $("#dfhtxt").hide();
                }
            }
        });

    },

    fetchNext: function (e) {//下一页
        if ($(e.currentTarget).hasClass('disable')) return;
        var pageIndex = localStorage.getItem('pageIndex');
        localStorage.setItem('pageIndex', +pageIndex + 1);
        this.fetchOrders();
    },

    fetchSpecific: function (e) {
        var target = $(e.currentTarget);
        if (target.hasClass('gray')) return;
        var index = +target.attr('index');
        localStorage.setItem('pageIndex', index);
        this.fetchOrders();
    },
    goToOrderDetail: function (e) {//订单详情
        var target = $(e.currentTarget);

        localStorage.setItem('orderCode', target.parents("li").attr('ordernumber'));
        pageView.goTo('OrderDetail');
    },
    GenerateOrder: function (e) {//去付款
        var target = $(e.currentTarget);
        var ordernumber = target.parents("li").attr("ordernumber");
        var ShouldPayPrice = target.parents("li").attr("ShouldPayPrice");

        localStorage.setItem('orderCode', ordernumber)
        localStorage.setItem('orderno', ordernumber);
        localStorage.setItem('ShouldPayPrice', ShouldPayPrice);
        localStorage.setItem('allPrice', ShouldPayPrice);

        pageView.goTo('GenerateOrder?' + ordernumber);
    }
    ,
    QXorder: function (e) { //取消订单
        //取消订单
        var target = $(e.currentTarget);
        var Guid = target.parents("li").attr("Guid");

        if (confirm('你确定要取消订单吗？')) {
            $.ajax({
                url: '/api/order/OrderUpdate/' + Guid,
                dataType: 'json',
                async: false,
                error: function (err) { ErrorPage(); },
                success: function (data) {
                    if (data != null && data.return == "202") {
                        alert("取消成功！");
                        pageView.goTo('MyOrder');
                    }
                    else { alert("取消失败"); }
                }
            });
        }
    },
    GoToreadlogistics: function (e) {
        var that = $(e.currentTarget);
        var OrderNumber = that.parents("li").attr("OrderNumber");

        localStorage.setItem('MylogisticsOrderNumber', OrderNumber);
        pageView.goTo('Mylogistics');
    },
    ReturnMoney: function (e) {
        var that = $(e.currentTarget);
        var OrderNumber = that.parents("li").attr("OrderNumber");

        localStorage.setItem('OrderNumberReturnMoney', OrderNumber);
        pageView.goTo('MyReturnMoneyDetail');
    },
    GoToMyOrderEvaluation: function (e) {
        var that = $(e.currentTarget);
        var productguid = that.parents("li").attr("productguid");
        var ordernumber = that.parents("li").attr("ordernumber");
        var buynumber = that.parents("li").attr("buynumber");
        var buyprice = that.parents("li").attr("buyprice");
        var name = that.parents("li").attr("NAME");
        var attributes = that.parents("li").attr("Attributes");
        var OriginalImge = that.parents("li").attr("originalimge");

        localStorage.setItem('OrderNumber', ordernumber);
        localStorage.setItem('ProductGuid', productguid);
        localStorage.setItem('BuyNumber', buynumber);
        localStorage.setItem('BuyPrice', buyprice);
        localStorage.setItem('Name', name);
        localStorage.setItem('Attributes', attributes);
        localStorage.setItem('OriginalImge', OriginalImge);


        pageView.goTo('ProductEvaluate');
    },
    ReturnGoods: function (e) {
        var that = $(e.currentTarget);
        var OrderNumber = that.parents("li").attr("OrderNumber");

        localStorage.setItem('OrderNumberReturnGoods', OrderNumber);
        pageView.goTo('MyReturnGoodsDetail');
    },
    ReturnGoodsAddress: function (e) {
        var that = $(e.currentTarget);
        var guid = that.parents("li").attr("guid");
        var OrderNumber = that.parents("li").attr("OrderNumber");
        localStorage.setItem('OrderGuidReturnGoods', guid);
        localStorage.setItem('OrderNumberReturnGoods', OrderNumber);
        pageView.goTo('MyReturnGoodsDetailAddress');
    },
    SHOrder: function (e) {  //确认收货
        //确定收货
        var target = $(e.currentTarget);
        var Guid = target.parents("li").attr("Guid");
        if (Guid == null || Guid == undefined) {
            Guid = target.parents("div[id='orderinfo_']").attr("guid");
        }
        if (confirm('你确定已收到货吗？')) {
            $.ajax({
                url: '/api/order/Shipment/UpdateShipmentStatus/?orderGuid=' + Guid,
                dataType: 'json',
                async: false,
                error: function (err) { ErrorPage(); },
                success: function (data) {
                    if (data != null && data.return == "202") {
                        pageView.goTo('MyOrder');
                    }
                    else {
                        alert("失败");
                    }
                }
            });
        }


    },
    muneli_li: function (e) {
        //订单状态切换
        var target = $(e.currentTarget);
        var activeClass = "on";
        target.addClass(activeClass).siblings().removeClass(activeClass);
        var t = parseInt(target.attr("t"));

        localStorage.setItem('pageIndex', 1);

        switch (t) {
            case 0:
                localStorage.setItem('t', 0);
                localStorage.setItem('OderStatus', 0);
                localStorage.setItem('ShipmentStatus', 0);
                localStorage.setItem('PaymentStatus', 0);
                localStorage.setItem('refundStatus', 0);
                break;
            case 1:
                localStorage.setItem('t', 1);
                localStorage.setItem('OderStatus', 1);
                localStorage.setItem('ShipmentStatus', 0);
                localStorage.setItem('PaymentStatus', 1);
                localStorage.setItem('refundStatus', 0);
                break;
            case 2:
                localStorage.setItem('t', 2);
                localStorage.setItem('OderStatus', 1);
                localStorage.setItem('ShipmentStatus', 0);
                localStorage.setItem('PaymentStatus', 1);
                localStorage.setItem('refundStatus', 0);
                break;
            case 3:
                localStorage.setItem('t', 3);
                localStorage.setItem('OderStatus', 2);
                localStorage.setItem('ShipmentStatus', 1);
                localStorage.setItem('PaymentStatus', 1);
                localStorage.setItem('refundStatus', 0);
                break;
            case 4:
                localStorage.setItem('t', 4);
                localStorage.setItem('OderStatus', 3);
                localStorage.setItem('ShipmentStatus', 0);
                localStorage.setItem('PaymentStatus', 0);
                localStorage.setItem('refundStatus', 0);
                break;
        }

        this.fetchOrders();
    }
});



function eachjson(model) {


    model.HasInvoice = model.InvoiceType != '';
    var orderPrice = model.ProductPrice + model.DispatchPrice + model.InsurePrice + model.InvoiceTax + model.PackPrice + model.BlessCardPrice + model.PaymentPrice - model.Discount;


    model.orderPrice = orderPrice;

    model.WL = true; //物流显示
    model.SH = true; //确定收货
    model.NeedPay = true;



    switch (model.OderStatus) {
        case 2: model.Status = '已取消'; model.WL = false; model.NeedPay = false; break;
        case 3: model.Status = '无效'; model.WL = false; model.NeedPay = false; break;
        case 5: model.Status = '完成'; model.WL = false; model.NeedPay = false; break;
        case 0:
            switch (model.PaymentStatus) {
                case 0: model.Status = '未付款'; model.NeedPay = true; model.WL = true; break;
                case 1: model.Status = '付款中'; model.NeedPay = true; model.WL = true; break;
                case 2: model.Status = '已经付款'; model.SH = true; model.NeedPay = false; model.WL = false; break;
                case 3: model.Status = '退款'; model.WL = false; model.NeedPay = false; break;
            }
            break;
        case 1:
            //            model.Status = '已确定';
            switch (model.ShipmentStatus) {
                case 0: model.Status = '未发货'; break;
                case 1: model.Status = '已发货'; model.WL = false; model.SH = false; model.NeedPay = false; break;
                case 2: model.Status = '已收货'; model.WL = false; model.NeedPay = false; break;
                case 3: model.Status = '配货中'; model.WL = false; model.SH = true; model.NeedPay = false; break;
                case 4: model.Status = '已退货'; model.WL = false; model.SH = true; model.NeedPay = false; break;
            }

            switch (model.PaymentStatus) {
                case 0: model.Status = '未付款'; model.NeedPay = true; model.WL = true; break;
                case 1: model.Status = '付款中'; model.NeedPay = true; model.WL = true; break;
                case 2: model.Status = '已经付款'; model.SH = true; model.NeedPay = false; model.WL = false;
                    switch (model.ShipmentStatus) {
                        case 0: model.Status = '未发货'; break;
                        case 1: model.Status = '已发货'; model.WL = false; model.SH = false; model.NeedPay = false;

                            if (model.ReturnOrderStatus != "") {
                                model.Status = model.ReturnOrderStatus;
                                model.StatusName = model.ReturnOrderStatus;
                            }

                            break;
                        case 2: model.Status = '已收货'; model.WL = false; model.NeedPay = false; break;
                        case 3: model.Status = '配货中'; model.WL = false; model.SH = true; model.NeedPay = false; break;
                        case 4: model.Status = '已退货'; model.WL = false; model.SH = true; model.NeedPay = false; break;
                    }


                    break;
                case 3: model.Status = '退款'; model.WL = false; model.NeedPay = false; break;
            }
            break;

    }




    return model;
}

function CloseBtn() {
    var arr = document.getElementsByName('ordernumber');
    for (var i = 0; i < arr.length; i++) {
        if ($("#paytype" + arr[i].value).val() != "1" && $("#paytype" + arr[i].value).val() != "") {
            $("#fk" + arr[i].value).hide();
        }
    }
}

//获取待发货订单和待收货订单数量
function GetFaHuoAndShouHuoCount(MemLoginID, AgentID) {
    $.ajax({
        type: "GET",
        url: "/api/getfahuoandshouhuocount/?MemLoginID=" + MemLoginID,
        data: {
            MemLoginID: MemLoginID,
            agentID: AgentID
        },
        dataType: "json",
        success: function (result) {
            if (result.toString() != "") {
                var all = result.Data.all,
                    fukuan = result.Data.fukuan,
                    fahuo = result.Data.fahuo,
                    shouhuo = result.Data.shouhuo,
                    pingjia = result.Data.pingjia;

                if (parseInt(all) >= 0) {
                    $("#a_a").html("全部<span >" + all + "</span>");
                }


                if (parseInt(fahuo) >= 0) {
                    $("#a_dfk").html("待付款<span >" + fukuan + "</span>");
                }

                if (parseInt(fahuo) >= 0) {
                    $("#a_dfh").html("待发货<span >" + fahuo + "</span>");
                }

                if (parseInt(shouhuo) >= 0) {
                    $("#a_dsh").html("待收货<span >" + shouhuo + "</span>");
                }
                if (parseInt(pingjia) >= 0) {
                    $("#a_dpj").html("待评价<span >" + pingjia + "</span>");
                }

            }
        }
    });
}

