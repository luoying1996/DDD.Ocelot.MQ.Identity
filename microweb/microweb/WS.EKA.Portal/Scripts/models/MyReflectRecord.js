window.MyReflectRecordView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyReflectRecordTemplate').html();
        this.Code = '';
    },
    events: {

    },
    render: function () {
        var partial = {
        };
        var data = {  };
        this.$el.html(Mustache.render(this.template, data, partial));

        MyReflectRecord();
        $(".maskgrey1").hide();
        return this;
    },
});

function MyReflectRecord() {
    var memLoginId = pageView.getCookieValue("uid");
    //alert("kaishi---" + memLoginId);
    $.ajax({
        url: 'api/account/MyReflectRecord/',
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
                        var template = $('#MyReflectRecordInnerItemTemplate').html();
                        template = template.replace("Guid", item[i]["Guid"]);
                      
                        template = template.replace("Date", item[i]["Date"]);
                        template = template.replace("OperateMoney", item[i]["OperateMoney"]);
                        template = template.replace("OperateStatus", item[i]["OperateStatus"]==1?"已提现":"审核中");

                        var str = item[i]["Account"];
                        template = template.replace("Account", str.substring(str.length - 4, str.length));

                        template = template.replace("OriginalImge", item[i]["Bank"] == "工行" ? "/Images/yh1.jpg" : "/Images/yh2.jpg");


                        $("#MyReflectRecordDom").append(template);
                    }
                } else {
                    $("#MyReflectRecordNoData").show();
                }



            } else {
                alert("网络错误!");
            }

        }
    });
}

