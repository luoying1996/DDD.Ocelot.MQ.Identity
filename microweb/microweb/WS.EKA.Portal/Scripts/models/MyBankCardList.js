window.MyBankCardListView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyBankCardListTemplate').html();
        this.Code = '';
    },
    events: {

    },
    render: function () {
        var partial = {  };
        var data = { };
        this.$el.html(Mustache.render(this.template, data, partial));

        MyBankCardList();
        $(".maskgrey1").hide();
        return this;
    },
});

function MyBankCardList() {
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
                        var template = $('#MyBankCardListInnerItemTemplate').html();
                        template = template.replace("Guid", item[i]["Guid"]);
                        template = template.replace("BankAccountName", item[i]["BankAccountName"]);
                        var str = item[i]["BankAccountNumber"];
                        template = template.replace("BankAccountNumber", str.substring(str.length - 4, str.length));

                        template = template.replace("OriginalImge", item[i]["BankName"] == "工行" ? "/Images/yh1.jpg" : "/Images/yh2.jpg");


                        $("#MyBankCardListDom").append(template);
                    }
                } else {
                    $("#MyBankCardListNoData").show();
                } 
                


            } else {
                alert("网络错误!");
            }

        }
    });
}