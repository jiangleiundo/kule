/*
 * 分页控制器
 * 
 */

var pageController =
{
    api:null,
    scope : null,
    currentPage:1,
    callback:null,

    fixedSearchParams:{},
    searchParams:{},

    // 初始化页面设置
    pageInit : function($scope, api, fixedSearchParams, callback)
    {
        this.scope = $scope;
        this.api = api;
        this.callback = callback;
        this.fixedSearchParams = fixedSearchParams;
        this.currentPage = 1;
        this.searchParams = {};
        
        // 初始化选项
        $scope.pageNumSelections = [10, 20, 50, 100];

        // 初始化model
        $scope.page = {
            selectPageNum : 10,
            nowPage : 1,
            totalPage : 0,
            inputPage : 1
        };

        var self = this;
        // 初始化点击事件
        $scope.next = function()
        {
            if(self.currentPage < $scope.page.totalPage)
            {
                self.currentPage++;
                $scope.page.nowPage = self.currentPage;
                self.callApi();
            }
            else
            {
                _CommonFuntion.dialog("已经在最后一页");
            }
        };

        $scope.prev = function()
        {
            if(self.currentPage > 1)
            {
                self.currentPage--;
                $scope.page.nowPage = self.currentPage;
                self.callApi();
            }
            else
            {
                _CommonFuntion.dialog("已经在第一页");
            }
        };

        $scope.first = function()
        {
            if (self.currentPage != 1)
            {
                self.currentPage = 1;
                $scope.page.nowPage = self.currentPage;
                self.callApi();
            }
            else
            {
                _CommonFuntion.dialog("已经在第一页");
            }
        };

        $scope.last = function()
        {
            if(self.currentPage != $scope.page.totalPage)
            {
                self.currentPage = $scope.page.totalPage;
                $scope.page.nowPage = self.currentPage;
                self.callApi();
            }
            else
            {
                _CommonFuntion.dialog("已经在最后一页");
            }
        };

        $scope.jump = function()
        {
            if($scope.page.inputPage > $scope.page.totalPage || $scope.page.inputPage <= 0)
            {
                _CommonFuntion.dialog("没有此页，请输入有效的页码");
                $scope.page.inputPage = 1;
            }
            else
            {
                self.currentPage = $scope.page.inputPage;
                $scope.page.nowPage = self.currentPage;
                self.callApi();
            }
        };

        //分页变化
        $scope.change = function(){
            self.callApi();
        };

        // 进来先调用一次接口
        this.callApi();
    },

    // 页数变化时调用此函数设置数字
    pageNum : function(totalPage)
    {
        if (this.scope == null)
        {
            alert("Page controller not inited!");
            return;
        }

        this.scope.page.totalPage = totalPage;
    },

    // 当搜索条件变化的时候调用此方法
    searchChange : function(searchParam)
    {
        if (this.scope == null)
        {
            alert("Page controller not inited!");
            return;
        }

        // 恢复设置
        this.scope.page = {
            selectPageNum : 10,
            nowPage : 1,
            totalPage : 0,
            inputPage : 1
        };

        this.searchParams = searchParam;
        this.currentPage = 1;
        this.callApi();
    },

    // 访问接口
    callApi : function()
    {
        var pageParams = {
            "startIndex" : (this.currentPage - 1) * this.scope.page.selectPageNum,
            "num" : this.scope.page.selectPageNum
        };
        var params = $.extend(pageParams, this.fixedSearchParams, this.searchParams);
        $data.HttpRequest(this.api, params, this.callback);
    }
};

