window.OrderDetailView = Backbone.View.extend({
    el: '#jqt',
    initialize: function () {
        this.model = new Order();
        this.template = $('#OrderDetailTemplate').html();
        var AdvancePayment = 0;
    },
    events: {
        'click #OrderDetail ul.orderPayment': 'goToPayDetail',
        'click .OrderProductList dl': 'goToProductDetail',
        'click #orderinfo_qx': 'OderStatus',
        'click .orderDetail ul li a:first': 'payorder',
        'click #orderinfo_fk': 'GenerateOrder',
        'click #ExpressDelivery a': 'ExpressDelivery',
        'click .backtran a': 'backOrder',
        'click #wuliuinfo_': 'ExpressDelivery',
        'click #makesureOrder': 'SHOrder',
        'click #applyReturnMoneyDetail': 'ReturnMoneyDetail',
        'click #applyReturnGoodsDetail': 'ReturnGoodsDetail',
        'click #applyReturnGoodsAddressDetail': 'ReturnGoodsAddressDetail',
        'click #Detailreadlogistics': 'GoToDetailreadlogistics',

        //'click #GoToMyOrderEvaluationDetail': 'GoToMyOrderEvaluationDetail',
    },
    render: function () {
        var partial = {
            header: $('#HeaderTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html()
        };
        var data = { weixinhao: localStorage.getItem('weixinhao'), title: "订单详情", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));

        this.fetchDetail();

        return this;
    },

    fetchDetail: function () {
        var that = this;
        this.model.fetch({
            success: function () {
                var template = $('#OrderDetailHeadTemplate').html();
                var data = that.model.toJSON();

                $.each(data, function (index, d) {
                    if (d.ReturnOrderStatus != "" && d.ReturnOrderStatus != null) {
                        d.StatusName = d.ReturnOrderStatus;
                    }
                });


                if (data.Orderinfo.ShouldPayPrice == 0) {
                    data.Orderinfo.ShouldPayPrice = data.Orderinfo.AlreadPayPrice.toFixed(2);
                }
                else {
                    data.Orderinfo.ShouldPayPrice = data.Orderinfo.ShouldPayPrice.toFixed(2);
                }

                $.each(data.Orderinfo.ProductList, function (index, c) {
                    c.BuyPrice = c.BuyPrice.toFixed(2);
                });

                $('#ddorderdetail').html(Mustache.render(template, data, []));
                template = $("#addreInfoTemplate").html();
                $("#AddressInfo").html(Mustache.render(template, data, []));

                $('#prodetailasdfasdf').html(Mustache.render($('#PayDetailProductListTemplate').html(), data, []));
                $('#orderAddresssdfa').append(Mustache.render($('#PayDetailPaymentTemplate').html(), data, []));

                var statusName = data.Orderinfo.StatusName;
                if (statusName == "已完成" || statusName == "已付款") {
                    var btn = " <a class='btn1' id='Detailreadlogistics'>查看物流</a>"
                    $("#ul_uste").append($(btn));
                }
                if ((statusName == "待发货")) {
                    var btn = " <a class='btn1' id='applyReturnMoneyDetail'>申请退款</a>"
                    $("#ul_uste").append($(btn));
                }
                if (statusName == "待收货") {
                    var btn = "<a class='btn1' id='applyReturnGoodsDetail'>申请退货</a><a class='btn1' id='Detailreadlogistics'>查看物流</a><a class='btn1' id='makesureOrder'>确认收货</a>"
                    $("#ul_uste").append(btn);
                }
                if (statusName == "待付款" || statusName == "已确认") {

                    var btn = '<span ID="orderinfo_qx"><a class="btn2" href="javascript:void(0)">取消订单</a></span><span ID="orderinfo_fk"><a class="btn1" href="javascript:void(0)">立即付款</a></span>';
                    $("#ul_uste").append(btn);
                }
                if (statusName == "同意退货") {
                    var btn = " <a class='btn1' id='applyReturnGoodsAddressDetail'>提交运单号</a>"
                    $("#ul_uste").append($(btn));
                }


            }
        });
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
    goToPayDetail: function (e) {
        pageView.goTo('PayDetail');
    },

    goToProductDetail: function (e) {
        var target = $(e.currentTarget);

        var productid = target.attr('productid');
        var price = target.attr('productprice');
        var name = target.attr('name');
        localStorage.setItem('productname', name);
        localStorage.setItem('productDetail', JSON.stringify({ productid: productid, price: price }));
        localStorage.setItem('productid', productid);
        localStorage.setItem('detailType', 'tab_intro');
        localStorage.setItem('commentPageIndex', 1);
        localStorage.setItem('ordercommentPageIndex', 1);

        pageView.goTo('ProductDetail?' + productid);
    },
    GenerateOrder: function (e) {
        var target = $(e.currentTarget);
        var ordernumber = $("#txt_OrderNumber").val();

        pageView.goTo('GenerateOrder?' + ordernumber);
    },
    OderStatus: function (e) {
        var target = $(e.currentTarget);
        var Guid = $("#orderinfo_").attr("Guid");

        if (confirm('你确定要取消订单吗？')) {
            $.ajax({
                url: '/api/order/OrderUpdate/' + Guid + '',
                dataType: 'json',
                async: false,
                error: function (err) { ErrorPage(); },
                success: function (data) {
                    if (data != null && data.return == "202") {
                        $(".orderInf .uste").hide(500);
                    }
                    else {
                        alert("取消失败");
                    }
                }
            });
        }
    },
    ReturnMoneyDetail: function (e) {
        var OrderNumber = $("#orderinfo_").attr("OrderNumber");
        localStorage.setItem('OrderNumberReturnMoney', OrderNumber);
        pageView.goTo('MyReturnMoneyDetail');
    },
    ReturnGoodsDetail: function (e) {
        var OrderNumber = $("#orderinfo_").attr("OrderNumber");

        localStorage.setItem('OrderNumberReturnGoods', OrderNumber);
        pageView.goTo('MyReturnGoodsDetail');
    },
    ReturnGoodsAddressDetail: function (e) {
        var guid = $("#orderinfo_").attr("guid");
        var OrderNumber = $("#orderinfo_").attr("OrderNumber");
        localStorage.setItem('OrderGuidReturnGoods', guid);
        localStorage.setItem('OrderNumberReturnGoods', OrderNumber);
        pageView.goTo('MyReturnGoodsDetailAddress');
    },
    GoToDetailreadlogistics: function (e) {
        var OrderNumber = $("#orderinfo_").attr("OrderNumber");
        localStorage.setItem('MylogisticsOrderNumber', OrderNumber);
        pageView.goTo('Mylogistics');
    },
    //GoToMyOrderEvaluationDetail:function(e){
    //    var guid = $("#orderinfo_").attr("guid");
    //    var OrderNumber = $("#orderinfo_").attr("OrderNumber");
    //    localStorage.setItem('OrderGuidReturnGoods', guid);
    //    localStorage.setItem('OrderNumberReturnGoods', OrderNumber);
    //    pageView.goTo('ProductEvaluate');

    //},
    payorder: function () {

    },
    PayzfBtn: function () {

    },
    ExpressDelivery: function (e) {
        //物流信息跟踪
        var type = $("#wuliuinfo_").attr("LogisticsCompanyCode");
        var postid = $("#wuliuinfo_").attr("ShipmentNumber");

        if (type != "" && postid != "") { var iframe = "<iframe src=\"http://m.kuaidi100.com/index_all.html?type=" + type + "&postid=" + postid + "#result\" height=\"600\" width=\"100%\"></iframe>"; $('.wuliuinfo').html(iframe); } else { alert("查询失败"); }
        // if (type != "" && postid != "") { var iframe = "<iframe src=\"http://wap.kuaidi100.com/wap_result.jsp?rand=20120517&id=" + type + "&fromWeb=null&&postid=" + postid + "#result\" height=\"600\" width=\"100%\"></iframe>"; $('.wuliuinfo').html(iframe); } else { alert("查询失败"); }


        //快递查询关闭
        $('.cabottom').click(function () {
            $('.ExpressDelivery').attr("style", "display:none;");
        });
    },
    backOrder: function () {
        pageView.goTo('MyOrder');
    }
});


window.PayDetailView = Backbone.View.extend({
    el: '#jqt',
    initialize: function () {
        this.model = new Order();
        this.template = $('#PayDetailTemplate').html();
    },
    events: {
        'click #PayDetail ul.fetchDetail li': 'goToProductDetail'
    },
    render: function () {
        var partial = { header: $('#HeaderTemplate').html() };
        var data = { hasBack: true, title: '返回', btnListR: [{ name: 'avatar' }, { name: 'home' }] };

        this.$el.append(Mustache.render(this.template, data, partial));

        if ($('#hiddenPayDetail').length > 0) {
            $('.payDetail').html($('#hiddenPayDetail').html());

        } else {
            var that = this;
            this.model.fetch({
                success: function () {
                    var template = $('#PayDetailPaymentTemplate').html();
                    $('.payDetail').html(Mustache.render(template, that.model.toJSON(), []));

                    var data = { products: that.model.get('ProductList') };
                    $('.payDetail #hiddenPayDetail').append(Mustache.render($('#PayDetailProductListTemplate').html(), data, []));
                    $('.payDetail #hiddenPayDetail').show();

                }
            });
        }

        return this;
    },

    goToProductDetail: function (e) {
        var target = $(e.currentTarget);

        localStorage.setItem('productDetail', JSON.stringify({ productid: target.attr('productid'), price: target.attr('productprice') }));
        localStorage.setItem('productid', target.attr('productid'));
        localStorage.setItem('detailType', 'tab_intro');
        localStorage.setItem('commentPageIndex', 1);
        localStorage.setItem('ordercommentPageIndex', 1);

        pageView.goTo('ProductDetail?' + target.attr('productid'));
    }
});

window.PayOrderView = Backbone.View.extend({
    el: '#jqt',
    initialize: function () {
        this.model = new Order();
        this.template = $('#PayDetailTemplate').html();
    },
    events: {
    },
    render: function () {

    }

});

