/**
 * Created by jack on 2016/7/19.
 */
var msgManageCtrl = {
    scope : null,

    msgModel : {
        modelArr : [],
        msgVal : '1',
        msgTitle : null,
        msgCon : null
    },

    init : function($scope){
        var self = this;
        self.scope = $scope;

        self.scope.msgModel = self.msgModel;

        self.getMsg();

        self.onClickFun();
    },

    getMsg : function(){
        var self = this;

        pageController.pageInit(self.scope, dataApi.API_GET_MSG, {}, function(data){
            if(!utilities.checkStringEmpty(pageParams.num))
            {
                var pageNum = Math.ceil(data.count / pageParams.num);
                pageController.pageNum(pageNum);
            }
            self.msgModel.modelArr = data.data;

            self.scope.$apply();
        })
    },

    onClickFun : function(){
        var self = this;

        self.scope.addMsg = function(){
            $("#msgModal").modal("show");
            self.reFresh();
        };

        self.scope.submitMsg = function(){
            var params = {
                "type": self.msgModel.msgVal,
                "title": self.msgModel.msgTitle,
                "content": self.msgModel.msgCon
            };

            if(self.checkParams(params))
            {
                $data.HttpRequest(dataApi.API_ADD_MSG, params, function(){
                    _CommonFuntion.dialog("添加成功");
                    $("#msgModal").modal("hide");
                    self.getMsg();
                })
            }
        }
    },

    reFresh : function(){
        var self = this;

        self.msgModel.msgTitle = null;
        self.msgModel.msgCon = null;
        self.msgModel.msgVal = '1';
    },

    checkParams : function(params){
        if(utilities.checkStringEmpty(params.title))
        {
            _CommonFuntion.dialog("请输入标题");
            return false;
        }
        if(utilities.checkStringEmpty(params.content))
        {
            _CommonFuntion.dialog("请输入内容");
            return false;
        }
        return true;
    }
};