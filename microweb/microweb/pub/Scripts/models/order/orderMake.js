/*
填写订单信息用到JS
*/

window.MakeOrderView = Backbone.View.extend({
    el: '#jqt',
    initialize: function () {
        this.template = $('#OrderMakeTemplate').html();
        this.MemLoginID = pageView.getCookieValue('uid');
    },
    events: {

    },
    render: function () {
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html()
        };

        var data = { title: "", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };
        this.$el.html(Mustache.render(this.template, data, partial));

        if (this.MemLoginID != undefined && this.MemLoginID != "") {
            this.LoadMakeOrder();
        }

        return this;
    },
    LoadMakeOrder: function () {

        OrderProductShow(this.MemLoginID);

    }
});

//订单商品展示
function OrderProductShow(MemLoginID) {
	var agentId = $('#hagentId').val();
    
    $.ajax({

        type: "GET",

        url: "/api/getcartbyselected/?MemLoginID=" + MemLoginID + "&IsSelected=1",

		data: { AgentID: agentId },

        dataType: "json",

        success: function (result) {
            if (result != null && result.Data != null && result.Data.length > 0) {
                $.each(result.Data, function (index, d) {
                    d.BuyPrice = d.BuyPrice.toFixed(2);
                });

                var template = $('#OrderProductTemplate').html();
                var str = Mustache.render(template, result, []);
                $("#li_OrderProduct").html(str);

                $("#cartJson").val(JSON.stringify(result.Data));

                SumOrderProductPrice();

                MemberAddressShow(MemLoginID);
            }
        }
    });
}

//计算订单商品总金额
function SumOrderProductPrice() {
    var allProductPrice = 0;
    for (var i = 0; i < $("input[name='txt_BuyPrice']").length; i++) {
        allProductPrice += (parseFloat($("input[name='txt_BuyPrice']").eq(i).val()) * parseInt($("input[name='txt_BuyNumber']").eq(i).val()));
    }

    $("#span_AllProductPrice").html(allProductPrice.toFixed(2));
}

//收货地址展示
function MemberAddressShow(MemLoginID) {
	var agentId = $('#hagentId').val();
    $.ajax({

        type: "GET",

        url: "/api/getmemberaddressbyselected/?MemLoginID=" + MemLoginID,

		data: { AgentID: agentId },


        dataType: "json",

        success: function (result) {
            if (result.Data != null && result.Data != "null") {
                var template = $('#MemberAddressShowTemplate').html();
                var str = Mustache.render(template, result, []);
                $("#dl_MemberAddress").html(str);

                DispatchmodeShow();
            }
            else {
                var template = $('#NoMemberAddressShowTemplate').html();
                var str = Mustache.render(template, [], []);
                $("#dl_MemberAddress").html(str);
            }
        }
    });
}

//配送方式
function DispatchmodeShow() {
    var dataSMemberID = pageView.getCookieValue('uid');
    var dataSHGUID = $("#MemberAddressId").val();
    var dataZFGUID = "1";
	var agentId = $('#hagentId').val();
    $.ajax({

        type: "Get",

        url: "/api/dispatchmodelistbycode/?dataSMemberID=" + dataSMemberID + "&dataSHGUID=" + dataSHGUID + "&dataZFGUID=" + dataZFGUID,

		data: { AgentID: agentId, Sbool: pageView.getCookieValue("Sbool") },

        dataType: "json",

        success: function (result) {
            $("#select_Dispatchmode").empty();
            if (result != null && result.Data != null)
            {
                for (var i = 0; i < result.Data.length; i++) {
                    var str = result.Data[i].Guid + "|" + result.Data[i].peipr + "|" + result.Data[i].baopr;
                    $("#select_Dispatchmode").append("<option value='" + str + "'>" + result.Data[i].NAME + "</option>");
                }

                if ($("#select_Dispatchmode").val() != "") {
                    $("#select_Dispatchmode").change();
                }
            }
            
        }
    });
}

//计算费用
function MakeOrderCaculatePrice() {
    var orderStr = CreateOrderInfo("");

    $.ajax({

        type: "POST",

        url: "api/order/price/caculate",

        data: { order: orderStr },

        dataType: "json",

        success: function (result) {
            if (result != null && result.Data != null) {

                result.Data.ProductPrice = result.Data.ProductPrice.toFixed(2);
                result.Data.DispatchPrice = result.Data.DispatchPrice.toFixed(2);
                result.Data.ShouldPayPrice = result.Data.ShouldPayPrice.toFixed(2);

                var template = $('#OrderPirceTemplate').html();
                var str = Mustache.render(template, result, []);
                $("#div_OrderPirce").html(str);
            }
        }
    });
}

