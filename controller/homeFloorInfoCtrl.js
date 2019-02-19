/**
 * Created by jack on 2016/7/16.
 */

var homeFloorInfoCtrl = {
    scope : null,

    floorInfoModel : {
        modelArr : [],
        curID : null,
        singleObj : null

    },

    init : function($scope){
        var self = this;
        self.scope = $scope;

        self.scope.floorInfoModel = self.floorInfoModel;

        self.onClickFun();

        self.addOrMod();
    },

    getFloorID : function(id){
        var self = this;
        self.floorInfoModel.curID = id;
    },

    addOrMod : function(){
        var self = this;

        self.scope.currentTab = 'one';//每次进来默认值

        if(!utilities.checkStringEmpty(self.floorInfoModel.curID))//修改
        {
            self.getFloorInfo(self.floorInfoModel.curID);
        }

    },

    /*
    * id:当前楼层ID
    **/
    getFloorInfo : function(id){
        var self = this;

        var params = {
            "floorId": id
        };
        floorFun.getFloor(params, function(data){
            self.floorInfoModel.singleObj = data.floors[0];

            floorThemeCtrl.getTheme(self.floorInfoModel.singleObj, id);

            var activeArr = data.floors[0].activityInfo.arr;
            floorActiveCtrl.getActive(activeArr, id);

            var labelInfoArr = data.floors[0].labelInfo.arr;
            floorLabelCtrl.getFloorLable(labelInfoArr, id);

            var brandInfoArr = data.floors[0].brandInfo.arr;
            floorBrandCtrl.getCurFloorBrand(brandInfoArr, id);
        })

    },

    onClickFun : function(){
        var self = this;

        self.scope.floorBack = function(){
            location.href = URL_CONST.HOME_FLOOR;
        };

        //tab
        self.scope.tabs = [
            {
                title: '主题颜色设置',
                url: 'one'
            },
            {
                title: '活动栏设置',
                url: 'two'
            },
            {
                title: '标签设置',
                url: 'three'
            },
            {
                title: '品牌设置',
                url: 'four'
            }
        ];

        //默认项
        self.scope.currentTab = 'one';

        self.scope.onClickTab = function (tab) {
            self.scope.currentTab = tab.url;
        };

        self.scope.isActiveTab = function(tabUrl) {
            return tabUrl == self.scope.currentTab;
        }
    }
};

//楼层主题
var floorThemeCtrl = {
    scope : null,

    themeModel : {
        name : null,
        color : null,
        curID : null
    },

    init : function($scope){
        var self = this;
        self.scope = $scope;

        self.scope.themeModel = self.themeModel;

        self.onClickFun();
    },

    getTheme : function(singleObj, id){
        var self = this;

        self.themeModel.curID = id;

        self.themeModel.name = singleObj.floorName;
        self.themeModel.color = singleObj.colorValue;

        self.scope.$apply();
    },

    onClickFun : function(){
        var self = this;

        self.scope.themeSubmit = function(name, color){
            var params = {
                "floorId": self.themeModel.curID
            };
            var modData = {};
            if(!utilities.checkStringEmpty(name))
            {
                modData.floorName = name;
            }
            if(!utilities.checkStringEmpty(color))
            {
                modData.colorValue = color;
            }

            params.modData = JSON.stringify(modData);

            floorInfoFun.modFloor(params, function(){
                _CommonFuntion.dialog("操作成功");
                homeFloorInfoCtrl.getFloorInfo(self.themeModel.curID);
                homeFloorInfoCtrl.scope.currentTab = 'one';
            })

        }
    }
};

