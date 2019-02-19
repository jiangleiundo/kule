/**
 * Created by CN on 2016/6/23.
 */
var goodsClassificationCtrl = {
    scope : null,

    goodsTypeModel : {
        selectAll : false,
        modalTitle : null,
        PicUrl : null,
        classIfyName : null,
        classIfySort : null,
        level : null,
        handleType : null,//判断添加修改1：添加大类，2添加分类，3修改
        goodsTypeArr : []
    },

    originData : null,//存储原始数据
    curClassifyId : null,//当前修改分类的ID
    curLevel : null,//当前修改分类的等级

    init : function ($scope) {
        this.scope = $scope;
        var self = this;

        //初始化获得大类
        self.getGoodsClassify($scope);

        self.scope.goodsTypeModel = self.goodsTypeModel;

        //展开分类开关
        $scope.switchCategory = function(curItem){
            curItem.isOpen = !curItem.isOpen;
            self.generateTableArr();
        }
    },

    //初始化对象
    initElementData : function(em){
        em.isOpen = false;
        if(!utilities.checkStringEmpty(em.cat_icon))
        {
            em.cat_icon = utilities.isContains(em.cat_icon)? em.cat_icon : BASE_IMG_URL + em.cat_icon;
        }

        em.style = {'margin-left' : parseInt(em.level)*20 + 'px'};
        if(em.child == undefined)
        {
            em.isOpen = true;
            return;
        }
        for(var i = 0; i < em.child.length; i++){
            this.initElementData(em.child[i]);
        }
    },

    //生成table数组
    generateTableArr : function(){
        var self = this;
        self.goodsTypeModel.goodsTypeArr = [];

        for(var i = 0; i < self.originData.length; i++){
            self.insertIntoTableArr(self.goodsTypeModel.goodsTypeArr, self.originData[i]);
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

        if(em.child == undefined)
        {
            return;
        }
        if(em.isOpen)
        {
            for(var i = 0; i < em.child.length; i++){
                self.insertIntoTableArr(arr, em.child[i]);
            }
        }
    },

    //获取分类
    getGoodsClassify : function($scope){
        var self = this;
        var params = {
            "parentId" : 0,
            "level" : 2
        };

        goodsClassifyFun.getGoodsClassifyOne(params, function(data){

            self.originData = data.categories;
            for(var i = 0; i < self.originData.length; i++){
                self.initElementData(self.originData[i]);
            }

            self.generateTableArr();
            self.scope.$apply();

            //删除分类
            $scope.delClassify = function(id, num)
            {
                if(num > 0)
                {
                    _CommonFuntion.dialog("该分类中还有商品，不能删除");
                }
                else
                {
                    var params = {};
                    params.catIds = '['+ id +']';
                    goodsClassifyFun.delClassifyOne(params, function(){
                        _CommonFuntion.dialog("删除成功");
                        self.getGoodsClassify($scope);//添加完成刷新数据
                    })
                }
            };

            //添加大类
            $scope.addGoodsClassifyOne = function(){
                $("#goodsClassifyModal").modal("show");
                self.goodsTypeModel.modalTitle = "添加商品一级分类";
                self.goodsTypeModel.handleType = 1;
                self.goodsTypeModel.classIfyName = null;
                self.goodsTypeModel.classIfySort = null;
                self.goodsTypeModel.level = 0;
                self.goodsTypeModel.PicUrl = null;
                $scope.showPicUrl = self.goodsTypeModel.PicUrl;

                //找到上传按钮
                upLoadFun.uploadPic();
            };

            //添加子类
            $scope.addChildClassify = function(curId, level){
                $("#goodsClassifyModal").modal("show");
                self.goodsTypeModel.handleType = 2;

                //当前对象的ID和level
                self.curClassifyId = curId;
                self.curLevel = level;

                //修改的参数
                self.goodsTypeModel.classIfyName = null;
                self.goodsTypeModel.classIfySort = null;
                self.goodsTypeModel.PicUrl = null;
                $scope.showPicUrl = self.goodsTypeModel.PicUrl;
                self.goodsTypeModel.level = level + 1;
                if(level == 0)
                {
                    self.goodsTypeModel.modalTitle = "添加二级分类";
                }
                else if(level == 1)
                {
                    self.goodsTypeModel.modalTitle = "添加三级分类";
                }
            };

            //修改分类
            $scope.modify = function(curId, level, name, order){
                $("#goodsClassifyModal").modal("show");
                self.goodsTypeModel.handleType = 3;

                //当前对象的ID和level
                self.curClassifyId = curId;
                self.curLevel = level;

                //修改的参数
                self.goodsTypeModel.classIfyName = name;
                self.goodsTypeModel.classIfySort = order;
                self.goodsTypeModel.level = level;
                if(level == 0)
                {
                    self.goodsTypeModel.modalTitle = "修改商品一级分类";
                    var curObj = _CommonFuntion.finderCurObj(curId, self.originData, 'cat_id');
                    self.goodsTypeModel.PicUrl = curObj.cat_icon;
                    $scope.showPicUrl = self.goodsTypeModel.PicUrl;//展示图片

                    //上传图片
                    upLoadFun.uploadPic();
                }
                else if(level == 1)
                {
                    self.goodsTypeModel.modalTitle = "修改商品二级分类";
                }
                else if(level == 2)
                {
                    self.goodsTypeModel.modalTitle = "修改商品三级分类";
                }
            };

            //提交数据
            $scope.classifyOneSubmit = function(name, sort, list){

                var params = {};
                //添加大类
                if(self.goodsTypeModel.handleType == 1)
                {
                    params = {};
                    params.parentId = 0;
                    if(name != null)
                    {
                        params.catName = name;
                    }
                    if(sort != null)
                    {
                        params.sortOrder = sort;
                    }
                    if(self.goodsTypeModel.PicUrl != null)
                    {
                        params.catIcon = self.goodsTypeModel.PicUrl;
                    }

                    //验证params掉接口
                    if(goodsClassifyFun.checkParams(name, sort, self.goodsTypeModel.PicUrl, 0))
                    {
                        goodsClassifyFun.addClassifyOne(params, function(){
                            $("#goodsClassifyModal").modal("hide");
                            _CommonFuntion.dialog("添加成功");
                            self.getGoodsClassify($scope);//添加完成刷新数据
                        })
                    }
                }

                //添加子类
                if(self.goodsTypeModel.handleType == 2)
                {
                    params = {};
                    if(self.curClassifyId != null)
                    {
                        params.parentId = self.curClassifyId;
                    }
                    if(name != null)
                    {
                        params.catName = name;
                    }
                    if(sort != null)
                    {
                        params.sortOrder = sort;
                    }

                    if(self.curLevel == 1)//添加二级的子分类
                    {
                        var ids = _CommonFuntion.findIdToArr(list);
                        if(ids != null)
                        {
                            params.bestSellers = ids;
                        }

                    }
                    //验证params掉接口
                    if(goodsClassifyFun.checkParams(name, sort, null, 1))
                    {
                        goodsClassifyFun.addClassifyOne(params, function(res){
                            $("#goodsClassifyModal").modal("hide");
                            _CommonFuntion.dialog("添加成功");
                            self.getGoodsClassify($scope);//添加完成刷新数据
                        })
                    }
                }

                //修改数据
                if(self.goodsTypeModel.handleType == 3)
                {
                    params = {
                        "modData" : {}
                    };
                    var modData = {};
                    if(self.curClassifyId != null)
                    {
                        params.catId = self.curClassifyId;
                    }
                    if(name != null)
                    {
                        modData.cat_name = name;
                    }
                    if(sort != null)
                    {
                        modData.sort_order = sort;
                    }

                    if(self.curLevel == 0)
                    {
                        if(self.goodsTypeModel.PicUrl != null)
                        {
                            modData.cat_icon = self.goodsTypeModel.PicUrl;
                        }
                    }

                    if(self.curLevel == 2)
                    {
                        var ids = _CommonFuntion.findIdToArr(list);
                        if(ids != '[]')
                        {
                            modData.best_sellers = ids;
                        }
                    }

                    params.modData = JSON.stringify(modData);

                    //验证params掉接口
                    if(goodsClassifyFun.checkParams(name, sort, null, 1))
                    {
                        goodsClassifyFun.modClassifyOne(params, function(res){
                            $("#goodsClassifyModal").modal("hide");
                            _CommonFuntion.dialog("修改成功");
                            self.getGoodsClassify($scope);//添加完成刷新数据
                        })
                    }
                }
            };

            //添加商品ID数组
            $scope.idList = [
                {"id" : ""}
            ];

            $scope.addID = function(){
                var obj={id : ""};
                $scope.idList.push(obj);
            };

            $scope.delID = function(idx){
                $scope.idList.splice(idx,1);
            }
        })
    },

    //上传图片
    showResponse_1 : function(responseText, statusText){
        if(statusText == "success")
        {
            var url = responseText.data.url;
            goodsClassificationCtrl.goodsTypeModel.PicUrl = url;
            goodsClassificationCtrl.scope.showPicUrl = BASE_IMG_URL + goodsClassificationCtrl.goodsTypeModel.PicUrl;//展示图片
            goodsClassificationCtrl.scope.$apply();
        }
    }
};

var goodsClassifyFun = {
    //商品大类
    getGoodsClassifyOne : function(params, callback){
        $data.HttpRequest(dataApi.API_GET_GOODS_CATEGORIES_BY_LEVEL, params, callback);
    },

    //添加商品大类
    addClassifyOne : function(params, callback){
        $data.HttpRequest(dataApi.API_ADD_GOODS_CATEGORY, params, callback);
    },

    //删除商品分类
    delClassifyOne : function(params, callback){
        $data.HttpRequest(dataApi.API_DEL_GOODS_CATEGORY, params, callback);
    },

    //修改商品大类
    modClassifyOne : function(params, callback){
        $data.HttpRequest(dataApi.API_MOD_GOODS_CATEGORY, params, callback);
    },

    //验证数据
    /*
    * name:大类名称
    * sort：大类排序
    * url：大类icon
    * type：判断添加或修改，0表示添加，1表示修改
    * */
    checkParams : function(name, sort, extened, type){
        if(name == null)
        {
            alert("请输入分类名称");
            return false;
        }
        if(sort == null)
        {
            alert("请输入排序");
            return false;
        }
        if(type == 0)
        {
            if(extened == null)
            {
                alert("请上传图标");
                return false;
            }
        }
        return true;
    }

};

