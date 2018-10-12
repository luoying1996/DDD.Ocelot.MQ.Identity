;(function ($) {
    if(!window.Plugins)window.Plugins = {};
    Plugins.PagingPlugin = function (el,options) {
        if (options === undefined) options = {};

        //var sample = $('<div class="pagingPlugin"><a class="pageLink prev"><span></span>上一页</a><span class="rectage">1/1</span><a class="pageLink next">下一页<span></span></a><br><br><div class="pagelist"><a index="1">1</a></div><br><br></div>');
        
        var sample=$('<div><a rel="nofollow"><span class="bg-button pageLink prev">上一页</span></a><p class="new-tbl rectage"><span>1/1</span></p><a rel="nofollow"><span class="bg-button pageLink next">下一页</span></a></div>');

        this.defaults = {
            template: $(sample),
            allCount:1,
            pageSize:5,
            usingLocalStorage:true, //save pageIndex in localStorage to keep page number when you refresh
            pageIndexKey:'pageIndex',
            startPageIndex:1,
            pageNumberCount:5,
            currentPageIndex:1,
            prevCall:null,
            nextCall:null,
            numberClickCall:null
        };

        var container = $(el),
            vars = $.extend({}, this.defaults, options),
            element = $(vars.template),
            currentIndex = vars.usingLocalStorage?(+localStorage.getItem(vars.pageIndexKey)):vars.currentPageIndex,
            startPageIndex = vars.startPageIndex,
            allCount = vars.allCount,
            pageSize = vars.pageSize,
            pageNumberCount = vars.pageNumberCount,
            pageCount = Math.ceil(vars.allCount / vars.pageSize),
            prevLink = element.find('.prev'),
            nextLink = element.find('.next'),
            buttonLink = element.find('.pageLink'),
            numberListElement = element.find('.pagelist'),
            pageNumber = _.range(1, Math.min(pageCount, pageSize) + 1),  //[1,2,3..pagesize]
            methods = {
                init:function(){
                    
                    currentIndex = vars.usingLocalStorage?(+localStorage.getItem(vars.pageIndexKey)):vars.currentPageIndex;

                    container.html(sample);
                    
                    element.find('.rectage').html('1/'+pageCount);
                    
                    methods.refresh();

                    prevLink.unbind('click.prev').bind('click.prev',function(e){
                        if(vars.prevCall&&typeof vars.prevCall === "function")
                            vars.prevCall(e);
                        if(prevLink.hasClass('disable'))return;
                        methods.goPrev();
                    });

                    nextLink.unbind('click.next').bind('click.next',function(e){
                        if(vars.nextCall&&typeof vars.nextCall === "function")
                            vars.nextCall(e);
                        if(nextLink.hasClass('disable'))return;
                        methods.goNext();
                    });

                    $('.pagelist a').die('click.number').live('click.number',function(e){
                        if(vars.numberClickCall && typeof vars.numberClickCall === "function")
                            vars.numberClickCall(e);
                        var target = $(e.currentTarget),
                            index = target.attr('index');
                        currentIndex = +index;
                        if(vars.usingLocalStorage)
                            localStorage.setItem(vars.pageIndexKey,currentIndex);
                        methods.refresh();
                        
                     });

                },

                refresh:function(){
                    methods.setPagingButton();
                    methods.setPagingNumber();
                    methods.setRectage();
                },

                goPrev:function(){
                    currentIndex -= 1;
                    if(vars.usingLocalStorage)
                        localStorage.setItem(vars.pageIndexKey,currentIndex);
                    methods.refresh();
                },

                goNext:function(){
                    currentIndex += 1;
                    if(vars.usingLocalStorage)
                        localStorage.setItem(vars.pageIndexKey,currentIndex);
                    methods.refresh();
                },

                setPagingButton:function(){
                    buttonLink.removeClass('disable').children('span').show();
                    if(currentIndex==startPageIndex) //at first page
                        methods.disablePrev();
                    
                    if(currentIndex == pageCount) //at last page
                       methods.disableNext();
                },

                setPagingNumber:function(){
                    if(pageCount<=pageNumberCount){
                        methods.renderNumberList();
                        return;
                    }

                    if(currentIndex > Math.ceil(pageNumberCount/2) && currentIndex < pageCount-Math.ceil(pageNumberCount/2-1)){
                        var before = Math.ceil(pageNumberCount/2-1); //up
                        var after = Math.floor(pageNumberCount / 2); //down

                        pageNumber = [currentIndex];

                        for (i = 1; i <= before; i++) {
                            pageNumber.unshift(currentIndex - i);
                        }
                        for (i = 1; i <= after; i++) {
                            pageNumber.push(currentIndex + i);
                        }
                    }else if(currentIndex >= pageCount-Math.ceil(pageNumberCount/2-1)){
                        pageNumber = _.range(pageCount-pageNumberCount+1,pageCount+1);
                    }else{
                        pageNumber = _.range(1, pageNumberCount + 1);
                    }

                    methods.renderNumberList();
                },

                setRectage:function(){
                    if(vars.usingLocalStorage){
                        currentIndex = +localStorage.getItem(vars.pageIndexKey);
                    }
                    element.find('.rectage').html(currentIndex+'/'+pageCount);
                },

                renderNumberList:function(){
                    var htmlContent = '';
                    for (i in pageNumber) {
                        htmlContent += '<a index="' + pageNumber[i] + '">' + pageNumber[i] + '</a>';
                    }
                    numberListElement.html(htmlContent);
                    numberListElement.find('a[index="' + currentIndex + '"]').addClass('gray');
                },

                disablePrev:function(){
                    prevLink.addClass('disable').children('span').hide();
                },

                disableNext:function(){
                    nextLink.addClass('disable').children('span').hide();
                }
            
            };

            this.refresh = methods.refresh;

            methods.init();
    }

})(jQuery);