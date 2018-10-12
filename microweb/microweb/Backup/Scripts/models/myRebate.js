
var MyRebateList = {
    FirstRebateList: [],
    SecondRebateList: [],
    ThirdRebateList: []
};
window.MyRebateView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyRebateInfo').html();
        this.MemLoginID = pageView.getCookieValue('uid');
    },

    events: {
    },

    render: function () {
        var partial = {
            header: $('#HeaderTemplate').html(),
            footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html()
        };
        var data = { weixinhao: localStorage.getItem('weixinhao'), title: "我的团队", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));
        this.LoadMyRebate();
        this.LoadTabChange();
        return this;
    },
    LoadMyRebate: function () {
        GetMyRebate(this.MemLoginID);
    },
    LoadTabChange: function () {
        $("#tabChange li").click(function () {
            $("#tabChange li").removeClass("cur");
            $(this).addClass("cur");
            var index = $(this).attr("dataindex");
            template = $('#MyRebateList').html();
            var data = {};
            switch (index) {
                case "1":
                    data = {
                        Distributor: MyRebateList.FirstRebateList
                    };
                    break;
                case "2":
                    data = {
                        Distributor: MyRebateList.SecondRebateList
                    };
                    break;
                case "3":
                    data = {
                        Distributor: MyRebateList.ThirdRebateList
                    };
                    break;
                default:
                    break;
            }
            $('#RebateListHtml').html(Mustache.render(template, data, []));
        });
    }
});


//获取分销商今日和所有收益
function GetMyRebate(MemLoginID) {
    $.ajax({
        type: "GET",
        url: "api/getdistributor/",
        data: { "MemLoginID": MemLoginID },
        dataType: "json",
        success: function (data) {
            var firstCount = 0;
            var sentCount = 0;
            var thirdCount = 0;
            var firstArrary = [];
            if (data != null && data != undefined && data.Data.Profit != null) {
                $("#TodayRebate").html(data.Data.Profit[0]);
                $("#AllRebate").html(data.Data.Profit[1]);
                $.each(data.Data.Distributor, function (index, object) {
                    if (object.lvl == "1") {
                        firstCount = firstCount + 1;
                        MyRebateList.FirstRebateList.push(object);
                    }
                    else if (object.lvl == "2") {
                        sentCount = sentCount + 1;
                        MyRebateList.SecondRebateList.push(object);
                    }
                    else if (object.lvl == "3") {
                        thirdCount = thirdCount + 1;
                        MyRebateList.ThirdRebateList.push(object);
                    }
                });

                $("#firstCount").html(firstCount);
                $("#secondCount").html(sentCount);
                $("#thirdCount").html(thirdCount);


                template = $('#MyRebateList').html();
                var data = {
                    Distributor: MyRebateList.FirstRebateList
                };
                $('#RebateListHtml').html(Mustache.render(template, data, []));
            }
        }
    });
}
