window.MyCollection = Backbone.Model.extend({
    defaults: {}
});

window.MyCollectionList = Backbone.Collection.extend({
    model: MyCollection,
    urlRoot: 'api/collectlist/',
    url: function () {
        return this.urlRoot + pageView.getCookieValue('uid');
    }
});

//页面初始化
window.MyCollectionView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyCollection').html();
        this.collection = new MyCollectionList();
        this.MemLoginID = pageView.getCookieValue('uid');
    },

    events: {
        'click a.W_EditIcn': 'EditClick',
        'click a.W_DelIcn': 'DellClick',
    },

    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
        };
        var data = { title: "我的收藏", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };
        this.$el.html(Mustache.render(this.template, data, partial));
        //判断是否登录        
        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }
        localStorage.setItem('pageIndex', 1);
        localStorage.setItem('pageCount', 5);

        that.Collection();
        $('.maskgrey1').hide(50);
        return this;
    },
    //获取收藏商品列表
    Collection: function () {
		var that = this;
		var agentId = localStorage.getItem('agentid');
        this.collection.fetch({
            data: {
                pageIndex: localStorage.getItem('pageIndex'),
				pageCount: localStorage.getItem('pageCount'),
				AgentID: agentId
            },
            success: function () {
                var products = that.collection.models[0].get('Data');
                allCount = that.collection.models[0].get('Count');
                $("#colectcount").html(allCount);

                var template;
                if (that.collection.length == 0 || products.length == 0 || allCount == 0) {
                    var template = $('#EmptyInnerListTemplate').html();
                    $('#ul_CollectionList').html(Mustache.render(template, [], []));
                    $(".nav-page").html("");
                } else {
                    var template = $('#MyCollectionModelli').html();
                    var data = { collection: products };
                    $("#ul_CollectionList").html(Mustache.render(template, data, []));

                    new Plugins.PagingPlugin('.nav-page', {
                        allCount: allCount,
                        prevCall: function (e) { that.fetchPrev(e); },
                        nextCall: function (e) { that.fetchNext(e) },
                        numberClickCall: function (e) { that.fetchSpecific(e) }
                    });
                }
            }
        });
    },
    //编辑
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
    //删除
    DellClick: function (e) {
		var that = $(e.currentTarget);
		var agentId = localStorage.getItem('agentid');
        $.ajax({
            type: 'Post',
            url: 'api/collectdelete/',
            data: {
                collectId: that.attr("collectid"),
				memLoginID: this.MemLoginID,
				AgentID: agentId
            },
            async: false,
            dataType: "json",
            success: function (res) {
                if (res && res.return == "202") {

                    that.parent().hide();
                }
            }
        })
    },



    fetchPrev: function (e) {//上一页
        if ($(e.currentTarget).hasClass('disable')) return;
        var pageIndex = localStorage.getItem('pageIndex');
        localStorage.setItem('pageIndex', +pageIndex - 1);
        this.ChangeText();
        this.Collection();
    },
    fetchNext: function (e) {//下一页
        if ($(e.currentTarget).hasClass('disable')) return;
        var pageIndex = localStorage.getItem('pageIndex');
        localStorage.setItem('pageIndex', +pageIndex + 1);
        this.ChangeText();
        this.Collection();
    },
    fetchSpecific: function (e) {
        var target = $(e.currentTarget);
        if (target.hasClass('gray')) return;
        var index = +target.attr('index');
        localStorage.setItem('pageIndex', index);
        this.ChangeText();
        this.Collection();
    },
    //切换页时，改变编辑的文字
    ChangeText: function () {
        if ($("a.W_EditIcn").html().trim() == "完成") {
            $("a.W_EditIcn").html("编辑");
        }
    },
});