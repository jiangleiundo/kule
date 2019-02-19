

var postGoodsCtrl = {

    scope: null,
    timeout: null,

    goodsInfoModel : {
        showClassify : false, //是否显分类
        showClassifyBtn : true, //是否显分类
        curID : null, //标记页面的ID

        goodsPics : [],
        wordsPics : [],
        goodsSingleObj : null,
        goodsId : null,//添加商品返回的goodsId
        classifyArr : []
    },

    //详情和修改选项
    optionModel2 : {
        classifyOneArr : [],
        classifyTwoArr : [],
        classifyThrArr : [],
        brandArr : [],
        tagsArr : [],
        goodsStyleArr : [],
        goodsStyleId : null,
        optionSelOne : null,
        optionSelTwo : null,
        optionSelThr : null,
        optionSelBrand : null,
        optionSelTag : null,
        optionSelTagId : null
    },

    init: function ($scope) {
        this.scope = $scope;
        var self = this;

        //获取一级分类
        self.getClassify1(null, null, null);

        self.onClickFun();

        //上传图片
        upLoadFun.uploadPic3();
        upLoadFun.uploadPic4();

        self.scope.optionModel2 = self.optionModel2;
        self.scope.goodsInfoModel = self.goodsInfoModel;

        //判断添加or编辑
        self.isAddGoods();
    },

    //跳转页面获取ID
    getGoodsById : function(id){
        var self = this;
        self.goodsInfoModel.curID = id;
    },

    //判断是否是添加
    isAddGoods : function(){
        var self = this;

        //待修改
        self.getTags();
        self.optionModel2.optionSelTag = null;

        self.goodsInfoModel.showClassify = false;

        if(self.goodsInfoModel.curID != null)
        {
            self.reFreshData();
            self.getCurGoodsInfo(self.goodsInfoModel.curID, 1);
            self.goodsInfoModel.showClassifyBtn = true;

        }
        else
        {//add
            self.getBrand('');
            self.setGoodsStyleArr('');
            self.reFreshData();
            self.goodsInfoModel.showClassifyBtn = false;
        }
    },

    //刷新数据
    reFreshData : function(){
        var self = this;
        self.goodsInfoModel.goodsPics = [];
        self.goodsInfoModel.wordsPics = [];
        self.goodsInfoModel.goodsSingleObj = null;
        self.optionModel2.optionSelTag = null;
        self.optionModel2.optionSelTagId = null;
    },

    //获取当前点击页面obj*--type:1 表示修改界面调用，2表示添加界面调用
     getCurGoodsInfo : function(id, type){
        var self = this;

        var params = {
            "goodsId" : id
        };
        goodsListFun.getSingleGoods(params, function(data){
            self.goodsInfoModel.goodsSingleObj = data.goodsData;
            self.goodsInfoModel.classifyArr = data.goodsData.categoryPath;

            var singleObj = self.goodsInfoModel.goodsSingleObj;

            if(type == 1)
            {
                var id1 = self.goodsInfoModel.classifyArr[0];
                var id2 = self.goodsInfoModel.classifyArr[1];
                var id3 = self.goodsInfoModel.classifyArr[2];
                self.getBrand(singleObj.brand_id);
                self.setGoodsStyleArr(singleObj.goods_type);
                self.getPics(singleObj);
                self.getClassify1(id1, id2, id3);

                //获得tag名
                if(!utilities.checkStringEmpty(singleObj.tag_id))
                {
                    self.scope.searchTag = self.finderTagName(self.optionModel2.tagsArr, singleObj.tag_id);
                }

                postModalCtr.postModel.curGoodsType = singleObj.goods_type;//修改商品时
            }

            postModalCtr.setGoodsAttr(singleObj, id)
        })
    },

    //获取图片
    getPics : function(singleObj){

        var self = this;
        var pics = JSON.parse(singleObj.goods_img);
        for(var i = 0; i < pics.length; i++)
        {
            self.goodsInfoModel.goodsPics.push({
                "picUrl": utilities.isContains(pics[i])? pics[i] : BASE_IMG_URL + pics[i]
            })
        }
        self.scope.delPics = function(idx){
            self.goodsInfoModel.goodsPics.splice(idx,1);
        };

        var pics2 = JSON.parse(singleObj.goods_detail);
        for(var j = 0; j < pics2.length; j++)
        {
            self.goodsInfoModel.wordsPics.push({
                "picUrl": utilities.isContains(pics2[j])? pics2[j] : BASE_IMG_URL + pics2[j]
            })
        }
        self.scope.delPics2 = function(idx){
            self.goodsInfoModel.wordsPics.splice(idx,1);
        };
    },

    //获得brandList
    getBrand : function(id){
        var self = this;
        var params = {
            "startIndex" : 0,
            "num" : 0
        };
        goodsListFun.getBrandList(params, function(data){
            var brandData = data.data;
            self.optionModel2.brandArr = [];
            for(var i = 0; i < brandData.length; i++)
            {
                self.optionModel2.brandArr.push({
                    "id" : brandData[i].brand_id,
                    "name" : brandData[i].brand_name
                });
            }

            self.scope.brandSel2 = id;
            self.scope.$apply();

            self.scope.selBrand2 = function(id){
                self.optionModel2.optionSelBrand = id;//选中的品牌ID
            }
        })
    },

    //获得标签
    getTags : function(){
        var self = this;
        var params = {
            "startIndex": 0,
            "num": 999
        };
        goodsTagFun.getGoodsTag(params, function(data){
            self.optionModel2.tagsArr = data.tags;
        })
    },

    finderTagName : function(arr, id){

        for(var i = 0; i < arr.length; i++)
        {
            if(id == arr[i].tag_id)
            {
                return arr[i].tagname;
            }
        }
    },

    //点击事件
    onClickFun : function(){
        var self = this;

        //搜索tags
        self.scope.focus = function(){
            $(".tag_sel_box").show();
        };

        self.scope.blur = function(){
            setTimeout(function(){
                $(".tag_sel_box").hide();
            }, 300);
        };

        //点击选择tags
        self.scope.selectTag = function(tagname, id){
            self.scope.searchTag = tagname;
            self.optionModel2.optionSelTag = tagname;
            self.optionModel2.optionSelTagId = id;
        };

        //切换分类与商品内容
        self.scope.showGoodsInfo = function(){
            self.goodsInfoModel.showClassify = false;
        };
        self.scope.showGoodsClassify = function(){//分类
            self.goodsInfoModel.showClassify = true;//添加数据成功后跳转页面
        };

        //提交数据
        self.scope.clickSubmit = function(name){
            if(self.goodsInfoModel.curID != null)
            {
                self.submitModData(name);
            }
            else
            {
                self.submitAddData(name);
            }
        };

    },

    //提交新增数据
    submitAddData : function(name){
        var self = this;
        var params = self.goodsParams(name);
        if(params != null)
        {
            postGoodsFun.addGoods(params, function(data){
                self.goodsInfoModel.goodsId = data.goodsId;

                self.getCurGoodsInfo(self.goodsInfoModel.goodsId, 2);//添加成功后掉一次数据
                self.goodsInfoModel.showClassifyBtn = true;
                self.goodsInfoModel.showClassify = true;//添加数据成功后跳转页面
                self.scope.$apply();
            })
        }
    },

    //提交修改数据
    submitModData : function(name){
        var self = this;

        var params = self.goodsModParams(name);
        if(params != null)
        {
            postGoodsFun.modGoods(params, function(){
                _CommonFuntion.dialog("修改信息成功");
                location.href = URL_CONST.GOODS_LIST;
            });
            self.submitModTag();
        }

    },

    //提交goodsTag
    submitModTag : function(){
     var self = this;

        var paramsTag = self.goodsModTagParams();
        if(!utilities.checkStringEmpty(paramsTag.tagName))
        {
            postGoodsFun.modGoodsTag(paramsTag, function(){});
        }
    },

    //修改goodstag
    goodsModTagParams : function(){
        var self = this;
        var paramsTag = {
            "goodsId": self.goodsInfoModel.curID
        };
        if(self.optionModel2.optionSelTag != null)//标签
        {
            paramsTag.tagName = self.optionModel2.optionSelTag;
        }

        return paramsTag;
    },

    //修改提交的参数
    goodsModParams : function(name){
        var self = this;
        var modData = {};
        var params = {
            "goodsId": self.goodsInfoModel.curID
        };

        if(self.optionModel2.optionSelTagId != null)//标签
        {
            modData.tag_id = self.optionModel2.optionSelTagId;
        }
        if(!utilities.checkStringEmpty(name))
        {
            modData.goods_name = name;
        }
        else
        {
            _CommonFuntion.dialog("商品名称不能为空");
            return null;
        }
        if(self.optionModel2.goodsStyleId != null)//商品类型
        {
            modData.goods_type = self.optionModel2.goodsStyleId;
        }
        if(self.optionModel2.optionSelThr != null)//选择分类
        {
            modData.cat_id = self.optionModel2.optionSelThr;
        }
        if(self.optionModel2.optionSelBrand != null)//品牌
        {
            modData.brand_id = self.optionModel2.optionSelBrand;
        }
        if(self.goodsInfoModel.goodsPics.length > 0)
        {
            var picArr = utilities.sliceHttp(self.goodsInfoModel.goodsPics);
            modData.goods_img = JSON.stringify(picArr);
        }
        else
        {
            _CommonFuntion.dialog("请上传商品图片");
            return null;
        }
        if(self.goodsInfoModel.wordsPics.length > 0)
        {
            var picArr2 = utilities.sliceHttp(self.goodsInfoModel.wordsPics);
            modData.goods_detail = JSON.stringify(picArr2);
        }
        else
        {
            _CommonFuntion.dialog("请上传图文详情");
            return null;
        }

        params.modData = JSON.stringify(modData);

        return params;
    },

    //添加提交的参数
    goodsParams : function(name){
        var self = this;
        var params = {};
        if(!utilities.checkStringEmpty(name))
        {
            params.goodsName = name;
        }
        else
        {
            _CommonFuntion.dialog("商品名称不能为空");
            return null;
        }
        if(self.optionModel2.goodsStyleId != null)//商品类型
        {
            params.goodsType = self.optionModel2.goodsStyleId;
        }
        if(self.optionModel2.optionSelThr != null)//选择分类
        {
            params.catId = self.optionModel2.optionSelThr;
        }
        else
        {
            _CommonFuntion.dialog("请选择商品分类");
            return null;
        }
        if(self.optionModel2.optionSelBrand != null)//品牌
        {
            params.brandId = self.optionModel2.optionSelBrand;
        }
        else
        {
            _CommonFuntion.dialog("请选择商品品牌");
            return null;
        }
        if(self.optionModel2.optionSelTag != null)//标签
        {
            params.tagName = self.optionModel2.optionSelTag;
        }
        if(self.goodsInfoModel.goodsPics.length > 0)
        {
            var picArr = utilities.sliceHttp(self.goodsInfoModel.goodsPics);
            params.goodsImg = JSON.stringify(picArr);
        }
        else
        {
            _CommonFuntion.dialog("请上传商品图片");
            return null;
        }
        if(self.goodsInfoModel.wordsPics.length > 0)
        {
            var picArr2 = utilities.sliceHttp(self.goodsInfoModel.wordsPics);
            params.goodsDetail = JSON.stringify(picArr2);
        }
        else
        {
            _CommonFuntion.dialog("请上传图文详情");
            return null;
        }
        return params;
    },

    setGoodsStyleArr : function(id){
        var self = this;

        //商品类型
        self.scope.goodsStyleSel = id;
        self.optionModel2.goodsStyleId = id;
        self.optionModel2.goodsStyleArr =
        [
            {"id" : "1", "name" : "境内"},
            {"id" : "2", "name" : "境外"}
        ];

        self.scope.selGoodsStyle = function(styleId){
            self.optionModel2.goodsStyleId = styleId;
            postModalCtr.postModel.curGoodsType = styleId;//添加商品时
        }
    },

    //一级商品分类
    getClassify1 : function(id1, id2, id3){
        var self = this;
        var params = {
            "parentId": 0
        };
        goodsListFun.getEveryClassifyList(params, function(data){
            self.optionModel2.classifyOneArr = [];
            self.optionModel2.classifyTwoArr = [];
            self.optionModel2.classifyThrArr = [];
            var categories = data.categories;
            for(var i =0; i < categories.length; i++)
            {
                self.optionModel2.classifyOneArr.push({
                    "id": categories[i].cat_id,
                    "name": categories[i].cat_name
                })
            }

            if(id1 != null)
            {
                self.scope.classOneSel = id1;
                self.getClassify2(id1, id2, id3);
            }
            else
            {
                self.scope.classOneSel = "";
            }

            self.scope.$apply();

            self.scope.oneSelChange = function(id)
            {
                if(!utilities.checkStringEmpty(id))
                {
                    self.optionModel2.optionSelOne = id;
                    self.getClassify2(id, id2, id3);
                }
            }
        })
    },

    //2级商品分类
    getClassify2 : function(id, id2, id3){
        var self = this;
        var params = {
            "parentId": id
        };
        goodsListFun.getEveryClassifyList(params, function(data){
            self.optionModel2.classifyTwoArr = [];
            self.optionModel2.classifyThrArr = [];
            var categories = data.categories;
            for(var i =0; i < categories.length; i++)
            {
                self.optionModel2.classifyTwoArr.push({
                    "id": categories[i].cat_id,
                    "name": categories[i].cat_name
                })
            }

            if(id2 != null)
            {
                self.scope.classTwoSel = id2;
                self.getClassify3(id2, id3);
            }
            else
            {
                self.scope.classTwoSel = "";
            }
            self.scope.$apply();

            self.scope.twoSelChange = function(id)
            {
                if(!utilities.checkStringEmpty(id))
                {
                    self.optionModel2.optionSelTwo = id;
                    self.getClassify3(id, id3);
                }
            }
        })
    },

    //2级商品分类
    getClassify3 : function(id, id3){
        var self = this;
        var params = {
            "parentId": id
        };
        goodsListFun.getEveryClassifyList(params, function(data){
            self.optionModel2.classifyThrArr = [];
            var categories = data.categories;
            for(var i =0; i < categories.length; i++)
            {
                self.optionModel2.classifyThrArr.push({
                    "id": categories[i].cat_id,
                    "name": categories[i].cat_name
                })
            }

            if(id3 != null)
            {
                self.scope.classThrSel = id3;
            }
            else
            {
                self.scope.classThrSel = "";
            }
            self.scope.$apply();

            self.scope.thrSelChange = function(id)
            {
                if(!utilities.checkStringEmpty(id))
                {
                    self.optionModel2.optionSelThr = id;
                }
            }
        })
    },

    //上传图片
    showResponse_1 : function(responseText, statusText){
        if(statusText == "success")
        {
            var url = responseText.data.url;
            postGoodsCtrl.goodsInfoModel.goodsPics.push({
                "picUrl": BASE_IMG_URL + url
            });
            postGoodsCtrl.scope.$apply();

            postGoodsCtrl.scope.delPics = function(idx){
                postGoodsCtrl.goodsInfoModel.goodsPics.splice(idx,1);
            }

        }
    },

    //上传图片
    showResponse_2 : function(responseText, statusText){
        if(statusText == "success")
        {
            var url = responseText.data.url;
            postGoodsCtrl.goodsInfoModel.wordsPics.push({
                "picUrl": BASE_IMG_URL + url
            });
            postGoodsCtrl.scope.$apply();

            postGoodsCtrl.scope.delPics2 = function(idx){
                postGoodsCtrl.goodsInfoModel.wordsPics.splice(idx,1);
            }
        }
    }

};

