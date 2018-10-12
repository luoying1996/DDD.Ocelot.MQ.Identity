window.UserInfo = Backbone.Model.extend({
    defaults: {
        MemLoginID: '',
    },
    urlRoot: 'api/account/',
    url: function () {
        return this.urlRoot + pageView.getCookieValue('uid');
    }
});


window.MyNameView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.model = new UserInfo();
        this.template = $('#MyName').html();
        this.MemLoginID = pageView.getCookieValue('uid');
    },

    events: {
        'click a#BtnClick': 'updateClick'
    },
    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
        };
        var data = { title: "修改姓名", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));
        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }
        this.fetchUserInfo();
        return this;
    },

    //获取RealName
    fetchUserInfo: function () {
        var that = this;
        this.model.fetch({
            success: function () {
                $("#UserName").val(that.model.get("RealName"));
            }
        });
        $('.maskgrey1').hide(50);
    },


    //校验昵称
    validation: function () {
        if (this.$el.find('#UserName').val() === "") {
            $('#loginError').html('昵称不能为空');
            return false;
        }
        return true;
    },

    updateClick: function (e) {
        var that = $(e.currentTarget);
        if (this.validation()) {
            $.ajax({
                type:'post',
                url: 'api/account/updaterealname/',
                data: {
                    RealName: $('#UserName').val(),
                    memLoginID: this.MemLoginID,
                },
                anysc: false,
                dataType: "json",
                success: function (res) {
                    if (res && res == 200) {
                        alert("修改成功");
                        pageView.goTo('MyUserInfo');
                    } else {
                        $('#loginError').html('修改失败');
                    }
                }
            })
        } 
    },
});


