var goodsTagCtrl = {
    scope : null,

    goodsModel : {
        selectAll : false,
        modalTitle : null,
        tagName : null,
        isAdd : true,
        modelArr : [] //公共的数组名
    },

    //当前选中的obj的ID
    currentID : null,

    init : function($scope){
        var self = this;
        self.scope = $scope;

        //初始化获取tag
        self.getGoodsTag();

        self.onClickFn();
    },

    getGoodsTag : function(){
        var self = this;
        pageController.pageInit(self.scope, dataApi.API_GET_TAG_LIST, {}, function(data){
            self.goodsModel.modelArr = [];

            if(pageParams.num != 0)
            {
                var pageNum = Math.ceil(data.count / pageParams.num);
                pageController.pageNum(pageNum);
            }

            var tags = data.tags;
            for(var i = 0; i < tags.length; i++)
            {
                self.goodsModel.modelArr.push({
                    "id" : tags[i].tag_id,
                    "name" : tags[i].tagname,//标签名
                    "hotSearch" : tags[i].search_count,//热搜
                    "goodsNum" : tags[i].goodsNum,
                    "selected" : false
                })
            }

            self.scope.goodsModel = self.goodsModel;
            self.scope.$apply();


        });
    },

    onClickFn : function(){
        var self = this;

        //单选
        self.scope.oneSel = function(id){
            _CommonFuntion.switchSelOne(id, self.goodsModel, 'id');
        };

        //多选
        self.scope.allSel = function(){
            _CommonFuntion.switchSelAll( self.goodsModel);
        };

        //删除
        self.scope.delTags = function(){
            var delArrStr =  _CommonFuntion.findSelIds(self.goodsModel, 'id');
            if(delArrStr != null)
            {
                _CommonFuntion.delListByIds(delArrStr, 'tagIds', dataApi.API_DEL_TAG_LIST, self.delCallback);
            }
        };

        //添加
        self.scope.addTag = function(){
            $("#tagModal").modal("show");
            self.goodsModel.modalTitle = "添加标签";
            self.goodsModel.isAdd = true;

            //刷新数据
            self.goodsModel.tagName = null;
            self.scope.idList = [{"id" : ""}];
        };

        //修改
        self.scope.modify = function(id){
            $("#tagModal").modal("show");
            self.goodsModel.modalTitle = "修改标签";
            self.goodsModel.isAdd = false;
            self.currentID = id;

            //找到当前点击对象
            var curObj = _CommonFuntion.finderCurObj(id, self.goodsModel.modelArr, 'id');
            if(curObj != null)
            {
                self.goodsModel.tagName = curObj.name;
            }
        };

        //提交数据
        self.scope.submit = function(name, list){
            var params = {};
            if(self.goodsModel.isAdd)
            {
                if(!utilities.checkStringEmpty(name))
                {
                    params.tagName = name;
                }
                var ids = _CommonFuntion.findIdToArr(list);
                if(ids != null)
                {
                    params.goods = ids;
                }

                if(goodsTagFun.checkParams(name))
                {
                    goodsTagFun.addGoodsTag(params, function(){
                        $("#tagModal").modal("hide");
                        _CommonFuntion.dialog("添加成功");
                        self.getGoodsTag();
                    })
                }
            }
            else
            {
                if(self.currentID != null)
                {
                    params.tagId = self.currentID;
                }
                if(!utilities.checkStringEmpty(name))
                {
                    params.tagName = name;
                }
                if(goodsTagFun.checkParams(name))
                {
                    goodsTagFun.modGoodsTag(params, function(){
                        $("#tagModal").modal("hide");
                        _CommonFuntion.dialog("修改成功");
                        self.getGoodsTag();
                    })
                }
            }
        };

        //添加商品ID数组
        self.scope.idList = [
            {"id" : ""}
        ];

        self.scope.addID = function(){
            var obj={id : ""};
            self.scope.idList.push(obj);
        };

        self.scope.delID = function(idx){
            self.scope.idList.splice(idx,1);
        }
    },

    //删除回调
    delCallback : function(data){

        var arr = data.delArr;
        var msgArr = [];
        for(var i = 0; i < arr.length; i++)
        {
            if(arr[i].err != '0')
            {
                msgArr.push(arr[i].errMsg);
            }
        }

        if(msgArr.length > 0)
        {
            var msgArrStr = msgArr.join();
            _CommonFuntion.dialog(msgArrStr);
        }
        else
        {
            _errModal.show("删除成功");
            goodsTagCtrl.getGoodsTag();
        }
    }
};

var goodsTagFun = {
    //获得tag列表
    getGoodsTag : function(params, callback){
        $data.HttpRequest(dataApi.API_GET_TAG_LIST, params, callback);
    },

    //添加tag列表
    addGoodsTag : function(params, callback){
        $data.HttpRequest(dataApi.API_ADD_TAG_LIST, params, callback);
    },

    //修改tag列表
    modGoodsTag : function(params, callback){
        $data.HttpRequest(dataApi.API_MOD_TAG_LIST, params, callback);
    },

    //检查参数
    checkParams : function(name){
        if(utilities.checkStringEmpty(name))
        {
            alert("请输入标签名称");
            return false;
        }
        return true;
    }
};