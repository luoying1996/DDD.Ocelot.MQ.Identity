window.MyCashBankView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyCashBank').html();
        this.MemLoginID = pageView.getCookieValue('uid');
    },

    events: {
        'click a.J-edit': 'EditClick',
        'click div.Withdraw li a': 'BankLiClick',
        'click div.edit': 'EditLiClick',        
    },

    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            
        };
        var data = { title: "提现方式", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));
        
        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }

        this.fetch();
        return this;
    },
    EditClick: function (e) {
        var target = $(e.currentTarget);
        $(".Withdraw ul").toggleClass("wdedit");
    },
    EditLiClick:function(e){
        var target = $(e.currentTarget);
        var guid = $(target).parents("li").attr("guid");
        var bankaccountname = $(target).parents("li").attr("bankaccountname");
        var bankname = $(target).parents("li").attr("bankname");
        var bankaccountnumber = $(target).parents("li").attr("bankaccountnumber");
        localStorage.setItem("EditCashGuid", guid);
        localStorage.setItem("EditCashBankAccountName", bankaccountname);
        localStorage.setItem("EditCashBankName", bankname);
        localStorage.setItem("EditCashBankAccountNumber", bankaccountnumber);
        pageView.goTo("MyCashEdit");
    },
    BankLiClick: function (e) {
        var target = $(e.currentTarget);
        $(target).parent().addClass("cur").siblings().removeClass("cur");
        var guid = $(target).parents("li").attr("guid");
        localStorage.setItem("CashBankGuid", guid);
        pageView.goTo("MyCash");
    },
    fetch: function () {
        $.ajax({
            url: "api/GetCashListByMemLoginID/",
            data: {
                MemLoginID:pageView.getCookieValue('uid')
            },
            async: false,
            dataType: "json",
            success: function (data) {
                if (data != null) {                
                    var template = $('#MyCashBankLi').html();
                    $("#ul_MyCashBankList").html(Mustache.render(template, data, []));
                    $("#ul_MyCashBankList li").each(function () {
                        var bankname = $(this).attr("bankname");
                        var bankaccountnumber = $(this).attr("bankaccountnumber");
                        switch (bankname)
                        {
                            case "建行":
                                $(this).find(".mybank").html("中国建设银行");

                                break;
                            case "工行":
                                $(this).find(".mybank").html("中国工商银行");
                                break;
                        }
                        $(this).find(".fd-gray.fs08").html("(尾号" + bankaccountnumber.substring(bankaccountnumber.length - 4, bankaccountnumber.length)+")");

                        if (localStorage.getItem("CashBankGuid") == $(this).attr("guid"))
                        {
                            $(this).addClass("cur").siblings().removeClass("cur");
                        }
                    });
                }

            }
        })
    },
});
