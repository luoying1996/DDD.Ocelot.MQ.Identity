window.Chooseagentview = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#ChooseagentTemplate').html();
    },
    events: {

    },
    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),

        };
        var data = { title: "选择代理商", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));

        this.LoadAgentsList();

        return this;
    },
    LoadAgentsList: function () {
        AgentsList();
    }
});

//获取代理商列表
function AgentsList() {
    $.ajax({

        type: "GET",

        url: "/api/GetAgentList",

        data: { },

        dataType: "json",

        success: function (data) {
            var template = $('#AgentListTemplate').html();
            $('#div_agent').html(Mustache.render(template, data, []));
            AgentLoadCss();
        }
    });
}

function AgentLoadCss() {
    $(".agentDt").each(function () {
        $(this).find("h2").click(function () {
            var agentid = $(this).attr("agentid");
            localStorage.setItem('agentid', agentid);
            window.location = "/#page/Catalog";
        });
    });
}
