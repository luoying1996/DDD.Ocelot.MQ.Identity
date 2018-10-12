window.MyExtensionManagerView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#MyExtensionManagerTemplate').html();       
    },
    events: {
    },

    render: function () {
        var that = this;
        var partial = {
           
        };
        var data = {  };
        this.$el.html(Mustache.render(this.template, data, partial));

        return this;
    },

});