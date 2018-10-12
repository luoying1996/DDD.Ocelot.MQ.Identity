/*
商品详情用到JS
*/

window.PanicProductDetailView = Backbone.View.extend({
    el: '#jqt',
    initialize: function () {
        this.template = $('#PanicProductDetailTemplate').html();
        this.ProductGuid = localStorage.getItem('productid');
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

        this.LoadProductDetai();
        $(".E-Tab li").click(function () {
            $(this).addClass("cur").siblings().removeClass("cur");
            $(this).parent().next().children().hide();
            $(this).parent().next().children().eq($(this).index()).show();
        });
        return this;
    },
    LoadProductDetai: function () {
        GetPanicProductDetai(this.ProductGuid);

        GetPanicProductComment(1);
        //获得抢购时间(传值)
        GetPanicTime();
    }
});

function GetPanicTime() {
    var EndTime = new Date(localStorage.getItem("PanicEndTime")).getTime();

    $("#PanicTime").attr("panictime", localStorage.getItem("PanicEndTime"));

    $("#PanicTime").html(getTimeHtmlPanicDetail(EndTime));

    setInterval(function () {
        var s = new Date($("#PanicTime").attr("panictime")).getTime();
        $("#PanicTime").html(getTimeHtmlPanicDetail(s));
    }, 1000);
}



function getTimeHtmlPanicDetail(time) {
    var days = 24 * 60 * 60,
        hours = 60 * 60,
        minutes = 60;
    var nowDate = (new Date()).getTime();
    var left, d, h, m, s;
    var str = '';
    left = Math.floor((time - nowDate) / 1000);
    // Number of days left
    d = Math.floor(left / days);
    left -= d * days;
    // Number of hours left
    h = Math.floor(left / hours);
    left -= h * hours;
    // Number of minutes left
    m = Math.floor(left / minutes);
    left -= m * minutes;
    // Number of seconds left
    s = left;
    str += '仅剩' + d + '天' + h + '小时' + m + '分' + checkNum(s) + '秒';


    if (parseInt(d) < 0 || parseInt(h)<0 || parseInt(m)<0 || parseInt(s)<0)
    {
        alert("抢购时间结束");
        window.location = "/#page/PanicBuying";
    }

    if (d=="0"&&h=="0"&&m=="0"&&s == "0")
    {
        alert("抢购时间结束");
        window.location = "/#page/PanicBuying";
    }
    return str;
}

function checkNumPanicDetail(num) {
    if (num < 10) {
        return "0" + num;
    } else
        return num;
}


//商品详情
function GetPanicProductDetai(ProductGuid) {
    var MemLoginID = pageView.getCookieValue('uid');
    if (MemLoginID == undefined || MemLoginID == null) {
        MemLoginID = "";
    }

    $.ajax({

        type: "GET",

        url: "/api/product/?id=" + ProductGuid + "&MemLoginID=" + MemLoginID,

        data: {},

        dataType: "json",

        async: false,

        success: function (result) {
            result.MarketPrice = result.MarketPrice.toFixed(2);
            result.ShopPrice = result.ShopPrice.toFixed(2);
            if (result.OriginalPrice != undefined) {
                result.OriginalPrice = result.OriginalPrice.toFixed(2);
            }

            var template = $('#PanicProductDetailShowTemplate').html();
            var str = Mustache.render(template, result, []);
            $("#section_ProductDetail").html(str);

            var template = $('#PanicProductDetailShow2Template').html();
            var str = Mustache.render(template, result, []);
            $("#ul_promoteList").html(str);


            $("#ShopPrice").html(localStorage.getItem("PanicBuyingPrice"));



            $("#spanRepertoryCount").html(result.RepertoryCount);
            $("#div_daitaTxt").html(result.MobileDetail);

            var imgArr = result.Images;

            ImagePanicSlider(imgArr);

            GetPanicProductDetaiSpecificationList(ProductGuid); //商品规格

            if (MemLoginID != "") {
                $("#huiyuan1").show();
                $("#huiyuan2").show();
            }
        }
    });
}

