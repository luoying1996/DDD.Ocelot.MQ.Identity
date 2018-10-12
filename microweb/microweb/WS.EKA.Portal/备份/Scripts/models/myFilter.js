window.FilterModel = Backbone.Model.extend({

});

window.BrandModel = Backbone.Model.extend({});

window.BrandList = Backbone.Collection.extend({
    model: BrandModel,
    urlRoot: 'api/product/brandlist/',
    url: function () {
        return this.urlRoot + localStorage.getItem('nextid_1');//fetch brand according to category1
    }
});

window.MyFilterView = Backbone.View.extend({
    el: '#jqt',
    initialize: function () {
        this.template = $('#MyFilterTemplate').html();
        this.brandlist = new BrandList();
    },

    render: function () {
        var partial = { header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html()
        };
        var data = { hasBack: true, title: "返回", btnListR: [{ name: 'sort' }, { name: 'cart' }, { name: 'home'}] };

        this.$el.append(Mustache.render(this.template, data, partial));

        this.fetchBrands();

        return this;
    },

    fetchBrands: function () {
        var that = this;
        this.brandlist.fetch({
            success: function () {
                if (that.brandlist.length > 0) {
                    var template = $('#BrandFilterTemplate').html(),
                        data = { brands: that.brandlist.toJSON() };
                    $('.brandFilter').html(Mustache.render(template, data, []));
                } else {
                    $('.brandFilter').hide(); $('.priceFilter').hide();
                }
            }
        });
    }
});