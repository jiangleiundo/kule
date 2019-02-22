var classificationContentCtrl = {
    scope : null,
    goodsTypeModel : {
        selectAll : false,
        goodsTypeArr : []
    },

    init : function ($scope) {

        this.scope = $scope;
        this.getGoodsType();
    },

    getGoodsType : function () {
        var self = this;

        var params = {
            "parentId" : 0,
            "level" : 3
        };
        pageController.pageInit(this.scope,dataApi.API_GET_GOODSCATEGORIES,params,function (data) {
            self.goodsTypeModel.goodsTypeArr = [];
            //列表数据模型
            if (pageParams.num != 0)
            {
                var pageNum = Math.ceil(data.count / pageParams.num);
                pageController.pageNum(pageNum);
            }

            //取出服务端赋给Model
            for (var i = 0; i < data.categories.length; ++i)
            {
                var goodsTypeObj = data.categories[i];
                self.goodsTypeModel.goodsTypeArr.push({
                    "selected" : false,
                    "cat_id" : goodsTypeObj.cat_id,
                    "parent_id" : goodsTypeObj.parent_id,
                    "cat_name" : goodsTypeObj.cat_name,
                    "cat_icon" : goodsTypeObj.cat_icon,
                    "sort_order" : goodsTypeObj.sort_order,
                    "taxrate" : goodsTypeObj.taxrate,
                    "goods_num" : goodsTypeObj.goods_num,
                    "child" : goodsTypeObj.child
                });
            }

            self.scope.goodsTypeModel = self.goodsTypeModel;
            self.scope.$apply();
        })
    }
};

