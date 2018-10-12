window.PaymentStyle = Backbone.Model.extend({});

window.PaymentList = Backbone.Collection.extend({
    model: PaymentStyle,
    urlRoot: 'api/payment/',
    url: function () {
        return this.urlRoot;
    }
});

window.PaymentView = Backbone.View.extend({
    el: '#jqt',
    initialize: function () {
        this.template = $('#PaymentListTemplate').html();
        this.paymentList = new PaymentList();
    },
    events: {
        'click .paymentList ul li': 'setPaymentStyle'
    },

    render: function () {
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html()
        };
        var data = { hasBack: true, title: "返回", btnListR: [{ name: 'home' }] };
        this.$el.append(Mustache.render(this.template, data, partial));

        if ($('#hidePaymentList').length > 0) {
            $('#PaymentList .paymentList').html($('#hidePaymentList').show());
        } else {
            this.fetchPaymentList();
        }

        return this;
    },

    fetchPaymentList: function () {
        var that = this;
        this.paymentList.fetch({
            data: { AgentID: pageView.getCookieValue('AgentID') },
            success: function () {
                var template = $('#PaymentListContentTemplate').html(),
                    data = { payments: that.paymentList.toJSON() };
                $('#PaymentList .paymentList').html(Mustache.render(template, data, []));
                $('#hidePaymentList').show();

            }
        });
    },

    setPaymentStyle: function (e) {
        var target = $(e.currentTarget),
            paymentid = target.attr('paymentid'),
            paymentstyle = target.text().trim();
        localStorage.setItem('paymentid', paymentid);
        pageView.goBack();
    }
}, {
    renderPaymentHidden: function (payments) {
        var template = $('#PaymentListContentTemplate').html();
        $('#OrderMake').append(Mustache.render(template, { payments: payments }, []));
    }
});