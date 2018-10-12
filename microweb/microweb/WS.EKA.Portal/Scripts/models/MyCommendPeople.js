/*
    我的会员
*/

window.MyCommendPeopleView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyCommendPeopleTemplate').html();
        this.Code = '';
    },
    events: {

    },
    render: function () {
        var partial = {
            header: $('#HeaderTemplate').html(),
        };
        var data = { title: "我的会员" };
        this.$el.html(Mustache.render(this.template, data, partial));
        // $(".maskgrey1").show();

        this.GetMyCommendPeople();

        $(".maskgrey1").hide();
        return this;
    },

    GetMyCommendPeople: function () {
        var memLoginId = pageView.getCookieValue("uid");

        $.ajax({
            url: 'api/account/GetMyCommenedPeople/',
            data: {
                memLoginID: memLoginId
            },
            type: "POST",
            dataType: 'json',
            async: false,
            success: function (res) {
                console.log(res);

                if (res.RESULT != null && res.RESULT.dataTable != null && res.RESULT.data == "200") {
                    var obj = res.RESULT.dataTable;

                    var dom = $("#MyCommendPeopleDom");

                    for (var i = 0; i < obj.length; i++) {
                        var html = $("#MyCommendPeopleInnerItemTemplate").html();
                        html = html.replace("Guid", obj[i]["Guid"]);
                        html = html.replace("OriginalImge", obj[i]["Photo"]);
                        html = html.replace("Name", obj[i]["MemLoginID"]);
                        html = html.replace("Mobile", obj[i]["Mobile"]);
                        html = html.replace("Email", obj[i]["Email"]);

                        dom.append(html);
                    }
                } else {
                    $("#MyCommendPeopleNoData").show();
                }


            }
        });
    }


});
