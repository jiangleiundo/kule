var allActiveCtrl = {
    scope : null,

    activeModel : {
        modelArr : [],
        modalTitle : null,
        conditionTitle : null,
        startTime : null,
        endTime : null,
        curID : null,
        condition : null,
        intensity : null,
        domestic : null,
        overseas : null
    },

    init : function($scope){
        var self = this;
        self.scope = $scope;

        self.scope.activeModel = self.activeModel;

        self.getEvents();

        self.onClickFun();
    },

    getEvents : function(){
        var self = this;

        self.activeModel.modelArr = [];
        allActiveFun.getEvents(function(data){
            for(var i = 0; i < 6; i++)
            {
                if(!utilities.checkStringEmpty(data.events[i]))
                {
                    self.activeModel.modelArr[i] = data.events[i];
                    self.activeModel.modelArr[i].sTime = utilities.formatDate(data.events[i].beginTime, false);
                    self.activeModel.modelArr[i].eTime = utilities.formatDate(data.events[i].endTime, false);
                    self.activeModel.modelArr[i].conditionType = self.conditionType(data.events[i].id);
                    self.activeModel.modelArr[i].isOutOfTime = utilities.compareStamp(data.events[i].endTime);
                    if(data.events[i].id == '5')
                    {
                        var arr = JSON.parse(data.events[i].condition);
                        self.activeModel.modelArr[i].domestic = arr[0];
                        self.activeModel.modelArr[i].overseas = arr[1];
                    }
                }
                else
                {
                    self.activeModel.modelArr[i] = null;
                }
            }
            self.scope.$apply();
        })
    },

    onClickFun : function(){
        var self = this;

        /*
        * id:当前点击的ID
        * status：状态，开启/关闭*/
        self.scope.switchOpen = function(id, status)
        {
            var params = {
                "eventId": id
            };
            var modData = {};

            if(status == '0')
            {
                modData.status = '1';
            }
            else
            {
                modData.status = '0';
            }

            params.modData = JSON.stringify(modData);
            $data.HttpRequest(dataApi.API_MOD_EVENTS, params, function(){
                _CommonFuntion.dialog("操作成功");
                self.getEvents();
            })
        };

        /*
        * id：当前ID
        * sTime：开始时间
        * eTime：结束时间
        * params1：充值等或者国内力度
        * params2：积分或者国外的力度*/
        self.scope.modify = function(id, sTime, eTime, params1, params2){
            $("#allActiveModal").modal("show");
            self.activeModel.curID = id;

            if(id == '1')
            {
                self.activeModel.modalTitle = "充值送积分";
                self.activeModel.conditionTitle = "充值";
            }
            if(id == '2')
            {
                self.activeModel.modalTitle = "首购优惠";
                self.activeModel.conditionTitle = "满额";
            }
            if(id == '3')
            {
                self.activeModel.modalTitle = "买送积分";
                self.activeModel.conditionTitle = "现金";
            }
            if(id == '4')
            {
                self.activeModel.modalTitle = "注册送积分";
            }
            if(id == '5')
            {
                self.activeModel.modalTitle = "满额包邮";
                self.activeModel.domestic = params1;
                self.activeModel.overseas = params2;
            }
            if(id == '6')
            {
                self.activeModel.modalTitle = "邀请返积分";
                self.activeModel.conditionTitle = "次数";
            }

            self.activeModel.startTime = sTime;
            self.activeModel.endTime = eTime;
            self.activeModel.condition = params1;
            self.activeModel.intensity = params2;
        };

        /*
         * sTime：开始时间
         * eTime：结束时间
         * condition：充值等
         * domestic国内力度
         * intensity：积分
         * overseas国外的力度*/
        self.scope.modActiveSubmit = function(sTime, eTime, condition, intensity, domestic, overseas){
            var startTime = $("#sTime-active").val();
            var endTime = $("#eTime-active").val();

            var params = {
                "eventId": self.activeModel.curID
            };
            var modData = {};
            if(startTime != sTime)
            {
                modData.beginTime = utilities.formatStamp(startTime) / 1000;
            }
            if(endTime != eTime)
            {
                modData.endTime = utilities.formatStamp(endTime) / 1000;
            }

            if(self.activeModel.curID == '5')
            {
                if(!utilities.checkStringEmpty(domestic) && !utilities.checkStringEmpty(overseas))
                {
                    modData.condition = '['+ domestic +','+ overseas +']';
                }
                else
                {
                    _CommonFuntion.dialog("修改项不能为空");
                    return;
                }

            }
            else if(self.activeModel.curID == '4')
            {
                if(!utilities.checkStringEmpty(intensity))
                {
                    modData.intensity = intensity;
                }
                else
                {
                    _CommonFuntion.dialog("修改项不能为空");
                    return;
                }

            }
            else
            {
                if(!utilities.checkStringEmpty(condition) && !utilities.checkStringEmpty(intensity))
                {
                    modData.condition = condition;
                    modData.intensity = intensity;
                }
                else
                {
                    _CommonFuntion.dialog("修改项不能为空");
                    return;
                }

            }

            params.modData = JSON.stringify(modData);
            $data.HttpRequest(dataApi.API_MOD_EVENTS, params, function(){
                _CommonFuntion.dialog("修改成功");
                $("#allActiveModal").modal("hide");
                self.getEvents();
            })

        }
        
    },

    conditionType : function(type){
        var cType = null;
        switch(parseInt(type))
        {
            case 1:
                cType = "充值";
                break;
            case 2:
                cType = "满额";
                break;
            case 3:
                cType = "现金";
                break;
            case 6:
                cType = "次数";
                break;
            default :
                cType = "";
                break;
        }

        return cType;
    }

};

var allActiveFun = {
    getEvents : function(callback){
        $data.HttpRequest(dataApi.API_GET_EVENTS, {}, callback);
    }
};