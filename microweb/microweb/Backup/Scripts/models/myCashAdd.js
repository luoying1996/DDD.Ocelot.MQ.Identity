window.MyCashAddView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyCashAdd').html();
        this.MemLoginID = pageView.getCookieValue('uid');
    },

    events: {        
        'click #MyCashAddClick': 'MyCashAddClick',
    },

    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            
        };
        var data = { title: "新增提现账户", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));
  
        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }

        return this;
    },
    MyCashAddClick: function (e) {
        var target = $(e.currentTarget);
        var Name = $("#MyCashAddName").val();
        var BankNumber = $("#MyCashAddNumber").val();
        var PassWord = $("#MyCashAddPass").val();
        if (Name == "") {
            alert("开户人不能为空");
            return;
        }
        if (BankNumber == "")
        {
            alert("银行卡号不能为空");
            return;
        }
        if (PassWord == "")
        {
            alert("支付密码不能为空");
            return;
        }
        
        if (BankNumber.replace(/^[1-9]\d{16,20}$/g, ''))
        {
            alert("请输入正确的15-19位银行卡号");
            return;
        }

        var isok = false;
        $.ajax({
            url: "api/checkequalpaypwd/",
            data: {
                MemLoginID: pageView.getCookieValue('uid'),
                PayPwd:PassWord

            },
            async: false,
            dataType: "json",
            success: function (data) {
                if (data.return == "200") {
                    isok = true;                    
                }
                else {
                    alert("支付密码错误");                    
                }

            }
        });
        if (isok == true) {
            $.ajax({
                type: "POST",
                url: "api/CashAdd/",
                data: {
                    MemLoginID: pageView.getCookieValue('uid'),
                    BankName: $("#select_CashType").val(),
                    BankAccountName: Name,
                    BankAccountNumber: BankNumber,
                    CreateUser: pageView.getCookieValue('uid'),
                    ModifyUser: pageView.getCookieValue('uid')
                },
                async: false,
                dataType: "json",
                success: function (data) {
                    if (data.return == "202") {
                        alert("添加成功");
                        pageView.goTo("MyCashBank");
                    }
                    else {
                        alert("添加失败");
                        return;
                    }

                }
            });
        }


    },
});
