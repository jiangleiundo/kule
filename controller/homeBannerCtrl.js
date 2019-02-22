var homeBannerCtrl = {
    scope : null,

    bannerModel : {
        selectAll : false,
        modelArr : [], //公共的数组名
        optionArr : [], //跳转类型
        modalTitle : null,
        isAdd : true,
        curId : null,
        curType : null,
        showPicUrl : null,
        showPicUrl2 : null,
        sTime : null,
        eTime : null,
        bannerParams : null,//跳转url
        bannerParams2 : null//跳转关键字
    },

    init : function($scope){
        var self = this;
        self.scope = $scope;

        self.scope.bannerModel = self.bannerModel;

        self.onClickFun();

        self.getBanner();

        self.jumpStyle();
    },

    getBanner : function(){
        var self = this;

        var params = {
            "startIndex": 0,
            "num": pageParams.count
        };
        bannerFun.getBanner(params, function(data){
            self.bannerModel.modelArr = data.banners;
            for(var i = 0; i < self.bannerModel.modelArr.length; i++)
            {
                self.bannerModel.modelArr[i].selected = false;
                self.bannerModel.modelArr[i].bannerTypeCopy = bannerFun.bannerType(self.bannerModel.modelArr[i].bannerType);
                if(self.bannerModel.modelArr[i].bannerType == 1)
                {
                    self.bannerModel.modelArr[i].bannerParam = utilities.isContains(self.bannerModel.modelArr[i].bannerParam)? self.bannerModel.modelArr[i].bannerParam : BASE_IMG_URL + self.bannerModel.modelArr[i].bannerParam;
                }
                self.bannerModel.modelArr[i].bannerIcon = utilities.isContains(self.bannerModel.modelArr[i].bannerIcon)? self.bannerModel.modelArr[i].bannerIcon : BASE_IMG_URL + self.bannerModel.modelArr[i].bannerIcon;
            }

            self.scope.$apply();
        })
    },

    delCallback : function(){

        _errModal.show("删除成功");
        homeBannerCtrl.getBanner();
    },

    onClickFun : function(){
        var self = this;

        //单选
        self.scope.oneSel = function(id){
            _CommonFuntion.switchSelOne(id, self.bannerModel, 'bannerId');
        };

        //多选
        self.scope.allSel = function(){
            _CommonFuntion.switchSelAll( self.bannerModel);
        };

        //删除
        self.scope.delBanner = function(){
            var delArrStr =  _CommonFuntion.findSelIds(self.bannerModel, 'bannerId');
            if(delArrStr != null)
            {
                _CommonFuntion.delListByIds(delArrStr, 'bannerIds', dataApi.API_DEL_BANNERS, self.delCallback);
                self.getBanner();
            }
        };

        //添加
        self.scope.addBanner = function(){
            $("#bannerModal").modal('show');
            self.bannerModel.modalTitle = "添加banner";
            self.bannerModel.isAdd = true;

            self.reFresh();
        };

        //修改
        /*
        * id:当前点击的bannerID
        * type：banner类型
        * sTime：绑定model的开始时间
        * eTime：绑定model的结束时间
        * bParams：跳转参数
        * bPic：banner图片
        * */
        self.scope.modifyBanner = function(id, type, sTime, eTime, bParams, bPic)
        {
            $("#bannerModal").modal('show');
            self.bannerModel.modalTitle = "修改banner";
            self.bannerModel.isAdd = false;
            self.bannerModel.curId = id;
            self.reFresh();

            self.bannerModel.curType = type;

            self.bannerModel.sTime = sTime;
            self.bannerModel.eTime = eTime;
            self.scope.optionSel = type;
            if(type == 0)
            {
                self.bannerModel.bannerParams = bParams;
            }
            if(type == 2)
            {
                self.bannerModel.bannerParams2 = bParams;
            }
            if(type == 1)
            {
                self.scope.showPicUrl = bParams;
            }
            self.scope.showPicUrl2 = bPic;
        };

        //提交数据
        /*optionSel：当期所选banner类型
        *bParams：banner类型为0时的跳转-url
        *bParams2：banner类型为2时的跳转-关键字
        *sTime：绑定model的开始时间
        *eTime：绑定model的结束时间
        *beginTime：所选开始时间
        *stopTime：所选结束时间
        **/
        self.scope.bannerSubmit = function(optionSel, bParams, bParams2, sTime, eTime){

            var beginTime = $("#beginTime").val();
            var stopTime = $("#stopTime").val();

            if(self.bannerModel.isAdd)
            {
                self.addBannerSub(optionSel, bParams, bParams2, beginTime, stopTime);
            }
            else
            {
                self.modBannerSub(optionSel, bParams, bParams2, beginTime, stopTime, sTime, eTime);
            }
        }
    },

    reFresh : function(){
        var self = this;

        self.bannerModel.sTime = null;
        self.bannerModel.eTime = null;
        self.bannerModel.bannerParams = null;
        self.bannerModel.bannerParams2 = null;
        self.scope.showPicUrl = null;
        self.scope.showPicUrl2 = null;

        upLoadFun.uploadPic6();
        upLoadFun.uploadPic7();

        self.jumpStyle();
    },

    //参数定义见--bannerSubmit
    addBannerSub : function(optionSel, bParams, bParams2, beginTime, stopTime){
        var self = this;

        var params = {};
        params.bannerIcon = self.bannerModel.showPicUrl2;
        params.bannerType = optionSel;
        if(optionSel == 0)
        {
            params.bannerParam = bParams;
        }
        if(optionSel == 2)
        {
            params.bannerParam = bParams2;
        }
        if(optionSel == 1)
        {
            params.bannerParam = self.bannerModel.showPicUrl;
        }
        params.startTime = beginTime;
        params.endTime = stopTime;

        if(bannerFun.checkParams(params))
        {
            $data.HttpRequest(dataApi.API_ADD_BANNER, params, function(){
                _CommonFuntion.dialog("添加成功");
                $("#bannerModal").modal('hide');
                self.getBanner();
            })
        }
    },

    //参数定义见--bannerSubmit
    modBannerSub : function(optionSel, bParams, bParams2, beginTime, stopTime, sTime, eTime){
        var self = this;

        var params = {};
        var modData = {};
        params.bannerId = self.bannerModel.curId;

        if(!utilities.checkStringEmpty(self.bannerModel.showPicUrl2))
        {
            modData.bannerIcon = self.bannerModel.showPicUrl2;
        }
        if(optionSel)
        {
            modData.bannerType = optionSel;

            if(optionSel == 0)
            {
                if(!utilities.checkStringEmpty(bParams))
                {
                    modData.bannerParam = bParams;
                }
                else
                {
                    _CommonFuntion.dialog("请输入跳转关联URL");
                    return;
                }
            }
            if(optionSel == 2)
            {
                if(!utilities.checkStringEmpty(bParams2))
                {
                    modData.bannerParam = bParams2;
                }
                else
                {
                    _CommonFuntion.dialog("请输入关键字");
                    return;
                }
            }
            if(optionSel == 1)
            {
                if(!utilities.checkStringEmpty(self.bannerModel.showPicUrl))
                {
                    modData.bannerParam = self.bannerModel.showPicUrl;
                }
                else
                {
                    _CommonFuntion.dialog("请上传跳转图片");
                    return;
                }
            }
        }
        if(beginTime != sTime)
        {
            modData.startTime = beginTime;
        }
        if(stopTime != eTime)
        {
            modData.endTime = stopTime;
        }

        params.modData = JSON.stringify(modData);

        $data.HttpRequest(dataApi.API_MOD_BANNERS, params, function(){
            _CommonFuntion.dialog("修改成功");
            $("#bannerModal").modal('hide');
            self.getBanner();
        })
    },

    jumpStyle : function(){
        var self = this;

        self.bannerModel.optionArr = [
            {'id': '0', 'name': '商品推荐'},
            {'id': '1', 'name': '图文跳转'},
            {'id': '2', 'name': '关键字'}
        ];

        self.bannerModel.curType = '0';
    },

    //上传跳转图片
    showResponse_1 : function(responseText, statusText){
        if(statusText == "success")
        {
            homeBannerCtrl.bannerModel.showPicUrl = responseText.data.url;
            homeBannerCtrl.scope.showPicUrl = BASE_IMG_URL + homeBannerCtrl.bannerModel.showPicUrl;//展示图片
            homeBannerCtrl.scope.$apply();
        }
    },

    //banner图
    showResponse_2 : function(responseText, statusText){
        if(statusText == "success")
        {
            homeBannerCtrl.bannerModel.showPicUrl2 = responseText.data.url;
            homeBannerCtrl.scope.showPicUrl2 = BASE_IMG_URL + homeBannerCtrl.bannerModel.showPicUrl2;//展示图片
            homeBannerCtrl.scope.$apply();
        }
    }


};

