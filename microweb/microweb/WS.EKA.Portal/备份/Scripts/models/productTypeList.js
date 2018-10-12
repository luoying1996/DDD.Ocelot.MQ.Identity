window.ProductTypeListView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#ProductTypeListTemplate').html();
    },

    events: {
    },

    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html(), orderCheck: $('#ThreeCheckTemplate').html()
        };
        var data = { title: "商品列表", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));
        localStorage.setItem('sorts', 'ModifyTime');
        localStorage.setItem('isASC', false);
        localStorage.setItem('pageIndex', 1);
        localStorage.setItem('pageCount', 5);
        that.getProductList();
        return this;
    },


    getProductList: function () {
        var that = this;
        $.ajax({
            type:'GET',
            url: "api/product/type/",
            data: {
                sorts: localStorage.getItem('sorts'),
                isASC: localStorage.getItem('isASC'),
                pageIndex: localStorage.getItem('pageIndex'),
                pageCount: localStorage.getItem('pageCount'),
                type: localStorage.getItem('ProductType'),
                agentId: pageView.getCookieValue('AgentID'),
                sbool: pageView.getCookieValue("Sbool"),
            },
            async: false,
            dataType: "json",
            success: function (data) {
                var products = data.Data,
                    allCount = data.Count;

                var typeName = data.TypeName;
                var pageCount = data.PageCount;
                if (typeName != null && typeName != undefined) {
                    $("#TypeName").html(typeName);
                }
                if (pageCount != null && pageCount != undefined) {
                    $("#pageCount").val(pageCount);
                }
                if (allCount == 0) {
                    var template = $('#EmptyInnerListTemplate').html();
                    return;
                }
                var template = $('#InnerTypeListTemplate').html();
                if (products.length > 0) {
                    $.each(products, function (index, d) {
                        d.ShopPrice = d.ShopPrice.toFixed(2);
                        d.MarketPrice = d.MarketPrice.toFixed(2);
                    });
                    var data = { products: products }
                    $("#ul_productTypeList").html(Mustache.render(template, data, []));

                    new Plugins.PagingPlugin('.nav-page', {
                        allCount: allCount,
                        pageSize: 5,//列表时每页显示10数据
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
        this.getProductList();
    },
    fetchNext: function (e) {//下一页
        if ($(e.currentTarget).hasClass('disable')) return;
        var pageIndex = localStorage.getItem('pageIndex');
        localStorage.setItem('pageIndex', +pageIndex + 1);
        this.getProductList();
    },
    fetchSpecific: function (e) {
        var target = $(e.currentTarget);
        if (target.hasClass('gray')) return;
        var index = +target.attr('index');
        localStorage.setItem('pageIndex', index);
        this.getProductList();
    },
});