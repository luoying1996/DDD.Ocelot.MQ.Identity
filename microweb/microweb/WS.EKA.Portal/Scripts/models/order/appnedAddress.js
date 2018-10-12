/*
添加收货地址管理用到JS
*/
window.MemberAddress = Backbone.Model.extend({
    urlRoot: 'api/addressgetbyid/',
    defaults: {
        NAME: ''
    },
    url: function () {
        return this.urlRoot + "?memberAddressId=" + localStorage.getItem('memberAddressId');
    },
    isFirstSent: true
});
window.AppendAddressView = Backbone.View.extend({
    el: '#jqt',
    initialize: function () {
        this.template = $('#AppendAddressTemplate').html();
        this.MemLoginID = pageView.getCookieValue('uid');
        this.model = new MemberAddress();
        this.memberAddressId = localStorage.getItem('memberAddressId');
        localStorage.setItem('isFirstSend', "1");
    },
    events: {

    },
    render: function () {
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html()
        };

        var data = { title: "", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };
        this.$el.html(Mustache.render(this.template, data, partial));

        this.LoadProvince();

        return this;
    },
    LoadProvince: function () {
        
        GetProvince(this.memberAddressId);
    }
});

//提交收货地址
function AppendManageAddress() {
    var isFirstSend = localStorage.getItem('isFirstSend');
    if (isFirstSend == "1") {
        localStorage.setItem('isFirstSend', 0);
        var Name = $("#txt_Name").val();
        var Mobile = $("#txt_Mobile").val();
        var province = $("#select_province").find("option:selected").text();
        var city = $("#select_city").find("option:selected").text();
        var area = $("#select_area").find("option:selected").text();
        var Detail = $("#txt_Address").val();
        var MemLoginID = pageView.getCookieValue('uid');

        if (Name == "") {
            alert("请填写收件人!");
            return;
        }
        if (Mobile == "") {
            alert("请填写联系电话!");
            return;
        }
        if (Mobile == "" || isNaN(Mobile) || Mobile.length != 11 || Mobile.substring(0, 1) != "1") {
            alert("手机号码格式不正确");
            return;
        }
        if (province == "") {
            alert("请填写省份!");
            return;
        }
        if (city == "") {
            alert("请填写城市!");
            return;
        }
        if (area == "") {
            alert("请填写地区!");
            return;
        }
        if (Detail == "") {
            alert("请填写详细地址");
            return;
        }


        var Address = province + city + area + Detail;
        var Code = $("#select_area").find("option:selected").attr("Code");
        var memberAddressId = "";
        if ($("#txt_memberAddressId").val() != "") {
            memberAddressId = $("#txt_memberAddressId").val();
        }
        else {
            memberAddressId = "00000000-0000-0000-0000-000000000000";
        }


        $.ajax({

            type: "POST",

            url: "api/address/",

            data: { MemLoginID: MemLoginID, NAME: Name, Email: "", Address: Address, Postalcode: "", Mobile: Mobile, Tel: "", Code: Code, Guid: memberAddressId },

            dataType: "json",

            success: function (data) {
                if (data.toString() != "") {
                    if (data.return == "202") {
                        window.location = "/#page/AddressList?" + localStorage.getItem('FromOrderMake');
                    }
                }
            }
        });
    }
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

function EditNewAddress() {
    $("#txt_Address").val("");
}
