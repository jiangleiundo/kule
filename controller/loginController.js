
$(function(){
	var remSta = localStorage.getItem(strKey.KrememberSta);
	_loginParams.userName.val(localStorage.getItem(strKey.KuserName));
	if(remSta == 1)
	{
		_loginParams.pwd.val(localStorage.getItem(strKey.Kpwd));
		_loginParams.remCon.attr("class",_loginParams.hasSel);
	}
	else
	{
		_loginParams.pwd.val("");
	}
});


var _loginParams = {
	hasSel : "has_sel",
	unSel : "un_sel",
	userName : $("#userName"),
    pwd : $("#pwd"),
    remCon : $(".rem_icon span"),
	remremberSta : 0,
	btnLogin : $(".btn_login"),
	active : "inputAct",
	isLogin : true
};

//自定义checkbox
_loginParams.remCon.on("click",function(){
	var curClass = $(this).attr("class");

	if(curClass == _loginParams.unSel)
	{
		$(this).attr("class",_loginParams.hasSel);
		_loginParams.remremberSta = 1;
	}
	else{
		$(this).attr("class",_loginParams.unSel);
		_loginParams.remremberSta = 0;
	}
});


var loginModel = {

	valiDateValue : function(userName,pwd){
		if(userName == "")
		{
			_loginParams.userName.addClass(_loginParams.active);
		}
		else if(pwd == "")
		{
			_loginParams.pwd.addClass(_loginParams.active);
		}
		else
		{
			loginModel.adminLogin(userName,pwd);
		}
	},

	adminLogin : function(userName, pwd){
		var params = {
			"username" : userName,
			"password" : pwd
		};

		$.ajax({
			url: dataApi.API_ADMIN_LOGIN,
			async:false,
			type: "post",
			data: params,
			dataType:"json",
			success: function(data) {
				var err = data['err'];
				var errMsg = data['errMsg'];
				if (err != errCode.success)
				{
					_loginParams.isLogin = false;

					// 调用接口返回错误
					if (errMsg != "")
					{
						_errModal2.show(errMsg);
					}
					if (err == errCode.tokenFailed)
					{
						// 会话不存在，需要清本地数据
						location.href = "login.html";
					}
				}
				else
				{
					_loginParams.isLogin = true;

					localStorage.setItem(strKey.KPHPSESSID, data.data.sessionId);
					localStorage.setItem(strKey.KAdminType, data.data.adminType);
					localStorage.setItem(strKey.KuserName, _loginParams.userName.val());

					if(_loginParams.remremberSta == 1)
					{
						localStorage.setItem(strKey.KrememberSta,1);
						localStorage.setItem(strKey.Kpwd, _loginParams.pwd.val());
					}
					else
					{
						localStorage.setItem(strKey.KrememberSta,0);
						localStorage.setItem(strKey.Kpwd, "");
					}
					location.href = "index.html";
				}
			},
			error: function () {
				_errModal2.show("请求数据失败");
			}
		});
	}

};

//登录点击操作
_loginParams.btnLogin.on("click",function(){

    loginModel.valiDateValue(_loginParams.userName.val(), _loginParams.pwd.val());
});


document.onkeypress = function(){
    if(_loginParams.isLogin)
	{
		if(event.keyCode == 13){//13 回车键
			loginModel.valiDateValue(_loginParams.userName.val(), _loginParams.pwd.val());
		}
	}

};
 