//楼层活动
var floorActiveCtrl = {
    scope : null,

    activeModel : {
        modelArr : [],
        activeArr : [],
        optionArr : [], //跳转类型
        modalTitle : null,
        isAdd : true,
        curIndex : null,
        curID : null,
        curType : null,
        showPicUrl : null,
        showPicUrl2 : null,
        activeParams : null,//跳转url
        activeParams2 : null//跳转关键字
    },

    init : function($scope){
        var self = this;
        self.scope = $scope;

        self.scope.activeModel = self.activeModel;

        self.onClickFun();

        self.jumpStyle();
    },

    getActive : function(activeArr, id){
        var self = this;

        self.activeModel.activeArr = activeArr;
        self.activeModel.curID = id;

        self.activeModel.modelArr = [];
        for(var i = 0; i < 4; i++)
        {
            if(!utilities.checkStringEmpty(activeArr[i]))
            {
                self.activeModel.modelArr[i] = activeArr[i];

                self.activeModel.modelArr[i].activityTypeCopy = bannerFun.bannerType(activeArr[i].type);
                if(self.activeModel.modelArr[i].type == 1)
                {
                    self.activeModel.modelArr[i].param = utilities.isContains(self.activeModel.modelArr[i].param)? self.activeModel.modelArr[i].param : BASE_IMG_URL + self.activeModel.modelArr[i].param;
                }
                self.activeModel.modelArr[i].icon = utilities.isContains(self.activeModel.modelArr[i].icon)? self.activeModel.modelArr[i].icon : BASE_IMG_URL + self.activeModel.modelArr[i].icon;
            }
            else
            {
                self.activeModel.modelArr[i] = false;
            }

        }
        self.scope.$apply();
    },

    onClickFun : function(){
        var self = this;

        self.scope.addActive = function(index){
            $("#activeModal").modal('show');
            self.activeModel.modalTitle = "添加活动";
            self.activeModel.isAdd = true;
            self.activeModel.curIndex = index;

            self.reFresh();
        };

        //修改
        /*
         * id:当前点击的活动ID
         * type：活动类型
         * aParams：跳转参数
         * aPic：活动图片
         * */
        self.scope.modifyActive = function(index, type, aParams, aPic){
            $("#activeModal").modal('show');
            self.activeModel.modalTitle = "修改活动";
            self.activeModel.isAdd = false;
            self.activeModel.curIndex = index;
            self.reFresh();

            self.activeModel.curType = type;

            if(type == 0)
            {
                self.activeModel.activeParams = aParams;
            }
            if(type == 2)
            {
                self.activeModel.activeParams2 = aParams;
            }
            if(type == 1)
            {
                self.scope.showPicUrl = aParams;
            }
            self.scope.showPicUrl2 = aPic;
        };

        //提交数据
        self.scope.activeSubmit = function(optionSel, aParams, aParams2){
            if(self.activeModel.isAdd)
            {
                self.addActiveSub(optionSel, aParams, aParams2);
            }
            else
            {
                self.modActiveSub(optionSel, aParams, aParams2);
            }
        }

    },

    addActiveSub : function(optionSel, aParams, aParams2){
        var self = this;

        var params = {};

        params.floorId = self.activeModel.curID;
        params.index = self.activeModel.curIndex;
        params.icon = self.activeModel.showPicUrl2;
        params.type = optionSel;
        if(optionSel == 0)
        {
            params.param = aParams;
        }
        if(optionSel == 2)
        {
            params.param = aParams2;
        }
        if(optionSel == 1)
        {
            params.param = self.activeModel.showPicUrl;
        }

        if(floorInfoFun.checkParams(params))
        {
            $data.HttpRequest(dataApi.API_MOD_FLOOR_ACTIVE, params, function(){
                _CommonFuntion.dialog("添加成功");
                $("#activeModal").modal('hide');
                homeFloorInfoCtrl.getFloorInfo(self.activeModel.curID);
                homeFloorInfoCtrl.scope.currentTab = 'two';
            })
        }
    },

    modActiveSub : function(optionSel, aParams, aParams2){
        var self = this;

        var params = {};
        params.floorId = self.activeModel.curID;
        params.index = self.activeModel.curIndex;
        if(!utilities.checkStringEmpty(self.activeModel.showPicUrl2))
        {
            params.icon = self.activeModel.showPicUrl2;
        }
        //if(self.activeModel.curType != optionSel)
        {
            params.type = optionSel;
            if(optionSel == 0)
            {
                if(!utilities.checkStringEmpty(aParams))
                {
                    params.param = aParams;
                }
                else
                {
                    _CommonFuntion.dialog("请输入跳转关联URL");
                    return;
                }
            }
            if(optionSel == 2)
            {
                if(!utilities.checkStringEmpty(aParams2))
                {
                    params.param = aParams2;
                }
                else
                {
                    _CommonFuntion.dialog("请输入关键字");
                    return;
                }
            }
            if(optionSel == 1)
            {
                if(!utilities.checkStringEmpty(self.activeModel.showPicUrl))
                {
                    params.param = self.activeModel.showPicUrl;
                }
                else
                {
                    _CommonFuntion.dialog("请上传跳转图片");
                    return;
                }
            }
        }

        $data.HttpRequest(dataApi.API_MOD_FLOOR_ACTIVE, params, function(){
            _CommonFuntion.dialog("修改成功");
            $("#activeModal").modal('hide');
            homeFloorInfoCtrl.getFloorInfo(self.activeModel.curID);
            homeFloorInfoCtrl.scope.currentTab = 'two';
        })

    },

    reFresh : function(){
        var self = this;

        self.activeModel.activeParams = null;
        self.activeModel.activeParams2 = null;
        self.scope.showPicUrl = null;
        self.scope.showPicUrl2 = null;

        upLoadFun.uploadPic11();
        upLoadFun.uploadPic12();

        self.jumpStyle();
    },

    jumpStyle : function(){
        var self = this;

        self.activeModel.optionArr = [
            {'id': '0', 'name': '商品推荐'},
            {'id': '1', 'name': '图文跳转'},
            {'id': '2', 'name': '关键字'}
        ];

        self.activeModel.curType = '0';
    },

    //上传跳转图片
    showResponse_1 : function(responseText, statusText){
        if(statusText == "success")
        {
            floorActiveCtrl.activeModel.showPicUrl = responseText.data.url;
            floorActiveCtrl.scope.showPicUrl = BASE_IMG_URL + floorActiveCtrl.activeModel.showPicUrl;//展示图片
            floorActiveCtrl.scope.$apply();
        }
    },

    //banner图
    showResponse_2 : function(responseText, statusText){
        if(statusText == "success")
        {
            floorActiveCtrl.activeModel.showPicUrl2 = responseText.data.url;
            floorActiveCtrl.scope.showPicUrl2 = BASE_IMG_URL + floorActiveCtrl.activeModel.showPicUrl2;//展示图片
            floorActiveCtrl.scope.$apply();
        }
    }
};

