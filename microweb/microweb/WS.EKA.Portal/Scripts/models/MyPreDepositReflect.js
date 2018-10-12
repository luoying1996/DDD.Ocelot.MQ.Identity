window.MyPreDepositReflectView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyPreDepositReflectTemplate').html();
        this.Code = '';
    },
    events: {

    },
    render: function () {
        var partial = {
            header: $('#HeaderTemplate').html(),
        };
        var data = { title: "预存款提现" };
        this.$el.html(Mustache.render(this.template, data, partial));

        this.getMyBankCards();
        this.getMymoney();

        $(".maskgrey1").hide();
        return this;
    },

    //银行卡信息
    getMyBankCards: function () {
        var memLoginId = pageView.getCookieValue("uid");

        $.ajax({
            url: 'api/account/MyBankCardList/',
            data: {
                memLoginID: memLoginId,
            },
            type: "POST",
            dataType: 'json',
            cache: false,
            success: function (res) {
                console.log(res);
                var i = res.RESULT.data;
                console.log(i);

                if (i == 200) {
                    var item = res.RESULT.dataTable;

                    if (item != null) {
                        for (var i = 0; i < item.length; i++) {
                            var src = item[i]["BankName"];
                            var bankNumber = item[i]["BankAccountNumber"];
                            var str1 = bankNumber.substring(bankNumber.length - 4, bankNumber.length);//银行卡后4位

                            var str = "<span>" + src + "--" + str1 + "</span>"
                            $("#sel_preDepositReflectBank").append("<option value=\"" + item[i]["Guid"] + "\">" + str + "</option>");
                        }
                        if (item.length == 0) {
                            $("#MyPreDepositReflectTemplateError").html("您还未添加银行卡.");
                        }
                    }
                    else {
                        $("#sel_preDepositReflectBank").html("<option value=\"-1\">-请选择-</option>");
                    }
                } else {
                    $("#sel_preDepositReflectBank").html("<option value=\"-1\">-请选择-</option>");
                }
            },
        });
    },

    //预存款信息
    getMymoney: function () {
        var memLoginId = pageView.getCookieValue("uid");

        $.ajax({
            url: 'api/account/GetMemInfoByMemLoginId/',
            data: {
                memLoginID: memLoginId,
            },
            type: "POST",
            dataType: 'json',
            cache: false,
            success: function (res) {
                console.log(res);
                var i = res.RESULT.data;
                console.log(i);

                if (i == 200) {
                    var item = res.RESULT.dataTable;
                    if (item != null) {
                        $("#lab_preDepositMoney").html(item[0]["AdvancePayment"] + " ¥");
                        $("#lab_preDepositMoney").attr("mark",item[0]["AdvancePayment"]);
                    }
                } else {
                    $("#lab_preDepositMoney").html(+"0.00 ¥");
                }
            },
        });
    },

});
//提现
function MyPreDepositReflectTemplateClick() {
    var memLoginId = pageView.getCookieValue("uid");
    var guid = $("#sel_preDepositReflectBank").val();
    var money = $("#txt_preDepositReflectMoney").val();
    var remark = $("#txt_preDepositReflectRemark").val();

    var error = "";
    if (guid == "-1") error += "<div>必须选择提现银行</div>";
    if (money == "") {
        error += "<div>必须输入提现金额</div>";
    } else {
        if (isNaN(money)) {
            error += "<div>请输入合法的提现金额</div>";
        } else {
            if (parseFloat(money) > parseFloat($("#lab_preDepositMoney").attr("mark"))) {
                error += "<div>已超过可提现金额</div>";
            }
        }
    }
    
    if (error != "") {
        $("#MyPreDepositReflectTemplateError").html(error);
        return false;
    }
    $("#MyPreDepositReflectTemplateError").html("");
    
    $.ajax({
        url: 'api/account/MyPreDepositReflect/',
        data: {
            memLoginID: memLoginId,
            bankGuid: guid,
            money: money,
            remark: remark,
        },
        type: "POST",
        dataType: 'json',
        cache: false,
        success: function (res) {
            console.log(res);
            var i = res.RESULT.data;
            console.log(i);

            if (i == 200) {
                alert("申请已提交,请等待审核");
                pageView.goTo('MyReflectRecord');
            } else {
                $("#MyPreDepositReflectTemplateError").html("申请失败!");
            }
        },
    });

}
