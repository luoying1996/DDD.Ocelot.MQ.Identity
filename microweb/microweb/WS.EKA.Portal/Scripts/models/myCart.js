/*
购物车用到JS
*/

window.MyCartView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyCartTemplate').html();
        this.MemLoginID = pageView.getCookieValue('uid');
    },
    events: {
        //绑定编辑按钮事件
        'click a.H-text': 'EditClick',
        //绑定删除按钮事件
        'click a#dellCart': 'DellClick',
        //绑定收藏按钮事件
        'click a#doCollect': 'DoCollect',
        //绑定增加商品数量事件
        'click a.add': 'AddProduct',
        //绑定减少商品数量
        'click a.incre': 'IncreProduct',
    },
    render: function () {
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html()
        };

        var data = { title: "", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };
        this.$el.html(Mustache.render(this.template, data, partial));




        this.LoadCarts();

        return this;

    },
    LoadCarts: function () {

        CartsShow(this.MemLoginID);

        ClearCartSelected(this.MemLoginID);
    },
    EditClick: function (e) {
    var that = $(e.currentTarget);
    $(".Checkbox").toggle();
    $(".editbox").toggle();
    if (that.html().trim() == "编辑") {
        that.html("完成");
    } else if (that.html().trim() == "完成") {
        that.html("编辑");
    }
},
DellClick: function (e) {
    var className = $("#dellCart").attr("class");
    if (className != "on") {
        return;//提交按钮不可用时跳出
    }
    if (!confirm("确认要删除？")) {
        return;
    }

    var ids = "";

    for (var i = 0; i < $("span[name='span_cartselected']").length; i++) {

        var className = $("span[name='span_cartselected']").eq(i).attr("class");
        var cartid = $("span[name='span_cartselected']").eq(i).attr("cartid");
        if (className == "trolley_nselect trolley_on") {
            ids += "'" + cartid + "'" + ",";
        }
    }

    if (ids == "") {
        alert("请选中您要删除的购物车商品！");
        return;
    }
    else {
        ids = ids.substring(0, ids.length - 1);
    }


    $.ajax({

        type: "GET",

        url: "api/removecart/?ids=" + ids,

        data: {},

        dataType: "json",

        success: function (data) {
            if (data != null) {
                if (data.Data == "202") {
                    alert("删除购物车成功！");
                    pageView.goTo('MyCart');
                }
            }
            else {
                alert("删除购物车失败！");
            }
        }
    });
},
DoCollect: function (e) {
    var className = $("#doCollect").attr("class");
    if (className != "on") {
        return;//提交按钮不可用时跳出
    }
       
    var li = $("ul[class=CartList] li");
    for (var i = 0; i < li.length; i++)
    {
        var className=$("ul[class=CartList] li").eq(i).find("span").attr("class");
        if (className == "trolley_nselect trolley_on") {
            var productGuid = li.eq(i).find("#productGuid").val();
			var agentId = localStorage.getItem('agentid');
            $.ajax({
                url: "api/collectadd/",
                data: {
                    productGuid: productGuid,
					memLoginID: this.MemLoginID,
					agentID: agentId
                },
                async: false,
                dataType: "json",
                success: function (data) {                        
                    if (data.return == "202") {
                            
                    }
                    
                }
            })
        }
    }
        
    alert("收藏成功");
        

},
AddProduct: function (e) {
    var that = $(e.currentTarget);
    var productNumber = that.parent().find(".arche_input").val();
    that.parent().find(".arche_input").val(parseInt(productNumber) + 1);
    CheckCartShop()
},
IncreProduct: function (e) {
    var that = $(e.currentTarget);
    var productNumber = that.parent().find(".arche_input").val();
    if (productNumber > 1)
    {
        that.parent().find(".arche_input").val(parseInt(productNumber) - 1);
        CheckCartShop()
    }
}
    
});