var bannerFun = {
    getBanner : function(params, callback){
        $data.HttpRequest(dataApi.API_GET_BANNERS, params, callback);
    },

    bannerType : function(type){
        var bType = "";

        switch (parseInt(type))
        {
            case 0:
                bType = "商品URL";
                break;
            case 1:
                bType = "图片";
                break;
            case 2:
                bType = "关键字";
                break;
            default :
                bType = "";
                break;
        }

        return bType;
    },

    checkParams : function(params){
        if(utilities.checkStringEmpty(params.startTime))
        {
            _CommonFuntion.dialog("请选择开始时间");
            return false;
        }
        if(utilities.checkStringEmpty(params.endTime))
        {
            _CommonFuntion.dialog("请选择结束时间");
            return false;
        }
        if(utilities.checkStringEmpty(params.bannerParam))
        {
            if(params.bannerType == 0)
            {
                _CommonFuntion.dialog("请输入跳转关联URL");
            }
            if(params.bannerType == 2)
            {
                _CommonFuntion.dialog("请输入关键字");
            }
            if(params.bannerType == 1)
            {
                _CommonFuntion.dialog("请上传跳转图片");
            }

            return false;
        }
        if(utilities.checkStringEmpty(params.bannerIcon))
        {
            _CommonFuntion.dialog("请上传banner图");
            return false;
        }

        return true;
    }

};