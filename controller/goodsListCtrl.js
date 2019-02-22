var goodsListCtrl = {
    scope : null,

    goodsListModel : {
        selectAll : false,
        modelArr : [], //公共的数组名
        modalTitle : null,
        search : null,
        isAdd : true,
        timeType : null,//区分上下架
        goodsID : null
    },

    //搜索选择
    optionModel : {
        classifyArr : [],
        brandArr : [],
        globalArr : [],
        statusArr : [],
        handleAllArr : [],
        handleSel : "",
        globalSel : "",
        brandSel : "",
        classifySel : "",
        statusSel : ""
    },

    originData : null,//保存原始数据

    init : function($scope){
        var self = this;
        self.scope = $scope;

        //初始化数组
        self.setOptionArr();

        self.getGoodsList();

        //初始化brandList
        self.getBrand();

        //初始化classify
        self.getClassify();

        self.onClickFun();


        //初始化绑定model
        self.scope.goodsListModel = self.goodsListModel;//商品列表
        self.scope.optionModel = self.optionModel;//搜索选项
        //self.scope.optionModel2 = self.optionModel2;//添加和修改选项

        //展开分类开关
        self.scope.switchCategory = function(curItem){
            curItem.isOpen = !curItem.isOpen;
            self.generateTableArr();
        }
    },

    //初始化对象
    initElementData : function(em){
        em.isOpen = false;
        em.selected = false;
        em.onSaleTimeCopy = utilities.formatDate(em.onSaleTime, true);
        em.offSaleTimeCopy = utilities.formatDate(em.offSaleTime, true);
        em.ontimeId = "onTime_" + em.goodsId;
        em.offtimeId = "offTime_" + em.goodsId;

        em.style = {'margin-left' : parseInt(em.level)*30 + 'px'};
        if(em.goodsSku == undefined)
        {
            em.isOpen = true;
            return;
        }
        for(var i = 0; i < em.goodsSku.length; i++){
            this.initElementData(em.goodsSku[i]);
        }
    },

    //生成table数组
    generateTableArr : function(){
        var self = this;
        self.goodsListModel.modelArr = [];

        for(var i = 0; i < self.originData.length; i++){
            self.insertIntoTableArr(self.goodsListModel.modelArr, self.originData[i]);
        }
    },

    //递归将子节点插入数组
    insertIntoTableArr : function(arr, em){
        var self = this;
        if(arr == null || em == null)
        {
            return;
        }

        arr.push(em);

        if(em.goodsSku == undefined)
        {
            return;
        }
        if(em.isOpen)
        {
            for(var i = 0; i < em.goodsSku.length; i++){
                self.insertIntoTableArr(arr, em.goodsSku[i]);
            }
        }
    },

    searchJump : function(){
        var self = this;

        self.optionModel.globalSel = '3';
        self.optionModel.statusSel = '0';

        var params = {} ;
        params.goodsType = 3;//库存不足
        params.goodsStatus = 0;//已下架

        pageController.searchChange(params);
    },

    getGoodsList : function(){
        var self = this;

        pageController.pageInit(self.scope, dataApi.API_GET_GOODS_LIST, {}, function(data){
            if(pageParams.num != 0)
            {
                var pageNum = Math.ceil(data.count / pageParams.num);
                pageController.pageNum(pageNum);
            }

            self.originData = data.goods;
            for(var i = 0; i < self.originData.length; i++){
                self.initElementData(self.originData[i]);
            }

            self.generateTableArr();
            self.scope.$apply();
        })
    },

    batchGoods : function(arr, batchMsg){
        var self = this;

        if(utilities.isObjInArr(arr))
        {
            var msgArr = [];
            for(var i = 0; i < arr.length; i++)
            {
                if(arr[i].err != '0')
                {
                    msgArr.push(arr[i].errMsg);
                }
            }

            if(msgArr.length > 0){
                var msgArrStr = msgArr.join();
                _CommonFuntion.dialog(msgArrStr);
                self.getGoodsList();
            }
            else
            {
                _CommonFuntion.dialog(batchMsg);
                self.getGoodsList();
            }

        }
        else
        {
            _CommonFuntion.dialog(batchMsg);
            self.getGoodsList();
        }
    },

    //点击事件
    onClickFun : function(){
        var self = this;

        self.scope.import = dataApi.API_IMPORT_GOODS_LIST;

        //单选
        self.scope.oneSel = function(id){
            _CommonFuntion.switchSelOne(id, self.goodsListModel, 'goodsId');
        };

        //多选
        self.scope.allSel = function(){
            _CommonFuntion.switchSelAll( self.goodsListModel);
        };

        //添加商品-跳转页面
        self.scope.addNewGoods = function(){
            postGoodsCtrl.getGoodsById(null);
            location.href = URL_CONST.EDIT_GOODS;
        };

        //修改商品-跳转页面
        self.scope.modifyGoods = function(goodsId){
            postGoodsCtrl.getGoodsById(goodsId);
            location.href = URL_CONST.EDIT_GOODS;
        };

        //搜索
        self.scope.search = function(){
            var params = {};

            if(!utilities.checkStringEmpty(self.optionModel.globalSel))
            {
                params.goodsType = self.optionModel.globalSel;
            }
            if(!utilities.checkStringEmpty(self.optionModel.brandSel))
            {
                params.brandId = self.optionModel.brandSel;
            }
            if(!utilities.checkStringEmpty(self.optionModel.classifySel))
            {
                params.catId = self.optionModel.classifySel;
            }
            if(!utilities.checkStringEmpty(self.optionModel.statusSel))
            {
                params.goodsStatus = self.optionModel.statusSel;
            }
            if(!utilities.checkStringEmpty(self.goodsListModel.search))
            {
                params.search = self.goodsListModel.search;
            }

            pageController.searchChange(params);
        };

        //批量操作
        self.scope.handleDeal = function(type)
        {
            if(!utilities.checkStringEmpty(type))
            {
                var params = {
                    "type": type
                };
                var delArrStr =  _CommonFuntion.findSelIds(self.goodsListModel, 'goodsId');
                if(delArrStr != null)
                {
                    params.goodsIds = delArrStr;
                    goodsListFun.batchDealGoods(params, function(data){

                        if(type == 1)
                        {
                            self.batchGoods(data.delArr, '删除成功');
                        }
                        if(type == 2)
                        {
                            self.batchGoods(data.dealArr, '上架成功');
                        }
                        if(type == 3)
                        {
                            self.batchGoods(data.dealArr, '下架成功');
                        }

                    });
                }
            }
        };

        //导出
        self.scope.exportData = function () {
            var bb = new Blob([document.getElementById('exportGoodsTable').innerHTML], {type: 'text/plain;charset=utf-8'});
            saveAs(bb, '商品列表.xls')
        };

        self.scope.blurOnTime = function(id, type){
            setTimeout(function(){
                self.changeTime(id, type);
            }, 300);
        };
    },

    changeTime : function(id, type){

        var curTimeVal = null;
        if(type == 1)
        {
            curTimeVal = $("#onTime_" + id).val();
        }
         if(type == 2)
        {
            curTimeVal = $("#offTime_" + id).val();
        }

        if(!utilities.checkStringEmpty(curTimeVal))
        {
            var timeStamp = JSON.stringify(utilities.formatStamp(curTimeVal) / 1000);

            if(timeStamp)
            {
                var params = {
                    "goodsId": id
                };
                var modData = {};

                if(type == 1)
                {
                    modData.on_sale_time = timeStamp;
                }
                if(type == 2)
                {
                    modData.off_sale_time = timeStamp;
                }

                params.modData = JSON.stringify(modData);

                postGoodsFun.modGoods(params, function(){})
            }
        }

    },

    //获得brandList
    getBrand : function(){
        var self = this;
        var params = {
            "startIndex" : 0,
            "num" : 0
        };
        goodsListFun.getBrandList(params, function(data){
            var brandData = data.data;
            for(var i = 0; i < brandData.length; i++)
            {
                self.optionModel.brandArr.push({
                    "id" : brandData[i].brand_id,
                    "name" : brandData[i].brand_name
                });
            }

            //self.scope.brandSel = "";
            self.scope.$apply();
        })

    },

    //获取分类
    getClassify : function(){
        var self = this;
        var params = {
            "level": 3
        };
        goodsListFun.getClassifyList(params, function(data){
            var categories = data.categories;
            for(var i =0; i < categories.length; i++)
            {
                self.optionModel.classifyArr.push({
                    "id" : categories[i].cat_id,
                    "name" : categories[i].cat_name
                })
            }

            //self.scope.classifySel = "";
            self.scope.$apply();
        })
    },

    //设置搜索选项数组
    setOptionArr : function(){
        var self = this;

        //全球商品
        //self.scope.globalSel = "";
        self.optionModel.globalArr =
        [
            {"id" : "1", "name" : "境内"},
            {"id" : "2", "name" : "境外"},
            {"id" : "3", "name" : "库存不足"}
        ];

        //状态数组
        //self.scope.statusSel = "";
        self.optionModel.statusArr =
        [
            {"id" : "1", "name" : "已上架"},
            {"id" : "0", "name" : "已下架"}
        ];

        //批量操作数组
        //self.scope.handleSel = "";
        self.optionModel.handleAllArr =
        [
            {"id" : "1", "name" : "删除"},
            {"id" : "2", "name" : "上架"},
            {"id" : "3", "name" : "下架"}
        ];
    }

};


var goodsListFun = {
    //获得分类列表
    getClassifyList : function(params, callback){
        $data.HttpRequest(dataApi.API_GET_CATEGORY, params, callback);
    },

    //获得详情
    getSingleGoods : function(params, callback){
        $data.HttpRequest(dataApi.API_GET_SINGLE_GOODS, params, callback);
    },

    //获得多级分类列表
    getEveryClassifyList : function(params, callback){
        $data.HttpRequest(dataApi.API_GET_CATEGORY, params, callback);
    },

    //获得brand列表
    getBrandList : function(params, callback){
        $data.HttpRequest(dataApi.API_GET_BRANDLIST, params, callback);
    },

    //批量处理
    batchDealGoods : function(params, callback){
        $data.HttpRequest(dataApi.API_BATCH_DEAL_GOODS, params, callback);
    }
};