//商品规格
function GetPanicProductDetaiSpecificationList(ProductGuid) {
    $.ajax({

        type: "GET",

        url: "/api/SpecificationList/?ProductGuid=" + ProductGuid,

        data: {},

        dataType: "json",

        success: function (data) {
            var template = $('#PanicProductDetailSpecificationListTemplate').html();
            var str = Mustache.render(template, data, []);
            $("#div_grey").html(str);

            PanicProductDetaiLoadCss();

        }
    });
}

//购买方式（前往购物车或直接购买）
function SubCartType(btntype) {
    $("#hidGoType").val(btntype);
}

//获取商品的规格金额
function GetPanicProductDetaiSpecificationPirce() {
    var ProductGuid = $("#hidProductGuid").val();
    var spec = $("#hidSpec").val();

    //if (parseInt($("#hidSpecRepertoryCount").val()) >= 0) {
    //    if (parseInt($("#txtBuyNumber").val()) > parseInt($("#hidSpecRepertoryCount").val())) {
    //        window.alert("规格库存不足");
    //        return;
    //    }
    //} else {
    //    if (parseInt($("#txtBuyNumber").val()) > parseInt($("#hidRepertoryCount").val())) {
    //        window.alert("产品库存不足");
    //        return;
    //    }
    //}
    //if (parseInt($("#txtBuyNumber").val()) > parseInt($("#hidLimitBuyCount").val()) && parseInt($("#hidLimitBuyCount").val()) > 0) {
    //    window.alert("产品限购" + $("#hidLimitBuyCount").val() + "件");
    //    return;
    //}
    
    var limitCount = localStorage.getItem("RestrictCount");
    if (parseInt($("#txtBuyNumber").val()) > parseInt(limitCount)) {
        alert("请不要超出限购数量");
    }
    



    var specAll = $("#div_grey").find("a");
    if (specAll.length > 0) {
        //商品有规格属性
        if (!CheckPanicProductSpecification()) {
            alert("请选择商品的属性和规格！");
            return;
        }
        $("#spanRepertoryCount").html($("#hidSpecRepertoryCount").val());
        $.ajax({
            type: "GET",
            url: "/api/Specification/" + ProductGuid + "?Detail=" + spec,
            data: {},
            dataType: "json",
            success: function (data) {
                if (data.toString() != "") {
                    $("#hidSpecPrice").val(data[0].Price.toFixed(2));
                    AddPanicMyCart();
                }
            }
        });
    }
    else {
        AddPanicMyCart();
    }
}

//评论
function GetPanicProductComment(pageIndex) {
    var pageCount = 10;

    $.ajax({

        type: "GET",

        url: 'api/product/comment/' + localStorage.getItem('productid') + '?startPage=' + pageIndex + '&pageSize=' + pageCount,

        data: {},

        dataType: "json",

        success: function (data) {

            var template = $('#PanicProductCommentList').html();

            var str = Mustache.render(template, data, []);
            $("#ul_Comment").html(str);
        }
    });
}

//轮换图
function ImagePanicSlider(imgArr) {
    var imgStr = "";
    var imgIndex = "";

    for (var i = 0; i < imgArr.length; i++) {
        imgStr += '<li class="fd-left"><img src="' + imgArr[i] + '" onerror="javascript: this.src = '+"'/Content/Images/noImage.gif'"+'"></li>';
        imgIndex += "<a></a>";
    }

    $("#slider").html(imgStr);
    $("#pagenavi").html(imgIndex);

    $.banner();
}

