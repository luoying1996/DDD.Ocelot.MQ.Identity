window.Invoice = Backbone.Model.extend({
    InvoiceTypeId: 1,
    InvoiceType: '',
    InvoiceHeader: '',
    InvoiceContent: '',
    HasInvoice: true
});

window.InvoiceType = Backbone.Model.extend({});

window.InvoiceTypeList = Backbone.Collection.extend({
    model: InvoiceType,
    urlRoot: 'api/order/invoicetype/list',
    url: function () {
        return this.urlRoot;
    }
});

window.InvoiceView = Backbone.View.extend({
    el: '#jqt',
    initialize: function () {
        this.template = $('#InvoiceTemplate').html();
        this.invoiceType = new InvoiceTypeList();
    },
    events: {
        'click .myinvoice .toggle': 'toggleInvoiceTemplate',
        'click .myinvoice #InvoiceBtn': 'saveInvoice'
    },
    render: function () {
        var partial = { header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html()
        };
        var data = { hasBack: true, title: "返回", btnListR: [{ name: 'home'}] };
        this.$el.append(Mustache.render(this.template, data, partial));

        this.fetchInvoiceType();



        return this;
    },
    fetchInvoiceType: function () {
        var that = this;
        $.getJSON('api/order/invoicetype/list', function (res) {
            var template = $('#InvoiceTypeTemplate').html();
            if (res.length > 0) {
                var data = [];
                for (i in res) {
                    data.push({id:i,type:res[i]});
                }
                $('.invoiceTypeList').html(Mustache.render(template, { invoicetypes: data }, []));
            }
            that.setDefaultValue();
        });
    },
    setDefaultValue: function () {
        var invoice = localStorage.getItem('invoiceitem');
        if (invoice) {
            var invoiceItem = JSON.parse(invoice);
            if (!invoiceItem.HasInvoice) {
                $('.myinvoice input[type="checkbox"]')[0].checked = false;
                $('.invoiceTemplate').hide();
            } else {
                $('.myinvoice input[type="checkbox"]')[0].checked = true;
                $('.invoiceTemplate').show();
                $('.invoiceTemplate input[type="radio"][value="' + invoiceItem.InvoiceTypeId + '"]')[0].checked = true;
                $('#invoice_headertype').val(invoiceItem.InvoiceHeader);
                $('#invoice_content').val(invoiceItem.InvoiceContent);
            }
        }
    },
    toggleInvoiceTemplate: function (e) {
        var target = $(e.currentTarget),
            checkbox = target.find('input[type="checkbox"]');
        if (!checkbox[0].checked) {
            $('.invoiceTemplate').hide();
        } else {
            $('.invoiceTemplate').show();
        }
    },

    saveInvoice: function (e) {
        var checkbox = $('.myinvoice input[type="checkbox"]'),
            invoicetype = $('.myinvoice input[type="radio"]:checked'),
            invoicehead = $('#invoice_headertype').val().trim(),
            invoicecontent = $('#invoice_content').val().trim();
        if (checkbox[0].checked) {
            if (this.validation()) {
                var invoice = new Invoice({
                    InvoiceTypeId: invoicetype.val(),
                    InvoiceType: invoicetype.next('label').text(),
                    InvoiceHeader: invoicehead,
                    InvoiceContent: invoicecontent,
                    HasInvoice: true
                });
                localStorage.setItem('invoiceitem', JSON.stringify(invoice));
                pageView.goBack();
            }
        } else {
            var invoice = new Invoice({
                HasInvoice: false
            });
            localStorage.setItem('invoiceitem', JSON.stringify(invoice));
            pageView.goBack();
        }

    },

    validation: function () {
        var flag = true,
            invoicehead = $('#invoice_headertype').val().trim(),
            invoicecontent = $('#invoice_content').val().trim();
        if (invoicehead == "") {
            $('#head_error').text('抬头不能为空'); flag = false;
        } else {
            $('#head_error').text(''); flag = true;
        }
        if (invoicehead == "") {
            $('#content_error').text('内容不能为空'); flag = false;
        } else {
            $('#content_error').text(''); flag = true;
        }
        return flag;
    }
});