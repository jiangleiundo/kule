var adminController = {
	scope : null,

	adminModel : {
		selectAll : false,
        modelArr : [],
		txtUserName : null,
		txtPwd : null,
		modalTitle : null,
		modalType : null,//模态框操作类型,1是修改，0是添加
		userId : null//管理员id
	},

	init : function ($scope) {
		this.scope = $scope;
        var self = this;

		this.getAdmin();

        self.onClickFun();

        //绑定model
        self.scope.adminModel = self.adminModel;
	},

	getAdmin : function () {
		var self = this;

		pageController.pageInit(this.scope,dataApi.API_GET_ADMIN,{},function (data) {

			//列表数据模型
			if (pageParams.num != 0)
			{
				var pageNum = Math.ceil(data.count / pageParams.num);
				pageController.pageNum(pageNum);
			}

            self.adminModel.modelArr = data.users;

			//取出服务端赋给Model
			for (var i = 0; i < self.adminModel.modelArr.length; ++i)
			{
                self.adminModel.modelArr[i].selected = false;
			}

			self.scope.$apply();

            //单选
            self.scope.oneSel = function(id){
                _CommonFuntion.switchSelOne(id, self.adminModel, 'id');
            };

            //多选
            self.scope.allSel = function(){
                _CommonFuntion.switchSelAll( self.adminModel);
            };

		})
	},

    onClickFun : function(){
        var self = this;

        //修改按钮点击事件
        self.scope.modAdmin = function (id, name, pwd) {
            self.showModModal(id, name, pwd);
        };

        //添加管理员按钮
        self.scope.addAdmin = function () {
            self.showAddAdmin();
        };

        //模态框提交按钮
        self.scope.adminSubmit = function () {
            self.adminSubmitFun();
        };

        //删除按钮
        self.scope.delAdmin = function () {
            self.delAdminFun();
        };

        //查看日志(默认超级管理员日志)
        self.scope.checkLog = function(){

        }

    },

	//点击修改时，弹出修改窗口
    showModModal : function(id, name, pwd) {
        var self = this;

		self.adminModel.modalType = 1;
		self.adminModel.modalTitle = '修改管理员密码';
        self.adminModel.userId = id;
        self.adminModel.txtUserName = name;
        self.adminModel.txtPwd = pwd;
		$("#adminModal").modal('show');
        $("#admin-name").attr("disabled", true);
	},

	//添加管理员时显示模态框
	showAddAdmin : function () {
        var self = this;

        self.adminModel.modalType = 0;//模态框类型为添加管理员
        self.adminModel.txtUserName = null;
        self.adminModel.txtPwd = null;
        self.adminModel.modalTitle = '添加管理员';
		$("#adminModal").modal('show');
        $("#admin-name").attr("disabled", false);
	},

	//模态框提交事件
	adminSubmitFun : function () {
		var self = this;

		if(this.adminModel.modalType == 0){
			var params = {
				"username" : this.adminModel.txtUserName,
				"password" : this.adminModel.txtPwd
			};

            if(adminFun.checkParams(params))
            {
                adminFun.addAdmin(params, function(){
                    $("#adminModal").modal('hide');
                    _errModal.show("添加成功");
                    self.getAdmin();
                })
            }
		}
		else
		{
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
                    self.getAdmin();
                })
            }
		}
	},

	delAdminFun : function () {
        var self = this;

        var delArrStr = _CommonFuntion.findSelIds(self.adminModel, 'id');
        if(delArrStr != null)
        {
            _CommonFuntion.delListByIds(delArrStr, 'ids', dataApi.API_DEL_ADMIN, self.delCallback);
        }
	},

    delCallback : function(){

        _errModal.show("删除成功");
        adminController.getAdmin();
    }
};

var adminFun = {

    checkParams : function(params){
        if(params.username == null)
        {
            _CommonFuntion.dialog("请输入管理员名称");
            return false;
        }
        if(params.password == null)
        {
            _CommonFuntion.dialog("请输入密码");
            return false;
        }
        return true;
    },

    checkParams2 : function(params){
        if(params.account == null)
        {
            _CommonFuntion.dialog("请输入管理员名称");
            return false;
        }
        if(params.password == null)
        {
            _CommonFuntion.dialog("请输入密码");
            return false;
        }

        return true;
    },

    //add admin
    getAdmin : function(params, callback){
        $data.HttpRequest(dataApi.API_GET_ADMIN, params, callback);
    },

    //add admin
    addAdmin : function(params, callback){
        $data.HttpRequest(dataApi.API_ADD_ADMIN, params, callback);
    },

    //mod admin
    modAdmin : function(params, callback){
        $data.HttpRequest(dataApi.API_MOD_ADMIN, params, callback);
    }
};
