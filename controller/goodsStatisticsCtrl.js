var goodsStatisticsCtrl = {
    scope : null,

    statisticsModel : {
        modelArr : [],
        saleCount: null,
        saleAmount: null,
        todaySaleCount: null,
        isInfoShow: false,
        search: null
    },

    init : function($scope){
        var self = this;
        self.scope = $scope;

        self.scope.statisticsModel = self.statisticsModel;

        self.getStatistic();

        self.onClickFun();
    },

    getStatistic : function(){
        var self = this;

        self.statisticsModel.modelArr = [];

        pageController.pageInit(self.scope, dataApi.API_GET_ALL_GOODS_STATISTIC, {}, function(data){
            if(!utilities.checkStringEmpty(pageParams.num))
            {
                var pageNumn = Math.ceil(data.goodsSaleData.count / pageParams.num);
                pageController.pageNum(pageNumn);
            }

            self.statisticsModel.modelArr = data.goodsSaleData.data;

            self.statisticsModel.saleCount = data.other.total_sale_num;
            self.statisticsModel.todaySaleCount = data.other.today_total_sale_num;
            self.statisticsModel.saleAmount = data.other.total_sale_amount;

            self.scope.$apply();

        });
    },

    onClickFun : function(){
        var self = this;

        //导出全部
        self.scope.import = dataApi.API_IMPORT_GOODS_SALE_STATISTIC;

        //搜索
        self.scope.searchGoods = function(optionSel, searchName){
            var sTime = $("#startTime-s").val();
            var eTime = $("#endTime-s").val();

            var params = {};
            if(!utilities.checkStringEmpty(optionSel))
            {
                params.goodsType = optionSel;
            }
            if(!utilities.checkStringEmpty(searchName))
            {
                params.words = searchName;
            }
            if(!utilities.checkStringEmpty(sTime))
            {
                params.beginTime = utilities.formatStamp(sTime) / 1000;
            }
            if(!utilities.checkStringEmpty(eTime))
            {
                params.endTime = utilities.formatStamp(eTime) / 1000;
            }

            pageController.searchChange(params);
        };

        //查看
        self.scope.checkInfo = function(id){
            goodsStatisticsInfoCtrl.getInfoId(id);
            self.statisticsModel.isInfoShow = true;
        };

        //返回
        self.scope.detialBack = function(){
            self.statisticsModel.isInfoShow = false;
        };

        //导出
        self.scope.toExcelStatistics = function () {
            var bb = new Blob([document.getElementById('exportable5').innerHTML], {type: 'text/plain;charset=utf-8'});
            saveAs(bb, '商品统计.xls')
        }

    }

};

var goodsStatisticsInfoCtrl = {
    scope : null,

    statisticsInfoModel : {
        modelArr : [],
        curID : null
    },

    init : function($scope){
        var self = this;
        self.scope = $scope;

    },

    getInfoId : function(id){
        var self = this;
        self.statisticsInfoModel.curID = id;

        self.getGoodsInfo();
    },

    getGoodsInfo : function(){
        var self = this;
        if(!utilities.checkStringEmpty(self.statisticsInfoModel.curID))
        {
            var params = {
                "catId": self.statisticsInfoModel.curID
            };
            pageController.pageInit(self.scope, dataApi.API_GET_GOODS_STATISTIC_INFO, params, function(data){
                if(!utilities.checkStringEmpty(pageParams.num))
                {
                    var pageNumn = Math.ceil(data.goodsSaleData.count / pageParams.num);
                    pageController.pageNum(pageNumn);
                }

                self.statisticsInfoModel.modelArr = data.goodsSaleData.data;

                self.scope.statisticsInfoModel = self.statisticsInfoModel;
                self.scope.$apply();
            })
        }
    }

};