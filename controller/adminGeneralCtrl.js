routerApp.controller('adminGeneralCtrl', function($scope){
    adminGeneralCtrl.init($scope);
});

var adminGeneralCtrl = {
    scope : null,

    adminModel : {
        ModelInfo : null,
        txtUserName : null,
        txtPwd : null,
        modalTitle : null,
        modalType : null,//模态框操作类型,1是修改，0是添加
        userId : null//管理员id
    },

    init : function($scope){
        var self = this;
        self.scope = $scope;

        self.scope.adminModel = self.adminModel;

        self.getAdminInfo();

        self.onClickFn();
    },

    getAdminInfo : function(){
        var self = this;

        var params = {
            "startIndex": 0,
            "num": pageParams.count
        };

        adminFun.getAdmin(params, function(data){
            var adminName = localStorage.getItem(strKey.KuserName);
            for(var i = 0; i < data.users.length; i++)
            {
                if(adminName == data.users[i].username)
                {
                    self.adminModel.ModelInfo = data.users[i];
                    break;
                }
            }

            self.scope.$apply();
        });

    },

    onClickFn : function(){
        var self = this;

        //修改按钮点击事件
        self.scope.modAdmin = function (id, name, pwd) {
            self.adminModel.modalTitle = '修改管理员';
            self.adminModel.userId = id;
            self.adminModel.txtUserName = name;
            self.adminModel.txtPwd = pwd;
            $("#adminModal").modal('show');
        };

        //模态框提交按钮
        self.scope.adminSubmit = function () {
            self.adminSubmitFun();
        };
    },

    //模态框提交事件
    adminSubmitFun : function () {
        var self = this;

        var params2 = {
            "id" : self.adminModel.userId,
            "account" : self.adminModel.txtUserName,
            "password" : self.adminModel.txtPwd
        };

        if(adminFun.checkParams2(params2))
        {
            adminFun.modAdmin(params2, function(){
                $("#adminModal").modal('hide');
                _errModal.show("修改成功");
                self.getAdminInfo();
            })
        }
    }
};