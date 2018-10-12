window.MyCashListView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyCashList').html();
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
        var data = { title: "提现明细", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));

        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }



        localStorage.setItem('pageIndex', 1);
        localStorage.setItem('pageCount', 5);

        fetchMyCashList();

        //绑定分页按钮
        this.BindFenYeClick();

        return this;
    },
    BindFenYeClick: function () {
        $("#first").bind("click", function () {
            var pageIndex = parseInt(localStorage.getItem('pageIndex'));
            if (pageIndex != 1) {
                localStorage.setItem('pageIndex', 1);
                fetchMyCashList();
            }
        });
        $("#top").bind("click", function () {
            var pageIndex = parseInt(localStorage.getItem('pageIndex')) - 1;
            if (parseInt(pageIndex) > 0) {
                localStorage.setItem('pageIndex', pageIndex);
                fetchMyCashList();
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
                fetchMyCashList();
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
                fetchMyCashList();
            }
        });
    },
    //DellClick: function (e) {
    //    var target = $(e.currentTarget);
    //},
});
function fetchMyCashList() {
    $.ajax({
        url: "api/GetAdvancePaymentApplyLogByMemLoginID/",
        data: {
            pageIndex:localStorage.getItem('pageIndex'),
            pageCount:localStorage.getItem('pageCount'),
            MemLoginID: pageView.getCookieValue('uid')
        },
        async: false,
        dataType: "json",
        success: function (data) {
            if (data != null) {
                var template = $('#MyCashListLi').html();
                $("#div_MyCashList").html(Mustache.render(template, data, []));
                $("div.Item").each(function () {
                    var bankname = $(this).attr("bank");
                    var bankaccountnumber = $(this).attr("account");
                    var operatestatus = $(this).attr("operatestatus");
                    switch (bankname) {
                        case "建行":
                            $(this).find("#banknamenumber").html("中国建设银行" + "(尾号" + bankaccountnumber.substring(bankaccountnumber.length - 4, bankaccountnumber.length) + ")");

                            break;
                        case "工行":
                            $(this).find("#banknamenumber").html("中国工商银行" + "(尾号" + bankaccountnumber.substring(bankaccountnumber.length - 4, bankaccountnumber.length) + ")");
                            break;
                    }

                    var statusName = $(this).find("font.fd-fbange.fd-right");
                    switch (operatestatus) {

                        case "0":
                            statusName.html(statusName.html() + "(未确认)");
                            break;
                        case "1":
                            statusName.html(statusName.html() + "(已确认)");
                            break;
                    }
                });
                $("#pageAllCount").val(data.Count);
            }

        }
    })

}