var postModalCtr = {
    scope : null,

    postModel : {
        attrValListArr : [],
        attrValListArr2 : [],
        goodsSkuArr : [],
        attrTypeArr : [],
        curGoodsID : null, //标记页面的ID
        curGoodsType : null, //标记当前商品是1境内还是2境外
        curSkuID : null, //标记当前skuID

        //属性分类
        modalTitle : null, //modal标题
        attrTitle : null,//分类属性名
        attrName : null,
        attrPic : null,
        attrPrice : null,
        attrStock : null,
        attrWeight : null,

        isAttrType1Exist: false,//一级标题类型是否存在
        isAttrType2Exist: false,//一级标题类型是否存在
        attrType1: null,//一级标题类型
        attrType2: null,//2级标题类型
        attrTypeCopy: null,//根据type判断是否显示上传图片
        attrTitle1: null,//绑定一级标题
        attrTitle2: null,//绑定2级标题
        attrTitleId: null,//添加标题后返回的ID
        attrTitleId2: null,//添加标题后返回的ID
        symbolId: null,//
        symbolId2: null,//

        submitType: null,//提交类型2：添加属性名//3修改属性分类
        addType: null//1,一级，2二级

    },

    init : function($scope){
        this.scope = $scope;
        var self = this;

        self.onClickFun();

        self.scope.postModel = self.postModel;

        self.selData();
    },

    //分类属性设置
    setGoodsAttr : function(singleObj, id){
        var self = this;

        //操作数据
        self.postModel.curGoodsID = id;
        self.postModel.attrValListArr = [];
        self.postModel.attrValListArr2 = [];
        self.postModel.goodsSkuArr = [];
        self.postModel.isAttrType1Exist = false;
        self.postModel.isAttrType2Exist = false;

        $("#addBtnClass1").hide();
        $("#addBtnClass2").hide();

        self.postModel.attrType1 = '1';
        self.postModel.attrType2 = '1';

        if(singleObj.attrValList.length > 0)
        {
            var attrValueArr = singleObj.attrValList;//属性列表

            //第一个属性
            self.postModel.attrValListArr = attrValueArr[0].v;
            for(var i = 0; i < self.postModel.attrValListArr.length; i++)
            {
                var curList = self.postModel.attrValListArr[i];
                if(!utilities.checkStringEmpty(curList.attr_img))
                {
                    curList.attr_img = utilities.isContains(curList.attr_img)? curList.attr_img : BASE_IMG_URL + curList.attr_img;
                }
            }
            self.postModel.attrTitleId = attrValueArr[0].k;
            self.postModel.attrTitle1 = attrValueArr[0].n;
            $("#addBtnClass1").show();
            self.postModel.attrTitle2 = null;
            self.postModel.attrType1 = attrValueArr[0].t;
            self.postModel.isAttrType1Exist = !utilities.checkStringEmpty(attrValueArr[0].t);

            if(attrValueArr.length >1)
            {
                self.postModel.attrValListArr2 = attrValueArr[1].v;
                for(var i = 0; i < self.postModel.attrValListArr2.length; i++)
                {
                    var curList = self.postModel.attrValListArr2[i];
                    if(!utilities.checkStringEmpty(curList.attr_img))
                    {
                        curList.attr_img = utilities.isContains(curList.attr_img)? curList.attr_img : BASE_IMG_URL + curList.attr_img;
                    }
                }
                self.postModel.attrTitle2 = attrValueArr[1].n;
                self.postModel.attrTitleId2 = attrValueArr[1].k;
                $("#addBtnClass2").show();
                self.postModel.attrType2 = attrValueArr[1].t;
                self.postModel.isAttrType2Exist = !utilities.checkStringEmpty(attrValueArr[1].t);
            }
        }
        else
        {
            //添加数据时刷新数据
            self.postModel.attrTitle1 = null;
            self.postModel.attrTitle2 = null;
            self.postModel.attrTitleId = null;
            self.postModel.attrTitleId2 = null;
        }

        if(singleObj.goodsSku.length > 0)
        {
            self.postModel.goodsSkuArr = singleObj.goodsSku;//具体商品
            for(var i = 0; i < singleObj.goodsSku.length; i++)
            {
                self.postModel.goodsSkuArr[i].weight = parseFloat(singleObj.goodsSku[i].goods_weight) * 1000;
                self.postModel.goodsSkuArr[i].price = parseFloat(singleObj.goodsSku[i].price);
                self.postModel.goodsSkuArr[i].stock = parseFloat(singleObj.goodsSku[i].stock);
            }
        }

        self.scope.$apply();
    },

    onClickFun : function(){
        var self = this;

        //返回列表
        self.scope.backToList = function(){
            location.href = URL_CONST.GOODS_LIST;
        };

        //添加标题名type1:一级，2二级
        self.scope.addClassTitle = function(titleName, type){
            if(type == 1)
            {
                if(!utilities.checkStringEmpty( self.postModel.attrTitleId) )
                {
                    var params = {
                        "attrId" : self.postModel.attrTitleId
                    };
                    var modData = {};
                    modData.attr_name = titleName;
                    modData.attr_type = self.postModel.attrType1;
                    params.modData = JSON.stringify(modData);
                    if(!utilities.checkStringEmpty( titleName ))
                    {
                        postGoodsFun.modAttrName(params, function(){
                            _CommonFuntion.dialog("提交成功");
                            $("#addBtnClass1").show();
                            postGoodsCtrl.getCurGoodsInfo(self.postModel.curGoodsID, 2);//刷新数据
                        })
                    }
                }
                else
                {
                    var params = {
                        "goodsId": self.postModel.curGoodsID,
                        "attrName": titleName,
                        "attrType": self.postModel.attrType1
                    };
                    if(!utilities.checkStringEmpty(titleName))
                    {
                        postGoodsFun.addAttrName(params, function(data){
                            self.postModel.attrTitleId = data.attrId;
                            _CommonFuntion.dialog("提交成功");
                            $("#addBtnClass1").show();
                            postGoodsCtrl.getCurGoodsInfo(self.postModel.curGoodsID, 2);//刷新数据
                        })
                    }
                }
            }

            if(type == 2)
            {
                if(!utilities.checkStringEmpty( self.postModel.attrTitleId2) )
                {
                    var params = {
                        "attrId" : self.postModel.attrTitleId2
                    };
                    var modData = {};
                    modData.attr_name = titleName;
                    modData.attr_type = self.postModel.attrType2;
                    params.modData = JSON.stringify(modData);
                    if(!utilities.checkStringEmpty( titleName ))
                    {
                        postGoodsFun.modAttrName(params, function(){
                            _CommonFuntion.dialog("提交成功");
                            $("#addBtnClass2").show();
                            postGoodsCtrl.getCurGoodsInfo(self.postModel.curGoodsID, 2);//刷新数据
                        })
                    }
                }
                else
                {
                    var params = {
                        "goodsId": self.postModel.curGoodsID,
                        "attrName": titleName,
                        "attrType": self.postModel.attrType2
                    };
                    if(!utilities.checkStringEmpty(titleName))
                    {

                        postGoodsFun.addAttrName(params, function(data){

                             self.postModel.attrTitleId2 = data.attrId;
                            _CommonFuntion.dialog("提交成功");
                            $("#addBtnClass2").show();
                            postGoodsCtrl.getCurGoodsInfo(self.postModel.curGoodsID, 2);//刷新数据
                        })
                    }
                }
            }

        };

        //添加属性分类
        self.scope.addAttr = function(type){//此按钮出现在添加产品成功后
            self.postModel.attrTitle = null;
            self.postModel.attrName = null;
            self.scope.PicUrl = null;

            self.postModel.submitType = 2;

            //上传图片
            upLoadFun.uploadPic5();

            self.postModel.addType = type;

            if(type == 1)//添加一级
            {
                $("#postModal").modal("show");
                self.postModel.modalTitle = "添加一级";
                self.postModel.attrTypeCopy = self.postModel.attrType1;
            }
            else if(type == 2)//添加二级
            {
                $("#postModal").modal("show");
                self.postModel.modalTitle = "添加二级";
                self.postModel.attrTypeCopy = self.postModel.attrType2;
            }
        };

        //修改属性分类
        self.scope.modifyAttr = function(symbolId, id, type, name, value, img){
            self.postModel.attrTitle = name;
            self.postModel.attrName = value;
            self.postModel.attrPic = img;
            self.scope.PicUrl = img;

            self.postModel.symbolId = symbolId;

            self.postModel.submitType = 3;

            //上传图片
            upLoadFun.uploadPic5();

            if(type == 1)//一级
            {
                $("#postModal").modal("show");
                self.postModel.modalTitle = "修改一级";
                self.postModel.attrTypeCopy = self.postModel.attrType1;
            }
            else if(type == 2)//二级
            {
                $("#postModal").modal("show");
                self.postModel.modalTitle = "修改二级";
                self.postModel.attrTypeCopy = self.postModel.attrType2;
            }
        };

        //修改sku
        /*
        *
        * */
        self.scope.modifySku = function(path, id, price, stock, weight, index, taxRate, goodNum){


            if(id == 0)
            {
                var params = {
                    "goodsId": self.postModel.curGoodsID,
                    "symbolList": path,
                    "price": price,
                    "goods_weight": weight / 1000,
                    "stock": stock
                };
                if(!utilities.checkStringEmpty(taxRate))
                {
                    params.taxrate = taxRate;
                }
                if(!utilities.checkStringEmpty(goodNum))
                {
                    params.goods_sn = goodNum;
                }
                if(self.checkParams2(params))
                {
                    postGoodsFun.addGoodsSku(params, function(data){
                        self.postModel.goodsSkuArr[index].sku_id = data.skuId;
                        _CommonFuntion.dialog("提交成功");
                        indexCtrl.getReminds();//刷新消息提醒
                    });
                }
            }
            else
            {
                var params = {
                    "skuId": id
                };
                var modData = {};
                modData.symbolList = path;
                modData.price = price;
                modData.goods_weight = weight / 1000;
                modData.stock = stock;
                if(!utilities.checkStringEmpty(taxRate))
                {
                    modData.taxrate = taxRate;
                }
                if(!utilities.checkStringEmpty(goodNum))
                {
                    modData.goods_sn = goodNum;
                }
                params.modData = JSON.stringify(modData);
                postGoodsFun.modGoodsSku(params, function(){
                    _CommonFuntion.dialog("提交成功");
                    indexCtrl.getReminds();//刷新消息提醒
                });
            }
        };

        //删除属性
        self.scope.delAttr = function(symbolId){
            var params = {
                "attrSymbolIds": '['+ symbolId +']'
            };

            postGoodsFun.delAttrValue(params, function(data){
                var resArr = data.delArr;
                if(resArr[0].err == errCode.success)
                {
                    _CommonFuntion.dialog("已删除");
                    postGoodsCtrl.getCurGoodsInfo(self.postModel.curGoodsID, 2);//刷新数据
                }
                else
                {
                    _CommonFuntion.dialog(resArr[0].errMsg);
                }
            });

        };

        //提交数据
        self.scope.postSubmit = function(){

            if(self.postModel.submitType == 2)
            {
                self.submit2();
            }
            if(self.postModel.submitType == 3)
            {
                self.submit3();
            }

        };

        //type:1删除一级属性名，2删除二级属性名
        self.scope.delAttrNameClick = function(type){
            var params = {};
            if(type == 1)
            {
                params.attrIds = '['+ self.postModel.attrTitleId +']';
            }
            if(type == 2)
            {
                params.attrIds = '['+ self.postModel.attrTitleId2 +']';
            }
            self.delAttrName(params);
        }

    },

    //删除属性名
    delAttrName : function(params){
        var self = this;
        postGoodsFun.delAttrName(params, self.delCallback);
    },

    //删除回调
    delCallback : function(data){
        var arr = data.delArr;

        if(arr[0].err == 0)
        {
            _errModal.show("删除成功");
            postGoodsCtrl.getCurGoodsInfo(postModalCtr.postModel.curGoodsID, 2);//刷新数据
        }
        else
        {
            _CommonFuntion.dialog(arr[0].errMsg);
        }
    },

    submit3 : function(){
        var self =this;

        var params = {
            "attrSymbolId": self.postModel.symbolId
        };
        var modData = {};
        modData.attr_value = self.postModel.attrName;
        modData.attr_img =  self.postModel.attrPic;

        params.modData = JSON.stringify(modData);

        if(self.checkParams(1)){
            postGoodsFun.modAttrValue(params, function(data){
                console.log(data);
                $("#postModal").modal("hide");
                _CommonFuntion.dialog("提交成功");

                self.postModel.attrPic = null;

                postGoodsCtrl.getCurGoodsInfo(self.postModel.curGoodsID, 2);//刷新数据
            })
        }

    },

    //提交分类属性
    submit2 : function(){
        var self = this;
        if(!utilities.checkStringEmpty( self.postModel.attrTitleId))
        {
            var params = {
                "goodsId": self.postModel.curGoodsID,
                "attrValue": self.postModel.attrName,
                "attrImg": self.postModel.attrPic
            };
            if(self.postModel.addType == 1)
            {
                params.attrId = self.postModel.attrTitleId;
            }
            if(self.postModel.addType == 2)
            {
                params.attrId = self.postModel.attrTitleId2;
            }

            if(self.checkParams(1))
            {
                postGoodsFun.addAttrValue(params, function(data){

                    $("#postModal").modal("hide");
                    _CommonFuntion.dialog("提交成功");

                    self.postModel.attrPic = null;

                    postGoodsCtrl.getCurGoodsInfo(self.postModel.curGoodsID, 2);//刷新数据
                })
            }
        }

    },

    selData : function(){
        var self = this;

        self.postModel.attrTypeArr = [
            {'id': '1', 'name': '文本类型'},
            {'id': '2', 'name': '图片类型'}
        ];
        self.postModel.attrType1 = '1';
        self.postModel.attrType2 = '1';
    },

    //上传图片
    showResponse_3 : function(responseText, statusText){
        if(statusText == "success")
        {
            postModalCtr.postModel.attrPic = responseText.data.url;
            postModalCtr.scope.PicUrl = BASE_IMG_URL + postModalCtr.postModel.attrPic;//展示图片
            postModalCtr.scope.$apply();
        }
    },

    //checkParams
    checkParams : function(type){
        var self = this;

        if(utilities.checkStringEmpty( self.postModel.attrName))
        {
            alert("请输入属性名");
            return false;
        }

        return true;
    },

    //checkParams
    checkParams2 : function(obj){

        if(obj.price == 0)
        {
            alert("请输入价格");
            return false;
        }
        if(obj.weight == 0)
        {
            alert("请输入重量");
            return false;
        }
        if(obj.stock == 0)
        {
            alert("请输入库存");
            return false;
        }

        return true;
    }
};

