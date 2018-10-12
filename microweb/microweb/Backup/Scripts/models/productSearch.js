
window.ProductSearch = Backbone.Model.extend({
    defaults: {}
});

window.KeyWordsList = Backbone.Collection.extend({
    model: ProductSearch,
    urlRoot: 'api/getKeyWords/',
    url: function () {
        console.log(this.urlRoot);
        return this.urlRoot;
    }
});

window.ProductSearchView = Backbone.View.extend({
    el: "#jqt",
    initialize: function () {
        this.template = $('#ProductSearch').html();
        this.collection = new KeyWordsList();
    },

    events: {
        'click .E-SearBtn': 'SearBtnClick',
        'click .SearchBtn': 'SearchBtn'
    },

    render: function () {
        var that = this;
        var partial = {
            header: $('#HeaderTemplate').html(), footer: $('#FooterTemplate').html(),

        };
        var data = { title: "搜索", loginUrl: localStorage.getItem('loginUrl'), mobile: localStorage.getItem('mobile') };

        this.$el.html(Mustache.render(this.template, data, partial));

        this.GetKeyWords();
        this.SetCookie();
        return this;
    },

    //获取热门搜索关键字
    GetKeyWords: function () {
		var that = this;
		var agentId = $('#hagentId').val();
        this.collection.fetch({
			data: {
				AgentID: agentId
            },
            success: function () {
                var keywords = that.collection.models[0].get('Data');
                var template = $('#KeyWordsModel').html();
                var data = { keywords: keywords }
                $.each(keywords, function (index, k) {
                    k.Name1 = encodeURI(k.Name);
                });

                $("#ul_KeyWordsList").html(Mustache.render(template, data, []));
            }
        });
    },

    //按照输入的商品名臣搜索
    SearBtnClick: function () {
        var name = $('.E-SearText').val();
        //document.cookie = "name=value;path=cookieDir";
        document.cookie = name + '=' + name;
        if (name == '') {
            alert('请输入商品名称');
            return;
		} else {
			var agentId = $('#hagentId').val();
            $.ajax({
                type: 'Get',
                url: 'api/keywordsexist/',
                async: false,
                data: {
					KeyWords: name,
					AgentID: agentId
                },
                dataType: 'json',
                success: function (data) {
                    if (data.Data != null) {
                        UpdateKeyWordCount(data.Data.Count, data.Data.Guid);
                    } else {
                        InsertKeyWord(name)
                    }
                }, error: function (err) {
                    alert('网络故障');
                }
            });
        }
        pageView.goTo('SearchList?' + encodeURI(name))
    },
    SearchBtn: function () {
        //清除
        $('.historyList ul li').remove();
        var strCookie = document.cookie;
        if (strCookie == "") {
            return;
        }
        var arrCookie = strCookie.split(';');
        for (var i = 0; i < arrCookie.length ; i++) {
            var arr = arrCookie[i].split('=');
            //name  和 key 相同时 清除
            if ($.trim(arr[0]) == $.trim(arr[1])) {
                document.cookie = arr[0] + "=;expires=" + (new Date(0)).toGMTString();
            }
        }
    },
    //读取Cookie添加历史搜索记录
    SetCookie: function () {
        var strCookie = document.cookie;
        if (strCookie == "") {
            return;
        }
        var arrCookie = strCookie.split(';');
        for (var i = arrCookie.length - 1; i >= 0 ; i--) {
            if (arrCookie.length - i > 8) {
                return;
            }
            var arr = arrCookie[i].split('=');

            if ($.trim(arr[0]) == $.trim(arr[1])) {
                var strHtml = "<li><a href=\"/#page/SearchList?" + encodeURI(arr[1]) + "\">" + arr[1] + "</a></li>";
                $(".historyList ul").append(strHtml);
            }


        }
    },
});

//搜索商品存在时，更改搜索次数
function UpdateKeyWordCount(count, guid) {
	var agentId = $('#hagentId').val();
    $.ajax({
        type: 'Post',
        url: 'api/UpdateKeyWordsCountByGuid/',
        data: {
            Guid: guid,
			Count: parseInt(count) + 1,
			AgentID: agentId
        },
        async: false,
        dataType: 'json',
        success: function (res) {
        },
    });

};
//搜索商品不存在时，新增搜搜索关键字
function InsertKeyWord(name) {
    //api/UpdateKeyWordsCountByGuid/
	var agentId = $('#hagentId').val();
    var a = name;
    $.ajax({
        type: 'Post',
        url: 'api/AddKeyWords/',
        data: {
            keyWords: name,
			MemLoginID: pageView.getCookieValue('uid'),
			AgentID: agentId
        },
        async: false,
        dataType: 'json',
        success: function (res) {
        },
    });
};