var LockGetOrderNumber = true;

//获取订单编号
function GetOrderNumber() {
    //if (!LockGetOrderNumber) {
    //    return;
    //}
    //LockGetOrderNumber = false;

    $.ajax({

        type: "GET",

        url: "api/getorderno",

        data: {},

        dataType: "json",

        success: function (data) {
            if (data.toString() != "") {
                SubOrderInfo(data.OrderNumber);
            }
        }
    });
}

//提交订单
function SubOrderInfo(orderNumber) {
    var orderJosn = CreateOrderInfo(orderNumber);

    $.ajax({

        type: "POST",

        url: "api/order",

        data: { model: orderJosn },

        dataType: "json",

        success: function (data) {
            LockGetOrderNumber = true;

            if (data.return != "failure") {
                window.location = "/#page/GenerateOrder?" + data.return;
            }
            else {
                alert("订单提交失败！请联系客服人员！");
            }
        }
    });
}

//前往选择收货地址
function GoChangeAddress() {
    localStorage.setItem('FromOrderMake', 1);
    window.location = "/#page/AddressList";
}

//创建订单JSON字符串
function CreateOrderInfo(orderNumber) {
    var MemLoginID = pageView.getCookieValue('uid');
    var OrderNumber = orderNumber;
    var Name = $("#MemberAddressName").val();
    var Email = "";
    var Address = $("#MemberAddressAddress").val();
    var Postalcode = "";
    var Tel = "";
    var Mobile = $("#MemberAddressMobile").val();

    var RegionCode = $("#MemberAddressCode").val();
    var ProductList = $("#cartJson").val();
    var ClientToSellerMsg = document.getElementById('treabeizu').value;
    var str = $("#select_Dispatchmode").val();
    var dispatchArr = str.split('|');
    var DispatchModeGuid = dispatchArr[0];
    var DispatchPrice = dispatchArr[1];
	var InsurePrice = dispatchArr[2];
	var agentId = $('#hagentId').val();

	var jsonOrder = '{"Guid": "00000000-0000-0000-0000-000000000000","MemLoginID": "' + MemLoginID + '","OrderNumber": "' + OrderNumber + '","OderStatus": 0,"ShipmentStatus": 0,"PaymentStatus": 0,"Name": "' + Name + '","Email": "","Address": "' + Address + '","Postalcode": null,"Tel": null,"Mobile": "' + Mobile + '","DispatchModeGuid": "' + DispatchModeGuid + '","PaymentGuid": "00000000-0000-0000-0000-000000000000","PackGuid": "00000000-0000-0000-0000-000000000000","BlessCardGuid": "00000000-0000-0000-0000-000000000000","DispatchMode": null,"Payment": null,"ProductPrice": 0.00,"DispatchPrice": ' + DispatchPrice + ',"InsurePrice": ' + InsurePrice + ',"PaymentPrice": 0.0,"PackPrice": 0.0,"BlessCardPrice": 0.0,"AlreadPayPrice": 0.0,"SurplusPrice": 0.0,"UseScore": 0,"ScorePrice": 0.0,"ShouldPayPrice": 0.00,"CreateTime": "0001/01/01 00:00:00","ConfirmTime": null,"PayTime": null,"DispatchTime": null,"ShipmentNumber": null,"PayMemo": null,"ActivityGuid": "00000000-0000-0000-0000-000000000000","InvoiceType": null,"InvoiceTitle": null,"InvoiceContent": null,"OutOfStockOperate": null,"ClientToSellerMsg": "' + ClientToSellerMsg + '","InvoiceTax": 0.0,"Discount": 0.0,"Deposit": 0.0,"IsPayDeposit": 0,"CreateUser": null,"ModifyUser": null,"ModifyTime": "0001/01/01 00:00:00","RegionCode": "' + RegionCode + '","JoinActiveType": 0,"ActvieContent": "0","UsedFavourTicket": null,"LogisticsCompanyCode": null,"ProductList": ' + ProductList + ',"AgentID": "' + agentId + '"}';

    return jsonOrder;
}