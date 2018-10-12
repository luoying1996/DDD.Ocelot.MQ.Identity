/*
推荐列表用到
*/

window.RankListView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#RankListTemplate').html();
    },
    events: {

    },
    render: function () {
        var partial = { header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(), innerFooter: $('#InnerFooterTemplate').html() };
        var data = { title: "", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));

        var RankType = "";
        if (localStorage.getItem('RankType') != null && localStorage.getItem('RankType') != undefined && localStorage.getItem('RankType') != "") {
            RankType = localStorage.getItem('RankType');
        }
        else {
            RankType = "1";
        }

        LoadRankList(RankType);

        RankListLoadCss();

        return this;
    }
});

//获取推荐商品列表
function LoadRankList(RankType) {

    var type = RankType;
    var sorts = "ModifyTime";
    var isASC = "true";
    var pageIndex = 1;
    var pageCount = 9999;
	var agentId = $('#hagentId').val();
    $.ajax({

        type: "GET",

		url: "/api/product/type/?type=" + type + "&sorts=" + sorts + "&isASC=" + isASC + "&pageIndex=" + pageIndex + "&pageCount=" + pageCount + "&agentID=" + agentId + "&sbool=" + localStorage.getItem('Sbool'),

        data: {},

        dataType: "json",

        success: function (data) {
            var template = $('#RankListDetailTemplate').html();
            $('#ul_productList').html(Mustache.render(template, data, []));

            $("#li_flex_div" + type).addClass("on");
        }
    });
}

function RankListLoadCss() {
    $(".promotRank li").click(function () {
        var type = $(this).attr("type");

        LoadRankList(type);

        $(this).addClass("on").siblings().removeClass("on").removeClass("select");
        $(this).find("a").click(function () {
            $(this).children().toggleClass("active");
        });
    });
}