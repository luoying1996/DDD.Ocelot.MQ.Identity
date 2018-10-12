window.MyCollect = Backbone.Model.extend({
    urlRoot: 'api/collect/',
    url: function () {
        return this.urlRoot;
    }
});

window.MyCollectList = Backbone.Collection.extend({
    model: MyCollect,
    urlRoot: 'api/collect/',
	url: function () {
		var agentId = localStorage.getItem('agentid');
		return this.urlRoot + pageView.getCookieValue('uid') + "?AgentID=" + agentId;
    }
});

window.MyCollectView = Backbone.View.extend({
    el: '#jqt',
    initialize: function () {
        this.template = $('#MyCollectTemplate').html();
        this.collection = new MyCollectList();
    },
    events: {
        'click .cancelFavorite': 'cancelCollect',
        'click .collectlist .detail': 'renderDetail'
    },
    render: function () {
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html()
        };
        var data = { btnListR: [{ name: 'avatar' }, { name: 'home' }] };

        this.$el.append(Mustache.render(this.template, data, partial));

        this.fetchCollects();

        return this;
    },

    renderDetail: function (e) {
        var target = $(e.currentTarget),
            productid = target.attr('productid'),
            price = target.closest('ul').find('.price').text();
        var name = target.attr('name');
        localStorage.setItem('productname', name);
        localStorage.setItem('productid', productid);
        localStorage.setItem('productDetail', JSON.stringify({ productid: productid, price: price }));
        pageView.goTo('ProductDetail');
    },

    fetchCollects: function () {
        var that = this,
            container = $('.collect');
        that.collection.fetch({
            success: function () {
                var template;
                if (that.collection.length == 0) {
                    template = $('#EmptyCollectTemplate').html();
                    container.html(Mustache.render(template, [], []));
                    $('.footer').hide();
                    return;
                } else {
                    template = $('#CollectListTemplate').html();
                    var data = { collects: that.collection.toJSON() };
                    container.html(Mustache.render(template, data, []));
                }
            }
        });
    },

    cancelCollect: function (e) {
        var that = this;
        if (confirm('确定取消收藏吗？')) {
            var target = $(e.currentTarget),
            productid = target.closest('ul').attr('collectid');

            //            MyCollectView.deleteFromCollect(productid, function () {
            //                that.fetchCollects();
            //            });

            $.ajax({
                url: '/api/collect/DELETE/' + productid + '',
                dataType: 'json',
                async: false,
                success: function (resx) {

                }
            });

            that.fetchCollects();

        }
    }
}, {
    addToMyCollect: function (callback) {
        var collect = new MyCollect({
            productGuid: localStorage.getItem('productid')
        });
        collect.save('', '', {
            success: function () {
                callback.call();
            }
        });
    },

    deleteFromCollect: function (collectid, callback) {
        var collect = new MyCollect({
            id: 1,
            CollectId: collectid
        });

        collect.url = collect.urlRoot + collectid;

        collect.destroy({
            success: function (model, res) {
                if (res && res == 200) {
                    callback.call();
                }
            }
        });
    }
});