//获取购物车列表
function CartsShow(MemLoginID) {
	var agentId = localStorage.getItem('agentid');
    $.ajax({
        type: "GET",
		url: "/api/shoppingcart/" + MemLoginID,
		data: { AgentID: agentId },
        dataType: "json",
        success: function (result) {
            if (result != null) {
				if (result.Data.length > 0) {
					var AgentId = agentId;
                    $.each(result.Data, function (index, d) {
                        if (d.IsSameAgent == null) {
                            d.IsSameAgent = false;
                        }
                        else {
                            if (d.IsSameAgent == AgentId) {
                                d.IsSameAgent = false;
                            }
                        }

                        if (d.AgentId == null || d.AgentId == "" || d.AgentId == undefined) {
                            result.Data.AgentId == "主站";
                        }

                        d.BuyPrice = d.BuyPrice.toFixed(2);
                    });

                    var template = $('#MyCartShowTemplate').html();
                    var str = Mustache.render(template, result, []);
                    $("#div_MyCart").html(str);

                    AllCartNumAndPirce();

                    LoadMyCartCss();
                }
                else {
                    var template = $('#EmptyCartTemplate').html();
                    var str = Mustache.render(template, [], []);
                    $("#div_MyCart").html(str);
                }
            }
        }
    });


}

//清除购物车选中状态
function ClearCartSelected(MemLoginID) {

    $.ajax({

        type: "GET",

        url: "api/clearcartselected/?MemLoginID=" + MemLoginID,

        data: { AgentID: localStorage.AgentID },

        dataType: "json",

        success: function (data) {
            if (data != null && data.toString() != "") {
                if (data.Data == "202") {

                }
            }
        }
    });
}

//购物车数量和价格合计
function AllCartNumAndPirce() {
    var allBuyPrice = 0;

    $("span[name='span_cartselected'][class*='trolley_on']").each(function () {
        var price = parseFloat($(this).siblings("div").find("span[name='span_BuyPrice']").html());
        var num = parseInt($(this).siblings("div").find("input[name='txt_BuyNumber']").val())

        allBuyPrice += price * num;
    });
    $("#span_allprice").html(allBuyPrice.toFixed(2));
}

function LoadMyCartCss() {
    $(".CartList  li").each(function () {
        $(this).find(".trolley_nselect").click(function () {
            $(this).toggleClass("trolley_on");
            AllCartNumAndPirce();
            CheckCartSelected();
        });
    });
    $(".select_all").toggle(function () {
        $(this).addClass("select_all_on");
        $(".trolley_nselect").addClass("trolley_on");
        AllCartNumAndPirce();
        CheckCartSelected();
    }, function () {
        $(this).removeClass("select_all_on");
        $(".trolley_nselect").removeClass("trolley_on");
        AllCartNumAndPirce();
        CheckCartSelected();
    })
}

//前往订单提交页面
function GoOrder() {
    var memLoginID = pageView.getCookieValue("uid");
    var className = $("#btnSubCart").attr("class");
    if (className != "on") {
        return;//提交按钮不可用时跳出
    }

    var numStr = $("#txt_cartupdate").val();
	var agentId = localStorage.getItem('agentid');
    $.ajax({

        type: "GET",

        url: "api/updatecartbuynumber/?MemLoginID=" + memLoginID + "&numStr=" + numStr,

		data: { AgentID: agentId },

        dataType: "json",

        success: function (data) {
            if (data != null && data.toString() != "") {
                if (data.Data == "202") {
                    window.location = "/#page/OrderMake";
                }
            }
        }
    });
}

