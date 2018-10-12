window.PanicBuyingView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#PanicBuying').html();
    },

    events: {
        //跳转抢购商品详细
        'click a.GoPanicProductDetail': 'GoPanicProductDetail',
    },

    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),

        };
        var data = { title: "限时抢购", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));

        localStorage.setItem('pageIndex', 1);
        localStorage.setItem('pageSize', 5);
        //绑定抢购列表数据
        BindPanicBuying();
        //替换时间格式
        this.ChangeTimeHtml();
        //时间刷新
        this.tick();
        //绑定分页按钮
        this.BindFenYeClick();

        return this;
    },
   
    tick: function () {
        setInterval(function () {
            $(".time").each(function (i, item) {
                var s = new Date($(item).attr("Endtime")).getTime();
                $(item).html(getTimeHtml(s));
            });
        }, 1000);

    },
    ChangeTimeHtml: function () {
        $(".time").each(function (i, item) {
            var Time = new Date($(item).attr("EndTime")).getTime();
            $(item).html(getTimeHtml(Time));
        })

    },
    BindFenYeClick: function () {
        $("#first").bind("click", function () {
            var pageIndex = parseInt(localStorage.getItem('pageIndex'));
            if (pageIndex != 1) {
                localStorage.setItem('pageIndex', 1);
                BindPanicBuying();
            }
        });
        $("#top").bind("click", function () {
            var pageIndex = parseInt(localStorage.getItem('pageIndex')) - 1;
            if (parseInt(pageIndex) >0) {
                localStorage.setItem('pageIndex', pageIndex);
                BindPanicBuying();  
            }
        });
        $("#down").bind("click", function () {
            var pageIndex = parseInt(localStorage.getItem('pageIndex')) + 1;
            var pageSize = localStorage.getItem('pageSize');
            var pageCount = $("#pageCount").val();
            //算出最后一页
            var lastIndex = 1;
            if (pageCount % pageSize > 0) {
                lastIndex = parseInt(pageCount / pageSize) + 1;
            }
            else {
                lastIndex = pageCount / pageSize;
            }

            if (pageIndex <= lastIndex) {
                localStorage.setItem('pageIndex', pageIndex);
                BindPanicBuying();
            }                    
        });
        $("#last").bind("click", function () {
            var pageCount = $("#pageCount").val();
            var pageSize = localStorage.getItem('pageSize');
            var pageIndex = localStorage.getItem('pageIndex');
            var lastIndex = 1;
            //算出最后一页
            if (pageCount % pageSize > 0) {
                lastIndex = parseInt(pageCount / pageSize) + 1;
            }
            else {
                lastIndex = pageCount / pageSize;
            }
            if (lastIndex != pageIndex) {
                localStorage.setItem('pageIndex', lastIndex);
                BindPanicBuying();
            }
        });
    },
    GoPanicProductDetail: function (e) {      
        var that = $(e.currentTarget);
        var ProductGuid = that.attr("ProductGuid");
        var PanicBuyingPrice = that.attr("PanicBuyingPrice");
        var EndTime = that.attr("EndTime");
        var RestrictCount = that.attr("RestrictCount");

        localStorage.setItem('RestrictCount', RestrictCount);
        localStorage.setItem('PanicBuyingPrice', PanicBuyingPrice);
        localStorage.setItem('PanicEndTime', EndTime);
        //进入抢购商品详细的页面被我改的有点变态,赶时间没得法
        window.location = "/#page/PanicProductDetail?"+ProductGuid;
    }

});

function BindPanicBuying() {
    $.ajax({
        url: "api/panicbuyinglist/",
        data: {
            pageIndex: localStorage.getItem('pageIndex'),
            pageSize: localStorage.getItem('pageSize'),
        },
        async: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                var template = $('#PanicBuyingLi').html();
                $("#ul_PanicBuyingList").html(Mustache.render(template, data, []));
                $("#pageCount").val(data.Count);
            }
        }
    })

}

function getTimeHtml(time) {
    var days = 24 * 60 * 60,
        hours = 60 * 60,
        minutes = 60;
    var nowDate = (new Date()).getTime();
    var left, d, h, m, s;
    var str = '';
    left = Math.floor((time - nowDate) / 1000);
    // Number of days left
    d = Math.floor(left / days);
    left -= d * days;
    // Number of hours left
    h = Math.floor(left / hours);
    left -= h * hours;
    // Number of minutes left
    m = Math.floor(left / minutes);
    left -= m * minutes;
    // Number of seconds left
    s = left;
    str +='仅剩'+ d + '天' + h + '小时' + m + '分' + checkNum(s) + '秒';
    return str;
}

function checkNum(num) {
    if (num < 10) {
        return "0" + num;
    } else
        return num;
}