//加入购物车
function AddPanicMyCart() {
    if (pageView.getCookieValue('uid') == undefined || pageView.getCookieValue('uid') == "") {
        //判断没有登录则先去登录
        localStorage.setItem('backUrl', window.location.href);
        window.location = "/#page/Login";
        return;
    }

    var btntype = $("#hidGoType").val();
    var MemLoginID = pageView.getCookieValue('uid');
    var ProductGuid = $("#hidProductGuid").val();
    var OriginalImge = $("#hidOriginalImge").val();
    var Name = $("#hidName").val();
    var RepertoryNumber = $("#hidRepertoryNumber").val();
    var BuyNumber = $("#txtBuyNumber").val();
    var MarketPrice = $("#hidMarketPrice").val();
    var ShopPrice = $("#hidShopPrice").val();
    var SpecPrice = $("#hidSpecPrice").val();
    var isSelected = 0;
    if (btntype == 0) {
        isSelected = 1;
    }

    var BuyPrice = 0;
    if (SpecPrice != "" && parseFloat(SpecPrice) > 0) {
        //有规格价格
        BuyPrice = parseFloat(localStorage.getItem("PanicBuyingPrice"));
    }
    else {
        //没有规格价格
        BuyPrice = parseFloat(localStorage.getItem("PanicBuyingPrice"));
    }

    var spec = $("#hidSpec").val();
    var specName = $("#hidSpecName").val();


    var cart = '{"Guid": "00000000-0000-0000-0000-000000000000","MemLoginID": "' + MemLoginID + '","ProductGuid": "' + ProductGuid + '","OriginalImge": "' + OriginalImge + '","Name": "' + Name + '","RepertoryNumber": "' + RepertoryNumber + '","Attributes": "' + specName + '","ExtensionAttriutes": "' + specName + '","BuyNumber": ' + BuyNumber + ',"MarketPrice":' + MarketPrice + ',"ShopPrice":' + ShopPrice + ',"BuyPrice": ' + BuyPrice + ',"IsJoinActivity": 0,"IsPresent": 0,"CreateTime": "","DetailedSpecifications": "' + spec + '","AgentID": "","IsSelected":"' + isSelected + '"}';

    $.ajax({

        type: "POST",

        url: "/api/shoppingcart/",

        data: { cart: cart },

        dataType: "json",

        success: function (data) {
            if (data != null) {
                if (data.Data == "202") {
                    if (btntype == 1) {
                        //加入购物车，进入购物车列表
                        window.location = "/#page/MyCart";
                    }
                    else {
                        //直接购买，进入下单页面
                        window.location = "/#page/OrderMake";
                    }
                }
            }
        }
    });
}

function PanicProductDetaiLoadCss() {

    $("a.addCart").click(function () {
        $(".shadow").slideDown("fast");
        $(".stande_cancel").click(function () {
            $(".shadow").slideUp();
        });
    });
    $("a.immediate").click(function () {
        $(".shadow").slideDown("fast");
        $(".stande_cancel").click(function () {
            $(".shadow").slideUp();
        });
    });

    $(".D-ggsxbox div").each(function () {
        $(this).find("li").click(function () {
            $(this).addClass("cur").siblings().removeClass("cur");
            $(this).siblings("input[name='HiddenSpeGuid']").val($(this).find("a").attr("guid"));
            if (CheckPanicProductSpecification()) {
                var specAll = $("#div_grey").find("li");
                var detailSpec = "";
                var detailSpecName = "";
                if (specAll.length > 0) {
                    //商品有规格属性
                    specAll.each(function () {
                        if ($(this).attr("class") == "cur") {
                            var val = $(this).find("a").attr("value");
                            detailSpec += val + ";";
                            var valName = $(this).find("a").attr("name");
                            detailSpecName += valName + ";"
                        }
                    });

                    if (detailSpec != "") {
                        detailSpec = detailSpec.substring(0, detailSpec.length - 1);
                        detailSpecName = detailSpecName.substring(0, detailSpecName.length - 1);
                        $("#hidSpec").val(detailSpec);
                        $("#hidSpecName").val(detailSpecName);
                    }
                }
                

                $("#SpecShopPrice").html("￥"+localStorage.getItem("PanicBuyingPrice"));


                $.ajax({
                    url: 'api/ProductSafetyCount/',
                    data: { detailSpec: detailSpec, productGuid: localStorage.getItem('productid') },
                    dataType: 'json',
                    success: function (data) {
                        if (data != null && data != "") {
                            $("#spanRepertoryCount").html(data.SpecRepertoryCount);
                            $("#hidSpecRepertoryCount").val(data.SpecRepertoryCount);
                            $("#hidRepertoryCount").val(data.RepertoryCount);
                            $("#hidLimitBuyCount").val(data.LimitBuyCount);
                        }

                    }
                });
            }
        });
    });
}

