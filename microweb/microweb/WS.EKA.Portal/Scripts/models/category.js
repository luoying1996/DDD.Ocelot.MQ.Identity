/*
一级商品类别列表用到
*/

window.FirstCategoryView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#FirstCatagoryTemplate').html();
    },
    events: {

    },
    render: function () {
        var partial = { header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(), innerFooter: $('#InnerFooterTemplate').html() };
        var data = { title: "商品类目", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));

        this.LoadFirstCategory();

        return this;
    },
    LoadFirstCategory: function () {
        FirstCategoryList();
    }
});

//获取一级商品类别列表
function FirstCategoryList() {
	var agentId = localStorage.getItem('agentid');
    $.ajax({

        type: "GET",

        url: "/api/productcatagory/0",

		data: { AgentID: agentId, Sbool: localStorage.getItem('Sbool') },

        dataType: "json",

        success: function (data) {
            var template = $('#FirstCatagoryListTemplate').html();
            $('#div_FirstCatagory').html(Mustache.render(template, data, []));

            FirstCategoryLoadCss();
        }
    });
}

//获取二级商品类别列表
function SecondCategoryList(id, htmlid) {
	var agentId = localStorage.getItem('agentid');
    $.ajax({

        type: "GET",

        url: "/api/productcatagory/" + id,

		data: { AgentID: agentId, Sbool: localStorage.getItem('Sbool') },

        dataType: "json",

        success: function (data) {
            var template = $('#SecondCatagoryListTemplate').html();
            $('#' + htmlid).html(Mustache.render(template, data, []));

            SecondCategoryLoadCss();
        }
    });
}

//获取三级商品类别列表
function ThirdCategoryList(id, htmlid) {
	var agentId = localStorage.getItem('agentid');
    $.ajax({

        type: "GET",

        url: "/api/productcatagory/" + id,

		data: { AgentID: agentId, Sbool: localStorage.getItem('Sbool') },

        dataType: "json",

        success: function (data) {
            var template = $('#ThirdCatagoryListTemplate').html();
            $('#' + htmlid).html(Mustache.render(template, data, []));
        }
    });
}

function FirstCategoryLoadCss() {
    $(".cageDt").each(function () {
        $(this).find("h2").click(function () {
            var categoryid = $(this).attr("categoryid");
            var isLast = $(this).attr("isLast");

            if (isLast == "false") {
                SecondCategoryList(categoryid, "dd_Catagory" + categoryid);
            }
            else {
                window.location = "/#page/ProductList?" + categoryid;
            }

            $(this).toggleClass("sub_select").parent().siblings("dt").children().removeClass("sub_select");
            $(this).parent().next().slideToggle().siblings("dd").slideUp();
        });
    });
}

function SecondCategoryLoadCss() {
    $(".cageDt").each(function () {
        $(this).next().find(".cageDl_text").click(function () {
            var categoryid = $(this).attr("categoryid");
            var isLast = $(this).attr("isLast");

            if (isLast == "false") {
                ThirdCategoryList(categoryid, "div_Catagory" + categoryid);
            }

            $(this).toggleClass("cageDl_text_on").parent(".cageDl_sub").siblings().find(".cageDl_text").removeClass("cageDl_text_on");
            $(this).next().slideToggle().parent(".cageDl_sub").siblings().find(".cageDl_third").slideUp();
        });
    });
}