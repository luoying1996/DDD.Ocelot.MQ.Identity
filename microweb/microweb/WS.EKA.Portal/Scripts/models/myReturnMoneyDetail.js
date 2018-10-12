window.MyReturnMoneyDetailView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyReturnMoneyDetail').html();
       
    },

    events: {
        'click .ReasonLi li': 'ChoseReason',
        'click #NoReturn': 'NoReturn',
        'click #ApplyReturnMoneyDetail': 'ApplyReturnMoneyDetail',
    },

    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            
        };
        var data = { title: "退款", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));
        
        if (pageView.getCookieValue('uid') == undefined || pageView.getCookieValue('uid') == null) {
            window.location = "/#page/Login";
            return;
        }


        this.BindReturnMoneyDetail();
        return this;
    },
    BindReturnMoneyDetail: function () {
        $.ajax({
            url: "api/order/" + localStorage.getItem("OrderNumberReturnMoney"),
            data: {
            },
            async: false,
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    var template = $('#MyReturnMoneyDetailLi').html();
                    $("#ul_MyReturnMoneyList").html(Mustache.render(template, data, []));
                    $("#ReturnMoney").html("￥" + data.Orderinfo.AlreadPayPrice);
                }

            }
        })
    },
    ChoseReason: function (e) {
        var that = $(e.currentTarget);
        $(that).addClass("cur").siblings().removeClass("cur")
    },
    NoReturn: function (e) {
        pageView.goTo("OrderDetail");
    },
    ApplyReturnMoneyDetail: function () {
        var OrderNumber = $("#hidOrderNumber").val();
        var AlreadPayPrice = $("#hidReturnMoney").val();
        var Reason;
        var li = $(".ReasonLi li");
        for (var i = 0; i < li.length ; i++)
        {
            var className = li.eq(i).attr("class");
            if (className == "cur")
            {
                Reason = li.eq(i).find("a").find("b").html();
            }
        }

        if (Reason == "" || Reason == null)
        {
            alert("请选择退款原因!");
            return;
        }


		if (confirm('你确定要取消退款吗？')) {
			var agentId = localStorage.getItem('agentid');
            $.ajax({
                url: 'api/memberepairs/',
                data:{
                    OrderID: OrderNumber,
                    MemLoginID: pageView.getCookieValue('uid'),
                    ReturnMoney: AlreadPayPrice,
					ApplyReason: Reason,
					AgentID: agentId
                },
                dataType: 'json',
                async: false,
                error: function (err) { ErrorPage(); },
                success: function (data) {
                    if (data != null && data.return == "202") {
                        alert("退款申请提交成功,请耐心等待卖家审核！");
                        localStorage.setItem('orderCode', OrderNumber);
                        pageView.goTo('OrderDetail');
                    }
                    else { alert("取消失败"); }
                }
            });
        }
    }
    
});
