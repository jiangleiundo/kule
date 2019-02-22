//消息提醒
routerApp.controller('indexCtrl', function($scope){
    indexCtrl.init($scope);
});

var indexCtrl = {
    scope : null,

    tipsModel : {},

    init : function($scope){
        var self = this;
        self.scope = $scope;

        self.getReminds();

        self.onClickFn();
    },

    getReminds : function() {
        var self = this;

        $data.HttpRequest(dataApi.API_GET_REMINDS, {}, function (data) {

            self.tipsModel = data.remindsList;
            self.scope.tipsModel = self.tipsModel;
            self.scope.$apply();

            var tipsTotalNum = self.tipsModel.shipping + self.tipsModel.stockNotEnough + self.tipsModel.checkVat + self.tipsModel.checkWithdrawalApply;
            if(tipsTotalNum > 0)
            {
                $("#tipsFlash").attr("class", "fa fa-bell faa-ring animated");
            }
            else
            {
                $("#tipsFlash").attr("class", "fa fa-bell");
            }
        })
    },

    onClickFn : function(){
        var self = this;

        //订单
        self.scope.order = function(order){
            if(order != 0)
            {
                location.href = URL_CONST.ORDER_LIST;

                setTimeout(function(){
                    OrderListCtrl.searchJump();
                }, 100);
            }else{alert("暂无数据");}
        };

        //库存不足
        self.scope.stock = function(stock){
            if(stock != 0)
            {
                location.href = URL_CONST.GOODS_LIST;
                setTimeout(function(){
                    goodsListCtrl.searchJump();
                }, 100)
            }else{alert("暂无数据");}
        };

        //增值税
        self.scope.vat = function(vat){
            if(vat != 0)
            {
                location.href = URL_CONST.VAT_LIST;
                setTimeout(function(){
                    certificationVatCtrl.searchJump();
                }, 100)
            }else{alert("暂无数据");}
        }
    }

};