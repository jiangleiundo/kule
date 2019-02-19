/**
 * Created by jack on 2016/7/15.
 */
var homeBoutiqueCtrl = {
    scope : null,

    boutiqueModel : {
        modelArr : [],
        modalTitle : null,
        isAdd : true,
        curId : null,
        showPicUrl : null,
        activeParams : null,//跳转url
        activeParams2 : null//跳转url用于记录修改变化
    },

    init : function($scope){
        var self = this;
        self.scope = $scope;

        self.scope.boutiqueModel = self.boutiqueModel;

        self.onClickFun();

        self.getBoutique();

    },

    getBoutique : function(){
        var self = this;

        boutiqueFun.getBoutique(function(data){
            self.boutiqueModel.modelArr = [];
            for(var i = 0; i < 8; i++)
            {
                var curBoutique = data.boutiques[i];
                if(!utilities.checkStringEmpty(curBoutique))
                {
                    self.boutiqueModel.modelArr[i] = curBoutique;
                    self.boutiqueModel.modelArr[i].boutiqueIcon = utilities.isContains(curBoutique.boutiqueIcon)? curBoutique.boutiqueIcon : BASE_IMG_URL + curBoutique.boutiqueIcon;
                }
                else
                {
                    self.boutiqueModel.modelArr[i] = false;
                }
            }
            self.scope.$apply();
        })
    },

    onClickFun : function(){
        var self = this;

        self.scope.addBoutique = function(){
            $("#boutiqueModal").modal('show');
            self.boutiqueModel.modalTitle = "添加精品推荐";
            self.boutiqueModel.isAdd = true;

            self.reFresh();
        };

        //修改
        /*
         * id:当前点击的精品ID
         * aParams：跳转参数
         * aPic：精品图片
         * */
        self.scope.modifyBoutique = function(id, aParams, aPic){
            $("#boutiqueModal").modal('show');
            self.boutiqueModel.modalTitle = "修改精品推荐";
            self.boutiqueModel.isAdd = false;
            self.boutiqueModel.curId = id;

            self.reFresh();

            self.boutiqueModel.activeParams = aParams;
            self.boutiqueModel.activeParams2 = aParams;
            self.scope.showPicUrl = aPic;
        };

        //提交数据
        self.scope.boutiqueSubmit = function(aParams){
            if(self.boutiqueModel.isAdd)
            {
                self.addActiveSub(aParams);
            }
            else
            {
                self.modActiveSub(aParams);
            }
        }

    },

    addActiveSub : function(aParams){
        var self = this;

        var params = {};

        params.boutiqueIcon = self.boutiqueModel.showPicUrl;
        params.boutiqueUrl = aParams;

        if(boutiqueFun.checkParams(params))
        {
            $data.HttpRequest(dataApi.API_ADD_BOUTIQUE, params, function(){
                _CommonFuntion.dialog("添加成功");
                $("#boutiqueModal").modal('hide');
                self.getBoutique();
            })
        }

    },

    modActiveSub : function(aParams){
        var self = this;

        var params = {};
        var modData = {};
        params.boutiqueId = self.boutiqueModel.curId;

        if(!utilities.checkStringEmpty(self.boutiqueModel.showPicUrl))
        {
            modData.boutiqueIcon = self.boutiqueModel.showPicUrl;
        }
        if(self.boutiqueModel.activeParams2 != aParams)
        {
            modData.boutiqueUrl = aParams;
        }

        params.modData = JSON.stringify(modData);

        if(!utilities.checkStringEmpty(modData.boutiqueIcon) || !utilities.checkStringEmpty(modData.boutiqueUrl))
        {
            $data.HttpRequest(dataApi.API_MOD_BOUTIQUE, params, function(){
                _CommonFuntion.dialog("修改成功");
                $("#boutiqueModal").modal('hide');
                self.getBoutique();
            })
        }
    },

    reFresh : function(){
        var self = this;

        self.boutiqueModel.activeParams = null;
        self.boutiqueModel.showPicUrl = null;
        self.scope.showPicUrl = null;

        upLoadFun.uploadPic10();
    },

    //上传跳转图片
    showResponse_1 : function(responseText, statusText){
        if(statusText == "success")
        {
            homeBoutiqueCtrl.boutiqueModel.showPicUrl = responseText.data.url;
            homeBoutiqueCtrl.scope.showPicUrl = BASE_IMG_URL + homeBoutiqueCtrl.boutiqueModel.showPicUrl;//展示图片
            homeBoutiqueCtrl.scope.$apply();
        }
    }
};

var boutiqueFun = {
    getBoutique : function(callback){
        $data.HttpRequest(dataApi.API_GET_BOUTIQUE, {}, callback);
    },

    checkParams : function(params){
        if(utilities.checkStringEmpty(params.boutiqueIcon))
        {
            _CommonFuntion.dialog("请上传图片");
            return false;
        }
        if(utilities.checkStringEmpty(params.boutiqueUrl))
        {
            _CommonFuntion.dialog("请填写跳转URL");
            return false;
        }

        return true;
    }
};