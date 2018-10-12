/*
收货地址管理用到JS
*/

window.AddressListView = Backbone.View.extend({
    el: '#jqt',
    initialize: function () {
        this.template = $('#AddressListTemplate').html();
        this.MemLoginID = pageView.getCookieValue('uid');
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

        this.LoadManageAddress();

        return this;
    },
    LoadManageAddress: function () {
        ManageAddressShow(this.MemLoginID);
    }
});

//获取用户收货地址列表
function ManageAddressShow(MemLoginID) {
    

    $.ajax({

        type: "GET",

        url: "/api/getmemberaddresslist/?MemLoginID=" + MemLoginID,

        data: {},

        dataType: "json",

        success: function (data) {
            if (data != null && data != undefined) {
                var template = $('#AddressListContentTemplate').html();
                var str = Mustache.render(template, data, []);
                $("#ul_AddressList").html(str);
            }
        }
    });
}

//选中收货地址
function AddressSelected(addressid) {
    var MemLoginID = pageView.getCookieValue('uid');

    if (confirm("设置此地址为默认收货地址吗？")) {
        $.ajax({

            type: "GET",

            url: "/api/updateisdefault/?MemLoginID=" + MemLoginID + "&Guid=" + addressid,

            data: {},

            dataType: "json",

            success: function (data) {
                if (data.toString() != "") {
                    if (data.Data == true) {
                        if (localStorage.getItem('FromOrderMake') != null && localStorage.getItem('FromOrderMake') == "1") {

                            window.location = "/#page/OrderMake";
                        }
                        else {
                            pageView.goTo('AddressList?' + localStorage.getItem('FromOrderMake'));
                        }
                    }
                }
            }
        });
    }
}

//打开收货地址删除界面
function ManageAddressDeleteShow(id) {
    var htmlid = "div_selectbtn" + id;
    if (document.getElementById(htmlid).style.display == "none" || document.getElementById(htmlid).style.display == "") {
        $("#" + htmlid).show();
    }
    else {
        $("#" + htmlid).hide();
    }
}

//前往更新用户收货地址
function UpdateManageAddress(id) {
    localStorage.setItem('memberAddressId', id);
    window.location = "/#page/AppendAddress?" + localStorage.getItem('FromOrderMake');
}

//删除收货地址
function RemoveManageAddress(id) {


    if (!confirm("确认要删除？")) {
        return;
    }

    $.ajax({

        type: "GET",

        url: "/api/addressdel/?memberAddressId=" + id,

        data: {},

        dataType: "json",

        success: function (data) {
            if (data.return == "ok") {
                alert("删除成功！");

                pageView.goTo('AddressList?' + localStorage.getItem('FromOrderMake'));
                return false;
            }
            else {
                alert("删除失败！");
            }
        }
    });
}

//前往添加收货地址
function GoAddAddress() {

    window.location = "/#page/AppendAddress?" + localStorage.getItem('FromOrderMake');
}