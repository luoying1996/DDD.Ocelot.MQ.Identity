window.MyReturnGoodsDetailView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyReturnGoodsDetail').html();
        this.MemLoginID = pageView.getCookieValue('uid');
    },

    events: {
        'click .ReasonLi li': 'ChoseReason',
        'click .SelectIcn': 'SelectGoods',
        'click .reduceGoods': 'reduceGoods',
        'click .addGoods': 'addGoods',
        'click #NoReturn': 'NoReturn',
        'click #ApplyReturnGoodsDetail': 'ApplyReturnGoodsDetail',
    },

    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),

        };
        var data = { title: "退货", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));

        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }

        this.BindReturnGoodsDetail();
        return this;
    },
    BindReturnGoodsDetail: function () {
        $.ajax({
            url: "api/order/" + localStorage.getItem("OrderNumberReturnGoods"),
            data: {
            },
            async: false,
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    if (data.Orderinfo.ReturnOrderStatus != "" && data.Orderinfo.ReturnOrderStatus != null)
                    {
                        pageView.goTo('OrderDetail');
                        return;
                    }
                    var template = $('#MyReturnGoodsDetailLi').html();
                    $("#ul_MyReturnGoodsList").html(Mustache.render(template, data, []));
                }

            }
        })
    },
    ChoseReason: function (e) {
        var that = $(e.currentTarget);
        $(that).addClass("cur").siblings().removeClass("cur")
    },
    SelectGoods: function (e) {
        var that = $(e.currentTarget);
        $(that).toggleClass("on");
        TotalFee();
    },
    addGoods: function (e) {
        var that = $(e.currentTarget);
        var inputnum = that.parents("li").find(".inpnum");
        var number = parseInt(inputnum.val()) + 1;
        var BuyNumber = inputnum.attr("BuyNumber");
        if (number <= BuyNumber) {
            inputnum.val(number);
            TotalFee();
        }
    },
    reduceGoods: function (e) {
        var that = $(e.currentTarget);
        var inputnum = that.parents("li").find(".inpnum");
        var number = parseInt(inputnum.val()) - 1;
        if (number > 0) {
            inputnum.val(number);
            TotalFee();
        }
    },
    NoReturn: function (e) {
        pageView.goTo("OrderDetail");
    },
    ApplyReturnGoodsDetail: function () {
        var OrderNumber = $("#hidOrderNumber").val();
        var ReturnGoodsMoney = $("#ReturnGoodsMoney").html().trim();
        if (ReturnGoodsMoney == "￥0.00") {
            alert("请选择退货商品");
            return;
        }
        var Reason;
        var li = $(".ReasonLi li");
        for (var i = 0; i < li.length ; i++) {
            var className = li.eq(i).attr("class");
            if (className == "cur") {
                Reason = li.eq(i).find("a").find("b").html();
            }
        }

        if (Reason == "" || Reason == null) {
            alert("请选择退款原因!");
            return;
        }

        var strReturnGoods = CreateReturnGoodsInfo(Reason);

        $.ajax({
            type: "POST",
            url: "api/addreturnorder/",
            data: {
                model: strReturnGoods
            },
            async: false,
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    if (data.return == "202") {
                        alert("退货申请提交成功,请耐心等待卖家审核！");
                        localStorage.setItem('orderCode', localStorage.getItem("OrderNumberReturnGoods"));
                        pageView.goTo('OrderDetail');
                    }
                    else {
                        alert("退货申请提交失败！");
                    }
                }

            }
        })

    },
});

function CreateReturnGoodsInfo(Reason) {
    var ApplyUserID = pageView.getCookieValue('uid');
    var OperateUserID = pageView.getCookieValue('uid');
    var OrderGuid = $("#hidOrderGuid").val();
    var OrderStatus = "0";//0表示待审核
    var ReturnGoodsCause = Reason;
    var AgentID= pageView.getCookieValue('AgentID');

    var GoodSList = "";

    var select = $(".SelectIcn.on");

    for (var i = 0; i < select.length; i++) {
        //拼商品Json
        var Attributes = select.eq(i).attr("attributes");
        var BuyPrice = select.eq(i).attr("buyprice");
        var OrderGuid = select.eq(i).attr("orderguid");
        var OrderType = "1";
        var ProductGuid = select.eq(i).attr("productguid");
        var ProductImage = select.eq(i).attr("originalimge");
        var ReturnCount = select.eq(i).parents("li").find(".inpnum").val();
        GoodSList += '{"Attributes":"' + Attributes + '","BuyPrice":"' + BuyPrice + '","OrderGuid":"' + OrderGuid + '","OrderType":"' + OrderType + '","ProductGuid":"' + ProductGuid + '","ProductImage":"' + ProductImage + '","ReturnCount":"' + ReturnCount + '"},';
    }
    GoodSList = '['+ GoodSList.substring(0, GoodSList.length - 1)+']';

    var jsonOrder = '{"ApplyUserID":"' + ApplyUserID + '","OperateUserID":"' + OperateUserID + '","OrderGuid":"' + OrderGuid + '","OrderStatus":"' + OrderStatus + '","ReturnGoodsCause":"' + ReturnGoodsCause + '","AgentID":"' + AgentID + '","GoodSList":' + GoodSList + '}';
    
    return jsonOrder;
}


function TotalFee() {
    var Total = 0;
    var select = $(".SelectIcn.on");
    for (var i = 0; i < select.length; i++) {
        var buyNum = parseFloat(select.eq(i).parents("li").find(".inpnum").val());
        var buyMoney = parseFloat(select.eq(i).attr("buyprice"));
        Total += buyNum * buyMoney;
    }
    $("#ReturnGoodsMoney").html("￥" + Total.toFixed(2));
}
