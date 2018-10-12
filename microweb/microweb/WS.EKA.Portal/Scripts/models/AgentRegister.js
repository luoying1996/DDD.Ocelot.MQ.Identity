window.AgentRegisterWordView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#GetAgentRegisterWordTemplate').html();
        this.Code = '';
    },
    events: {
        'click #SubmitLostPassWord': 'SubmitLostPassWord',
        'click #GetLostPassWordNextBtn': 'GetLostPassWordNextBtn'
    },
    render: function () {
        var partial = {
            header: $('#HeaderTemplate').html(),
            footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html(),
        };
        var data = { title: "分销商注册" };
        this.$el.html(Mustache.render(this.template, data, partial));
        $('#AgentRegister').append($('#AgentRegisterWordFirstTemplate').html());
        $(".maskgrey1").hide();
        return this;
    },



    //点击下一步  校验验证码输入是否正确
    GetLostPassWordNextBtn: function () {
        //登录名
        var phone = $("#LoginPhone").val();
        if (!phone || Trim(phone) == "") {
            alert("用户名不能为空");
            return false;
        }
        if (!CheckMemloginId(phone)) {
            return false;
        }
        //邀请码
        var verCode = $("#VerCode").val();
        if (!verCode || Trim(verCode) == "") {
            alert("邀请码不能为空");
            return false;
        }
        //邀请码是否合法
        if (!CheckVerCode(verCode)) {
            return false;
        }
        $('#AgentRegister div').remove();
        $('#AgentRegister').append($('#AgentRegisterWordSecondTemplate').html());
        $("#tp2_phone").val(phone);
        $("#tp2_yqCode").val(verCode);
        $('.PopTips').hide();
    },

    //提交信息注册
    SubmitLostPassWord: function () {
        var that = this;
        if (this.validation()) {
            $.ajax({
                type: 'Post',
                url: 'api/AgentRegister/',
                data: {
                    memLoginID: $("#tp2_phone").val(),
                    verCode: $("#tp2_yqCode").val(),
                    pwd: $('#lostPassWord1').val(),
                },
                async: false,
                dataType: "json",
                success: function (res) {
                    if (res.success == "202") {
                        //注册成功消息显示
                        //$('.PopTips').show();
                        alert("分销商注册成功");
                        pageView.goTo('Login');
                    } else {
                        alert(res.error);
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

});



//验证用户名是否合法
function CheckMemloginId(memlogin) {
    var isExist = false;
    $.ajax({
        url: 'api/account/userexist/' + memlogin,
        dataType: 'json',
        async: false,
        success: function (res) {
            if (res != null && res == true) {
                alert('用户名已经存在！');
                isExist = false;
            } else {
                isExist = true;
            }
        }
    });
    return isExist;
}

//验证邀请码是否合法
function CheckVerCode(code) {
    var isExist = false;
    $.ajax({
        url: 'api/account/vercodexist/' + code,
        dataType: 'json',
        async: false,
        success: function (res) {
            if (res != null && res == true) {
                //邀请码存在
                isExist = true;
            } else {
                alert('邀请码不存在！');
                isExist = false;
            }
        }
    });
    return isExist;
}

function Trim(str) {

    return str.replace(/(^\s*)|(\s*$)/g, "");

}