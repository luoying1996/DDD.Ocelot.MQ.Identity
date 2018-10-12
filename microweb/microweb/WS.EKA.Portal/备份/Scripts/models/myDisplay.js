/*
晒单列表用到JS
*/
window.MyDisplay = Backbone.Model.extend({
    defaults: {}
});

window.MyDisplayList = Backbone.Collection.extend({
    model: MyDisplay,
    urlRoot: 'api/order/member/',
    url: function () {
        return this.urlRoot + pageView.getCookieValue('uid');
    }
});

window.MyDisplayView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyDisplay').html();
        this.collection = new MyDisplayList();
        this.MemLoginID = pageView.getCookieValue('uid');
    },
    events: {
    },

    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
        };
        var data = { title: "商品晒单", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };
        this.$el.html(Mustache.render(this.template, data, partial));

        localStorage.setItem('pageIndex', 1);
        localStorage.setItem('pageCount', 5);
        localStorage.setItem('t', 4);

        this.DisplayList();
        $('.maskgrey1').hide(50);
        return this;
    },

    //string loginId, int t, 

    //string agentID
    //获取确认收货订单列表
    DisplayList: function () {
        var that = this;
        this.collection.fetch({
            data: {
                pageIndex: localStorage.getItem('pageIndex'),
                pageCount: localStorage.getItem('pageCount'),
                t: localStorage.getItem('t'),
                OderStatus: 0,
                ShipmentStatus: 0,
                PaymentStatus: 0,
                refundStatus: 0,
                memLoginID: this.MemLoginID,
                agentID: pageView.getCookieValue('AgentID')
            },
            success: function () {
                var products = that.collection.models[0].get('Data'),
                    allCount = that.collection.models[0].get('Count');

                var template;
                //加载空模板
                if (that.collection.length == 0 || products.length == 0 || allCount == 0) {
                    template = $('#EmptyDisplayTemplate').html();
                    $("#ul_DisplayList").html(Mustache.render(template, [], []));
                    $(".nav-page").html("");

                } else { //加载数据模板
                    template = $('#MyDisplayModelli').html();
                    var data = { orders: products }
                    $("#ul_DisplayList").html(Mustache.render(template, data, []));

                    //判断是否晒单
                    $.each(products, function () {
                        var productGuid = this.ProductList[0].ProductGuid;
                        var orderNumber = this.OrderNumber;
                        if (that.CheckLog(productGuid, orderNumber)) {
                            $("#" + productGuid).attr('href', "/#page/ProductDisplay?" + productGuid).text("去晒单");
                            localStorage.setItem(productGuid, orderNumber);
                        }
                    });

                    new Plugins.PagingPlugin('.nav-page', {
                        allCount: allCount,
                        prevCall: function (e) { that.fetchPrev(e); },
                        nextCall: function (e) { that.fetchNext(e) },
                        numberClickCall: function (e) { that.fetchSpecific(e) }
                    });
                }
            }
        });
    },

    //判断是否已经晒单
    CheckLog: function (productGuid, orderNumber) {
        var flag = false;
        $.ajax({
            url: 'api/CheckIsLog/',
            data: {
                ProductGuid: productGuid,
                OrderNumber: orderNumber
            },
            dataType: 'json',
            async: false,
            success: function (res) {
                if (res.return != null && (res.return == false || res.return == "false")) {
                    flag = true;
                }
            }
        });
        return flag;
    },

    fetchPrev: function (e) {//上一页
        if ($(e.currentTarget).hasClass('disable')) return;
        var pageIndex = localStorage.getItem('pageIndex');
        localStorage.setItem('pageIndex', +pageIndex - 1);
        this.DisplayList();
    },
    fetchNext: function (e) {//下一页
        if ($(e.currentTarget).hasClass('disable')) return;
        var pageIndex = localStorage.getItem('pageIndex');
        localStorage.setItem('pageIndex', +pageIndex + 1);
        this.DisplayList();
    },
    fetchSpecific: function (e) {
        var target = $(e.currentTarget);
        if (target.hasClass('gray')) return;
        var index = +target.attr('index');
        localStorage.setItem('pageIndex', index);
        this.DisplayList();
    },
});