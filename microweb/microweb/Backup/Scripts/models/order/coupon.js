window.Activity = Backbone.Model.extend({});

window.ActivityList = Backbone.Collection.extend({
    model: Activity,
    urlRoot: 'api/promotionbyprice/',
    url: function () {
        return this.urlRoot + localStorage.getItem('allPrice');
    }
});

window.CouponView = Backbone.View.extend({
    el: '#jqt',
    initialize: function () {
        this.template = $('#CouponTemplate').html();
        this.activities = new ActivityList();
    },

    events: {
        'click .promotionList input[type="radio"]': 'toggleCouponInput',
        'click .promotionList #CouponSubmit': 'saveCoupon',
        'click .promotionList input[type="checkbox"]': 'toggleInputField'
    },

    render: function () {
        var partial = { header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html()
        };
        var data = { hasBack: true, title: "返回", btnListR: [{ name: 'home'}] };

        this.$el.append(Mustache.render(this.template, data, partial));

        this.fetchActivities();

        return this;
    },
    fetchActivities: function () {
        var that = this;
        this.activities.fetch({
            success: function () {
                if (that.activities.length == 0) {
                    var template = $('#EmptyPromotionListTemplate').html();
                    $('.promotionList').html(Mustache.render(template, [], []));
                    return;
                } else {
                    var template = $('#PromotionListTemplate').html();
                    $('.promotionList').html(Mustache.render(template, { coupons: that.activities.toJSON() }, []));
                    $('.couponInput').hide();
                }
            }
        });
    },
    toggleCouponInput: function (e) {
        var target = $(e.currentTarget),
            canUse = target.closest('ul').attr('canuse');
        if (canUse == '0') {
            $('.couponInput').hide();
        } else {
            $('.couponInput').show(); $('.couponInput input').val('');
            pageView.myScroll.scrollToElement('.couponInput', 100);
        }
    },

    toggleInputField: function (e) {
        var checkbox = $('.promotionList input[type="checkbox"]')[0];
        if (checkbox.checked) {
            $('.couponInput p').show();
        } else {
            $('.couponInput p').hide();
        }
    },

    saveCoupon: function (e) {
        var ticketcode = $('.promotionList #couponID').val().trim(),
            couponname = $('.promotionList input[type="radio"]:checked').next('label').find('.couponname').text(),
            activityGuid = $('.promotionList input[type="radio"]:checked').attr('id'),
            checkbox = $('.promotionList input[type="checkbox"]')[0],
            hascoupon = !($('.couponInput').css('display') == 'none');
        if (!hascoupon || !checkbox.checked) {
            localStorage.setItem('couponitem', JSON.stringify({ activityGuid: activityGuid, couponname: couponname}));
            pageView.goBack();
        } else {
            $.getJSON('api/FavourTicketVerify/', { ticketCode: ticketcode }, function (res) {
                if (res == true) {
                    localStorage.setItem('couponitem', JSON.stringify({ activityGuid: activityGuid, ticketcode: ticketcode, couponname: couponname }));
                    pageView.goBack();
                } else {
                    alert('此优惠券错误，请重新输入！');
                    $('.couponInput input').val('');
                }
            });
        }
    }
});