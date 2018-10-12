window.MyCashView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyCash').html();
        this.MemLoginID = pageView.getCookieValue('uid');
    },

    events: {
        'click #CashMoneyClick': 'CashMoney',
        'click a.chosebank': 'chosebank',
    },

    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            
        };
        var data = { title: "提现", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));
        
        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }

        this.BindAccuont();

        this.fetch();

        return this;
    },
    chosebank: function (e) {
        var target = $(e.currentTarget);
        localStorage.setItem("CashBankGuid", localStorage.getItem("myCashGuid"));
        pageView.goTo("MyCashBank");
    },
    BindAccuont: function () {
        $.ajax({
            url: "api/account/" + pageView.getCookieValue('uid'),
            data: {
            },
            async: false,
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    $("#MyMoney").html(data.AdvancePayment);
                    $("#MyMoney1").html(data.AdvancePayment);
                }
            }
        })
    },
    fetch: function () {
        $.ajax({
            url: "api/GetCashListByMemLoginID/",
            data: {
                MemLoginID: pageView.getCookieValue('uid')
            },
            async: false,
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    var guid = localStorage.getItem("CashBankGuid");
                    if (guid != "" && guid != undefined && guid != null) {

                        $.each(data.Data, function (index, d) {
                            if (d.Guid == guid) {
                                switch (d.BankName) {
                                    case "建行":
                                        $("b.bankname").html("中国建设银行");
                                        break;
                                    case "工行":
                                        $("b.bankname").html("中国工商银行");
                                        break;
                                }
                                localStorage.setItem("myCashGuid", d.Guid);
                                localStorage.setItem("myCashBankName", d.BankName);
                                localStorage.setItem("myCashBankAccountNumber", d.BankAccountNumber);
                                localStorage.setItem("myCashBankAccountName", d.BankAccountName);
                                $(".fd-gray2.fs08").html("(尾号" + d.BankAccountNumber.substring(d.BankAccountNumber.length - 4, d.BankAccountNumber.length) + ")");;
                            }
                          
                        });

                    }
                }

            }
        })
    },
    CashMoney: function () {
       
        var bankname = $("b.bankname").html().trim();
        if (bankname == "请选择")
        {
            alert("请选择绑定的银行卡");
            return;
        }
        var CashMoney=$("#CashMoney").val(); 
        if (CashMoney == "" || CashMoney == undefined || CashMoney == null)
        {
            alert("请输入提现金额");
            return;
        }        
        if (CashMoney.replace(/^([1-9]\d{0,9}|0)(\.\d{0,1}[1-9])?$/g, '')) {
               
            alert("请输入正确的金额");
            return;
        }     
        var MyMoney=$("#MyMoney1").html().trim();
        if (parseFloat(CashMoney) > parseFloat(MyMoney))
        {
            alert("输入的金额不能大于账户余额");
            return;
        }
        var remark = $("#remark").val();
        if (remark.length > 50)
        {
            alert("备注长度不能超过50");
            return;
        }

        $.ajax({
            type:"POST",
            url: "api/SumbitCash/",
            data: {
                OperateMoney: CashMoney,
                Memo: remark,
                MemLoginID: pageView.getCookieValue('uid'),
                Bank: localStorage.getItem("myCashBankName"),
                TrueName: localStorage.getItem("myCashBankAccountName"),
                Account: localStorage.getItem("myCashBankAccountNumber")        
            },
            async: false,
            dataType: "json",
            success: function (data) {
                if (data.return == "202") {
                    alert("提现成功");
                    pageView.goTo("MyCashList");
                }
                else {
                    alert("提现失败");
                }



            }
        })

    },
});
