window.AgreementView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#AgreementTemplate').html();
    },
    render: function () {
        var partial = { header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(), innerFooter: $('#InnerFooterTemplate').html() };
        var data = { hasBack: true,title: "注册", btnListR: [{ name: 'home'}] };

        this.$el.append(Mustache.render(this.template, data, partial));

        return this;
    }
});