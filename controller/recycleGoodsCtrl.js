
var recycleGoodsCtrl = {
    scope : null,

    goodsListModel : {
        selectAll : false,
        modelArr : [], //公共的数组名
        modalTitle : null,
        search : null,
        isAdd : true,
        timeType : null,//区分上下架
        onSaleTime : null,//
        offSaleTime : null,//
        editType : null,//区分下架理由
        stockNum : null,//库存
        goodsID : null,
        skuID : null

    },

    //搜索选择
    optionModel : {
        classifyArr : [],
        brandArr : [],
        globalArr : [],
        statusArr : [],
        handleAllArr : [],
        optionSelClassify : null,
        optionSelBrand : null,
        optionSelGlobal : null,
        optionSelStatus : null,
        handleSel : null
    },

    originData : null,//保存原始数据

    init : function($scope){
        var self = this;
        self.scope = $scope;

        //初始化数组
        self.setOptionArr();

        //初始化获得大类
        self.getGoodsList();

        //初始化brandList
        self.getBrand();

        //初始化classify
        self.getClassify();

        self.onClickFun();

        //初始化绑定model
        self.scope.goodsListModel = self.goodsListModel;//商品列表
        self.scope.optionModel = self.optionModel;//搜索选项
        self.scope.optionModel2 = self.optionModel2;//添加和修改选项

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

    getGoodsList : function(){
        var self = this;

        pageController.pageInit(self.scope, dataApi.API_GOODS_OFF_SALE_LIST, {}, function(data){
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

            //单选
            self.scope.oneSel = function(id){
                _CommonFuntion.switchSelOne(id, self.goodsListModel, 'goodsId');
            };

            //多选
            self.scope.allSel = function(){
                _CommonFuntion.switchSelAll(self.goodsListModel);
            };

            //搜索参数
            self.scope.selGlobal = function(id){
                self.optionModel.optionSelGlobal = id;
            };
            self.scope.selBrand = function(id){
                self.optionModel.optionSelBrand = id;
            };
            self.scope.selClassify = function(id){
                self.optionModel.optionSelClassify = id;
            };
            self.scope.selStatus = function(id){
                self.optionModel.optionSelStatus = id;
            };

            //
            self.scope.selHandle = function(id){
                self.optionModel.handleSel = id;
            };


            //搜索
            self.scope.search = function(words){
                var params = {};
                if(self.optionModel.optionSelGlobal != null)
                {
                    params.goodsType = self.optionModel.optionSelGlobal;
                }
                if(self.optionModel.optionSelBrand != null)
                {
                    params.brandId = self.optionModel.optionSelBrand;
                }
                if(self.optionModel.optionSelClassify != null)
                {
                    params.catId = self.optionModel.optionSelClassify;
                }
                if(self.optionModel.optionSelStatus != null)
                {
                    params.reason = self.optionModel.optionSelStatus;
                }
                if(words)
                {
                    params.search = words;
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
                        goodsListFun.batchDealGoods(params, function(){
                            if(type == 1)
                            {
                                _CommonFuntion.dialog("删除成功");
                            }
                            if(type == 2)
                            {
                                _CommonFuntion.dialog("上架成功");
                            }
                            self.getGoodsList();
                        });
                    }
                }

            };

        })
    },

    //点击事件
    onClickFun : function(){
        var self = this;

        //修改
        self.scope.modifyGoods = function(id, type){
            $("#goodsTimeModal").modal("show");
            $("#onSaleTime").val("");
            $("#offSaleTime").val("");

            self.goodsListModel.editType = type;
            if(type == 2)
            {
                self.goodsListModel.skuID = id;
            }
            else
            {
                self.goodsListModel.goodsID = id;
            }

        };

        self.scope.recycleSubmit = function(stock){

            var params = {};
            var modData = {};

            if(self.goodsListModel.editType == 2)
            {
                params.skuId = self.goodsListModel.skuID;

                modData.stock = stock;
                params.modData = JSON.stringify(modData);
                if(!utilities.checkStringEmpty(stock))
                {
                    postGoodsFun.modGoodsSku(params, function(){
                        _CommonFuntion.dialog("操作成功");
                        self.getGoodsList(self.scope);
                        $("#goodsTimeModal").modal("hide");
                    });
                }
                else
                {
                    _CommonFuntion.dialog("请输入库存数");
                }
            }
            if(self.goodsListModel.editType == 1)
            {
                var timeStr1 = $("#onSaleTime").val();
                var timeStamp1 = JSON.stringify(utilities.formatStamp(timeStr1) / 1000);

                if(timeStamp1)
                {
                    params.goodsId = self.goodsListModel.goodsID;

                    modData.on_sale_time = timeStamp1;
                  
                    params.modData = JSON.stringify(modData);

                    postGoodsFun.modGoods(params, function(){
                        _CommonFuntion.dialog("操作成功");
                        self.getGoodsList(self.scope);
                        $("#goodsTimeModal").modal("hide");
                    })

                }
                else
                {
                    _CommonFuntion.dialog("请选择上架时间");
                }
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

            self.scope.brandSel = "";
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

            self.scope.classifySel = "";
            self.scope.$apply();
        })
    },

    //设置搜索选项数组
    setOptionArr : function(){
        var self = this;

        //全球商品
        self.scope.globalSel = "";
        self.optionModel.globalArr =
            [
                {"id" : "1", "name" : "境内"},
                {"id" : "2", "name" : "境外"}
            ];

        //状态数组
        self.scope.statusSel = "";
        self.optionModel.statusArr =
            [
                {"id" : "1", "name" : "库存不足"},
                {"id" : "2", "name" : "活动到期"},
                {"id" : "3", "name" : "人工下架"}
            ];

        //批量操作数组
        self.scope.handleSel = "";
        self.optionModel.handleAllArr =
            [
                {"id" : "2", "name" : "上架"}
            ];

    }

};