//标签
var floorLabelCtrl = {
    scope : null,

    labelModel : {
        modelArr : [],
        curID : null

    },

    init : function($scope){
        var self = this;
        self.scope = $scope;

        self.scope.labelModel = self.labelModel;

        self.onClickFun();
    },

    getFloorLable : function(labelInfoArr, id){
        var self = this;

        self.labelModel.curID = id;

        self.labelModel.modelArr = [];
        for(var i = 0; i < 10; i++)
        {
            if(!utilities.checkStringEmpty(labelInfoArr[i]))
            {
                self.labelModel.modelArr[i] = labelInfoArr[i];
            }
            else
            {
                self.labelModel.modelArr[i] = null;
            }

        }
        self.scope.$apply();
    },

    onClickFun : function(){
        var self = this;

        self.scope.labelSubmit = function(index, keyWords){
            var params = {
                "floorId": self.labelModel.curID,
                "index": index
            };
            if(!utilities.checkStringEmpty(keyWords))
            {
                params.label = keyWords;
            }

            floorInfoFun.modFloorLabel(params, function(){
                _CommonFuntion.dialog("操作成功");
                //homeFloorInfoCtrl.getFloorInfo(self.labelModel.curID);
                //homeFloorInfoCtrl.scope.currentTab = 'three';
            })
        }
    }
};

//brand
var floorBrandCtrl = {
    scope : null,

    brandModel : {
        modelArr : [],
        optionArr : [],
        curID : null
    },

    init : function($scope){
        var self = this;
        self.scope = $scope;

        self.scope.brandModel = self.brandModel;

        self.getBrand();

        self.onClickFun();

    },

    getCurFloorBrand : function(brandInfoArr, id){
        var self = this;

        self.brandModel.curID = id;

        self.brandModel.modelArr = [];
        for(var i = 0; i < 5; i++)
        {
            if(!utilities.checkStringEmpty(brandInfoArr[i]))
            {
                self.brandModel.modelArr[i] = brandInfoArr[i];
            }
            else
            {
                self.brandModel.modelArr[i] = false;
            }

        }
        self.scope.$apply();

    },

    onClickFun : function(){
        var self = this;

        self.scope.brandSubmit = function(index, brandId){
            var params = {
                "floorId": self.brandModel.curID,
                "index": index
            };
            if(!utilities.checkStringEmpty(brandId))
            {
                params.brandId = brandId;
            }

            floorInfoFun.modFloorBrand(params, function(){
                _CommonFuntion.dialog("操作成功");
                homeFloorInfoCtrl.getFloorInfo(self.brandModel.curID);
                homeFloorInfoCtrl.scope.currentTab = 'four';
            })
        }
    },

    //获得brandList
    getBrand : function(){
        var self = this;

        self.brandModel.optionArr = [];
        var params = {
            "startIndex" : 0,
            "num" : 0
        };
        goodsListFun.getBrandList(params, function(data){
            var brandData = data.data;
            for(var i = 0; i < brandData.length; i++)
            {
                self.brandModel.optionArr.push({
                    "id" : brandData[i].brand_id,
                    "name" : brandData[i].brand_name
                });
            }

            self.scope.$apply();
        })
    }
};

var floorInfoFun = {
    modFloor : function(params, callback){
        $data.HttpRequest(dataApi.API_MOD_FLOOR, params, callback);
    },

    modFloorLabel : function(params, callback){
        $data.HttpRequest(dataApi.API_MOD_FLOOR_LABEL, params, callback);
    },

    modFloorBrand : function(params, callback){
        $data.HttpRequest(dataApi.API_MOD_FLOOR_BRAND, params, callback);
    },

    checkParams : function(params){
        if(utilities.checkStringEmpty(params.param))
        {
            if(params.type == 0)
            {
                _CommonFuntion.dialog("请输入跳转关联URL");
            }
            if(params.type == 2)
            {
                _CommonFuntion.dialog("请输入关键字");
            }
            if(params.type == 1)
            {
                _CommonFuntion.dialog("请上传跳转图片");
            }

            return false;
        }
        if(utilities.checkStringEmpty(params.icon))
        {
            _CommonFuntion.dialog("请上传活动图");
            return false;
        }

        return true;
    }
};