var postGoodsFun = {
    //添加
    addGoods : function(params, callback){
        $data.HttpRequest(dataApi.API_ADD_GOODS, params, callback);
    },

    //修改goods
    modGoods : function(params, callback){
        $data.HttpRequest(dataApi.API_MOD_GOODS, params, callback);
    },

    //修改goods
    modGoodsTag : function(params, callback){
        $data.HttpRequest(dataApi.API_MOD_GOODS_TAG, params, callback);
    },

    addAttrName : function(params, callback){
        $data.HttpRequest(dataApi.API_ADD_GOODS_ATTR_NAME, params, callback);
    },

    modAttrName : function(params, callback){
        $data.HttpRequest(dataApi.API_MOD_GOODS_ATTR_NAME, params, callback);
    },

    delAttrName : function(params, callback){
        $data.HttpRequest(dataApi.API_DEL_GOODS_ATTR_NAME, params, callback);
    },

    addAttrValue : function(params, callback){
        $data.HttpRequest(dataApi.API_ADD_GOODS_ATTR_VALUE, params, callback);
    },

    addGoodsSku : function(params, callback){
        $data.HttpRequest(dataApi.API_ADD_GOODS_SKU, params, callback);
    },

    modGoodsSku : function(params, callback){
        $data.HttpRequest(dataApi.API_MOD_GOODS_SKU, params, callback);
    },

    modAttrValue : function(params, callback){
        $data.HttpRequest(dataApi.API_MOD_GOODS_ATTR_VALUE, params, callback);
    },

    delAttrValue : function(params, callback){
        $data.HttpRequest(dataApi.API_DEL_GOODS_ATTR_VALUE, params, callback);
    }
};

