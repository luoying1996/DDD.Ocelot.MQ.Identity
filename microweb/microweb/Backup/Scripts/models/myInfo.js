window.UserInfo = User.extend({
    defaults: {
        MemLoginID: '',
    },
    urlRoot: 'api/account/',
    url: function () {
        return this.urlRoot + pageView.getCookieValue('uid');
    }
});


window.UserXG = User.extend({
    defaults: {
        MemLoginID: '',
        Email: '',
        RealName: '',
        QQ: ''
    },
    urlRoot: 'api/UpdateAccount',
    url: function () {
        return this.urlRoot;
    }
});


window.UserInfoView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.model = new UserInfo();
        this.template = $('#MyInfoTemplate').html();
        //this.memLoginId = pageView.getCookieValue('uid');
    },

    events: {
        'click a.exit': 'logout',
        'click #myMenu a[action="myCollect"]': 'renderCollect',
        'click #myMenu a[action="myOrder"]': 'renderMyOrder',
        'click a.mymsg,#myMenu a[action="myMsg"]': 'renderMyMessage',
        'click #myMenu a[action="myCart"]': 'renderMyCart',
        'click #reg_button': 'reg_button'

    },

    render: function () {
        var partial = { header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),
            innerFooter: $('#InnerFooterTemplate').html() 
        };
        var data = { weixinhao: localStorage.getItem('weixinhao'), title: "个人中心", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };
        this.$el.html(Mustache.render(this.template, data, partial));
        if (pageView.getCookieValue('uid') == undefined || pageView.getCookieValue('uid') == null) {
            window.location = "/#page/Login";
            return;
        }


		this.fetchUserInfo();
		var agentId = $('#hagentId').val();
		this.GetOrderStateCount(pageView.getCookieValue('uid'), agentId);
        $(".MemOrder li a").click(function () {
            localStorage.setItem("orderType", $(this).attr("orderType"));
        });
        return this;
    },

    fetchUserInfo: function () {
        var that = this ;

        this.model.fetch({
            success: function () {

                $("#MemLoginID").html(that.model.get("MemLoginID"));
                $("#MemPhoto").attr("src", that.model.get("Photo"));
                $("#AdvancePayment").html(that.model.get("AdvancePayment"));
                $("#Score").html(that.model.get("Score"));
                $("#RankScore").html(that.model.get("RankScore"));
            }
        });

        $('.maskgrey1').hide(50);
 
    },

    logout: function () {
        pageView.logout();
    },

    renderCollect: function () {
        pageView.goTo('MyCollect');
    },

    renderMyOrder: function () {
        pageView.goTo('MyOrder');
    },

    renderMyCart: function () {
        pageView.goTo('MyCart');
    },

    renderMyMessage: function () {
        localStorage.setItem('messagePageIndex', 1);
        pageView.goTo('MyMessage');
    },
    reg_button: function () {

    if(this.validation())
    {
        var Userxg = new UserXG();
        Userxg.set({
            MemLoginID: pageView.getCookieValue('uid'),
            Email: $("#Email").val(),
            RealName: $("#RealName").val(),
            QQ: $("#QQ").val()
        });

        Userxg.save('', '', {
            success: function (model, res) {
                if(res && res == 200)
                {
                  alert("保存成功");
                  pageView.goTo('MyUserInfo');
                }
            }
        });
     }
    },
       validation: function () {
        var email = $("#Email").val(),
            QQ = $('#QQ').val(),
            RealName =$('#RealName').val(),
            flag = true;
        $('#usernameError').text('');
        $('#passwordError').text('');
        $('#passwordConfirmError').text('');
        $('#emailError').text('');

        if (QQ != "" && !(/^\d{5,10}$/.test(QQ))) {
            $('#emailError').text('QQ填写错误');
            flag = false;
        }
        if (email != "" && !(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-z][a-z.]{2,8}$/.test(email))) {
            $('#emailError').text('邮箱格式错误！');
            flag = false;
        }

        if (QQ == "" || email == "" || RealName == "") {
            $('#emailError').text('必填项不能为空');
            flag = false;
        }
        return flag;
       },
   
       GetOrderStateCount: function (MemLoginID,AgentID) {
           $.ajax({
               type: "GET",
               url: "/api/getfahuoandshouhuocount/",
               data: {
                   MemLoginID: MemLoginID,
                   agentID: AgentID
               },
               dataType: "json",
               success: function (result) {
                   if (result.toString() != "") {
                       var all = result.Data.all,
                           fukuan = result.Data.fukuan,
                           fahuo = result.Data.fahuo,
                           shouhuo = result.Data.shouhuo,
                           pingjia = result.Data.pingjia;
                       tuikuanhuo = result.Data.tuikuanhuo;

                       if (parseInt(fahuo) >= 0) {
                           $("#a_pfk").append("<p>待付款</p><b>" + fukuan + "</b>");
                       }

                       if (parseInt(fahuo) >= 0) {
                           $("#a_pfh").append("<p>待发货</p><b>" + fahuo + "</b>");
                       }

                       if (parseInt(shouhuo) >= 0) {
                           $("#a_psh").append("<p>待收货</p><b>" + shouhuo + "</b>");
                       }
                       if (parseInt(pingjia) >= 0) {
                           $("#a_ppj").append("<p>待评价</p><b>" + pingjia + "</b>");
                       }
                       if (parseInt(pingjia) >= 0) {
                           $("#a_ptkh").append("<p>退款退货</p><b>" + tuikuanhuo + "</b>");
                       }

                   }
               }
           });
       }
});