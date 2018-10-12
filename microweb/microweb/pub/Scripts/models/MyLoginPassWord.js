//页面初始化
window.MyLoginPassWordView = Backbone.View.extend({
    //页面对象
    el: "#jqt",
    //初始化对象
    initialize: function () {
        this.template = $('#MyLoginPassWordTemplate').html();
        this.MemLoginID = pageView.getCookieValue('uid');
    },
    events: {
        'click #SubmitUpdatePwd': 'SubmitUpdatePwd'
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
        var data = { title: "修改登录密码", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };
        //合并并加载页面
        this.$el.html(Mustache.render(this.template, data, partial));
        //判断是否登录        
        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }
        return this;
    },
    SubmitUpdatePwd: function () {
        var that = this;
        if (this.validation()) {
            $.ajax({
                type: 'post',
                url: 'api/updateloginpwd/',
                data: {
                    MemLoginId: this.MemLoginID,
                    OldPwd: $('#OldPwd').val(),
                    NewPwd: $('#NewPwd1').val(),
                },
                dataTpe: 'json',
                async: 'false',
                success: function (res) {
                    if (res.return==404) {
                        alert('旧密码输入有误');
                    }
                    if (res.return==200) {
                        alert('密码修改成功');
                        pageView.goTo('MyUserInfo');
                    }
                }
            });
        }
    },

    //校验两次输入的密码
    validation: function () {
        var pwd = $('#OldPwd').val(),
            pwd1 = $('#NewPwd1').val(),
            pwd2 = $('#NewPwd2').val(),
            flag = true;
        if (pwd == "") { alert('原密码不能为空！'); flag = false; return; }
        if (pwd1 == "") { alert('新密码不能为空！'); flag = false; return; }
        if (pwd2 == "") { alert('确认密码不能为空！'); flag = false; return; }
        if (pwd1 != pwd2) { alert('密码前后不一致！'); flag = false; return; }
        return flag;
    },
});