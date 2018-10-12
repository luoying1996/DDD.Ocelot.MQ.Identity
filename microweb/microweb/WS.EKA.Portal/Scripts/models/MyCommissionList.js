window.MyCommissionListView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyCommissionListTemplate').html();
        this.Code = '';
    },
    events: {

    },
    render: function () {
        var partial = {
            header: $('#HeaderTemplate').html(),
        };
        var data = { title: "佣金明细" };
        this.$el.html(Mustache.render(this.template, data, partial));

        $(".maskgrey1").hide();
        return this;
    },




});
