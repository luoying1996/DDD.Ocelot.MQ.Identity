//页面初始化
window.MySetUpView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MySetUpTemplate').html();
        this.MemLoginID = pageView.getCookieValue('uid');
    },

    events: {
    },
    render: function () {
        var that = this;
        //加载模板
        var partial = { header: $('#HeaderTemplate').html()};
        //加载数据
        var data = { title: "设置", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };
        //合并并加载页面
        this.$el.html(Mustache.render(this.template, data, partial));
        //判断是否登录        
        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }
        return this;
    },
});