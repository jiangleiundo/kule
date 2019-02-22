var brandManageCtrl = {
    scope : null,
    brandModel : {
        selectAll : false,
        brandArr : [],
        modalTitle : null,
        modalType : 0,
        brandName : null,
        PicUrl : null,
        isAdd : true,
        defaultImg : "images/moren.png",
        search : null
    },

    //当前选中的obj的ID
    currentID : null,

    init : function ($scope) {
        var self = this;
        self.scope = $scope;

        this.getBrandList();
    },

    getBrandList : function () {
        var self = this;
        pageController.pageInit(self.scope, dataApi.API_GET_BRANDLIST, {}, function (data) {
            self.brandModel.brandArr = [];
            //列表数据模型
            if (pageParams.num != 0)
            {
                var pageNum = Math.ceil(data.count / pageParams.num);
                pageController.pageNum(pageNum);
            }

            //取出服务端赋给Model
            for (var i = 0; i < data.data.length; ++i)
            {
                var brandObj = data.data[i];
                self.brandModel.brandArr.push({
                    "selected" : false,
                    "brand_id" : brandObj.brand_id,
                    "id" : brandObj.brand_id,
                    "brand_name" : brandObj.brand_name,
                    "brand_logo" : utilities.isContains(brandObj.brand_logo)? brandObj.brand_logo : BASE_IMG_URL + brandObj.brand_logo,
                    "sort_order" : brandObj.sort_order,
                    "goods_num" : brandObj.goods_num,
                    "is_show" : brandObj.is_show
                });
            }

            self.scope.brandModel = self.brandModel;
            self.scope.$apply();

            //单选
            self.scope.oneSel = function(id){
                self.switchSelOne(id, self.brandModel.brandArr);
            };

            //多选
            self.scope.allSel = function(){
                self.switchSelAll( self.brandModel.brandArr);
            };

            //搜索
            self.scope.search = function(words){
                var params = {
                    "words" : words
                };
                pageController.searchChange(params);
            };

            //删除按钮
            self.scope.onClickDelBrand = function(){
                self.delBrand();
            };

            //添加brand
            self.scope.addBrand = function(){
                self.brandModel.isAdd = true;
                self.brandModel.modalTitle = "添加品牌";
                $("#brandModal").modal('show');

                //刷新数据
                self.brandModel.brandName = null;
                self.brandModel.PicUrl = null;
                self.scope.showPicUrl = self.brandModel.PicUrl;

                //刷新商品ID数组
                self.scope.idList = [{"id" : ""}];

                //找到上传按钮
                upLoadFun.uploadPic2();
            };

            //修改brand
            self.scope.modify = function(id){
                self.brandModel.isAdd = false;
                self.brandModel.modalTitle = "修改品牌";
                $("#brandModal").modal('show');
                self.currentID = id;//当前选中的ID

                //找到当前点击对象
                var curObj = self.finderCurObj(id, self.brandModel.brandArr);
                self.brandModel.brandName = curObj.brand_name;
                self.brandModel.PicUrl = curObj.brand_logo;
                self.scope.showPicUrl = self.brandModel.PicUrl;//展示图片

                //找到上传按钮
                upLoadFun.uploadPic2();
            };

            //提交数据
            self.scope.brandSubmit = function(brandName, list){
                var params = {};
                if(self.brandModel.isAdd)
                {
                    if(brandName != null)
                    {
                        params.brandName = brandName;
                    }
                    if(self.brandModel.PicUrl != null)
                    {
                        params.brandLogo = self.brandModel.PicUrl;
                    }
                    var ids = _CommonFuntion.findIdToArr(list);
                    if(ids != null)
                    {
                    	params.goods = ids;
                    }
                    
                    if(brandFun.checkParams(brandName, self.brandModel.PicUrl, true))
                    {
                        brandFun.addBrand(params, function(res){
                            $("#brandModal").modal('hide');
                            _CommonFuntion.dialog("添加成功");
                            self.getBrandList();
                        })
                    }
                }
                else
                {
                    if(self.currentID != null)
                    {
                        params.brandId = self.currentID;
                    }
                    if(brandName != null)
                    {
                        params.brand_name = brandName;
                    }
                    if(self.brandModel.PicUrl != null)
                    {
                        params.brand_logo = self.brandModel.PicUrl;
                    }
                    if(brandFun.checkParams(brandName, self.brandModel.PicUrl, false))
                    {
                        brandFun.modBrand(params, function(res){
                            $("#brandModal").modal('hide');
                            _CommonFuntion.dialog("修改成功");
                            self.getBrandList();
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
        })
    },

    //找到当前obj
    finderCurObj : function(curId, arr){
        for(var i = 0; i < arr.length; i++ )
        {
            if(curId == arr[i].id)
            {
                return arr[i];
            }
        }
        return null;
    },

    //切换单选状态
    switchSelOne : function(curId, arr){
        var self = this;
        var curItem =  self.finderCurObj(curId, arr);
        if(curItem == null)
        {
            return;
        }
        curItem.selected = !curItem.selected;
        self.checkSelAll(arr);
    },

    //判断是否全部选中
    checkSelAll : function(arr){
        var self = this;
        var isAllSel = true;
        for(var i = 0; i < arr.length; i++ )
        {
            if(!arr[i].selected)
            {
                isAllSel = false;
                break;
            }
        }
        self.brandModel.selectAll = isAllSel;
    },

    //切换全选状态
    switchSelAll : function(arr){
        var self = this;
        var selected = !self.brandModel.selectAll;
        self.brandModel.selectAll = selected;
        for(var i = 0; i < arr.length; i++)
        {
            arr[i].selected = selected;
        }
    },

    //删除品牌
    delBrand : function () {
        var self = this;
        var delArr = [];

        var brandArr = self.brandModel.brandArr;
        for(var i = 0;i< brandArr.length;i++){
            if(brandArr[i].selected)
            {
                delArr.push(brandArr[i].brand_id);
            }
        }
        if (delArr.length == 0)
        {
            _errModal.show("请选择要删除的选项");
        }
        else
        {
            var delString = JSON.stringify(delArr);
            _CommonFuntion.delListByIds(delString, 'brandIds', dataApi.API_DEL_BRAND, self.delCallback);

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
            brandManageCtrl.getBrandList();
        }
    },

    //上传图片
    showResponse_1 : function(responseText, statusText){
        if(statusText == "success")
        {
            var url = responseText.data.url;
            brandManageCtrl.brandModel.PicUrl = url;
            brandManageCtrl.scope.showPicUrl = BASE_IMG_URL + brandManageCtrl.brandModel.PicUrl;//展示图片
            brandManageCtrl.scope.$apply();
        }
    }
};

var brandFun = {
    //添加brand
    addBrand : function(params, callback){
        $data.HttpRequest(dataApi.API_ADD_BRAND, params, callback);
    },

    //修改brand
    modBrand : function(params, callback){
        $data.HttpRequest(dataApi.API_MOD_BRAND, params, callback);
    },

    //检查参数,type:true表添加
    checkParams : function(name, logo, type){
        if(name == null)
        {
            alert("请输入品牌名称");
            return false;
        }
        if(type)
        {
            if(logo == null)
            {
                alert("请上传logo");
                return false;
            }
        }
        return true;
    }


};

