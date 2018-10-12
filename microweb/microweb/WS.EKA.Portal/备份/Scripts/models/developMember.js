window.DevelopMemberView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#DevelopMember').html();
    },

    events: {
    },

    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            
        };
        var data = { title: "发展会员", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile'), loginid: pageView.getCookieValue('uid') };

        this.$el.html(Mustache.render(this.template, data, partial));
  
        this.SetImgQrc();

        return this;
    },
    SetImgQrc: function () {
        var imageQrc = $("#imageQrc");
        var QrcUrl = "http://qr.liantu.com/api.php?text=";
        var commendUrl = "http://" + window.location.host + "/#page/QRCodeRegister?CommendPeople=" + pageView.getCookieValue('uid');
        imageQrc.attr("src", QrcUrl + commendUrl);
    },
});
