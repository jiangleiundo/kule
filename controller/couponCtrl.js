/**
 * Created by Jack on 2016/7/18.
 */
var couponCtrl = {
    scope : null,

    couponModel : {
        selectAll : false,
        modalTitle : null,
        userID : null,
        couponID : null,
        modelArr : [],
        optionTypeArr : [],
        optionStatusArr : [],

        optionSelStatus : null,
        optionSelType : null,

        name : null,//优惠券名称
        goodsID : null,//实物券对应商品ID
        upperLine : null,//触发上线
        intensity : null,//力度
        num : null,//优惠券数量
        startTime : null,//开始时间
        endTime : null,//截止时间
        isChecked : '2'
    },

    init : function($scope){
        var self = this;
        self.scope = $scope;

        self.scope.couponModel = self.couponModel;

        self.getCoupons();

        self.onClickFun();

        self.constOption();
    },

    getCoupons : function(){
        var self = this;

        self.couponModel.modelArr = [];
        self.scope.optionSel3 = null;
        pageController.pageInit(self.scope, dataApi.API_GET_COUPONS, {}, function(data){
            if(pageParams.num != 0)
            {
                var pageNum = Math.ceil(data.count / pageParams.num);
                pageController.pageNum(pageNum);
            }

            self.couponModel.modelArr = data.coupons;
            for(var i = 0; i < data.coupons.length; i++)
            {
                self.couponModel.modelArr[i].selected = false;
                self.couponModel.modelArr[i].nameId = "name_" + data.coupons[i].id;
                self.couponModel.modelArr[i].btnId = "btn_" + data.coupons[i].id;
            }
            self.scope.$apply();
        })
    },

    delCallback : function(){

        _errModal.show("删除成功");
        couponCtrl.couponModel.selectAll = false;
        if(!utilities.checkStringEmpty(couponCtrl.couponModel.optionSelStatus) || !utilities.checkStringEmpty(couponCtrl.couponModel.optionSelType))
        {
            couponCtrl.search();
        }
        else
        {
            couponCtrl.getCoupons();
        }
    },
    
    onClickFun : function(){
        var self = this;

        //option-select
        self.scope.changeStatus = function(sel){
            self.couponModel.optionSelStatus = sel;
        };
        self.scope.changeType = function(sel){
            self.couponModel.optionSelType = sel;
        };

        //单选
        self.scope.oneSel = function(id){
            _CommonFuntion.switchSelOne(id, self.couponModel, 'id');
        };

        //多选
        self.scope.allSel = function(){
            _CommonFuntion.switchSelAll( self.couponModel);
        };

        //删除
        self.scope.delCoupon = function(){
            var delArrStr =  _CommonFuntion.findSelIds(self.couponModel, 'id');
            if(delArrStr != null)
            {
                _CommonFuntion.delListByIds(delArrStr, 'couponStatusIds', dataApi.API_DEL_COUPONS, self.delCallback);
            }
        };

        //筛选
        self.scope.searchCoupon = function(){
            self.search();
        };

        //添加优惠卷
        self.scope.addCoupon = function(){
            self.reFreshData();
            $("#addCouponModal").modal("show");
        };

        //提交添加数据
        self.scope.modCouponSubmit = function(optionSel){
            var startTime = utilities.formatStamp($("#sTime-coupon").val()) / 1000;
            var endTime = utilities.formatStamp($("#eTime-coupon").val()) / 1000;

            var params = {};
            params.couponName = self.couponModel.name;
            params.couponType = optionSel;
            params.couponNum = self.couponModel.num;
            params.beginTime = startTime;
            params.endTime = endTime;
            if(optionSel == '1')
            {
                params.couponIntensity = self.couponModel.goodsID;
            }
            if(optionSel == '2')
            {
                params.couponUpper = self.couponModel.upperLine;
                params.couponIntensity = self.couponModel.intensity;
            }
            if(optionSel == '3')
            {
                params.couponIntensity = self.couponModel.intensity;
            }
            if(self.couponModel.isChecked == "1")
            {
                params.isGlobal = '1';
                params.isRandom = '0';
            }
            if(self.couponModel.isChecked == "0")
            {
                params.isGlobal = '0';
                params.isRandom = '1';
            }


            if(self.checkParams(params))
            {
                $data.HttpRequest(dataApi.API_CREATE_COUPONS, params, function(data){
                    $("#addCouponModal").modal("hide");
                    _CommonFuntion.dialog("新增成功");
                    self.getCoupons();
                })
            }
        };

        //赠送
        self.scope.modify = function(id){
            $("#couponModal").modal("show");
            self.couponModel.couponID = id;
            self.couponModel.userID = null;
        };

        //提交赠送数据
        self.scope.couponSubmit = function(userID){
            var params = {
                "couponStatusId": self.couponModel.couponID
            };
            if(!utilities.checkStringEmpty(userID))
            {
                params.userId = userID;
            }
            else
            {
                _CommonFuntion.dialog("请输入用户ID");
                return;
            }
            $data.HttpRequest(dataApi.API_GIVING_COUPONS, params, function(data){
                $("#couponModal").modal("hide");
                _CommonFuntion.dialog("赠送成功");
                
         
                $("#name_" + data.couponStatusId).text(data.nickName);
                $("#btn_" + data.couponStatusId).hide();
            })
        }
    },

    search : function(){
        var self = this;

        var params = {
            "couponType": self.couponModel.optionSelStatus,
            "useStatus": self.couponModel.optionSelType
        };
        pageController.searchChange(params);
    },

    reFreshData : function(){
        var self = this;

        self.couponModel.name = null;
        self.couponModel.goodsID = null;
        self.couponModel.upperLine = null;
        self.couponModel.intensity = null;
        self.couponModel.num = null;
        self.couponModel.startTime = null;
        self.couponModel.endTime = null;
        self.couponModel.isChecked = '2';
        $("#sTime-coupon").val("");
        $("#eTime-coupon").val("");
    },

    constOption : function(){
        var self = this;

        self.couponModel.optionStatusArr = [
            {"id": '1', "name": '实物券'},
            {"id": '2', "name": '折扣券'},
            {"id": '3', "name": '积分券'}
        ];
        self.scope.optionSel = null;
        self.scope.optionSel3 = null;

        self.couponModel.optionTypeArr = [
            {"id": '1', "name": '未使用'},
            {"id": '2', "name": '已使用'}
        ];
        self.scope.optionSel2 = null;
    },

    checkParams : function(params){
        if(utilities.checkStringEmpty(params.couponName))
        {
            _CommonFuntion.dialog("请输入优惠券名称");
            return false;
        }
        if(utilities.checkStringEmpty(params.couponType))
        {
            _CommonFuntion.dialog("请选择类型");
            return false;
        }
        else
        {
            if(params.couponType == '1')
            {
                if(utilities.checkStringEmpty(params.couponIntensity))
                {
                    _CommonFuntion.dialog("请输入物品ID");
                    return false;
                }
            }
            if(params.couponType == '2')
            {
                if(utilities.checkStringEmpty(params.couponUpper))
                {
                    _CommonFuntion.dialog("请输入触发上线");
                    return false;
                }
                if(utilities.checkStringEmpty(params.couponIntensity))
                {
                    _CommonFuntion.dialog("请输入力度");
                    return false;
                }
            }
            if(params.couponType == '3')
            {
                if(utilities.checkStringEmpty(params.couponIntensity))
                {
                    _CommonFuntion.dialog("请输入力度");
                    return false;
                }
            }

        }
        if(params.isGlobal == '0')
        {
            if(utilities.checkStringEmpty(params.couponNum))
            {
                _CommonFuntion.dialog("请输入数量");
                return false;
            }
        }
        if(utilities.checkStringEmpty(params.beginTime))
        {
            _CommonFuntion.dialog("请输入开始时间");
            return false;
        }
        if(utilities.checkStringEmpty(params.endTime))
        {
            _CommonFuntion.dialog("请输入截止时间");
            return false;
        }

        return true;
    }
};
