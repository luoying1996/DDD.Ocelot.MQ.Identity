window.MyOrderEvaluationDetailView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyOrderEvaluationDetail').html();
        this.MemLoginID = pageView.getCookieValue('uid');
    },

    events: {
        //'click a.W_DelIcn': 'DellClick',
    },

    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            
        };
        var data = { title: "订单评价(做多了暂时不要)", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));
  
        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }

        return this;
    },
    //DellClick: function (e) {
    //    var target = $(e.currentTarget);
    //},
});
