//错误提示框
var _errModal = {
	show : function(errMsg){
		var html = '';
		html += '<div class="err_bg"></div>';
		html += '<div class="errModal">';
		html += '<div class="errMoadl_top">提示</div>';
		html += '<div class="errMoadl_txt">'+errMsg+'</div>';
		html += '</div>';
		$("body").append(html);
		$(".errModal").show().addClass("animated zoomInSm");
		
		$(".err_bg").show().on("click",function(){
			$(".err_bg").remove();
		    $(".errModal").remove();
		})
	}
};

//错误提示框-login
var _errModal2 = {
	show : function(errMsg){
		var html = '';
		html += '<div class="err_bg"></div>';
		html += '<div class="errModal">';
		html += '<div class="errMoadl_top">提示</div>';
		html += '<div class="errMoadl_txt">'+errMsg+'</div>';
		html += '</div>';
		$("body").append(html);
		$(".errModal").show().addClass("animated zoomInSm");

		$(".err_bg").show().on("click",function(){
			$(".err_bg").remove();
			$(".errModal").remove();
            _loginParams.isLogin = true;
		})
	}
};
