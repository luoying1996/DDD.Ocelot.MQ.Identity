/*
编辑会员信息管理用到JS
*/

window.MemberMessageView = Backbone.View.extend({
    el: '#jqt',
    initialize: function () {
        this.template = $('#MemberMessageTemplate').html();
        this.MemLoginID = pageView.getCookieValue('uid');
    },
    events: {

    },
    render: function () {
        var partial = { header: $('#HeaderMembercenterTemplate').html(), footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html()
        };

        var data = { title: "个人资料"};
        this.$el.html(Mustache.render(this.template, data, partial));

        this.LoadMemberMessage();

        return this;
    },
    LoadMemberMessage: function () {
        MemberMessageShow(this.MemLoginID);
    }
});

//按用户名获取用户资料
function MemberMessageShow(MemLoginID) {
    if (MemLoginID == undefined || MemLoginID == "") {
        window.location = "/#page/Login";
    }

    $.ajax({

        type: "GET",

        url: "/api/account/" + MemLoginID,

        data: {},

        dataType: "json",

        success: function (data) {
            if (data.toString() != "") {

                var template = $('#MemberMessageShowTemplate').html();
                var str = Mustache.render(template, data, []);
                $("#div_MemberMessage").html(str);
            }
        }
    });
}

function MemberMessageGoManageAddress() {

    window.location = "/#page/ManageAddress";
}

function LoginOut() {
    pageView.logout();
}

//前往选择收货地址
function GoManageAddress(type) {
    localStorage.setItem('backurl', '/#page/MemberMessage');

    window.location = "/#page/ManageAddress";
}