window.QRCodeRegisterModel = User.extend({
    defaults: {
        MemLoginID: "",
        Pwd: "",
        PwdConfirm: "",
        validateCode: "",
        WxOpenID: "",
        CommendPeople: "",
        Mobile: ""
    },

    urlRoot: 'api/account/',
    url: function () {
        return this.urlRoot + 'Regist';
    }
});

window.QRCodeRegisterView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#QRCodeRegisterTemplate').html();
        this.model = new RegisterModel();
    },
    events: {
        'click #registerBtn': 'userRegister',
        'click #GetQRCode': 'GetQRCodeClick'
    },
    render: function () {
        var partial = { header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(), innerFooter: $('#InnerFooterTemplate').html() };
        var data = { title: "注册", btnListR: [{ name: 'home' }] };

   
        this.$el.html(Mustache.render(this.template, data, partial));
 
        var tmpCommendPeople = localStorage.getItem("CommendPeople");
        var tmps = tmpCommendPeople.replace("CommendPeople=", '');
        $("#r_CommendPeople").attr("disabled", "true").val(tmps);
        $(".maskgrey1").hide();
        return this;
    },

    //点击发送验证码
    GetQRCodeClick: function () {
 
        var that = this;
        var phone = $('#r_Phone').val();

        SendCodeToPhone(phone);
        if (CheckPhone(phone) && CheckPhoneExists(phone)) {
            StartTimer();//开启计时器
        };
    },

    //提交录入信息  注册
    userRegister: function () {
        var that = this;
        var agentId = localStorage.getItem('agentid');

        if (this.validation()) {
            this.model.set({
                MemLoginID: $('#r_Phone').val(),
                Pwd: $('#r_password').val(),
                WxOpenID: pageView.getCookieValue('wxOpenID'),
                CommendPeople: $("#r_CommendPeople").val(),
                Mobile: $('#r_Phone').val(),
                Tshou: 1,
                AgentID: agentId,
                //AgentId:

            });
            this.model.save('', '', {
                success: function (model, res) {
                    if (res && res.RESULT == "202") {
                        localStorage.setItem('loginid', that.model.get('MemLoginID'));
                        var loginfrom = localStorage.getItem('loginfrom');
                        if (loginfrom) {
                            LoginView.loginAfterAction(loginfrom).call();
                        }
                        else {
                            alert("注册成功");
                            pageView.goTo('MyUserInfo');
                        }
                    } else {
                        $('#registerError').html('注册失败！');
                    }
                }
            });
        }
    },

    //校验提交数据
    validation: function () {
        var phone = $('#r_Phone').val(),
            pwd = $('#r_password').val(),
            pwd2 = $('#r_password_confirm').val(),
            verCode = $('#VerCode').val(),
            flag = true;
        if (localStorage.getItem("Time") == 0 || localStorage.getItem("Time") == "") { alert("验证码超时,请重新获取"); }
        if (verCode == "") { alert('请输入验证码'); flag = false; return }
        if ($('#VerCode').val() != localStorage.getItem("Code")) { alert("验证码输入有误"); flag = false; return }

        if (phone == "") { alert('请输入手机号！'); flag = false; return; }
        if (pwd == "") { alert('密码不能为空！'); flag = false; return; }
        if (pwd2 == "") { alert('确认密码不能为空！'); flag = false; return; }
        if (pwd2 != pwd) { alert('密码前后不一致！'); flag = false; return; }

        return flag;
    },
});