 ///富文本编辑器
var myEditor;

//公告管理
routerApp.controller('announceCtrl', function($scope){
    announceCtrl.init($scope);
}).run(function () {
    KindEditor.ready(function(K) {
        K.remove('#myEditor');
        myEditor = K.create('#myEditor', {
            themeType : 'simple',
            resizeType : 2,
            allowImageUpload : true,
            items : [
                'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                'insertunorderedlist', '|', 'link']
        });
    });
});

var announceCtrl = {
    scope : null,
    copyK : null,

    noticeModel : {
        modelArr : [],
        selectAll : false,
        isAdd : true,
        curID : null,
        title : null,
        titleCopy : null,
        showPicUrl : null,
        isListShow : true,
        isInfoShow : false
    },

    init : function($scope){
        var self = this;
        self.scope = $scope;

        self.scope.noticeModel = self.noticeModel;

        self.getNotice();

        self.onClickFun();

        self.noticeModel.isInfoShow = false;
        self.noticeModel.isListShow = true;
    },

    getNotice : function(){
        var self = this;

        pageController.pageInit(self.scope, dataApi.API_GET_NOTICE, {}, function(data){
            if(!utilities.checkStringEmpty(pageParams.num))
            {
                var pageNum = Math.ceil(data.count / pageParams.num);
                pageController.pageNum(pageNum);
            }
            self.noticeModel.modelArr = data.data;
            for(var i = 0; i < data.data.length; i++)
            {
                self.noticeModel.modelArr[i].selected = false;
            }

            self.scope.$apply();
        })
    },

    delCallback : function(){

        _errModal.show("删除成功");
        announceCtrl.getNotice();
    },

    onClickFun : function(){
        var self = this;

        //单选
        self.scope.oneSel = function(id){
            _CommonFuntion.switchSelOne(id, self.noticeModel, 'id');
        };

        //多选
        self.scope.allSel = function(){
            _CommonFuntion.switchSelAll( self.noticeModel);
        };

        //删除
        self.scope.delNotice = function(){
            var delArrStr =  _CommonFuntion.findSelIds(self.noticeModel, 'id');
            if(delArrStr != null)
            {
                _CommonFuntion.delListByIds(delArrStr, 'noticeIds', dataApi.API_DEL_NOTICE, self.delCallback);
            }
        };

        //发布
        self.scope.releaseClick = function(data){
            var params = {
                "noticeIds": '['+ data.id +']',
                "type": data.isRelease == '0'? '1':'0'
            };

            $data.HttpRequest(dataApi.API_RELEASE_NOTICE, params, function(){
                _CommonFuntion.dialog("操作成功");
                self.getNotice();
            })
        };

        //添加
        self.scope.addNotice = function(){
            self.noticeModel.isInfoShow = true;
            self.noticeModel.isListShow = false;
            self.noticeModel.isAdd = true;

            self.noticeModel.title = null;
            self.scope.showPicUrl = null;

            KindEditor.ready(function(K) {
                K.remove('#myEditor');
                myEditor = K.create('#myEditor', {
                    themeType : 'simple',
                    resizeType : 2,
                    allowImageUpload : true,
                    items : [
                        'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                        'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                        'insertunorderedlist', '|', 'link']
                });
                self.copyK = K;
                K.html('#myEditor', '');

                var html = '';
                html += '<span class="ke-outline" title="图片"><span class="ke-toolbar-icon ke-toolbar-icon-url ke-icon-shopImg"></span></span>';
                $(".ke-toolbar").append(html);

                $(".ke-icon-shopImg").on("click", function(){
                    announceCtrl.scope.showPicUrl = null;
                    announceCtrl.scope.$apply();
                    $("#picModal").modal("show");
                    upLoadFun.uploadPic13();
                });

            });


        };

        //修改
        self.scope.modify = function(data){
            self.noticeModel.isInfoShow = true;
            self.noticeModel.isListShow = false;
            self.noticeModel.isAdd = false;

            self.scope.showPicUrl = null;

            self.noticeModel.title = data.title;
            self.noticeModel.titleCopy = data.title;
            self.noticeModel.curID = data.id;

            KindEditor.ready(function(K) {
                K.remove('#myEditor');
                myEditor = K.create('#myEditor', {
                    themeType : 'simple',
                    resizeType : 2,
                    allowImageUpload : true,
                    items : [
                        'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                        'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                        'insertunorderedlist', '|', 'link']
                });

                self.copyK = K;
                myEditor.html(data.words);

                var html = '';
                html += '<span class="ke-outline" title="图片"><span class="ke-toolbar-icon ke-toolbar-icon-url ke-icon-shopImg"></span></span>';
                $(".ke-toolbar").append(html);

                $(".ke-icon-shopImg").on("click", function(){
                    announceCtrl.scope.showPicUrl = null;
                    announceCtrl.scope.$apply();
                    $("#picModal").modal("show");
                    upLoadFun.uploadPic13();
                });
            });

        };

        //提交数据
        self.scope.noticeSubmit = function(){
            if(self.noticeModel.isAdd)
            {
                self.addNotice();
            }
            else
            {
                self.modNotice();
            }
        };

        //返回
        self.scope.back = function(){
            self.noticeModel.isInfoShow = false;
            self.noticeModel.isListShow = true;
        };

        self.scope.picSubmit = function(){

            var html = '<span><img style="max-width: 300px;" src="'+ BASE_IMG_URL + self.noticeModel.showPicUrl +'" /></span>';
            self.copyK.insertHtml('#myEditor', html);
            $("#picModal").modal("hide");
        }
    },

    addNotice : function(){
        var self = this;

        var params = {};
        if(!utilities.checkStringEmpty(self.noticeModel.title))
        {
            params.title = self.noticeModel.title;
        }else{
            _CommonFuntion.dialog("请输入标题");
            return;
        }

        params.words = myEditor.html();

        $data.HttpRequest(dataApi.API_ADD_NOTICE, params, function(){
            _CommonFuntion.dialog("添加成功");
            self.getNotice();
            self.noticeModel.isInfoShow = false;
            self.noticeModel.isListShow = true;

        })
    },

    modNotice : function(){
        var self = this;

        var params = {
            "noticeId": self.noticeModel.curID
        };
        if(self.noticeModel.title != self.noticeModel.titleCopy)
        {
            params.title = self.noticeModel.title;
        }

        params.words = myEditor.html();
        $data.HttpRequest(dataApi.API_MOD_NOTICE, params, function(){
            _CommonFuntion.dialog("修改成功");
            self.getNotice();
            self.noticeModel.isInfoShow = false;
            self.noticeModel.isListShow = true;
        })
    },

    //上传跳转图片
    showResponse_1 : function(responseText, statusText){
        if(statusText == "success")
        {
            announceCtrl.noticeModel.showPicUrl = responseText.data.url;
            announceCtrl.scope.showPicUrl = BASE_IMG_URL + announceCtrl.noticeModel.showPicUrl;//展示图片
            announceCtrl.scope.$apply();
        }
    }
};
