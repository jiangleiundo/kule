var homeFloorCtrl = {
    scope : null,

    floorModel : {
        modelArr : [],
        modalTitle : null,
        floorName : null,
        floorColor : null
    },

    init : function($scope){
        var self = this;
        self.scope = $scope;

        self.scope.floorModel = self.floorModel;

        self.getFloor();

        self.onClickFun();
    },

    getFloor : function(){
        var self = this;

        self.floorModel.modelArr = [];
        floorFun.getFloor({}, function(data){
            for(var i = 0; i < 5; i++)
            {
                if(!utilities.checkStringEmpty(data.floors[i]))
                {
                    self.floorModel.modelArr[i] = data.floors[i];
                }
                else
                {
                    self.floorModel.modelArr[i] = false;
                }
            }
            self.scope.$apply();
        })
    },

    onClickFun : function(){
        var self = this;

        self.scope.addFloor = function(){
            $("#floorModal").modal("show");
            self.floorModel.modalTitle = "添加楼层";
            self.floorModel.floorName = null;
            self.floorModel.floorColor = null;
        };

        self.scope.modifyFloor = function(id){
            homeFloorInfoCtrl.getFloorID(id);
            location.href = URL_CONST.HOME_FLOOR_INFO;
        };

        self.scope.floorSubmit = function(name, color){
            var params = {
                "floorName": name,
                "colorValue": color
            };

            if(floorFun.checkParams(params))
            {
                $data.HttpRequest(dataApi.API_ADD_FLOOR, params, function(res){
                    $("#floorModal").modal("hide");
                    _CommonFuntion.dialog("添加成功");
                    self.getFloor();
                })
            }
        }

    }
};

var floorFun = {
    getFloor : function(params, callback){
        $data.HttpRequest(dataApi.API_GET_FLOOR, params, callback);
    },

    checkParams : function(params){
        if(utilities.checkStringEmpty(params.floorName))
        {
            _CommonFuntion.dialog("请输入楼层名");
            return false;
        }
        if(utilities.checkStringEmpty(params.colorValue))
        {
            _CommonFuntion.dialog("请输入颜色值");
            return false;
        }

        return true;
    }
};