/*
商品详情用到JS
*/



window.ProductDetailView = Backbone.View.extend({
    el: '#jqt',
    initialize: function () {
        this.template = $('#ProductDetailTemplate').html();
        this.ProductGuid = localStorage.getItem('productid');
    },
    events: {
        'click em.CollectIcn': 'collectionClick'//加入收藏
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
        return this;
    },
    LoadProductDetai: function () {
        GetProductDetai(this.ProductGuid);

        GetProductComment(1);
    },
    //加入收藏
    collectionClick: function () {
        if ($("em.CollectIcn").hasClass("on")) {
            return;
        }

        var memLoginID = pageView.getCookieValue('uid');
        if (memLoginID == null) {
            alert("请登录");
            //todo:跳转到登录页面
        }
        var productGuid = this.ProductGuid;

        $.ajax({
            url: "api/collectadd/",
            data: {
                ProductGuid: productGuid,
                MemLoginID: memLoginID,
                agentID: pageView.getCookieValue('AgentID')
            },
            async: false,
            dataType: "json",
            success: function (data) {
                if (data.return == "202") {
                    alert("收藏成功");
                    $("em.CollectIcn").addClass("on");
                   
                } else {
                    alert("已经收藏");
                }
            }
        })
    },

});

//商品详情
function GetProductDetai(ProductGuid) {
    var MemLoginID = pageView.getCookieValue('uid');
    if (MemLoginID == undefined || MemLoginID == null) {
        MemLoginID = "";
    }

    $.ajax({

        type: "GET",

        url: "/api/product/",

        data: { AgentID: pageView.getCookieValue("AgentID"), Sbool: pageView.getCookieValue("Sbool"), Id: ProductGuid, MemLoginID: MemLoginID },

        dataType: "json",

        success: function (result) {
            result.MarketPrice = result.MarketPrice.toFixed(2);
            result.ShopPrice = result.ShopPrice.toFixed(2);
            if (result.OriginalPrice != undefined) {
                result.OriginalPrice = result.OriginalPrice.toFixed(2);
            }
            var template = $('#ProductDetailShowTemplate').html();
            var str = Mustache.render(template, result, []);
            $("#section_ProductDetail").html(str);

            var template = $('#ProductDetailShow2Template').html();
            var str = Mustache.render(template, result, []);
            $("#ul_promoteList").html(str);
            $("#spanRepertoryCount").html(result.RepertoryCount);
            $("#div_daitaTxt").html(result.MobileDetail);

            var imgArr = result.Images;

            ImageSlider(imgArr);

            GetProductDetaiSpecificationList(ProductGuid); //商品规格
            CheckIsCollected(ProductGuid);//判断是否收藏

            if (MemLoginID != "") {
                $("#huiyuan1").show();
                $("#huiyuan2").show();
            }
        }
    });
}

//判断是否收藏
function CheckIsCollected(ProductGuid) {
    $.ajax({
        type: "GET",
        url: "api/CheckIsCollected/",
        data: {
            productGuid: ProductGuid,
            MemLoginID: pageView.getCookieValue('uid'),
            agentID: pageView.getCookieValue('AgentID')
        },
        dataType: "json",
        success: function (data) {
            if (data.Data == true) {
                $("em.CollectIcn").addClass("on");
            }
        }
    });
}

//商品规格
function GetProductDetaiSpecificationList(ProductGuid) {
    $.ajax({

        type: "GET",

        url: "/api/SpecificationList/?ProductGuid=" + ProductGuid,

        data: {},

        dataType: "json",

        success: function (data) {
            var template = $('#ProductDetailSpecificationListTemplate').html();
            var str = Mustache.render(template, data, []);
            $("#div_grey").html(str);

            ProductDetaiLoadCss();

        }
    });
}

//购买方式（前往购物车或直接购买）
function SubCartType(btntype) {
    $("#hidGoType").val(btntype);
}

//获取商品的规格金额
function GetProductDetaiSpecificationPirce() {
    
    if (parseInt($("#hidSpecRepertoryCount").val()) >= 0) {
        if (parseInt($("#txtBuyNumber").val()) > parseInt($("#hidSpecRepertoryCount").val())) {
            window.alert("规格库存不足");
            return;
        }
    } else {
        if (parseInt($("#txtBuyNumber").val()) > parseInt($("#hidRepertoryCount").val())) {
            window.alert("产品库存不足");
            return;
        }
    }
    if (parseInt($("#txtBuyNumber").val()) > parseInt($("#hidLimitBuyCount").val()) && parseInt($("#hidLimitBuyCount").val()) > 0) {
        window.alert("产品限购" + $("#hidLimitBuyCount").val() + "件");
        return;
    }
    var specAll = $("#div_grey").find("a");
    if (specAll.length > 0) {
        //商品有规格属性
        if (!CheckProductSpecification()) {
            alert("请选择商品的属性和规格！");
            return;
        }
        AddMyCart();
    }
    else {
        AddMyCart();
    }
}


//评论
function GetProductComment(pageIndex) {
    var pageCount = 9999;

    $.ajax({

        type: "GET",

        url: 'api/product/comment/' + localStorage.getItem('productid') + '?startPage=' + pageIndex + '&pageSize=' + pageCount,

        data: {},

        dataType: "json",

        success: function (data) {

            var template = $('#ProductCommentTemplate').html()

            var str = Mustache.render(template, data, []);

            $("#ul_Comment").html(str);
        }
    });
}

//轮换图
function ImageSlider(imgArr) {
    var imgStr = "";
    var imgIndex = "";

    for (var i = 0; i < imgArr.length; i++) {
        imgStr += '<li class="fd-left"><img src="' + imgArr[i] + '"></li>';
        imgIndex += "<a></a>";
    }

    $("#slider").html(imgStr);
    $("#pagenavi").html(imgIndex);

    $.banner();
}

