window.MyReturnGoodsDetailAddressView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyReturnGoodsDetailAddress').html();
        this.MemLoginID = pageView.getCookieValue('uid');
    },
    events: {
        'click #ReturnGoodsAddress': 'ReturnClick',
    },
    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),

        };
        var data = { title: "退货", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));

        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }

        return this;
    },
    ReturnClick: function () {
        var OrderGuid = localStorage.getItem('OrderGuidReturnGoods');
        var ReturnInfo;
        $.ajax({
            url: "api/getreturnorderlist/",
            data: {
                MemLoginID: pageView.getCookieValue('uid'),
                OrderGuid: OrderGuid
            },
            async: false,
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    ReturnInfo = data.data;
                }

            }
        })
        if (ReturnInfo != null && ReturnInfo != "")
        {
            ReturnInfo.MainDistribution = $("#MainDistribution").val();
            ReturnInfo.StreamOrder = $("#StreamOrder").val();            
        }
        $.ajax({
            type: "POST",
            url: "api/updatereturngoodsinfo/",
            data: {
                model: JSON.stringify(ReturnInfo)
            },
            async: false,
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    if (data.return == "202") {
                        alert("提交成功!");                        
                        localStorage.setItem('orderCode', localStorage.getItem("OrderNumberReturnGoods"));
                        pageView.goTo('OrderDetail');
                    }
                    else {
                        alert("提交失败!");
                    }
                }

            }
        })

    },
});
