
window.Catalog = Backbone.Model.extend({
});

window.CatalogCollection = Backbone.Collection.extend({
    model: Catalog,
    url: 'api/product/type/'
});


window.CatalogView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.collection = new CatalogCollection();
        this.template = $('#IndexCatalogTemplate').html();
    },
    events: {
        'click #test1115651 li': 'renderDetail',
        'click #searchButton': "ShowCatagory",
        'click #cancelprocatorylist': "hidecatory",
        'click #allcatagorylist dt': "LoadSecondCatagory",
        'click #search_button': "searchpro",
        'click #mycarttips': "gotoMyOrder",
    },
    render: function () {
        this.$el.html(Mustache.render(this.template, [], []));
        try {
            this.flashs();
        } catch (e) {

        }



        this.newProduct();
        this.TJProduct();
        this.CXProduct();
        this.JPTJProduct();
        this.mybanner();

        IndexSlider();
        this.IndexAnnouncement();
        this.IndexTop8Category();
        this.IndexAdFirst();
        return this;
    },
    //新首页改版功能
    IndexTop8Category: function () {
        $.ajax({
            url: "api/productcatagory/0",
            data: {
                id: "0",
                agentID: pageView.getCookieValue('AgentID'),
                sbool: localStorage.getItem('Sbool')
            },
            dataType: "json",
            type: "GET",
            success: function (data) {
                if (data != null && data.Data != null && data.Data.length > 0) {
                    if (data.Data.length > 8) {
                        data.Data = data.Data.splice(0, 8);
                    }


                    var template = $('#IndexTop8CategoryTemplate').html();
                    var str = Mustache.render(template, data, []);
                    $("#IndexTop8Category").html(str);
                }
            }
        });
    },
    IndexAnnouncement: function () {
        $.ajax({
            url: "api/GetAnnouncementList/?AgentID=" + pageView.getCookieValue('AgentID'),
            dataType: "json",
            type: "GET",
            success: function (data) {
                if (data != null && data.Data != null && data.Data.length > 0) {
                    var template = $('#IndexAnnouncementTemplate').html();
                    var str = Mustache.render(template, data, []);
                    $("#IndexAnnouncement").html(str);
                }
            }
        });
    },
    IndexAdFirst: function () {
        $.ajax({
            url: "api/GetDefaultAD/",
            dataType: "json",
            data: { W_Type: 1, BanerPostion: 0, ShopID: pageView.getCookieValue('AgentID') },
            type: "GET",
            success: function (data) {
                if (data != null && data.Data != null && data.Data.length > 0) {
                    var template = $('#IndexAdTemplate').html();
                    var str = Mustache.render(template, data, []);
                    $("#IndexADFirst").html(str);
                }
            }
        });
    },
    gotoMyOrder: function () {
        pageView.goTo("MyOrder");
    },
    setNumber: function () {
        var theorderlist = new OrderList();
        theorderlist.fetch({
            data: {
                pageIndex: 1,
                pageCount: 100000,
                t: 2,
                OderStatus: 1,
                ShipmentStatus: 0,
                PaymentStatus: 1,
                refundStatus: 0,
                memLoginID: pageView.getCookieValue('uid'),
                agentID: pageView.getCookieValue('AgentID'),
                sbool: localStorage.getItem('Sbool')
            },
            success: function (data) {
                $("#mycarttips").find("span").text(theorderlist.models[0].get("Count"));
            }
        });

    },
    searchpro: function () {
        localStorage.setItem("keyword", $("#txt_SearchKey").val());
        localStorage.setItem("searchPageIndex", "1");
        location.href = "/#page/SearchList?" + localStorage.getItem("keyword");
    },
    hidecatory: function (e) {
        $(e.currentTarget).find("h2").click(function () {
            $(this).toggleClass("sub_select").parent().siblings("dt").children().removeClass("sub_select");
            $(this).parent().next().slideToggle().siblings("dd").slideUp();
        })
    },
    LoadShopCatagory: function () {
        var procatogery = new FirstLevelCollection();
        var catalogtemplate = $("#newprocatagory").html();
        procatogery.fetch({
            success: function () {
                var data = { catagory: procatogery.toJSON() };
                $("#allcatagorylist").html(Mustache.render(catalogtemplate, data, null));
            }
        });
    },
    LoadSecondCatagory: function (e) {

        if ($(e.currentTarget).next("dd").hasClass("fd-hide")) {
            var id = $(e.currentTarget).attr("ID");
            var secondcatorety = new SecondLevelCollection();
            secondcatorety.nextID = id;
            secondcatorety.level = undefined;
            var template = $("#newprocatagory2").html();
            secondcatorety.fetch({
                success: function () {
                    var data = { catagory: secondcatorety.toJSON() };
                    $(e.currentTarget).next("dd").html(Mustache.render(template, data, null));
                }
            });
            $(e.currentTarget).next("dd").removeClass("fd-hide");
        }
        else {
            $(e.currentTarget).next("dd").addClass("fd-hide");
        }

    }
    ,
    ShowCatagory: function () {
        $(".shadow").slideDown();
        $(".shopBox").addClass("shopBox_all");
        $(".search_btn").click(function () {
            $(".shadow").slideUp();
            $(".shopBox").removeClass("shopBox_all");
        });
    },
    newProduct: function () {

        //新品上架
        var that = this;
        this.collection.fetch({
            data: {
                type: 1,
                sorts: "ModifyTime",
                isASC: "false",
                pageIndex: 1,
                pageCount: 6,
                agentID: pageView.getCookieValue('AgentID'),
                sbool: localStorage.getItem('Sbool')
            },
            success: function () {
                var products = that.collection.models[0].get('Data'),
                    allCount = that.collection.models[0].get('Count');

                if (products != undefined && products != null) {
                    $.each(products, function (index, d) {
                        d.ShopPrice = d.ShopPrice.toFixed(2);
                        d.MarketPrice = d.MarketPrice.toFixed(2);
                    });

                    var template = $('#IndexCatalogProductTemplate').html();
                    var data = { products: products };
                    $('#newproductlist').html(Mustache.render(template, data, []));
                }

            }
        });
    }
    ,
    TJProduct: function () {
        //商品推荐
        var that = this;
        this.collection.fetch({
            data: {
                type: 4,
                sorts: "ModifyTime",
                isASC: "false",
                pageIndex: 1,
                pageCount: 6,
                agentID: pageView.getCookieValue('AgentID'),
                sbool: localStorage.getItem('Sbool')
            },
            success: function () {
                var products = that.collection.models[0].get('Data'),
                    allCount = that.collection.models[0].get('Count');

                if (products != undefined && products != null) {
                    $.each(products, function (index, d) {
                        d.ShopPrice = d.ShopPrice.toFixed(2);
                        d.MarketPrice = d.MarketPrice.toFixed(2);
                    });

                    //ShopPrice.toFixed(2);

                    var template = $('#IndexCatalogProductTemplate').html();
                    var data = { products: products };
                    $('#tuijianproductlist').html(Mustache.render(template, data, []));
                }

            }
        });
    }
    ,
    CXProduct: function () {
        //促销商品
        var that = this;
        this.collection.fetch({
            data: {
                type: 2,
                sorts: "ModifyTime",
                isASC: "false",
                pageIndex: 1,
                pageCount: 6,
                agentID: pageView.getCookieValue('AgentID'),
                sbool: localStorage.getItem('Sbool')
            },
            success: function () {
                var products = that.collection.models[0].get('Data'),
                    allCount = that.collection.models[0].get('Count');
                if (products != undefined && products != null) {
                    $.each(products, function (index, d) {
                        d.ShopPrice = d.ShopPrice.toFixed(2);
                        d.MarketPrice = d.MarketPrice.toFixed(2);
                    });

                    var template = $('#IndexCatalogProductTemplate').html();
                    var data = { products: products };
                    $('#hotsellproductlist').html(Mustache.render(template, data, []));
                }

            }
        });
    },

    JPTJProduct: function () {
        //精品推荐
        var that = this;
        this.collection.fetch({
            data: {
                type: 3,
                sorts: "ModifyTime",
                isASC: "false",
                pageIndex: 1,
                pageCount: 6,
                agentID: pageView.getCookieValue('AgentID'),
                sbool: localStorage.getItem('Sbool')
            },
            success: function () {
                var products = that.collection.models[0].get('Data'),
                allCount = that.collection.models[0].get('Count');

                if (products != undefined && products != null) {
                    $.each(products, function (index, d) {
                        d.ShopPrice = d.ShopPrice.toFixed(2);
                        d.MarketPrice = d.MarketPrice.toFixed(2);
                    });

                    var template = $('#tjspproducttemplate').html();
                    var data = { products: products };
                    $('#jinpingproductlist').html(Mustache.render(template, data, []));

                }

            }
        });
    },
    flashs: function () {
        var template = $('#flashTemplate').html();
        var flash = JSON.parse(localStorage.getItem('flash'));


        var data = { flashs: flash };
        $('#flash').html(Mustache.render(template, data, []));

        $('.flexslider').flexslider({
            animation: "slide",
            slideshow: false
        });
    }
    ,
    renderDetail: function (e) {
        var target = $(e.currentTarget);
        var productid = target.attr('productid');
        var price = target.attr('ShopPrice');
        localStorage.setItem('productid', productid);
        localStorage.setItem('productDetail', JSON.stringify({ productid: productid, price: price }));
        pageView.goTo('ProductDetail?' + productid);
    }
    ,
    mybanner: (function () {
        window.setTimeout(function () {
            var num = 0;
            num = $("#slider li").length;
            var html = "";
            html = "<a href='javascript:void(0);' {c}>{i}</a>";
            var lasthtml,
            thtml;
            lasthtml = "";

            for (var i = 0; i < num; i++) {
                thtml = "";
                if (i == 0) {
                    thtml = html.replace("{c}", "class='active' ");

                } else {
                    thtml = html.replace("{c}", "");

                }
                thtml = thtml.replace("{i}", i);

                lasthtml += thtml;

            };
            $("#pagenavi").html(lasthtml);
            var active = 0,
            as = $('#pagenavi a');

            for (var i = 0; i < as.length; i++) {
                (function () {
                    var j = i;
                    as[i].onclick = function () {
                        t2.slide(j);
                        return false;
                    }

                })();

            }

            var t2 = new TouchSlider({
                id: 'slider',
                speed: 600,
                timeout: 60000,
                before: function (index) {
                    as[active].className = '';
                    active = index;
                    as[active].className = 'active';

                }
            });
            if (t2 != null && t2 != undefined && t2.slides.length > 0) {
                setTimeout(function () { t2.resize(); }, 100);
            }

        }, 100);


    })
});



//轮换图
function IndexSlider() {

    var ShopID = pageView.getCookieValue('AgentID');

    $.ajax({

        type: "GET",

        url: "/api/getshopconfiglist/?ShopID=" + ShopID,

        data: {},

        dataType: "json",

        success: function (data) {
            if (data != null && data != undefined && data != "") {
                var template = $('#IndexSliderImageTemplate').html();
                $('#slider').html(Mustache.render(template, data, []));

                var template = $('#IndexSliderIndexTemplate').html();
                $('#pagenavi').html(Mustache.render(template, data, []));

                $.banner();
            }

        }
    });
}

function AutoScroll(obj) {
    $(obj).animate({
        marginTop: "-2.5em"
    }, 500, function () {
        $(this).css({ marginTop: "0px" }).find("a:first").appendTo(this);
    });
}
$(document).ready(function () {
    setInterval('AutoScroll("#IndexAnnouncement")', 3000);
});