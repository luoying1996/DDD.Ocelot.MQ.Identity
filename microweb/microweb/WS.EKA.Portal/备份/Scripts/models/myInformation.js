window.UserInfo = Backbone.Model.extend({
    defaults: {
        MemLoginID: '',
        Sex: '',
    },
    urlRoot: 'api/account/',
    url: function () {
        return this.urlRoot + pageView.getCookieValue('uid');
    }
});

window.MyInformationView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.model = new UserInfo();
        this.template = $('#MyInformation').html();
        this.MemLoginID = pageView.getCookieValue('uid');
    },

    events: {
        'click #LoginOut': 'LoginOut',
        'click #PhoneAlbum': 'PhoneAlbum',
        'click #SubPhoto': 'SubPhoto',
        'click #CancelPhoto': 'CancelPhoto'

    },

    render: function () {
        var that = this;
        var partial = { header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html() };
        var data = { title: "个人资料", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };
        this.$el.html(Mustache.render(this.template, data, partial));
        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }
        this.fetchUserInfo();

        return this;
    },

    fetchUserInfo: function () {
        var that = this;
        this.model.fetch({
            success: function () {
                $(".PersImg img").attr('src', that.model.get("Photo"));
                $("#UserName").html(that.model.get("RealName"));
                var sex = null;
                switch (that.model.get("Sex")) {
                    case 0:
                        sex = "保密"
                        break;
                    case 1:
                        sex = "男"
                        break;
                    case 2:
                        sex = "女"
                        break;
                }
                $("#Sex").html(sex);
            }
        });
        $('.maskgrey1').hide(50);
    },

    //退出当前账号
    LoginOut: function () {
        localStorage.clear();
        $.ajax({
            type: "GET",
            url: "/api/accountlogout/",
            data: {},
            dataType: "json",
            success: function (res) {
                if (res != null && res.Result == "202") {
                    location.href = "/#page/MyOrder";
                }
            }
        });
    },

    PhoneAlbum: function () {
        $('#PhoneAlbum img').src = "../../ImgUpload/phote.jpg";
        alert($('#PhoneAlbum img').attr("src"));
    },


    //点击确定
    SubPhoto: function () {
        var that = this;
        var filename = $("#textfield").html();
        $("form").ajaxSubmit({
            url: "http://fxmhv811.groupfly.cn/api/MemberUploadImage.ashx",
            data: { filename: filename },
            type: "post",
            success: function (text) {
                //转换成Json对象
                var res = eval('(' + text + ')');
                if (res['msg'] == 1) {
                    //修改成功后 将图片数据存入数据库中
                    that.UpdateUserPhoto(res['imagepath']);
                } else {
                    alert("上传头像失败");
                }
            },
            error: function () {
                alert("网站出现异常");
            },
        });
    },
    //修改成功后 将图片数据存入数据库中
    UpdateUserPhoto: function (imagepath) {
        $.ajax({
            type: "GET",
            url: " api/updatephoto/",
            data: {
                MemLoginID: pageView.getCookieValue('uid'),
                Photo: imagepath,
            },
            dataType: "json",
            success: function (res) {
                if (res != null && res.return == "200") {
                    location.href = "/#page/MyUserInfo";
                } else {
                    alert("修改失败");
                }
            }
        });

    },

    //取消修改
    CancelPhoto: function () {
        $(".ChangeBox").hide();
    },


});


function changfile(obj) {
    var el = obj.files[0];
    $("#textfield").html(el.name)
};






