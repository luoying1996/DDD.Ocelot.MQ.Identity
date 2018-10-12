//性别信息
window.Sex = Backbone.Model.extend({
    defaults: {
        MemLoginID: "",
        Sex: ""
    }
});

window.Sex = Sex.extend({
    urlRoot: 'api/account/',
    url: function () {
        return this.urlRoot + pageView.getCookieValue('uid');
    }
});

//页面初始化
window.MySexView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MySex').html();
        this.model = new Sex();
        this.MemLoginID = pageView.getCookieValue('uid');
    },

    events: {
        'click a#Other': 'OtherClick',
        'click a#Man': 'ManClick',
        'click a#Woman': 'WomanClick',
        'click a#UpdateSex': 'UpdateSexClick',
    },

    render: function () {
        var that = this;
        //加载模板
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
        };
        //加载数据
        var data = { title: "修改性别", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };
        //合并并加载页面
        this.$el.html(Mustache.render(this.template, data, partial));
        //判断是否登录        
        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }
        //默认选择性别
        this.fetchSex();
        return this;
    },

    fetchSex: function () {
        var that = this;
        this.model.fetch({
            success: function () {
                switch (that.model.get("Sex")) {
                    case 0:
                        $("#Other").parent().toggleClass("cur");
                        break;
                    case 1:
                        $("#Man").parent().toggleClass("cur");
                        break;
                    case 2:
                        $("#Woman").parent().toggleClass("cur");
                        break;
                }
            }
        });
        $('.maskgrey1').hide(50);
    },


    OtherClick: function (e) {
        var that = $(e.currentTarget);
        Sex.Sex = 0;
        $("#Other").parent().toggleClass("cur").siblings().removeClass("cur");
    },
    ManClick: function (e) {
        var that = $(e.currentTarget);
        Sex.Sex = 1;
        $("#Man").parent().toggleClass("cur").siblings().removeClass("cur");
    },
    WomanClick: function (e) {
        var that = $(e.currentTarget);
        Sex.Sex = 2;
        $("#Woman").parent().toggleClass("cur").siblings().removeClass("cur");
    },

    UpdateSexClick: function (e) {
        var that = $(e.currentTarget);

        if (!$(".PerSex").children().hasClass("cur")) {
            alert("没有选择性别");
            return;
        }
        $.ajax({
            type: 'post',
            url: "api/account/updatesex/",
            data: {
                Sex: Sex.Sex,
                MemLoginID: this.MemLoginID,
            },
            anysc: false,
            dataType: "json",
            success: function (res) {
                if (res && res == 200) {
                    alert("修改成功");
                    pageView.goTo('MyUserInfo');
                } else {
                    $('#loginError').html('修改失败');
                }
            }
        })
    },
});