//购买数量加一
function AddPanicProductShop() {
    //Jerry说抢购不判断库存
    var num = $("#txtBuyNumber").val();
    num++;

    var limitCount=localStorage.getItem("RestrictCount");

    if (parseInt(num) > parseInt(limitCount)) {
        alert("请不要超出限购数量");
    }
    else {
        $("#txtBuyNumber").val(num);
    }
    

    //var allnum = $("#hidRepertoryCount").val();
    //var specNum = $("#hidSpecRepertoryCount").val();
    //var limitCount = $("#hidLimitBuyCount").val();
    //if (parseInt(specNum) >= 0) {
    //    if (parseInt(num) <= parseInt(specNum)) {
    //        if (parseInt(limitCount) == 0) {
    //            $("#txtBuyNumber").val(num);
    //            return;
    //        }
    //        else if (parseInt(limitCount) > 0 && parseInt(num) >= parseInt(limitCount)) {
    //            $("#txtBuyNumber").val(num);
    //            return;
    //        }
    //        else {
    //            alert("请不要超出限购数量");
    //            $("#txtBuyNumber").val(limitCount);
    //        }
    //    }
    //    else {
    //        alert("请不要超出规格库存数量");
    //        $("#txtBuyNumber").val(specNum);
    //        return;
    //    }
    //}
    //else {

    //    if (parseInt(num) <= parseInt(allnum)) {
    //        if (parseInt(num) <= parseInt(limitCount) && parseInt(limitCount) == 0) {
    //            $("#txtBuyNumber").val(num)
    //        }
    //        else {
    //            alert("请不要超出限购数量");
    //            $("#txtBuyNumber").val(limitCount);
    //        }
    //    }
    //    else {
    //        alert("请不要超出库存数量");
    //        $("#txtBuyNumber").val(allnum);
    //        return;
    //    }
    //}

}

//购买数量减一
function CutPanicProductShop() {
    var num = $("#txtBuyNumber").val();
    num--;
    if (parseInt(num) >= 1) {
        $("#txtBuyNumber").val(num);
    }
}

function CheckPanicProductSpecification() {
    var flag = true;
    var HiddenSpeGuid = $("#div_grey").find("input[name='HiddenSpeGuid']");
    for (var i = 0; i < HiddenSpeGuid.length; i++) {
        if (HiddenSpeGuid[i].value == "0") {
            flag = false;
        }
    }
    return flag;
}

function SpecificationSelect(obj) {

}

//评论
function comment(pageIndex) {
    var pageCount = 5;
    var template = $('#ProductTopTemplate').html() + $('#CommentTemplate').html();
    $.ajax({
        url: 'api/product/comment/' + localStorage.getItem('productid') + '?startPage=' + pageIndex + '&pageSize=' + pageCount + '',
        dataType: 'json',
        async: false,
        success: function (resx) {
            $('.subfloor').html(Mustache.render(template, resx, []));

            $("#commentPrevious").click(function () {
                var i = parseInt($("#commentPageIndex").html());
                i = i - 1;
                if (i > 0) {
                    comment(i);
                }
            });

            $("#commentNext").click(function () {
                var i = parseInt($("#commentPageIndex").html());
                i = i + 1;
                if (i <= resx.Count) {
                    comment(i);
                }
            });

        }
    });

    var activeClass = 'active';
    $(".gdsales").addClass(activeClass).siblings().removeClass(activeClass);
}