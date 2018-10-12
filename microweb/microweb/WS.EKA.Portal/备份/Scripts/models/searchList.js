window.SearchList = Backbone.Collection.extend({
    model: Product,
    urlRoot: 'api/productsearch/',
    url: function () {
        return this.urlRoot + "-1";
    }
});



window.SearchListView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.collection = new SearchList();
        this.template = $('#SearchListTemplate').html();
    },

    events: {
        'click #SearchListOrder li': 'SearchListchangeOrderType',
        //'click  #searchlist_ dl': 'renderDetail',
    },
    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html(), orderCheck: $('#ThreeCheckTemplate').html()
        };

        //判断是从哪个页面传过来的值
        var title = '';
        if (localStorage.getItem(localStorage.getItem('SearchKey')) != null) {
            title = localStorage.getItem(localStorage.getItem('SearchKey'));
        } else {
            title = decodeURI(localStorage.getItem('SearchKey'));
        }
        var data = { weixinhao: localStorage.getItem('weixinhao'), title: title, loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));

        localStorage.setItem('isASC', false);
        localStorage.setItem('pageIndex', 1);

        that.setOrderCheck();
        that.searchProductList();
        $('.maskgrey1').hide(50);



        return this;
    },

    searchProductList: function () {
        var that = this;

        if (localStorage.getItem('orderType') == null || localStorage.getItem('orderType') == undefined) {
            localStorage.setItem('orderType', "ModifyTime");
        }

        if (localStorage.getItem('isASC') == null || localStorage.getItem('isASC') == undefined) {
            localStorage.setItem('isASC', "false");
        }
        this.collection.fetch({
            data: {
                sorts: localStorage.getItem('orderType'),
                isASC: localStorage.getItem('isASC'),
                pageIndex: localStorage.getItem('pageIndex'),
                pageCount: 10,
                name: localStorage.getItem(localStorage.getItem('SearchKey')) == null ? localStorage.getItem('SearchKey') : '',
                agentID: pageView.getCookieValue('AgentID'),
                sbool: localStorage.getItem('Sbool'),
                BrandGuid: localStorage.getItem(localStorage.getItem('SearchKey')) == null ? '' : localStorage.getItem('SearchKey'),
            },
            success: function () {

                var products = that.collection.models[0].get('Data');
                var allCount = that.collection.models[0].get('Count');

                var template;
                if (allCount == 0) {
                    template = $('#EmptyInnerListTemplate').html();
                    $('#ul_productList').html(Mustache.render(template, [], []));
                    $(".nav-page").html("");
                } else {
                    template = $('#InnerListTemplate').html();
                    $.each(products, function (index, d) {
                        d.ShopPrice = d.ShopPrice.toFixed(2);
                        d.MarketPrice = d.MarketPrice.toFixed(2);
                    });
                    var data = { products: products };
                    $('#ul_productList').html(Mustache.render(template, data, []));

                    //分页
                    new Plugins.PagingPlugin('.nav-page', {
                        allCount: allCount,
                        pageSize:5,
                        prevCall: function (e) { that.fetchPrev(e); },
                        nextCall: function (e) { that.fetchNext(e) },
                        numberClickCall: function (e) { that.fetchSpecific(e) }
                    });
                }
            }
        });
    },

    fetchPrev: function (e) {//上一页
        if ($(e.currentTarget).hasClass('disable')) return;
        var pageIndex = localStorage.getItem('pageIndex');
        localStorage.setItem('pageIndex', +pageIndex - 1);
        this.searchProductList();
    },
    fetchNext: function (e) {//下一页
        if ($(e.currentTarget).hasClass('disable')) return;
        var pageIndex = localStorage.getItem('pageIndex');
        localStorage.setItem('pageIndex', +pageIndex + 1);
        this.searchProductList();
    },
    fetchSpecific: function (e) {
        var target = $(e.currentTarget);
        if (target.hasClass('gray')) return;
        var index = +target.attr('index');
        localStorage.setItem('pageIndex', index);
        this.searchProductList();
    },

    //renderDetail: function (e) {
    //    var target = $(e.currentTarget);

    //    var price = target.attr('ShopPrice'),
    //        productid = target.attr('productid');
    //    localStorage.setItem('productDetail', JSON.stringify({ productid: productid, price: price }));

    //    localStorage.setItem('productid', productid);
    //    localStorage.setItem('detailType', 'tab_intro');
    //    localStorage.setItem('commentPageIndex', 1);
    //    localStorage.setItem('ordercommentPageIndex', 1);
    //    pageView.goTo('ProductDetail?' + productid);
    //},

    setOrderCheck: function () {
        var orderType = localStorage.getItem('orderType'),
            isASC = localStorage.getItem('isASC'),
            priceClass = isASC == "true" ? 'up' : 'down',
            activeClass = 'selected',
            currentTarget = $('.orderType ').find('li[ordertype="' + orderType + '"]');
        currentTarget.addClass(activeClass).siblings().removeClass(activeClass);
        if (currentTarget.hasClass('price')) {
            currentTarget.find('a').removeClass('up down').addClass(priceClass);
        }
    },

    SearchListchangeOrderType: function (e) {
        var target = $(e.currentTarget);
        var activeClass = "on";

        localStorage.setItem('orderType', target.attr('orderType'));
        localStorage.setItem('isASC', true);

        if (!target.hasClass(activeClass)) {
            target.addClass(activeClass);
        }
        else {
            target.removeClass(activeClass);
        }


        if (target.hasClass(activeClass)) {
            this.changeAsc(e);
            return;
        }

        this.searchProductList();
    },

    changeAsc: function (e) {
        var target = $(e.currentTarget),
            activeClass = 'on';

        var orderAsc = localStorage.getItem('isASC');

        localStorage.setItem('isASC', orderAsc == "true" ? false : true);

        this.searchProductList();

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