var LockAddMyCart = true;

//加入购物车
function AddMyCart() {
    if (pageView.getCookieValue('uid') == undefined || pageView.getCookieValue('uid') == "") {
        //判断没有登录则先去登录
        localStorage.setItem('backUrl', window.location.href);
        window.location = "/#page/Login";
        return;
    }

    var btntype = $("#hidGoType").val();

    if (!LockAddMyCart) {
        return;
    }

    LockAddMyCart = false;

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
        BuyPrice = parseFloat(SpecPrice);
    }
    else {
        //没有规格价格
        BuyPrice = parseFloat(ShopPrice);
    }

    var spec = $("#hidSpec").val();
    var specName = $("#hidSpecName").val();
    var RepertoryCount = parseInt($("#hidRepertoryCount").val()) - parseInt(BuyNumber);
    if (RepertoryCount < 0) {
        window.alert("商品库存不足");
        return;
    }

    var cart = '{"Guid": "00000000-0000-0000-0000-000000000000","MemLoginID": "' + MemLoginID + '","ProductGuid": "' + ProductGuid + '","OriginalImge": "' + OriginalImge + '","Name": "' + Name + '","RepertoryNumber": "' + RepertoryNumber + '","Attributes": "' + specName + '","ExtensionAttriutes": "' + specName + '","BuyNumber": ' + BuyNumber + ',"MarketPrice":' + MarketPrice + ',"ShopPrice":' + ShopPrice + ',"BuyPrice": ' + BuyPrice + ',"IsJoinActivity": 0,"IsPresent": 0,"CreateTime": "","DetailedSpecifications": "' + spec + '","AgentID": "' + pageView.getCookieValue('AgentID') + '","IsSelected":"' + isSelected + '"}';

    $.ajax({

        type: "POST",

        url: "/api/shoppingcart/",

        data: { cart: cart },

        dataType: "json",

        success: function (data) {
            LockAddMyCart = true;

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

function ProductDetaiLoadCss() {
    $(".promoteTit li").click(function () {
        var indx = $(this).index();
        $(this).addClass("on").siblings().removeClass("on");
        $(".daitaTxt").eq(indx).removeClass("fd-hide").siblings().addClass("fd-hide");
    });
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
    $(".textHead").each(function (indx, elems) {
        $(elems).click(function () {
            $(this).find("span").toggleClass("on");
            $(".daitaTxt").eq(indx).slideToggle();
        });
    });

    $(".stande dl").each(function () {
        $(this).find("a").click(function () {
            $(this).addClass("active").siblings().removeClass("active");
            $(this).siblings("input[name='HiddenSpeGuid']").val($(this).attr("guid"));
            if (CheckProductSpecification()) {
                var specAll = $("#div_grey").find("a");
                var detailSpec = "";
                var detailSpecName = "";
                if (specAll.length > 0) {
                    //商品有规格属性
                    specAll.each(function () {
                        if ($(this).attr("class") == "active") {
                            var val = $(this).attr("value");
                            detailSpec += val + ";";
                            var valName = $(this).attr("name");
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
                var ProductGuid = $("#hidProductGuid").val();
                var spec = $("#hidSpec").val();
                $.ajax({
                    type: "GET",
                    url: "/api/Specification/" + localStorage.getItem('productid') + "?Detail=" + spec,
                    data: { MemLoginID: pageView.getCookieValue('uid'), AgentID: pageView.getCookieValue('AgentID'), Sbool: pageView.getCookieValue('Sbool') },
                    dataType: "json",
                    success: function (data) {
                        if (data.toString() != "") {
                            $("#hidSpecPrice").val(data[0].Price.toFixed(2));
                            $("#huiyuanPrice").html(data[0].Price.toFixed(2));
                            $("#shangchengPrice").html(data[0].OriginalPrice.toFixed(2));
                        }
                    }
                });
            }
        });
    });
}

//购买数量加一
function AddProductShop() {
    var num = $("#txtBuyNumber").val();
    num++;
    var allnum = $("#hidRepertoryCount").val();
    var specNum = $("#hidSpecRepertoryCount").val();
    var limitCount = $("#hidLimitBuyCount").val();
    if (parseInt(specNum) >= 0) {
        if (parseInt(num) <= parseInt(specNum)) {
            if (parseInt(num) <= parseInt(limitCount) && parseInt(limitCount) != 0) {
                $("#txtBuyNumber").val(num)
            }
            else {
                alert("请不要超出限购数量");
                $("#txtBuyNumber").val(limitCount);
            }
        }
        else {
            alert("请不要超出规格库存数量");
            $("#txtBuyNumber").val(specNum);
            return;
        }
    }
    else {

        if (parseInt(num) <= parseInt(allnum)) {
            if (parseInt(num) <= parseInt(limitCount) && parseInt(limitCount) != 0) {
                $("#txtBuyNumber").val(num)
            }
            else {
                alert("请不要超出限购数量");
                $("#txtBuyNumber").val(limitCount);
            }
        }
        else {
            alert("请不要超出库存数量");
            $("#txtBuyNumber").val(allnum);
            return;
        }
    }
}

//购买数量减一
function CutProductShop() {
    var num = $("#txtBuyNumber").val();
    num--;
    if (parseInt(num) >= 1) {
        $("#txtBuyNumber").val(num);
    }
}

//检验是否选择了所有规格属性
function CheckProductSpecification() {
    var flag = true;
    var HiddenSpeGuid = $("#div_grey").find("input[name='HiddenSpeGuid']");
    for (var i = 0; i < HiddenSpeGuid.length; i++) {
        if (HiddenSpeGuid[i].value == "0") {
            flag = false;
        }
    }
    return flag;
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