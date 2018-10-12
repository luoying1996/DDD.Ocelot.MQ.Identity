
window.MyReturnOrderView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyReturnOrder').html();
        this.MemLoginID = pageView.getCookieValue('uid');
    },

    events: {
        'click #ul_ReturnOrderList li .ordpro': 'goToReturnDetail',
        'click #submitReturnOrder': 'submitReturnOrder',
    },

    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            
        };
        var data = { title: "退款", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));

        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }

        localStorage.setItem('pageIndex', 1);
        localStorage.setItem('pageCount', 5);
        //数据绑定
        BindData(this.MemLoginID);
        //绑定分页按钮
        this.BindFenYeClick();
        return this;
    },    
    goToReturnDetail: function (e) {
        var that = $(e.currentTarget);
        
        var OrderNumber = that.parents("li").attr("OrderNumber");
        localStorage.setItem('orderCode', OrderNumber);

        window.location = "/#page/OrderDetail";
        
    },
    BindFenYeClick: function () {
        $("#first").bind("click", function () {
            var pageIndex = parseInt(localStorage.getItem('pageIndex'));
            if (pageIndex != 1) {
                localStorage.setItem('pageIndex', 1);
                BindData(pageView.getCookieValue('uid'));
            }
        });
        $("#top").bind("click", function () {
            var pageIndex = parseInt(localStorage.getItem('pageIndex')) - 1;
            if (parseInt(pageIndex) > 0) {
                localStorage.setItem('pageIndex', pageIndex);
                BindData(pageView.getCookieValue('uid'));
            }
        });
        $("#down").bind("click", function () {
            var pageIndex = parseInt(localStorage.getItem('pageIndex')) + 1;
            var pageSize = localStorage.getItem('pageCount');
            var pageCount = $("#pageAllCount").val();
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
                BindData(pageView.getCookieValue('uid'));
            }
        });
        $("#last").bind("click", function () {
            var pageCount = $("#pageAllCount").val();
            var pageSize = localStorage.getItem('pageCount');
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
                BindData(pageView.getCookieValue('uid'));
            }
        });
    },
    submitReturnOrder: function (e) {
        var that = $(e.currentTarget);
        var guid = that.parents("li").attr("guid");
        var OrderNumber = that.parents("li").attr("OrderNumber");
        localStorage.setItem('OrderGuidReturnGoods', guid);
        localStorage.setItem('OrderNumberReturnGoods', OrderNumber);
        pageView.goTo('MyReturnGoodsDetailAddress');
    },

});

 function BindData(MemLoginID) {
    $.ajax({
        url: "api/order/member/"+MemLoginID,
        data: {
            pageIndex: localStorage.getItem('pageIndex'),
            pageCount: localStorage.getItem('pageCount'),
            t: "7",
            OderStatus: "0",
            ShipmentStatus: "0",
            PaymentStatus: "0",
            refundStatus: "0",
            memLoginID: MemLoginID,
            agentID: pageView.getCookieValue('AgentID')
        },
        async: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                $.each(data.Data, function (index, d) {
                    if (d.ReturnOrderStatus != "") {
                        d.StatusName = d.ReturnOrderStatus;
                    }
                });
                template = $('#MyReturnOrderLi').html();
                $('#ul_ReturnOrderList').html(Mustache.render(template, data, []));
                $("#pageAllCount").val(data.Count);


                $("#ul_ReturnOrderList li").each(function () {
                    var statename = $(this).find(".statename").html().trim();
                    if (statename == "同意退货")
                    {
                        var btn = " <div class='btnbox'><a class='btn2' id='submitReturnOrder'>提交运单号</a></div>"
                        $(this).append($(btn));
                    }
                });



            }

        }
    })
         
}
