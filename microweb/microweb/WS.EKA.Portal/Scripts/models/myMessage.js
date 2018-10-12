//消息对象
window.MyMessage = Backbone.Model.extend({
    defaults: {}
});
//消息对象集合
window.MyMessageList = Backbone.Collection.extend({
    model: MyMessage,
    urlRoot: 'api/membermessagelist/',
    url: function () {
        return this.urlRoot + pageView.getCookieValue('uid');
    }

});

//页面初始化
window.MyMessageView = Backbone.View.extend({
    //页面对象
    el: "#jqt",
    //初始化对象
    initialize: function () {
        this.template = $('#MyMessage').html();
        this.collection = new MyMessageList();
        this.MemLoginID = pageView.getCookieValue('uid');

    },
    //绑定事件
    events: {
        //绑定编辑按钮事件
        'click a.W_EditIcn': 'EditClick',
        //绑定删除按钮事件
        'click a.W_DelIcn': 'DellClick',
    },
    //页面加载
    render: function () {
        var that = this;
        //加载模板文件
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
        };
        //加载数据
        var data = { title: "我的消息", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };
        //合并并加载页面
        this.$el.html(Mustache.render(this.template, data, partial));
        //判断是否登录        
        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }
        //绑定消息数据列表
        this.fetchMessage();

        return this;
    },
    fetchMessage: function () {
        var that = this;
        this.collection.fetch({
            data: {
                pageIndex: localStorage.getItem('pageIndex'),
                pageCount: 5
            },
            success: function () {
                var messages = that.collection.models[0].get('Data');
                var allCount = that.collection.models[0].get('Count');
                var template = $('#MyMessageModelLi').html();
                if (messages.length > 0) {
                    $.each(messages, function (index, d) {

                    });
                    $(" #MessageCount").html(messages.length);
                    var data = { messages: messages }
                    $("#ul_MyMessageModelList").html(Mustache.render(template, data, []));
                }

            }
        });
    },
    EditClick: function (e) {
        var that = $(e.currentTarget);
        $(".W_DelIcn").toggle();
        $(".E_mymess li").toggleClass("on");
        if (that.html().trim() == "编辑") {
            that.html("完成");
        } else if (that.html().trim() == "完成") {
            that.html("编辑");
        }

    },
    DellClick: function (e) {
        var that = $(e.currentTarget);
        $.ajax({
            url: "api/membermessagedelete/",
            data: {
                msgId: that.attr("messageguid"),
                memLoginID: this.MemLoginID,

            },
            async: false,
            dataType: "json",
            success: function (data) {
                if (data.return == "202") {
                    that.parent().hide();
                }
            }

        })
    },
});
