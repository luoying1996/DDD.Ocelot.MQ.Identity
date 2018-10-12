/*
晒单用到JS
*/
window.ProductDisplay = Backbone.Model.extend({
    defaults: {
        MemLoginID: '',
        ProductGuid: '',
        OrderNumber: '',
        Name: '',
        Title: '',
        Content: '',
        Image: '',
        IsAudit: '',// 是否审核
        CreateUser: '',
        ModifyUser: '',// 最后修改人
        IsDeleted: '',// 是否删除
        IsAgentId: '',// 是否是分销商
    },
    urlRoot: 'api/addBaskorderlog/',
    url: function () {
        return this.urlRoot;
    }
});
window.ProductDisplayView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#ProductDisplay').html();
        this.model = new ProductDisplay();
        this.ProductGuid = localStorage.getItem('ProductGuid');
        this.OrderNumber = localStorage.getItem(this.ProductGuid);
        this.MemLoginID = pageView.getCookieValue('uid');
    },

    events: {
        'click #SubMitPhoto': 'SubMitPhoto',
    },

    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
        };
        var data = { title: "去晒单", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));
        //判断是否登录        
        if (this.MemLoginID == undefined || this.MemLoginID == null) {
            window.location = "/#page/Login";
            return;
        }
        this.LoadProductDisplay(this.ProductGuid, this.MemLoginID);
        return this;
    },



    //校验输入的类容
    validation: function () {
        var Title = $("#Title").val(),
            Content = $('#Content').val(),
            flag = true;
        if (Title == "" || Content == "") {
            alert('必填项不能为空');
            flag = false;
        }
        return flag;
    },

    SubMitPhoto: function () {
        var that = this,
            firstName = $("#ImageName1").html(),
            nextName = $("#ImageName2").html(),
            lastName = $("#ImageName3").html(),
            image="";

        if (firstName == "" && nextName == "" && lastName == "") {
            alert("请选择图片");
            return;
        }
        if (firstName != "") {
            $("#First").ajaxSubmit({
                url: "http://fxmhv811.groupfly.cn/api/MemberUploadImage.ashx",
                data: { filename: firstName },
                type: "post",
                async: false,
                success: function (text) {
                    //转换成Json对象
                    var res = eval('(' + text + ')');
                    if (res['msg'] == 1) {
                        //修改成功后 将图片数据存入数据库中
                        image = res['imagepath'];
                    } else {
                        alert(res['imagepath']);
                    }
                },
                error: function () {
                    alert("网站出现异常");
                },
            });
        }

        if (nextName != "") {
            $("#Next").ajaxSubmit({
                url: "http://fxmhv811.groupfly.cn/api/MemberUploadImage.ashx",
                data: { filename: nextName },
                type: "post",
                async: false,
                success: function (text) {
                    //转换成Json对象
                    var res = eval('(' + text + ')');
                    if (res['msg'] == 1) {
                        //修改成功后 将图片数据存入数据库中
                        image += '|' + res['imagepath'];
                    } else {
                        alert(res['imagepath']);
                    }
                },
                error: function () {
                    alert("网站出现异常");
                },
            });
        }

        if (lastName != "") {
            $("#Last").ajaxSubmit({
                url: "http://fxmhv811.groupfly.cn/api/MemberUploadImage.ashx",
                data: { filename: lastName },
                type: "post",
                async: false,
                success: function (text) {
                    //转换成Json对象
                    var res = eval('(' + text + ')');
                    if (res['msg'] == 1) {
                        //修改成功后 将图片数据存入数据库中
                        image += '|' + res['imagepath'];
                    } else {
                        alert(res['imagepath']);
                    }
                },
                error: function () {
                    alert("网站出现异常");
                },
            });
        }
        if (image.trim() != "") {
            that.SubProductDisPlay(image);
        }
    },

    //将晒图数据提交到服务器
    SubProductDisPlay: function (image) {
        var that = this;
        if (!that.validation()) {
            return;
        }
		var agentId = $('#hagentId').val();
        that.model.set({
            MemLoginID: pageView.getCookieValue('uid'),
            ProductGuid: localStorage.getItem('ProductGuid'),
            OrderNumber: localStorage.getItem(localStorage.getItem('ProductGuid')),
            Name: $('.info h2').html(),
            Title: $('#Title').val(),
            Content: $('#Content').val(),
            Image: image,
            CreateUser: pageView.getCookieValue('uid'),
			ModifyUser: pageView.getCookieValue('uid'),
			IsAgentId: agentId
        });
        that.model.save('', '', {
            success: function (model, res) {
                if (res.return == 202) {
                    pageView.goTo("MyDisplay");
                } else {
                    alert("添加失败，请重新晒单")
                }
            }

        });
    },
    //获取产品的信息
	LoadProductDisplay: function (ProductGuid, MemLoginID) {
		var agentId = $('#hagentId').val();
        $.ajax({
            type: "GET",
            url: "api/product/",
            data: {
                id:  ProductGuid,
				MemLoginID: MemLoginID,
				agentID: agentId,
                sbool: pageView.getCookieValue("Sbool")
            },
            dataType: "json",
            success: function (result) {
                var template = $('#MyDisplayModel').html();
                var data = { Product: result }
                $("#div_ProductDisplay").html(Mustache.render(template, data, []));
            }
        });
    },
});

//查看预览图片
function changfileFirst(file) {
    var el = file.files[0];
    if (!file.files || !file.files[0]) {
        return;
    }
    $("#ImageName1").html(el.name);
    var reader = new FileReader();
    reader.readAsDataURL(el);
    reader.onload = function (evt) {
        //预览图片
        var img = '<img src="' + evt.target.result + '"width="600" height="600"/>'
        $('#ImagePreviewFirst').html("").append(img);
    }
};
function changfileNext(file) {
    if (!file.files || !file.files[0]) {
        return;
    }
    var el = file.files[0];
    $("#ImageName2").html(el.name);
    var reader = new FileReader();
    reader.readAsDataURL(el);
    reader.onload = function (evt) {
        //预览图片
        var img = '<img src="' + evt.target.result + '"width="600" height="600"/>'
        $('#ImagePreviewNext').html("").append(img);
    }
};
function changfileLast(file) {
    var el = file.files[0];
    if (!file.files || !file.files[0]) {
        return;
    }
    $("#ImageName3").html(el.name);
    var reader = new FileReader();
    reader.readAsDataURL(el);
    reader.onload = function (evt) {
        //预览图片
        var img = '<img src="' + evt.target.result + '"width="600" height="600"/>'
        $('#ImagePreviewLast').html("").append(img);
    }
};