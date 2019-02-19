var _CommonFuntion = {
    //删除
	delListByIds : function(delids, delKey, api, delCallback){
		var params = {};
		params[delKey] = delids;
		$data.HttpRequest(api, params, delCallback);
	},

    //找到当前选中项的ids
    findSelIds : function(curObj, idKey, tips){
        var delArr = [];

        for(var i = 0; i< curObj.modelArr.length; i++){
            if(curObj.modelArr[i].selected)
            {
                delArr.push(curObj.modelArr[i][idKey]);
            }
        }
        if (delArr.length == 0)
        {
            if(tips == undefined)
            {
                tips = "请先勾选要操作的选项";
            }
            _errModal.show(tips);
            return null;
        }
        else
        {
            return JSON.stringify(delArr);
        }
    },

    dialog : function(errMsg){
        var html = '';
        html += '<div class="err_bg"></div>';
        html += '<div class="errModal">';
        html += '<div class="errMoadl_top">提示</div>';
        html += '<div class="errMoadl_txt">'+errMsg+'</div>';
        html += '</div>';

        $("body").append(html);
        $(".errModal").show().addClass("animated zoomInSm");

        $(".err_bg").show().on("click",function(){
            _CommonFuntion.hideDialog();
        })
    },

    hideDialog : function(){
        $(".err_bg").remove();
        $(".errModal").remove();
    },

    //将当前对象中的ID取出来返回一个数组字符串
    findIdToArr : function(arr){
        var ids = [];
        for(var i = 0; i < arr.length; i++)
        {
            if( !utilities.checkStringEmpty(arr[i].id) )
            {
                ids.push(arr[i].id);
            }
        }
        if(arr.length == 0)
        {
        	return null;
        }
        else
        {
        	return  JSON.stringify(ids);
        }
        
    },

    //找到当前obj
    finderCurObj : function(curId, arr, idKey){
        for(var i = 0; i < arr.length; i++ )
        {
            if(curId == arr[i][idKey])
            {
                return arr[i];
            }
        }
        return null;
    },

    //切换单选状态
    switchSelOne : function(curId, curObj, idKey){
        var self = this;
        var curItem =  self.finderCurObj(curId, curObj.modelArr, idKey);
        if(curItem == null)
        {
            return;
        }
        curItem.selected = !curItem.selected;
        self.checkSelAll(curObj);
    },

    //判断是否全部选中
    checkSelAll : function(curObj){
        var isAllSel = true;
        for(var i = 0; i < curObj.modelArr.length; i++ )
        {
            if(!curObj.modelArr[i].selected)
            {
                isAllSel = false;
                break;
            }
        }
        curObj.selectAll = isAllSel;
    },

    //切换全选状态
    switchSelAll : function(curObj){
        var selected = !curObj.selectAll;
        curObj.selectAll = selected;
        for(var i = 0; i < curObj.modelArr.length; i++)
        {
            curObj.modelArr[i].selected = selected;
        }
    }
	
};

// 一些常用函数
var utilities = {

    numberPrefix : function (size, num)
    {
        var sLen = ('' + num).length;
        if (sLen >= size) {
            return '' + num;
        }
        var preZero = (new Array(size)).join('0');

        return preZero.substring(0, size - sLen) + num;
    },

    //时间戳转日期 YYYY-MM-DD HH:SS
    formatDate : function(timestamp, onlyDate)
    {
        var date = new Date(timestamp * 1000);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();

        if (onlyDate)
        {
            return this.numberPrefix(4, year) + "-" + this.numberPrefix(2, month) + "-" + this.numberPrefix(2, day);
        }

        return this.numberPrefix(4, year) + "-" + this.numberPrefix(2, month) + "-" + this.numberPrefix(2, day) + " "
            + this.numberPrefix(2, hour) + ":" + this.numberPrefix(2, minute) + ":" + this.numberPrefix(2, second);
    },

    //日期YYYY-MM-DD转化时间戳
    formatStamp : function(str){
        var str1 = str.replace(/-/g,'/');
        var date = new Date(str1);

        return date.getTime();
    },

    //比较两个日期的大小
    compareStamp : function(timeStamp){
        var date = new Date();
        var curTimeStamp = date.getTime() / 1000;
        return curTimeStamp > timeStamp;
    },

    // 对象深拷贝
    // 要判断是不是会嵌套，需要判断嵌套层级
    objDeepCopy : function(source) {
        var result = {};
        for (var key in source)
        {
            result[key] = (typeof source[key]==='object') ? this.objDeepCopy(source[key]) : source[key];
        }
        return result;
    },

    //判断数组中是否包含对象
    isObjInArr : function(str){
        var json = eval(str);

        if(typeof(json[0]) == 'object'){
           return true;
        }
        return false;
    },

    // 检查字符串是否为空
    checkStringEmpty : function(str)
    {
        if (str == undefined || str == null || str == '')
        {
            return true;
        }
        return false;
    },

    //判断字符串中是否含有'http://'
    isContains : function(str){

        return new RegExp("http://").test(str);
    },

    //切割数组中的字符串，去掉图片拼接前缀;
    sliceHttp : function(arr){
        var len = BASE_IMG_URL.length;
        for(var i = 0; i < arr.length; i++)
        {
            arr[i] = arr[i].picUrl.slice(len);
        }

        return arr;
    }
};