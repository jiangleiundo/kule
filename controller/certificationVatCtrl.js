var certificationVatCtrl = {
    scope : null,

    vatModel : {
        selectAll : false,
        modelArr : [],
        isShowInfo : false,
        optionSel : ""
    },

    init : function($scope){
        var self = this;
        self.scope = $scope;

        self.scope.vatModel = self.vatModel;

        self.getVatList();

        self.onClickFun();
    },

    searchJump : function(){
        var self = this;

        self.vatModel.optionSel = 1;

        var params = {} ;
        params.status = 1;

        pageController.searchChange(params);
    },

    getVatList : function(){
        var self = this;

        self.vatModel.modelArr = [];
        self.vatModel.isShowInfo = false;

        pageController.pageInit(self.scope, dataApi.API_GET_VAT_LIST, {}, function(data){
            if(!utilities.checkStringEmpty(pageParams.num))
            {
                var pageNum = Math.ceil(data.count / pageParams.num);
                pageController.pageNum(pageNum);
            }

            self.vatModel.modelArr = data.vatList;
            for(var i = 0; i < data.vatList.length; i++)
            {
                self.vatModel.modelArr[i].status = self.vatStatus(data.vatList[i].checkStatus);
            }

            self.scope.$apply();
        })
    },

    onClickFun : function(){
        var self = this;
        self.scope.checkInfo = function(curId){
            self.vatModel.isShowInfo = true;

            certificationVatInfoCtrl.getVatId(curId);
        };

        self.scope.BackVat = function(){
            self.vatModel.isShowInfo = false;
        };

        self.scope.search = function(){

            var params = {
                "status": self.vatModel.optionSel
            };
            pageController.searchChange(params);
        }
    },

    vatStatus : function(sta){
        var status = null;
        switch (parseInt(sta))
        {
            case 1:
                status = "审核中";
                break;
            case 2:
                status = "通过";
                break;
            case 3:
                status = "驳回";
                break;
            default :
                status = "";
        }

        return status;
    }
};

var certificationVatInfoCtrl = {
    scope : null,

    vatInfoModel : {
        vatInfo : null,
        vatID : null
    },

    refuseModel : {
        msgCon : null,
        modalTitle : null
    },

    init : function($scope){
        var self = this;
        self.scope = $scope;

        self.onClickFun();

        self.scope.refuseModel = self.refuseModel;
    },

    getVatId : function(id){
        var self = this;
        self.vatInfoModel.vatID = id;

        self.getVatInfo();
    },

    getVatInfo : function(){
        var self = this;
        self.scope.vatImg = null;

        if(!utilities.checkStringEmpty(self.vatInfoModel.vatID))
        {
            var params = {
                "vatId": self.vatInfoModel.vatID
            };

            $data.HttpRequest(dataApi.API_GET_VAT_INFO, params, function(data){
                self.vatInfoModel.vatInfo = data.vatInfo;

                self.vatInfoModel.vatInfo.certificateType = data.vatInfo.certificateType == 1? "三证合一": "未三证合一";

                self.vatInfoModel.vatInfo.vatImgList = JSON.parse(data.vatInfo.certificate);

                for(var i = 0, len = self.vatInfoModel.vatInfo.vatImgList.length; i < len; i++)
                {
                    self.vatInfoModel.vatInfo.vatImgList[i] = utilities.isContains(self.vatInfoModel.vatInfo.vatImgList[i])? self.vatInfoModel.vatInfo.vatImgList[i] : BASE_IMG_URL + self.vatInfoModel.vatInfo.vatImgList[i];
                }

                self.scope.vatInfoModel = self.vatInfoModel;
                self.scope.$apply();
            })
        }

    },

    onClickFun : function(){
        var self = this;

        self.scope.yesForVat = function(){

            var params = {
                "vatId": self.vatInfoModel.vatID
            };

            $data.HttpRequest(dataApi.API_AGREE_VAT_APPLY, params, function(){
                certificationVatCtrl.getVatList();
                _CommonFuntion.dialog("提交成功");
                indexCtrl.getReminds();//刷新消息提醒
            })
        };

        self.scope.noForVat = function(){
            self.refuseModel.modalTitle = "回复驳回内容";
            $("#refuseModal").modal("show");
        };

        self.scope.submitVat = function(msgCon){

            var params = {
                "vatId": self.vatInfoModel.vatID
            };
            if(!utilities.checkStringEmpty(msgCon))
            {
                params.reason = msgCon;
            }
            else
            {
                _CommonFuntion.dialog("请输入驳回理由");
                return;
            }

            $data.HttpRequest(dataApi.API_REFUSE_VAT_APPLY, params, function(){
                certificationVatCtrl.getVatList();
                $("#refuseModal").modal("hide");
                _CommonFuntion.dialog("提交成功");
                indexCtrl.getReminds();//刷新消息提醒
            })
        }
    }
};

