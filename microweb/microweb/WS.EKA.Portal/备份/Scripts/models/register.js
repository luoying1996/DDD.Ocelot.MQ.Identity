window.RegisterModel = User.extend({
    defaults: {
        MemLoginID: "",
        Pwd: "",
        PwdConfirm: "",
        Email: "",
        validateCode: "",
        WxOpenID: "",
        CommendPeople: "",
        Mobile: '',
        Tshou: ''
    },

    urlRoot: 'api/account/',
    url: function () {
        return this.urlRoot + 'Regist';
    }
});

window.RegisterView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#RegisterTemplate').html();
        this.model = new RegisterModel();
        this.Code = '';
    },
    events: {
        'click #registerFirstBtn': 'registerFirstBtn',
        'click #registerNextBtn': 'registerNextBtn',
        'click a.register_help': 'openAgreement',
        'click #GetCode': 'GetCodeClick'
    },
    render: function () {
        var partial = { header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(), innerFooter: $('#InnerFooterTemplate').html() };
        var data = { title: "注册", btnListR: [{ name: 'home' }] };

        this.$el.html(Mustache.render(this.template, data, partial));
        $('#RegisterOther').append($('#RegisterFirstTemplate').html());
        $(".maskgrey1").hide();
        return this;
    },

    //获取验证码
    GetCodeClick: function () {
        var that = this;
        var phone = $('#r_Phone').val();
        if (CheckPhone(phone) && CheckPhoneExist(phone) && SendCodeToPhone(phone)) {
            StartTimer();//开启计时器
        };
    },

    //点击下一步  校验验证码输入是否正确
    registerFirstBtn: function () {
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
            //点击下一页后要清除计时器
            $("#GetCode").removeAttr("disabled").text("获取验证码");
            $('#RegisterOther div').remove();
            $('#RegisterOther').append($('#RegisterSecondTemplate').html());
            $('.PopTips').hide();
        }
    },
    //提交信息注册
    registerNextBtn: function () {
        var that = this;
        if (this.validation()) {
            this.model.set({
                MemLoginID: localStorage.getItem("Phone"),
                Pwd: $('#r_password').val(),
                WxOpenID: pageView.getCookieValue('wxOpenID'),
                CommendPeople: $("#r_CommendPeople").val(),
                Mobile: localStorage.getItem("Phone"),
                Tshou: 1,
                AgentID: pageView.getCookieValue('AgentID'),
            });
            this.model.save('', '', {
                success: function (model, res) {
                    if (res && res.RESULT == "202") {
                        pageView.goTo('MyUserInfo');

                    } else {
                        alert("注册失败！")
                    }

                }
            });
        }
    },
    //第二步校验
    validation: function () {
        var pwd = $('#r_password').val(),
            pwd2 = $('#r_password_confirm').val(),
            commendPeople = $('#r_CommendPeople').val();
        agree = true,
        flag = true;
        if (pwd == "") { alert('密码不能为空！'); flag = false; return; }
        if (pwd2 == "") { alert('确认密码不能为空！'); flag = false; return; }
        if (pwd2 != pwd) { alert('密码前后不一致！'); flag = false; return; }
        if (commendPeople == "") { alert('推荐人账号不能为空！'); flag = false; return; }

        $.ajax({
            url: 'api/account/userexist/' + commendPeople,
            dataType: 'json',
            async: false,
            success: function (res) {
                if (res != null && res.return == false) {
                    alert('推荐人账号不存在！');
                    flag = false;
                }
            }
        });
        return flag;
    },
    //不知道干什么
    openAgreement: function () {
        pageView.goTo('Agreement');
    },

});

//校验手机号是否输入正确
function CheckPhone(phone) {
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (phone == "") {
        alert('请输入手机号！');
        return false;
    }
    if (!myreg.test(phone)) {
        alert('请输入有效的手机号码！');
        return false;
    }
    return true;
};
// 校验手机号是否已经注册
function CheckPhoneExist(phone) {
    var isExist = false;
    $.ajax({
        url: 'api/account/userexist/' + phone,
        dataType: 'json',
        async: false,
        success: function (res) {
            if (res != null && res.return) {
                alert('用户名已经存在！');
                isExist = false;
            } else {
                isExist = true;
            }
        }
    });
    return isExist;
};
//向输入的手机号发送验证码
function SendCodeToPhone(phone) {
    var isSend = false;
    $.ajax({
        url: 'api/getmobilecode/' + phone,
        dataType: 'json',
        async: false,
        success: function (res) {
            if (res != null && res.Data != null) {
                alert("验证码发送成功!" + res.Data);
                localStorage.setItem("Code", res.Data);
                localStorage.setItem("Phone", phone);
                isSend = true;
            } else {
                alert("验证码发送失败!");
            }
        }
    });
    return isSend;
};
//开启计时器
function StartTimer() {
    var time = 60;
    //设置button效果，开始计时
    $("#GetCode").attr("disabled", "true").text(time + "秒");
    InterValObj = window.setInterval(function () {
        if (time == 0) {
            window.clearInterval(InterValObj);//停止计时器
            $("#GetCode").removeAttr("disabled").text("重新发送验证码");//启用按钮
        } else {
            time--;
            $("#GetCode").text(time + "秒");
            localStorage.setItem("Time", time--);
        }
    }, 1000); //启动计时器，1秒执行一次
};
