window.Product = Backbone.Model.extend({
    defaults: {}
});

window.ProductList = Backbone.Collection.extend({
    model: Product,
    urlRoot: 'api/product/list/',
    url: function () {
        return this.urlRoot + localStorage.getItem('productcategoryid');
    }
});

window.ProductListView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#ProductListTemplate').html();
        this.collection = new ProductList();
    },

    events: {
        'click #ProductListOrder li': 'ProductListchangeOrderType',
        'click .floor-cate dl': 'renderDetail',
        'click #ProductList .filter a': 'renderFilter'
    },

    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html(), orderCheck: $('#ThreeCheckTemplate').html()
        };
        var data = { title: "商品列表", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));

        localStorage.setItem('orderType', 'SaleNumber');
        localStorage.setItem('isASC', true);
        localStorage.setItem('pageIndex', 1);
        localStorage.setItem('pageCount', 5);
        this.setOrderCheck();
        this.fetchProductList();
        this.screentab();
        new Plugins.SearchPlugin('.searchContainer', { id: 'keyword_productlist' });

        return this;
    },
    screentab: function () {
        $(".promotRank li").click(function () {
            $(this).addClass("cur").siblings().removeClass("cur");
            localStorage.setItem("pageIndex", 1);
        })
    },
    fetchProductList: function () {
		var that = this;
		var agentId = $('#hagentId').val();
        this.collection.fetch({
            data: {
                sorts: localStorage.getItem('orderType'),
                isASC: localStorage.getItem('isASC'),
                pageIndex: localStorage.getItem('pageIndex'),
				pageCount: $('#ul_productList').parent().hasClass("BigList") ? 10 : 5,
				agentID: agentId,
                sbool: localStorage.getItem('Sbool')
            },
            success: function () {
                if (that.collection != null && that.collection.models.length > 0) {
                    var products = that.collection.models[0].get('Data'), allCount = that.collection.models[0].get('Count');
                    if (allCount == 0) {
                        var template = $('#EmptyInnerListTemplate').html();
                        $('.floor-cate').html(Mustache.render(template, [], []));
                        $('.footer').hide();
                        $('.orderType').hide();
                        return;
                    }
                    var template = $('#InnerListTemplate').html();

                    $.each(products, function (index, d) {
                        d.ShopPrice = d.ShopPrice.toFixed(2);
                        d.MarketPrice = d.MarketPrice.toFixed(2);
                    });
                    var data = { products: products }
                    $('#ul_productList').html(Mustache.render(template, data, []));

                    new Plugins.PagingPlugin('.nav-page', {
                        allCount: allCount,
                        pageSize: $('#ul_productList').parent().hasClass("BigList") ? 10 : 5,//列表时每页显示10数据
                        prevCall: function (e) { that.fetchPrev(e); },
                        nextCall: function (e) { that.fetchNext(e) },
                        numberClickCall: function (e) { that.fetchSpecific(e) }
                    });
                }

            }
        });
    },

    fetchPrev: function (e) {
        if ($(e.currentTarget).hasClass('disable')) return;
        var pageIndex = localStorage.getItem('pageIndex');
        localStorage.setItem('pageIndex', +pageIndex - 1);
        this.fetchProductList();
    },

    fetchNext: function (e) {
        if ($(e.currentTarget).hasClass('disable')) return;
        var pageIndex = localStorage.getItem('pageIndex');
        localStorage.setItem('pageIndex', +pageIndex + 1);
        this.fetchProductList();
    },

    fetchSpecific: function (e) {
        var target = $(e.currentTarget);
        if (target.hasClass('gray')) return;
        var index = +target.attr('index');
        localStorage.setItem('pageIndex', index);
        this.fetchProductList();
    },

    renderDetail: function (e) {
        var target = $(e.currentTarget);
        var price = target.attr('ShopPrice'),
            productid = target.attr('productid');
        localStorage.setItem('productDetail', JSON.stringify({ productid: productid, price: price }));

        localStorage.setItem('productid', productid);
        localStorage.setItem('detailType', 'tab_intro');
        localStorage.setItem('commentPageIndex', 1);
        localStorage.setItem('ordercommentPageIndex', 1);
        pageView.goTo('ProductDetail?' + productid);

    },

    renderFilter: function (e) {
        pageView.goTo('MyFilter');
    },
    setOrderCheck: function () {
        var orderType = localStorage.getItem('orderType'),
            isASC = localStorage.getItem('isASC'),
            priceClass = isASC == "true" ? 'up' : 'down',
            activeClass = 'on',
            currentTarget = $('.orderType ').find('li[ordertype="' + orderType + '"]');
        currentTarget.addClass(activeClass).siblings().removeClass(activeClass);
        if (currentTarget.hasClass('price')) {
            currentTarget.find('a').removeClass('up down').addClass(priceClass);
        }
    },
    ProductListchangeOrderType: function (e) {
        var target = $(e.currentTarget);
        var activeClass = "on";
        if (!target.hasClass(activeClass)) {
            target.addClass(activeClass);
            //当点击时是小图换成大图
            if (target.attr('orderType') == "GetList") {
                if ($('#ul_productList').parent().hasClass("Smalllist")) {
                    $('#ul_productList').parent().removeClass("Smalllist").addClass("BigList");
                }
            } else {
                localStorage.setItem('isASC', false);
            }
        }
        else {
            target.removeClass(activeClass);
            //当点击时是大图换成小图
            if (target.attr('orderType') == "GetList") {
                if ($('#ul_productList').parent().hasClass("BigList")) {
                    $('#ul_productList').parent().removeClass("BigList").addClass("Smalllist");
                }
            } else {
                localStorage.setItem('isASC', true);
            }
        }


        var orderType = target.attr('orderType') == "GetList" ? localStorage.getItem('orderType') : target.attr('orderType');
        localStorage.setItem('orderType', orderType);
        this.fetchProductList();
    },

    changeAsc: function (e) {
        var target = $(e.currentTarget),
            activeClass = 'on';

        var orderAsc = localStorage.getItem('isASC');

        localStorage.setItem('isASC', orderAsc == "true" ? false : true);

        this.fetchProductList();
    },

    changePriceImg: function (target) {
        var icon = $(target).find('a'),
            asc = icon.hasClass('up');
        if (asc) {
            icon.removeClass('up').addClass('down');
        } else
            icon.removeClass('down').addClass('up');
    }
});