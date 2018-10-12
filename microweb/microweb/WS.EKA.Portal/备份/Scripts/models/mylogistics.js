window.MylogisticsView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#Mylogistics').html();
        this.MemLoginID = pageView.getCookieValue('uid');
    },

    events: {
        //'click a.W_DelIcn': 'DellClick',
    },

    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            
        };
        var data = { title: "查看物流", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));
  
        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }

        this.fetch();

        this.Bind();

        return this;
    },
    fetch: function () {
        $.ajax({
            url: "api/GetExpressInfo/",
            data: {
                orderNumber: localStorage.getItem('MylogisticsOrderNumber'),                

            },
            async: false,
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    if (data.Data.status == "1") {
                        var template = $('#MylogisticsLi').html();

                        var datatext = {datatext:data.Data.data};
                        $("#ul_MylogisticsList").html(Mustache.render(template, datatext, []));
                        $("#ul_MylogisticsList li").eq(0).toggleClass("cur");
                    }
                    else {
                        $(".con").html(data.Data.message);
                    }
                    $("#logisticsName").html(data.Name);
                   
                    
                }
             

            }
        });
    },
    Bind: function () {
        $("#MylogisticsOrderNumber").html(localStorage.getItem('MylogisticsOrderNumber'));
    },
    //DellClick: function (e) {
    //    var target = $(e.currentTarget);
    //},
});
