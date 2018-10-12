window.DispatchMode = Backbone.Model.extend({});

window.DispatchModeList = Backbone.Collection.extend({
    model: DispatchMode,
    urlRoot: 'api/DispatchModeList',
    url: function () {
        return this.urlRoot;
    }
});


window.DispatchView = Backbone.View.extend({
    el: '#jqt',
    initialize: function () {
        this.template = $('#DispatchModeListTemplate').html();
        this.dispatchList = new DispatchModeList();
    },

    events: {
        'click .dispatchmodeList ul li': 'setDispatchMode'
    },

    render: function () {
        var partial = { header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html()
        };
        var data = { hasBack: true, title: "返回", btnListR: [{ name: 'home'}] };
        this.$el.append(Mustache.render(this.template, data, partial));

        if ($('#hideDispatchModeList').length > 0) {
            $('#DispatchModeList .dispatchmodeList').html($('#hideDispatchModeList').show());
        } else {
            this.fetchDispatchModeList();
        }
        return this;
    },
    fetchDispatchModeList: function () {
        var that = this;
        this.dispatchList.fetch({
            success: function () {
                var template = $('#DispatchModeListContentTemplate').html(),
                    data = { dispatchmodes: that.dispatchList.toJSON() };
                $('#DispatchModeList .dispatchmodeList').html(Mustache.render(template, data, []));
                $('#hideDispatchModeList').show();
            }
        });
    },

    setDispatchMode: function (e) {
        var target = $(e.currentTarget),
            dispatchmodeid = target.attr('dispatchmodeid');
        localStorage.setItem('dispatchmodeid', dispatchmodeid);
        pageView.goBack();
    }
}, {
    renderDispatchHidden: function (dispatchmodes) {
        var template = $('#DispatchModeListContentTemplate').html();
        $('#OrderMake').append(Mustache.render(template, { dispatchmodes: dispatchmodes }, []));
    }
});