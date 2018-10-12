
window.BrandListView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#BrandListTemplate').html();
    },

    events: {
        'click #brandclick': 'ClickBrand'
    },

    render: function () {
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(), innerFooter: $('#InnerFooterTemplate').html()
        };
        var data = { title: "商品品牌", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));
        this.LoadBrand();

        $(".E-Tab li").click(function () {
            $(this).addClass("cur").siblings().removeClass("cur");
            $(this).parent().next().children().hide();
            $(this).parent().next().children().eq($(this).index()).show();
        });

        return this;
    },
    LoadBrand: function () {
        GetBrand();
    },
    ClickBrand: function (e) {
        var name = e.currentTarget.lastChild.innerHTML
        var guid = e.currentTarget.href.split('?')[1];
        localStorage.setItem(guid, name);
    }
});


function GetBrand() {

	var agentId = $('#hagentId').val();

    $.ajax({
        type: "GET",
        url: "api/GetBrandList/",
		data: {
			agentId: agentId
		},
        dataType: "json",
        success: function (data) {
            template = $('#BrandListInfoTemplate').html();
            if (data.CommondBrand == "404") {
                data.CommondBrand = null;
                var data = { AllBrand: data.AllBrand };
            }
            if (data.AllBrand == "404") {
                data.AllBrand = null;
                var data = { CommondBrand: data.CommondBrand };
            }
            $('#BrandList').html(Mustache.render(template, data, []));
        }
    });
}