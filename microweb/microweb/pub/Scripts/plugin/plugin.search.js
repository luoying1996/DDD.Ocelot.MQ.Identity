; (function ($) {
    if (!window.Plugins) window.Plugins = {};
    Plugins.SearchPlugin = function (el, options) {
        if (options === undefined) options = {};

       // var template = '<div class="search"><input type="search" placeholder="请输入商品名称" name="keyword" class="keyword" id="keyword"/><input type="submit" value="搜商品" class="search-button" autocomplete="off"><span class="red errorInfo" style="display:inline-block;"></span></div>';

        var template = '<div class="srchWord search"><div class="srchInput"><input type="search" name="keyword" id="keyword" autocomplete="off" placeholder="请输入产品名称" /></div></div><div class="srchButton"><input type="submit" class="srchIcon  search-button" value></div>';

         
        this.defaults = {
            autoComplete: false,//need help of jquery.autocomplete.js
            usingLocalstorage: true,
            searchPageID: 'SearchList',
            pageIndexKey: 'searchPageIndex',
            keyWordKey: 'keyword',
            placeholder: '请输入商品名称',
            fetchNamesUrl: 'api/product/namelist/',
            id: 'keyword',
            productCategoryKey: 'productcategoryid',
            isGlobalSearch: false
        };

        var container = $(el),
            element = $(template),
            searchBox = element.find('input[type="search"]'),
            searchButton = element.find('.search-button'),
            errorInfo = element.find('.errorInfo'),
            vars = $.extend({}, this.defaults, options),
            methods = {
                init: function () {
         
                    searchBox.attr('id', vars.id).attr('placeholder', vars.placeholder);
                    container.html(element);
                    searchButton.unbind('click.search').bind('click.search', function (e) {
                        methods.setSearchParameter(e);
                    });

                    searchBox.unbind('change.text').bind('change.text', function (e) {
                        methods.checkUserInput(e);
                    });

                    searchBox.unbind('keypress.search').bind('keypress.search', function (e) {
                        methods.setSearchParameterOnEnter(e);
                    });

                    if (vars.autoComplete) {
                        methods.autoComplete($('#' + vars.id));
                    }
                         
                },
                     
                setSearchParameter: function (e) {
          
                    var target = $(e.currentTarget),
                        keyword = searchBox.val().trim();
                    errorInfo.text('');
                    if (keyword == "") {
                        errorInfo.text('输入不能为空');
                        return;
                    }

                    localStorage.setItem(vars.pageIndexKey, 1);
                    localStorage.setItem(vars.keyWordKey, keyword);
                    localStorage.setItem('pageCount', 6);
                    localStorage.setItem('orderType', 'SaleNumber');
                    localStorage.setItem('isASC', true);

                    if (vars.isGlobalSearch)
                        localStorage.setItem(vars.productCategoryKey, -1);

                    pageView.goTo(vars.searchPageID);
                },

                setSearchParameterOnEnter: function (e) {
                    if (e.keyCode != 13) return;
                    methods.setSearchParameter(e);
                },

                autoComplete: function (searchBox) {

                    $.getJSON(vars.fetchNamesUrl, function (data) {
                        searchBox.autocomplete(data, {
                            formatItem: function (row, i, max) {
                                return row.Name;
                            },

                            formatMatch: function (row, i, max) {
                                return row.PYChar;
                            },
                            formatResult: function (row) {
                                return row.Name;
                            }
                        });
                        searchBox.autocomplete(data, {
                            formatItem: function (row, i, max) {
                                return row.Name;
                            },

                            formatMatch: function (row, i, max) {
                                return row.PYName;
                            },
                            formatResult: function (row) {
                                return row.Name;
                            }
                        });
                        searchBox.autocomplete(data, {
                            formatItem: function (row, i, max) {
                                return row.Name;
                            },

                            formatMatch: function (row, i, max) {
                                return row.Name;
                            },
                            formatResult: function (row) {
                                return row.Name;
                            }
                        });
                    });
                },

                checkUserInput: function (e) {
                    var target = $(e.currentTarget),
                        val = target.val();
                    if (val === "" || val.trim() != "") {
                        errorInfo.text("");
                    }
                }
            };

        methods.init();
    }
})(jQuery);