//页面初始化
window.MyBusinessPassWordView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {

        this.MemLoginID = pageView.getCookieValue('uid');
        this.HasPayPass = this.HasBusinessPassWord(this.MemLoginID);
        this.template = this.HasPayPass ? $('#MyBusinessPassWordTemplate2').html() : $('#MyBusinessPassWordTemplate1').html();

    },

    events: {
        'click #SubmitUpdateBusinessPwd': 'SubmitUpdateBusinessPwd'

    },
    render: function () {
        var that = this;
        //加载模板
        var partial = {
            header: $('#HeaderTemplate').html(),
            footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html()
        };
        //加载数据
        var data = { title: "设置交易密码", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };
        //合并并加载页面

        this.$el.html(Mustache.render(this.template, data, partial));
        //判断是否登录        
        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }
        return this;
    },


    //判断是否存在支付密码
    HasBusinessPassWord: function (memLoginId) {
        var that = this,
            flag = false;
        $.ajax({
            type: "Get",
            url: 'api/getpaypwd/',
            data: { memLoginId: memLoginId },
            async: false,
            dataTpe: 'json',
            success: function (res) {
                if (res.return == 202) {
                    if (res.Data == "") {
                        flag = false;
                    } else {
                        flag = true;
                    }
                }
            }
        });
        return flag;
    },


    //提交设置新密码
    SubmitUpdateBusinessPwd: function () {
        var that = this;
        //检验是否有支付密码并做校验
        if (this.HasPayPass) {
            var pwd = $('#OldPayPwd').val();
            if (pwd == "") { alert('新密码不能为空！'); return; }
            if (that.GetIsPayPwd(pwd)) { alert("支付密码错误"); return; }
        }
        //校验输入的新密码
        if (this.validation()) {
            $.ajax({
                type: 'post',
                url: 'api/updatepaypwd/',
                data: {
                    MemLoginId: this.MemLoginID,
                    newPayPwd: $('#NewPayPwd1').val()
                },
                dataTpe: 'json',
                success: function (res) {
                    if (res.return == 404) {
                        alert('支付密码修改失败');
                    }
                    if (res.return == 200) {
                        alert('支付密码修改成功');
                        pageView.goTo('MyUserInfo');
                    }
                }
            });
        }
    },

    //校验两次输入的密码
    validation: function () {
        var pwd1 = $('#NewPayPwd1').val(),
            pwd2 = $('#NewPayPwd2').val(),
            flag = true;
        if (pwd1 == "") { alert('新密码不能为空！'); flag = false; return; }
        if (pwd2 == "") { alert('确认密码不能为空！'); flag = false; return; }
        if (pwd1 != pwd2) { alert('密码前后不一致！'); flag = false; return; }
        return flag;
    },

    //校验输入的支付密码
    GetIsPayPwd: function (PassWord) {
        var flag = false;
        $.ajax({
            url: "api/checkequalpaypwd/",
            data: {
                MemLoginID: pageView.getCookieValue('uid'),
                PayPwd: PassWord
            },
            async: false,
            dataType: "json",
            success: function (data) {
                if (data.return != "200") {
                    flag = true;
                } else {
                    flag = false;
                }
            }
        })
        return flag;
    }
});