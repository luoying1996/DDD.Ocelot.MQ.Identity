window.MyCreateBankCardView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyCreateBankCardTemplate').html();
        this.Code = '';
    },
    events: {

    },
    render: function () {
        var partial = {
            header: $('#HeaderTemplate').html(),
        };
        var data = { title: "新增银行卡" };
        this.$el.html(Mustache.render(this.template, data, partial));

        $(".maskgrey1").hide();
        return this;
    },
});

function MyCreateBankCardTemplateClick() {
    var memLoginId = pageView.getCookieValue("uid");
    var bankName = $("#sel_bankName").val();
    var bankAccountName = $("#txt_bankAccountName").val();
    var bankCard = $("#txt_bankCard").val();
    var confirmBankCard = $("#txt_confirmBankCard").val();
    var payPwd = $("#txt_payPwd").val();

    var error = "";
    if (bankName == "" || bankName=="-1") {
        error += "<div>请选择开户银行</div> ";
    }
    if (bankAccountName == "" ) {
        error += "<div>请填写开户人姓名</div>";
    }
    if (bankCard == "") {
        error += "<div>请填写银行账号</div>";
    }
    if (confirmBankCard == "") {
        error += "<div>请填写确认银行账号</div>";
    }
    if(confirmBankCard != ""&&bankCard != ""&&confirmBankCard!=bankCard)
    {
        error += "<div>两次填写的银行卡账号不一致</div>";
    } 

    if (payPwd == "") {
        error += "<div>请填写支付密码</div>";
    }
   
    if (error != "") {
        $("#MyCreateBankCardTemplateError").html(error);
        return false;
    } else {
        $("#MyCreateBankCardTemplateError").html("");
    }

    $.ajax({
        url: 'api/account/MyCreateBankCard/',
        data: {
            memLoginID: memLoginId,
            bankName: bankName,
            bankAccountName: bankAccountName,
            bankAccountNumber: bankCard,
            payPwd: payPwd,
        },
        type: "POST",
        dataType: 'json',
        cache: false,
        success: function (res) {
            console.log(res);
            var i = res.RESULT.data;
            console.log(i);

            if (i == 200) {
                alert("添加银行卡成功");
                location.href = "/#page/MyBankCardList";
            } else {
                if (i == "300") $("#MyCreateBankCardTemplateError").html("添加失败!");
                if (i == "201") $("#MyCreateBankCardTemplateError").html("网络错误,请重新登录之后再尝试操作!");//签名错误
                if (i == "202") $("#MyCreateBankCardTemplateError").html("网络错误,请重新登录之后再尝试操作!");//用户不存在或者已经下线
                if (i == "203") $("#MyCreateBankCardTemplateError").html("请检查是否存在不允许为空的空值!");
                if (i == "204") $("#MyCreateBankCardTemplateError").html("未设置支付密码,设置支付密码之后再操作!");
                if (i == "205") $("#MyCreateBankCardTemplateError").html("支付密码错误!");
                if (i == "206") $("#MyCreateBankCardTemplateError").html("该银行卡已经添加,请勿重复添加!");

            }

        }
    });
}