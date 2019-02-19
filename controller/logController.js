/**
 * Created by jack on 2016/6/23.
 */
var logController = {
    scope: null,

    logModel: {
        modelArr: [],
        selOptionArr: []
    },

    init: function ($scope) {
        this.scope = $scope;
        var self = this;

        //绑定model
        self.scope.logModel = self.logModel;

        self.getLogList();

        self.onClickFun();

        self.getAdminList();
    },

    getLogList: function () {
        var self = this;

        pageController.pageInit(this.scope, dataApi.API_GET_LOG, {}, function (data) {
            //列表数据模型
            if (pageParams.num != 0) {
                var pageNum = Math.ceil(data.count / pageParams.num);
                pageController.pageNum(pageNum);
            }

            self.logModel.modelArr = data.data;
            self.scope.$apply();

        })
    },

    getAdminList : function(){
        var self = this;

        var params = {
            'startIndex': 0,
            'num': pageParams.count //9999
        };

        logFan.getAdminList(params, function(data){

            self.logModel.selOptionArr = [];

            for(var i = 0; i < data.users.length; i++)
            {
                self.logModel.selOptionArr.push({
                    "id": data.users[i].id,
                    "name": data.users[i].username
                })
            }

            self.scope.optionSel = ''; //默认
            self.scope.selModelArr = self.logModel.selOptionArr;
            self.scope.$apply();
        })
    },

    finderName : function(arr, id){

        for(var i = 0; i < arr.length; i++)
        {
            if(id == arr[i].id)
            {
                return arr[i].name;
            }
        }
    },

    onClickFun : function(){
        var self = this;

        //当前选项
        self.scope.selCurOption = function(curID){

            self.scope.optionSel = curID;//重新绑定
        };

        //搜索
        self.scope.search = function(optionSel){
            var params = {};

            var sTime = $("#startTime-log").val();
            var eTime = $("#endTime-log").val();

            if(!utilities.checkStringEmpty(optionSel))
            {
                params.adminName = self.finderName(self.logModel.selOptionArr, optionSel);
            }
            if(!utilities.checkStringEmpty(sTime))
            {
                params.startTime = utilities.formatStamp(sTime) / 1000;
            }
            if(!utilities.checkStringEmpty(eTime))
            {
                params.endTime = utilities.formatStamp(eTime) / 1000;
            }

            pageController.searchChange(params);
        };

        //导出
        self.scope.toExcelLog = function () {
            var bb = new Blob([document.getElementById('exportable3').innerHTML], {type: 'text/plain;charset=utf-8'});
            saveAs(bb, 'log.xls')
        }
    }
};

var logFan = {
    getAdminList : function(params, callback){
        $data.HttpRequest(dataApi.API_GET_ADMIN, params, callback);
    }
};
