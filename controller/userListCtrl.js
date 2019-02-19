/**
 * Created by Jack on 2016/7/11.
 */
var userListCtrl = {
    scope : null,

    userListModel : {
        selectAll : false,
        modelArr : [], //公共的数组名
        modalTitle : null,
        search : null,
        curID : null,
        msgVal : null,
        msgCon : null,//私信内容
        registerNum : null,
        certificationNum : null
    },

    init : function($scope){
        this.scope = $scope;
        var self = this;

        self.scope.userListModel = self.userListModel;

        self.getUserList();

        self.getUserNum();

        self.onClickFun();
    },

    //用户列表
    getUserList : function(){
        var self = this;
        pageController.pageInit(self.scope, dataApi.API_GET_USER_LIST, {}, function(data){
            if(pageParams.num != 0)
            {
                var pageNum = Math.ceil(data.count / pageParams.num);
                pageController.pageNum(pageNum);
            }

            self.userListModel.modelArr = data.userList;
            for(var i = 0; i < self.userListModel.modelArr.length; i++)
            {
                self.userListModel.modelArr[i].selected = false;
            }
            self.scope.$apply();
        })
    },

    //用户数量统计
    getUserNum : function(){
        var self = this;
        userListFun.getUserNum(function(data){
            self.userListModel.registerNum = data.registerNum;
            self.userListModel.certificationNum = data.certificationNum;

            self.scope.$apply();
        })
    },

    delCallback : function(){

        _errModal.show("删除成功");
        userListCtrl.getUserList();
        userListCtrl.getUserNum();
    },

    onClickFun : function(){
        var self = this;

        self.scope.import = dataApi.API_IMPORT_USER_LIST;

        self.scope.oneSel = function(id){
            _CommonFuntion.switchSelOne(id, self.userListModel, 'userId');
        };

        self.scope.allSel = function(){
            _CommonFuntion.switchSelAll(self.userListModel);
        };

        self.scope.search = function(search){
            var params = {
                "keywords": search
            };
            pageController.searchChange(params);
        };

        self.scope.deleteUser = function(){
            var delStr = _CommonFuntion.findSelIds(self.userListModel, 'userId');
            if( !utilities.checkStringEmpty(delStr))
            {
                _CommonFuntion.delListByIds(delStr, 'userIds', dataApi.API_DEL_USER, self.delCallback);
            }

        };

        //跳到详情页
        self.scope.checkInfo = function(id){
            userInfoCtrl.getUserId(id);
            location.href = URL_CONST.USER_INFO;
        };

        //发消息
        self.scope.sendMsg = function(id){
            $("#userMsgModal").modal("show");
            self.userListModel.modalTitle = "私信";
            self.userListModel.curID = id;
            self.userListModel.msgVal = "1";
            self.userListModel.msgCon = null;
        };

        //提交消息
        self.scope.submitMsg = function(val, con){
            var params = {
                "msgType": val,
                "msgContent": con,
                "userId": self.userListModel.curID
            };
            if(userListFun.checkParams(params))
            {
                userListFun.sendPrivateMsg(params, function(){
                    $("#userMsgModal").modal("hide");
                    _CommonFuntion.dialog("发送成功");
                })
            }
        };

        //导出
        self.scope.toExcelUserList = function () {
            var bb = new Blob([document.getElementById('exportable4').innerHTML], {type: 'text/plain;charset=utf-8'});
            saveAs(bb, '用户列表.xls')
        }
    }
};

var userListFun = {
    //会员列表
    getUserNum : function(callback){
        $data.HttpRequest(dataApi.API_GET_USERS_NUM, {}, callback);
    },

    //会员信息
    getUserObj : function(params, callback){
        $data.HttpRequest(dataApi.API_GET_USER_OBJ, params, callback);
    },

    //修改用户余额，积分
    modUserObj : function(params, callback){
        $data.HttpRequest(dataApi.API_MOD_USER_OBJ, params, callback);
    },

    //私信
    sendPrivateMsg : function(params, callback){
        $data.HttpRequest(dataApi.API_SEND_PRIVATE_MSG, params, callback);
    },



    //验证参数
    checkParams : function(params){
        if(utilities.checkStringEmpty(params.msgContent))
        {
            alert("请输入信息内容");
            return false;
        }

        return true;
    }
};