//验证购买数量
function CheckCartShop() {
    var result = true;

    for (var i = 0; i < $("input[name='txt_BuyNumber']").length; i++) {
        var BuyNumber = $("input[name='txt_BuyNumber']").eq(i).val();
        var ProductGuid = $("input[name='productGuid']").eq(i).val();
        var spec = $("input[name='detailSpec']").eq(i).val();
        var specReportyCount = 0; //规格库存
        var limitCount = 0;//限购数量
        var reportyCount = 0;//产品库存
        $.ajax({
            type: "GET",
            url: "/api/ProductSafetyCount/?productGuid=" + ProductGuid + "&detailSpec=" + spec,
            dataType: "json",
            async: false,
            success: function (data) {
                if (data != null) {
                    specReportyCount = data.SpecRepertoryCount;
                    limitCount = data.LimitBuyCount;
                    reportyCount = data.RepertoryCount;
                }
            }
        });
        if (isNaN(BuyNumber)) {
            $("#btnSubCart").removeClass("on");
            alert("购买数量必须为数字！");
            result = false;
            return result;
        }

        if (parseInt(BuyNumber) < 1) {
            $("#btnSubCart").removeClass("on");
            alert("购买数量必须大于0！");
            result = false;
            return result;
        }

        if (limitCount != 0 && parseInt(BuyNumber) > parseInt(limitCount)) {
            $("#btnSubCart").removeClass("on");
            alert("购买数量超过限购数量！");
            $("input[name='txt_BuyNumber']").eq(i).val(limitCount);
            result = false;
            return result;
        }

        if (specReportyCount != 0 && parseInt(BuyNumber) > parseInt(specReportyCount)) {
            $("#btnSubCart").removeClass("on");
            alert("规格库存不足！");
            $("input[name='txt_BuyNumber']").eq(i).val(specReportyCount);
            result = false;
            return result;
        }

        if (specReportyCount == 0 && reportyCount != 0 && parseInt(BuyNumber) > parseInt(reportyCount)) {
            $("#btnSubCart").removeClass("on");
            alert("产品库存不足！");
            $("input[name='txt_BuyNumber']").eq(i).val(reportyCount);
            result = false;
            return result;
        }

        if (parseInt(BuyNumber) > 99) {
            $("#btnSubCart").removeClass("on");
            alert("购买数量必须小于99！");
            $("input[name='txt_BuyNumber']").eq(i).val("99");
            result = false;
            return result;
        }
    }



    if (result) {
        AllCartNumAndPirce();
        CheckCartSelected();
    }
    return result;
}

//验证购物车选中
function CheckCartSelected() {
    var result = false;
    var updateStr = "";

    for (var i = 0; i < $("span[name='span_cartselected']").length; i++) {
        var className = $("span[name='span_cartselected']").eq(i).attr("class");
        var cartid = $("span[name='span_cartselected']").eq(i).attr("cartid");
        if (className == "trolley_nselect trolley_on") {
            var num = $("#txt_BuyNumber" + cartid).val();
            updateStr += cartid + "," + num + "|";

            result = true;
        }
    }

    if (updateStr != "") {
        updateStr = updateStr.substring(0, updateStr.length - 1);

        $("#txt_cartupdate").val(updateStr);
    }

    if (result == false) {
        $("#btnSubCart").removeClass("on");
        $("#doCollect").removeClass("on");
        $("#dellCart").removeClass("on");
    }
    else {
        $("#btnSubCart").addClass("on");
        $("#doCollect").addClass("on");
        $("#dellCart").addClass("on");
    }
}

//删除购物车
function RemoveCart() {
    if (!confirm("确认要删除？")) {
        return;
    }

    var ids = "";

    for (var i = 0; i < $("span[name='span_cartselected']").length; i++) {

        var className = $("span[name='span_cartselected']").eq(i).attr("class");
        var cartid = $("span[name='span_cartselected']").eq(i).attr("cartid");
        if (className == "trolley_nselect trolley_on") {
            ids += "'" + cartid + "'" + ",";
        }
    }

    if (ids == "") {
        alert("请选中您要删除的购物车商品！");
        return;
    }
    else {
        ids = ids.substring(0, ids.length - 1);
    }


    $.ajax({

        type: "GET",

        url: "api/removecart/?ids=" + ids,

        data: {},

        dataType: "json",

        success: function (data) {
            if (data != null) {
                if (data.Data == "202") {
                    alert("删除购物车成功！");
                    pageView.goTo('MyCart');
                }
            }
            else {
                alert("删除购物车失败！");
            }
        }
    });
}