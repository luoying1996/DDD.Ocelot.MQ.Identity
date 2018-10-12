/*
注册分销商用到JS
*/

window.AgentRegistView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#AgentRegistTemplate').html();
        this.MemLoginID = pageView.getCookieValue('uid');
    },
    events: {

    },
    render: function () {
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html()
        };

        var data = { title: "注册分销商", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };
        this.$el.html(Mustache.render(this.template, data, partial));

        GetAgentProvince();

        return this;

    }
});


function GetAgentProvince() {
    $.ajax({

        type: "GET",

        url: "/api/region/0",

        data: {},

        dataType: "json",

        success: function (data) {
            if (data.toString() != "") {
                var template = $('#AddressOptionTemplate').html();
                var str = Mustache.render(template, data, []);
                str = '<option value="">请选择省份</option>' + str;
                $("#select_province").html(str);
            }
        }
    });
}

//加载城市
function GetAgentCity() {
    if ($("#select_province").val() == "") {
        return;
    }

    $.ajax({

        type: "GET",

        url: "/api/region/" + $("#select_province").val(),

        data: {},

        dataType: "json",

        success: function (data) {
            if (data.toString() != "") {
                var template = $('#AddressOptionTemplate').html();
                var str = Mustache.render(template, data, []);
                $("#select_city").html(str);

                GetAgentArea();
            }
        }
    });
}

//加载地区
function GetAgentArea() {
    if ($("#select_city").val() == "") {
        return;
    }

    $.ajax({

        type: "GET",

        url: "/api/region/" + $("#select_city").val(),

        data: {},

        dataType: "json",

        success: function (data) {
            if (data.toString() != "") {
                var template = $('#AddressOptionTemplate').html();
                var str = Mustache.render(template, data, []);
                $("#select_area").html(str);
            }
        }
    });
}

//注册分销商验证
function CheckAgentRegist() {
    var name = $('#r_Name').val();
    var username = $('#r_userName').val();
    var pwd = $('#r_password').val();
    var pwd2 = $('#r_password_confirm').val();
    var email = $('#r_email').val();
    var province = $('#select_province').val();
    var city = $('#select_city').val();
    var area = $('#select_area').val();

    var flag = true;

    if (username == "") { alert('用户名不能为空！'); flag = false; }
    else if (username.length < 6) { alert('用户名长度不可小于6位！'); flag = false; }
    else if (pwd == "") { alert('密码不能为空！'); flag = false; }
    else if (pwd.length < 6) { alert('密码长度不可小于6位！'); flag = false; }
    else if (pwd2 == "") { alert('确认密码不能为空！'); flag = false; }
    else if (pwd2 != pwd) { alert('密码前后不一致！'); flag = false; }
        //    else if (email == "") { alert('邮箱不能为空！'); flag = false; }
        //    else if (email != "" && !(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-z][a-z.]{2,8}$/.test(email))) { alert('邮箱格式错误！'); flag = false; }
    else if (province == "") { alert('省份不能为空！'); flag = false; }
    else if (city == "") { alert('城市不能为空！'); flag = false; }
    else if (area == "") { alert('地区不能为空！'); flag = false; }

    return flag;
}

//注册分销商
function AgentRegist() {
    if (!CheckAgentRegist()) {
        return;
    }

    var username = $('#r_userName').val();

    CheckMemLoginIDRepeat(username, 0);
}

//验证用户名是否重复
function CheckMemLoginIDRepeat(MemLoginID, type) {

    $.ajax({

        type: "GET",

        url: "/api/checkmemloginIdrepeat/?MemLoginID=" + MemLoginID,

        data: {},

        dataType: "json",

        success: function (res) {
            if (res != null && res.Result == "202") {
                if (type == 0) {
                    alert("用户名已被注册，请使用其它用户名！");
                }
                else {
                    alert("注册成功！");

                    pageView.goTo('Catalog');
                }
            }
            else {
                if (type == 0) {
                    AddAgent();
                }
                else {
                    alert("注册失败！");
                }
            }
        }
    });
}

//注册分销商
function AddAgent() {
    var RealName = $('#r_Name').val();
    var MemLoginID = $('#r_userName').val();
    var Pwd = $('#r_password').val();
    var Email = $('#r_email').val();

    var Area = $("#select_province").find("option:selected").text() + $("#select_city").find("option:selected").text() + $("#select_area").find("option:selected").text();
    var AreaCode = $("#select_area").find("option:selected").attr("Code");

    $.ajax({

        type: "GET",

        url: "/api/addagent/?RealName=" + RealName + "&MemLoginID=" + MemLoginID + "&Pwd=" + Pwd + "&Email=" + Email + "&Area=" + Area + "&AreaCode=" + AreaCode,

        data: {},

        dataType: "json",

        success: function (res) {
            if (res != null && res.RESULT == "202") {
                CheckMemLoginIDRepeat(MemLoginID, 1);
            }
        }
    });
}