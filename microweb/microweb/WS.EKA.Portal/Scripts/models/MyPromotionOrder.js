var myPromotionOrderArr = [];
window.MyPromotionOrderView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyPromotionOrderTemplate').html();
        this.Code = '';
    },
    events: {
        "click #MyPromotionOrderTemplateDiv .muneli li": "switchTab",
        "click #MyPromotionOrderContainer li":"goToOrderDetail",
    },
    render: function () {
        var partial = {
           
        };
        var data = {};
        this.$el.html(Mustache.render(this.template, data, partial));
        $(".maskgrey1").show();

        this.getData();

        $(".maskgrey1").hide();

        return this;
    },

    getData: function () {
        var memLoginId =pageView.getCookieValue("uid");

        $.ajax({
            url: 'api/account/GetMyPromotionOrder/',
            data: {
                memLoginID: memLoginId,
            },
            type: "POST",
            dataType: 'json',
            cache: false,
            success: function (res) {
                console.log(res);

                if (res.RESULT.data == "200") {

                    var list = res.RESULT.dataTable;

                    //使用myPromotionOrderArr之前先清空
                    myPromotionOrderArr = [];

                    if (list != null) {
                        for (var i = 0; i < list.length; i++) {
                            var item = list[i];
                            var newItem = isExistInArr(myPromotionOrderArr, item);
                            var obj = { BuyNumber: item["BuyNumber"], Name: item["Name"], ProductGuid: item["ProductGuid"], ProductPrice: item["ProductPrice"], DispatchPrice: item["DispatchPrice"], OriginalImge: item["OriginalImge"] };

                            if (newItem != null) {
                                //存在
                                newItem.List.push(obj);
                            } else {
                                //不存在
                                var newObj = {
                                    OrderStatus: item["OrderStatus"],
                                    Guid: item["Guid"],
                                    MemLoginID: item["MemLoginID"],
                                    OrderNumber: item["OrderNumber"],
                                    PaymentStatus: item["PaymentStatus"],
                                    PayType: item["PayType"],
                                    ShipmentStatus: item["ShipmentStatus"],
                                    List: [],
                                };
                                newObj.List.push(obj);
                                myPromotionOrderArr.push(newObj);
                            }
                        }
                        setValToTemplate(0);

                    } else {
                        $("#MyPromotionOrderTemplateDiv .NoDate").show();
                    }
                } else {
                    console.log("推广订单 获取数据出错");
                }
                
            }, error: function () {
                console.log("推广订单 获取数据ajax出错");
            }
        });
    },
    
    switchTab: function (e) {
        //订单状态切换
        var target = $(e.currentTarget);
        var activeClass = "on";
        target.addClass(activeClass).siblings().removeClass(activeClass);
        var t=target.attr("t");
        setValToTemplate(parseInt(t));
    },

    goToOrderDetail: function (e) {
        var target = $(e.currentTarget);
        localStorage.setItem('orderCode', target.attr('ordernumber'));
        localStorage.setItem('frompage', "promotionorder");
        pageView.goTo('OrderDetail');
    },
});

function isExistInArr(arra, obj) {
    if (arra == null) return null;
    if (arra.length == 0) return null;
    if (obj == null) return null;

    for (var i = 0; i < arra.length; i++) {
        var item = arra[i];
        if (item.Guid == obj.Guid && item.OrderNumber == obj.OrderNumber) {
            return item;
        }
    }
    return null;
}

function setValToTemplate(number) {

    if (myPromotionOrderArr == null) return;
    if (myPromotionOrderArr.length == 0) return null;
                   
    $("#MyPromotionOrderContainer").html("");

    for (var i = 0; i < myPromotionOrderArr.length; i++) {
        var item = myPromotionOrderArr[i];
        var innerHtml = "";
        for (var k = 0; k < item.List.length; k++) {
            var tem = $("#MyPromotionOrderItemInner").html();

            var innerItem = item.List[k];
            tem = tem.replace("ProductGuid", innerItem["ProductGuid"]);
            tem = tem.replace("OriginalImge", innerItem["OriginalImge"]);
            tem = tem.replace("Name", innerItem["Name"]);
            tem = tem.replace("ProductPrice", innerItem["ProductPrice"]);
            tem = tem.replace("BuyNumber", innerItem["BuyNumber"]);

            innerHtml += tem;
        }
       
        var tem1 = $("#MyPromotionOrderItem").html();
        tem1 = tem1.replace("OrderNumber", item["OrderNumber"]);
        tem1 = tem1.replace("Guid", item["Guid"]);
        tem1 = tem1.replace("OrderStatus", item["OrderStatus"]);
        tem1 = tem1.replace("PaymentStatus", item["PaymentStatus"]);
        tem1 = tem1.replace("PayType", item["PayType"]);
        tem1 = tem1.replace("ShipmentStatus", item["ShipmentStatus"]);
       
        tem1 = tem1.replace("MyPromotionOrderItemInner", innerHtml);

        switch (number) {
            case 0://全部
                $("#MyPromotionOrderContainer").append(tem1);
                break;
            case 1://待付款
                if (item["PaymentStatus"] == 0 && item["OrderStatus"] != 2 && item["OrderStatus"] != 3 && item["OrderStatus"] != 6 && item["PayType"] != 0) {
                    $("#MyPromotionOrderContainer").append(tem1);
                }
                break;
            case 2://待发货
                if (item["OrderStatus"] == 1 && (item["ShipmentStatus"] == 0 || item["ShipmentStatus"] == 3) && item["PaymentStatus"] == 2) {
                    $("#MyPromotionOrderContainer").append(tem1);
                }
                break;
            case 3://待收货
                if (item["OrderStatus"] == 1 && item["ShipmentStatus"] == 1 && item["PaymentStatus"] == 2) {
                    $("#MyPromotionOrderContainer").append(tem1);
                }
                break;
            default:
                break;
        }

    }
}
