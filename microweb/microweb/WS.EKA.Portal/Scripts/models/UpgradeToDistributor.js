
//页面初始化
window.UpgradeToDistributorView = Backbone.View.extend({
    //页面对象
    el: "#jqt",
    //初始化对象
    initialize: function () {
        this.template = $('#UpgradeToDistributorTemplate').html();
        this.memberAddressId = localStorage.getItem('memberAddressId');
    },
    //绑定事件
    events: {
       
    },
    //页面加载
    render: function () {
        var partial = { header: $('#HeaderTemplate').html() };
        var data = { title: "升级为分销商" };
       
        this.$el.html(Mustache.render(this.template, data, partial));
    
        this.LoadProvince();
        $(".maskgrey1").hide();
        return this;
    },
    LoadProvince: function () {
        GetProvince(this.memberAddressId);
    }
});

function UpgradeToDistributorClick() {
    var yqocde = $("#txt_yqocde").val();
    var province = $("#select_province").find("option:selected").attr("code");
    var city = $("#select_city").find("option:selected").attr("code");
    var area = $("#select_area").find("option:selected").attr("code");

    if (yqocde=="") {
        alert("邀请码必填!");
        return false;
    }
    if (province == "" || province == "请选择省份" || city == "" || city == "请选择城市" || area == "" || area == "请选择地区") {
        alert("请选择省市区!");
        return false;
    }
    //邀请码是否合法
    if (!CheckVerCode(yqocde)) {
        return false;
    }
 
    var memLoginID = pageView.getCookieValue("uid");

    //提交申请
    $.ajax({
        url: 'api/account/UpgradeToDistributor',
        data: { code: yqocde, areacode: area, memLoginID: memLoginID },
        dataType: 'json',
        type:"POST",
        async: false,
        success: function (res) {
            if (res != null && res == "200") {
                alert("您的申请已提交,请耐心等待管理员的审核");
                location.href = "/#page/MyUserInfo";
            } else {
                if (res == "201") alert('网络错误！');
                if (res == "202") alert('用户已下线,请重新登录！');
                if (res == "203") alert('邀请码不能为空！');
                if (res == "204") alert('邀请码不存在！');
                if (res == "205") alert('不允许被三级分销商邀请！');
                if (res == "206") alert('您已经是分销商！');
                if (res == "207") alert('AgentNumber生成失败!');
            }
        }
    });


}
//验证邀请码是否合法
function CheckVerCode(code) {
    var isExist = false;
    $.ajax({
        url: 'api/account/vercodexist/' + code,
        dataType: 'json',
        async: false,
        success: function (res) {
            if (res != null && res == "200") {
                isExist = true; //合法的邀请码
            } else {
                if (res == "201") alert('网络错误！');
                if (res == "202") alert('邀请码不存在！');
                if (res == "303") alert('不允许被三级分销商邀请！');
                isExist = false;
            }
        }
    });
    return isExist;
}

//加载用户收货地址数据
function UpdateManageAddressShow(memberAddressId) {
    if (memberAddressId == undefined || memberAddressId == "" || memberAddressId == null) {
        return;
    }
    localStorage.removeItem('memberAddressId');
    $("#txt_memberAddressId").val(memberAddressId);

    $.ajax({

        type: "GET",

        url: "api/addressgetbyid/?memberAddressId=" + memberAddressId,

        data: {},

        dataType: "json",

        success: function (result) {
            if (result != null) {
                $("#txt_Name").val(result.Data.NAME);
                $("#txt_Mobile").val(result.Data.Mobile);
                $("#select_province").val(result.Data.ProvinceId);
                $("#txt_Address").val(result.Data.Address);
                GetEditArea(result.Data.Code);
            }
        }
    });
}
//加载省份
function GetProvince(memberAddressId) {
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

                UpdateManageAddressShow(memberAddressId);
            }
        }
    });
}

//加载城市
function GetCity() {
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

                GetArea();
            }
        }
    });
}

//加载地区
function GetArea() {
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
//省市区
function GetEditArea(code) {
    $.ajax({
        type: "GET",
        url: "/api/GetAreaInfoByCode/?code=" + code,
        data: {},
        dataType: "json",
        success: function (data) {
            if (data.toString() != "") {
                var areaInfo = data.Data;
                $("#select_province option[code='" + areaInfo.ProvinceCode + "']").attr("selected", true);
                GetCity();
                $("#select_city option[code='" + areaInfo.CityCode + "']").attr("selected", true);
                GetArea();
                $("#select_area option[code='" + areaInfo.AreaCode + "']").attr("selected", true);
            }
        }
    });
}
