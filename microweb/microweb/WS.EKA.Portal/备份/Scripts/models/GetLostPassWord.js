window.GetLostPassWordView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#GetLostPassWordTemplate').html();
        this.Code = '';
    },
    events: {
        'click #SubmitLostPassWord': 'SubmitLostPassWord',
        'click #GetLostPassWordNextBtn': 'GetLostPassWordNextBtn',
        'click #GetCode': 'GetCodeClick'
    },
    render: function () {
        var partial = {
            header: $('#HeaderTemplate').html(),
            footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html(),
        };
        var data = { title: "忘记密码" };
        this.$el.html(Mustache.render(this.template, data, partial));

        $('#GetLostPassWord').append($('#GetLostPassWordFirstTemplate').html());

        $(".maskgrey1").hide();
        return this;
    },

    //发送验证码
    GetCodeClick: function () {
        var that = this;
        var phone = $('#LoginPhone').val();
        if (CheckPhone(phone) && that.CheckPhoneExistOther(phone) && SendCodeToPhone(phone)) {
            StartTimer();//开启计时器
        };
    },

    //点击下一步  校验验证码输入是否正确
    GetLostPassWordNextBtn: function () {
        if (localStorage.getItem("Time") == 0 || localStorage.getItem("Time") == "") {
            alert("验证码超时,请重新发送")
        }
        //校验验证码
        if ($('#VerCode').val() == '') {
            alert('请输入验证码');
            return;
        }
        else if ($('#VerCode').val() != localStorage.getItem("Code")) {
            alert("验证码输入有误");
            return;
        } else {
            //点击下一步后清除定时器
            $("#GetCode").removeAttr("disabled").text("获取验证码");
            //重新加载页面
            $('#GetLostPassWord div').remove();
            $('#GetLostPassWord').append($('#GetLostPassWordSecondTemplate').html());
            $('.PopTips').hide();
        }
    },

    //提交信息注册
    SubmitLostPassWord: function () {
        var that = this;
        if (this.validation()) {
            $.ajax({
                type: 'Post',
                url: 'api/ResetPassWrod/',
                data: {
                    MemLoginID: localStorage.getItem("Phone"),
                    newPwd: $('#lostPassWord2').val(),
                },
                async: false,
                dataType: "json",
                success: function (res) {
                    if (res.return == "202") {
                        //注册成功消息显示
                        //$('.PopTips').show();
                        pageView.goTo('Login');
                    } else {
                        $('#Error').html('重置密码事失败！');
                    }

                }
            });
        }
    },


    //第二步校验
    validation: function () {
        var pwd1 = $('#lostPassWord1').val(),
            pwd2 = $('#lostPassWord2').val(),
            flag = true;
        if (pwd1 == "") { alert('密码不能为空！'); flag = false; return; }
        if (pwd2 == "") { alert('确认密码不能为空！'); flag = false; return; }
        if (pwd2 != pwd1) { alert('密码前后不一致！'); flag = false; return; }
        return flag;
    },

    // 校验手机号是否已经注册
    CheckPhoneExistOther: function (phone) {
        var flag = false;
        $.ajax({
            url: 'api/account/userexist/' + phone,
            dataType: 'json',
            async: false,
            success: function (res) {
                if (res != null && res.return == true) {
                    flag = true;
                } else {
                    flag = false;
                    alert('手机号没有注册，输入正确手机号！');
                }
            }
        });
        return flag;
    },
});

