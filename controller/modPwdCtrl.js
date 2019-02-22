
var modPwdCtrl = {
    scope : null,

    pwdModel : {
        oldPwd : null,
        newPwd : null,
        newPwd2 : null,
        userName : null
    },

    init : function($scope){
        var self = this;
        self.scope = $scope;

        self.pwdModel.newPwd = null;
        self.pwdModel.newPwd2 = null;
        self.pwdModel.oldPwd = null;
        
        self.scope.pwdModel = self.pwdModel;

        self.onClickFun();
    },

    onClickFun : function(){
        var self = this;

        self.scope.submitChange = function(oldPwd, newPwd, newPwd2)
        {
            self.pwdModel.userName = localStorage.getItem(strKey.KuserName);

            var params = {
                "username": self.pwdModel.userName,
                "oldPassword": oldPwd,
                "newPassword": newPwd
            };

            if(self.checkParams(params, newPwd2))
            {
                $data.HttpRequest(dataApi.API_CHANGE_PASSWORD, params, function(data){
                    _CommonFuntion.dialog("修改成功");
                    location.href = URL_CONST.INDEX_CONTENT;
                })
            }
        }
    },

    checkParams : function(params, newPwd2){
        if(utilities.checkStringEmpty(params.oldPassword))
        {
            _CommonFuntion.dialog("请输入旧密码");
            return false;
        }
        if(utilities.checkStringEmpty(params.newPassword))
        {
            _CommonFuntion.dialog("请输入新密码");
            return false;
        }
        if(params.newPassword != newPwd2)
        {
            _CommonFuntion.dialog("两次输入新密码不一致");
            return false;
        }

        return true;
    }
};


