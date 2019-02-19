/**
 * Created by Jack on 2016/7/15.
 */
var homeActiveCtrl = {
    scope : null,

    activeModel : {
        modelArr : [],
        optionArr : [], //跳转类型
        modalTitle : null,
        isAdd : true,
        curId : null,
        curType : null,
        showPicUrl : null,
        showPicUrl2 : null,
        activeParams : null,//跳转url
        activeParams2 : null//跳转关键字
    },

    init : function($scope){
        var self = this;
        self.scope = $scope;

        self.scope.activeModel = self.activeModel;

        self.onClickFun();

        self.getActive();

        self.jumpStyle();
    },

    getActive : function(){
        var self = this;

        activeFun.getHomeActive(function(data){
            self.activeModel.modelArr = data.activities;
            for(var i = 0; i < 3; i++)
            {
                if(!utilities.checkStringEmpty(self.activeModel.modelArr[i]))
                {
                    self.activeModel.modelArr[i].activityTypeCopy = bannerFun.bannerType(self.activeModel.modelArr[i].activityType);
                    self.activeModel.modelArr[i].activityIcon = utilities.isContains(self.activeModel.modelArr[i].activityIcon)? self.activeModel.modelArr[i].activityIcon : BASE_IMG_URL + self.activeModel.modelArr[i].activityIcon;
                    if(self.activeModel.modelArr[i].activityType == 1)
                    {
                        self.activeModel.modelArr[i].activityParam = utilities.isContains(self.activeModel.modelArr[i].activityParam)? self.activeModel.modelArr[i].activityParam : BASE_IMG_URL + self.activeModel.modelArr[i].activityParam;
                    }
                }
                else
                {
                    self.activeModel.modelArr[i] = false;
                }
            }
            self.scope.$apply();
        })

    },

    onClickFun : function(){
        var self = this;

        self.scope.addActive = function(){
            $("#activeModal").modal('show');
            self.activeModel.modalTitle = "添加活动";
            self.activeModel.isAdd = true;

            self.reFresh();
        };

        //修改
        /*
         * id:当前点击的活动ID
         * type：活动类型
         * aParams：跳转参数
         * aPic：活动图片
         * */
        self.scope.modifyActive = function(id, type, aParams, aPic){
            $("#activeModal").modal('show');
            self.activeModel.modalTitle = "修改活动";
            self.activeModel.isAdd = false;
            self.activeModel.curId = id;
            self.reFresh();

            self.activeModel.curType = type;

            if(type == 0)
            {
                self.activeModel.activeParams = aParams;
            }
            if(type == 2)
            {
                self.activeModel.activeParams2 = aParams;
            }
            if(type == 1)
            {
                self.scope.showPicUrl = aParams;
            }
            self.scope.showPicUrl2 = aPic;
        };

        //提交数据
        self.scope.activeSubmit = function(optionSel, aParams, aParams2){
            if(self.activeModel.isAdd)
            {
                self.addActiveSub(optionSel, aParams, aParams2);
            }
            else
            {
                self.modActiveSub(optionSel, aParams, aParams2);
            }
        }
    },

    addActiveSub : function(optionSel, aParams, aParams2){
        var self = this;

        var params = {};
        params.activityIcon = self.activeModel.showPicUrl2;
        params.activityType = optionSel;
        if(optionSel == 0)
        {
            params.activityParam = aParams;
        }
        if(optionSel == 2)
        {
            params.activityParam = aParams2;
        }
        if(optionSel == 1)
        {
            params.activityParam = self.activeModel.showPicUrl;
        }

        if(activeFun.checkParams(params))
        {
            $data.HttpRequest(dataApi.API_ADD_HOME_ACTIVE, params, function(){
                _CommonFuntion.dialog("添加成功");
                $("#activeModal").modal('hide');
                self.getActive();
            })
        }

    },

    modActiveSub : function(optionSel, aParams, aParams2){
        var self = this;

        var params = {};
        var modData = {};
        params.activityId = self.activeModel.curId;

        if(!utilities.checkStringEmpty(self.activeModel.showPicUrl2))
        {
            modData.activityIcon = self.activeModel.showPicUrl2;
        }
        if(optionSel)
        {
            modData.activityType = optionSel;

            if(optionSel == 0)
            {
                if(!utilities.checkStringEmpty(aParams))
                {
                    modData.activityParam = aParams;
                }
                else
                {
                    _CommonFuntion.dialog("请输入跳转关联URL");
                    return;
                }
            }
            if(optionSel == 2)
            {
                if(!utilities.checkStringEmpty(aParams2))
                {
                    modData.activityParam = aParams2;
                }
                else
                {
                    _CommonFuntion.dialog("请输入关键字");
                    return;
                }
            }
            if(optionSel == 1)
            {
                if(!utilities.checkStringEmpty(self.activeModel.showPicUrl))
                {
                    modData.activityParam = self.activeModel.showPicUrl;
                }
                else
                {
                    _CommonFuntion.dialog("请上传跳转图片");
                    return;
                }
            }
        }

        params.modData = JSON.stringify(modData);
        $data.HttpRequest(dataApi.API_MOD_HOME_ACTIVE, params, function(){
            _CommonFuntion.dialog("修改成功");
            $("#activeModal").modal('hide');
            self.getActive();
        })

    },

    reFresh : function(){
        var self = this;

        self.activeModel.activeParams = null;
        self.activeModel.activeParams2 = null;
        self.scope.showPicUrl = null;
        self.scope.showPicUrl2 = null;

        upLoadFun.uploadPic8();
        upLoadFun.uploadPic9();

        self.jumpStyle();
    },

    jumpStyle : function(){
        var self = this;

        self.activeModel.optionArr = [
            {'id': '0', 'name': '商品推荐'},
            {'id': '1', 'name': '图文跳转'},
            {'id': '2', 'name': '关键字'}
        ];

        self.activeModel.curType = '0';
    },

    //上传跳转图片
    showResponse_1 : function(responseText, statusText){
        if(statusText == "success")
        {
            homeActiveCtrl.activeModel.showPicUrl = responseText.data.url;
            homeActiveCtrl.scope.showPicUrl = BASE_IMG_URL + homeActiveCtrl.activeModel.showPicUrl;//展示图片
            homeActiveCtrl.scope.$apply();
        }
    },

    //banner图
    showResponse_2 : function(responseText, statusText){
        if(statusText == "success")
        {
            homeActiveCtrl.activeModel.showPicUrl2 = responseText.data.url;
            homeActiveCtrl.scope.showPicUrl2 = BASE_IMG_URL + homeActiveCtrl.activeModel.showPicUrl2;//展示图片
            homeActiveCtrl.scope.$apply();
        }
    }
};

var activeFun = {
    getHomeActive : function(callback){
        $data.HttpRequest(dataApi.API_GET_HOME_ACTIVE, {}, callback);
    },

    checkParams : function(params){
        if(utilities.checkStringEmpty(params.activityParam))
        {
            if(params.activityType == 0)
            {
                _CommonFuntion.dialog("请输入跳转关联URL");
            }
            if(params.activityType == 2)
            {
                _CommonFuntion.dialog("请输入关键字");
            }
            if(params.activityType == 1)
            {
                _CommonFuntion.dialog("请上传跳转图片");
            }

            return false;
        }
        if(utilities.checkStringEmpty(params.activityIcon))
        {
            _CommonFuntion.dialog("请上传活动图");
            return false;
        }

        return true;
    }
};