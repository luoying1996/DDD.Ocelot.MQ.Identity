//积分对象
window.ScoreDetail = Backbone.Model.extend({
    default: {
    },
});
//积分对象集合
window.MyScoreDetailList = Backbone.Collection.extend({
    model: ScoreDetail,
    urlRoot: "api/getscoremodifylog/",
    url: function () {
        return this.urlRoot + pageView.getCookieValue('uid');
    }
});

//页面初始化
window.MyScoreDetailView = Backbone.View.extend({
    //页面对象
    el: "#jqt",
    //初始化对象
    initialize: function () {
        this.template = $('#ScoreDetailTemplate').html();
        this.collection = new MyScoreDetailList();
        this.MemLoginID = pageView.getCookieValue('uid');
    },
    //绑定事件
    events: {
    },
    //页面加载
    render: function () {
        var that = this;
        //加载模板文件
        var partial = { header: $('#HeaderTemplate').html() };
        //加载数据
        var data = { title: "积分明细", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };
        //合并并加载页面
        this.$el.html(Mustache.render(this.template, data, partial));
        //判断是否登录        
        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }

        localStorage.setItem('pageIndex', 1);
        localStorage.setItem('pageCount', 5);


        //加载积分明细列表
        this.fetchScoreDetailList();
        $('.maskgrey1').hide(50);
        return this;
    },
    fetchScoreDetailList: function () {
        var that = this;
        this.collection.fetch({
            data: {
                pageIndex: localStorage.getItem('pageIndex'),
                pageCount: localStorage.getItem('pageCount')
            },
            success: function () {
                var myScoreDetails = that.collection.models[0].get('Data'),
                    allCount = that.collection.models[0].get('Count');
                var template;
                //加载空模板
                if (that.collection.length == 0 || MyScoreDetailModel.length == 0 || allCount == 0) {
                    template = $('#EmptyScorceDetialTemplate').html();
                    $("#MyScoreDetailList").html(Mustache.render(template, [], []));
                    $(".nav-page").html("");

                } else { //加载数据模板
                    $.each(myScoreDetails, function (index, d) {
                        if (d.OperateType == 0) {
                            d.OperateScore = '-' + d.OperateScore;
                        } else {
                            d.OperateScore = '+' + d.OperateScore;
                        }
                    });

                    template = $("#MyScoreDetailModel").html();
                    var data = { MyScoreDetailModel: myScoreDetails };
                    $("#MyScoreDetailList").html(Mustache.render(template, data, []));

                    //修改数据显示的效果
                    $("#MyScoreDetailList .dd").each(function () {
                        if (parseInt($(this).html()) > 0) {
                            $(this).addClass('fd-green');
                        } else {
                            $(this).addClass('fd-fbange');
                        }
                    });


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


    fetchPrev: function (e) {//上一页
        if ($(e.currentTarget).hasClass('disable')) return;
        var pageIndex = localStorage.getItem('pageIndex');
        localStorage.setItem('pageIndex', +pageIndex - 1);
        this.fetchScoreDetailList();
    },
    fetchNext: function (e) {//下一页
        if ($(e.currentTarget).hasClass('disable')) return;
        var pageIndex = localStorage.getItem('pageIndex');
        localStorage.setItem('pageIndex', +pageIndex + 1);
        this.fetchScoreDetailList();
    },
    fetchSpecific: function (e) {
        var target = $(e.currentTarget);
        if (target.hasClass('gray')) return;
        var index = +target.attr('index');
        localStorage.setItem('pageIndex', index);
        this.fetchScoreDetailList();
    },
});