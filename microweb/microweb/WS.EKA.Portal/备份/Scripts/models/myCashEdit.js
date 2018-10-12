window.MyCashEditView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyCashEdit').html();
        this.MemLoginID = pageView.getCookieValue('uid');
    },

    events: {
        'click #CashEditDelete': 'DellClick',
    },

    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),

        };
        var data = { title: "账户明细", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));

        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }

        this.Bind();
        return this;
    },
    Bind: function () {
        var BankAccountName = localStorage.getItem("EditCashBankAccountName");
        var BankName = localStorage.getItem("EditCashBankName");
        var BankAccountNumber = localStorage.getItem("EditCashBankAccountNumber");

        switch (BankName) {
            case "建行": BankName = "中国建设银行"; break;
            case "工行": BankName = "中国工商银行"; break;
        }

        $("#EditName").val(BankAccountName);
        $("#EditBankName").val(BankName);
        $("#EditBankAccount").val(BankAccountNumber);
    },
    DellClick: function (e) {
        $.ajax({
            url: "api/CashDelete/",
            data: {
                Guid: localStorage.getItem("EditCashGuid")
            },
            async: false,
            dataType: "json",
            success: function (data) {
                if (data.return == "202") {
                    alert("删除成功");
                    pageView.goTo("MyCashBank");
                }
                else {
                    alert("删除失败");
                }

            }
        })
    },
});
