window.MyOrdersWithRebateView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyOrdersWithRebateTemplate').html();
        this.Code = '';
    },
    events: {

    },
    render: function () {
        var partial = {
            header: $('#HeaderTemplate').html(),
        };
        var data = { title: "订单返利信息" };
        this.$el.html(Mustache.render(this.template, data, partial));

        $(".maskgrey1").hide();
        return this;
    },




});
