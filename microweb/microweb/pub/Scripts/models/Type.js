 
window.TypeList = Backbone.Collection.extend({
    model: Product,
    urlRoot: 'api/product/type/',
    url: function () {
        return this.urlRoot + '?type=' + localStorage.getItem('TypePro');
    }
});

window.TypeProView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#TypeListTemplate').html();
        this.collection = new TypeList();
    },

    events: {
        'click #TypeListOrder li': 'TypechangeOrderType',
        'click .floor-cate li': 'renderDetail',
        'click #ProductList .filter a': 'renderFilter'
    },

    render: function () {
        
        var that = this;
        var partial = { header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html(), orderCheck: $('#ThreeCheckTemplate').html()
        };
        var data = { weixinhao: localStorage.getItem('weixinhao'), loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));
        localStorage.setItem('orderType', 'ModifyTime');
        localStorage.setItem('isASC', true);
        localStorage.setItem('pageIndex', 1);
        localStorage.setItem('pageCount', 5);
        this.setOrderCheck();

        this.fetchProductList();

        new Plugins.SearchPlugin('.searchContainer', {
            id: 'keyword_productlist'
        });

        return this;

    },
    fetchProductList: function () {

		var that = this; var agentId = $('#hagentId').val();
        this.collection.fetch({
            data: {
                sorts: localStorage.getItem('orderType'),
                isASC: localStorage.getItem('isASC'),
                pageIndex: localStorage.getItem('pageIndex'),
				pageCount: 5,
				agentID: agentId,
                sbool: localStorage.getItem('Sbool')
            },
            success: function () {
                var products = that.collection.models[0].get('Data'),
                    allCount = that.collection.models[0].get('Count');
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
                $('.floor-cate').html(Mustache.render(template, data, []));

                new Plugins.PagingPlugin('.nav-page', {
                    allCount: allCount,
                    prevCall: function (e) { that.fetchPrev(e); },
                    nextCall: function (e) { that.fetchNext(e) },
                    numberClickCall: function (e) { that.fetchSpecific(e) }
                });
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
            activeClass = 'selected',
            currentTarget = $('.orderType ').find('li[ordertype="' + orderType + '"]');
        currentTarget.addClass(activeClass).siblings().removeClass(activeClass);
        if (currentTarget.hasClass('price')) {
            currentTarget.find('a').removeClass('up down').addClass(priceClass);
        }
    },
    TypechangeOrderType: function (e) {
        var target = $(e.currentTarget),
            activeClass = "on";

        if (!target.hasClass(activeClass)) { localStorage.setItem('isASC', false); target.addClass(activeClass); }
        else { localStorage.setItem('isASC', true); target.removeClass(activeClass); }
        //        if (target.hasClass(activeClass)) {
        //            this.changeAsc(e);
        //        }


        localStorage.setItem('orderType', target.attr('orderType'));
        this.fetchProductList();
    },

    changeAsc: function (e) {
        var target = $(e.currentTarget),
            activeClass = "on";

        //        var orderAsc = localStorage.getItem('isASC');
        //        localStorage.setItem('isASC', orderAsc == "true" ? false : true);
        // this.fetchProductList();

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