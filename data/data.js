/**
 * meeno.js
 * Created By: 梁勇
 * Data: 2015-08-06
 * Description: 提供基础方法和共用方法
 */

var $data = {
	/**
	 * 网络底层
	 * @param apiUrl
	 * @param dataParams
	 * @param callBack
     * @param onFail
	 * @param sync	是否使用同步的方式
	 * @constructor
	 */
	HttpRequest : function(apiUrl, dataParams, callBack, onFail, sync)
	{
		var phpSessId = localStorage.getItem(strKey.KPHPSESSID);	
		if ((phpSessId != null) && (phpSessId != ''))
		{
			apiUrl = apiUrl + "?sid=" + phpSessId;
		}

		var async = true;
		if (sync != undefined)
		{
			async = !sync;
		}
		
	    $.ajax({      
	        url: apiUrl,
	        async:async,
	        type: "post",
	        data: dataParams,
	        dataType:"json",
	        success: function(data) {        	
	        	var err = data['err'];
	            var errMsg = data['errMsg'];
	            if (err != errCode.success)
	            {
	                // 调用接口返回错误
	                if (errMsg != "")
	                {
	                	_errModal.show(errMsg);
	                }
	                if (err == errCode.tokenFailed)
	                {
                        setTimeout(function(){
                            location.href = "login.html";
                        }, 1000);
                        return;
	                }

                    if (onFail != null)
                    {
                        onFail(err);
                    }
	            }    
	            else
	            {
	                callBack(data["data"]);
	            }        	        	
		    },
	        error: function () {
	           _errModal.show("请求数据失败");
	        }
	    });
	    
	},
	
	newJQueryAjax : function(s_url, param, callback){
		var phpSessId = localStorage.getItem(strKey.KPHPSESSID);	
		if ((phpSessId != null) && (phpSessId != ''))
		{
			s_url = s_url + "?sid=" + phpSessId;
		}
		
	    $.ajax({        
	        url: s_url,
	        async:false,
	        type: "post",
	        data: param,
	        dataType:'text',
	        success:function(data){
//	        	window.location.href = "aliapply.html";
//	        	newwindow=window.open("aliapply.html","", "height=1000, width=1600,toolbar=no,enubar=no");
				newwindow=window.open("index.html#/accountWithdraw","_blank", 'height='+screen.height+', width='+screen.width+',toolbar=no,enubar=no');
	        	newwindow.document.write(data)

	        }
	    });
	}
	
};


