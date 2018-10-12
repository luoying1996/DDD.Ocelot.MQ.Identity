window.ProductEvaluateView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#ProductEvaluate').html();
        this.MemLoginID = pageView.getCookieValue('uid');
    },

    events: {
        'click .graded dd span': 'StarClick',
        'dblclick .graded dd span': 'StardblClick',
        'click #btnSubmitEvaluate': 'SubmitEvaluate',
        
    },

    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            
        };
        var data = { title: "商品评价", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }
        

        this.$el.html(Mustache.render(this.template, data, partial));
  
        this.fetch();
        return this;
    },
    StarClick: function (e) {
        var that = $(e.currentTarget);
        $(that).addClass("cur");
        $(that).prevAll().addClass("cur");
        $(that).nextAll().removeClass("cur");
    },
    StardblClick: function (e) {
        var that = $(e.currentTarget);           
        $(that).removeClass("cur").siblings().removeClass("cur");
    },
  
    fetch: function () {
        var OrderNumber= localStorage.getItem('OrderNumber');
        var ProductGuid = localStorage.getItem('ProductGuid');
        var BuyNumber = localStorage.getItem('BuyNumber');
        var BuyPrice = localStorage.getItem('BuyPrice');
        var Name = localStorage.getItem('Name');
        var Attributes = localStorage.getItem('Attributes');
        var OriginalImge = localStorage.getItem('OriginalImge');


        var list = $(".List");
        list.find("#productimg").attr("src", OriginalImge);
        list.find("h2").html(Name);
        list.find(".pri").html(BuyPrice);
        list.find(".num").html("x" + BuyNumber);
        list.find(".spec").html(Attributes);
        
    },
    SubmitEvaluate: function () {
        var star, content;
        
        star = $(".graded").find(".cur").length;
        content = $("#EvaluateContent").val();
        if (content == "")
        {
            alert("评论内容不能为空!");
            return;
        }
        if (content.length > 200)
        {
            alert("内容不能超过200字符");
            return;
        }

        var model = "";

        model = '{"MemLoginID":"' + pageView.getCookieValue('uid') + '","ProductGuid":"' + localStorage.getItem('ProductGuid') + '","Rank":"' + star + '","Content":"' + content + '","OrderNumber":"' + localStorage.getItem('OrderNumber') + '"}';

        $.ajax({
            type: "POST",
            url: "api/addProductComment/",
            data: {
                model:model
            },
            async: false,
            dataType: "json",
            success: function (data) {
                if (data.return == "202") {
                    alert("评论成功");
                    pageView.goTo('MyOrder');
                }
                else {
                    alert("评论失败");
                    pageView.goTo('MyOrder');
                }
            }

        })
    },
});
