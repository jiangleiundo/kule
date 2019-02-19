routerApp.controller('OrderSearchCtrl', ['$scope', function($scope){
	OrderSearchCtrl.init($scope);
}]);

var OrderSearchCtrl = {
    scope : null,

    orderModel : {
        orderListArr : [],
        orderNo : null,
        orderBuyer : null,
        orderAccept : null,
        orderPhone : null,
        isSearchShow : true,
        isShowDetial : false, //是否显示详情
        isShowDeliver : false, //是否显示发货
        isShowInfo : false, //是否显示详情
        logisticsNum : null, //物流单号
        orderTips : null, //退货提示
        isTraces : true, //物流与退货物流
        isRefund : false //申请
    },

    currentIndex : null,//当前点击对象的index
    isAlwaysClick : false,//防止用户连续点击

    init : function($scope){
        var self = this;
        self.scope = $scope;

        //初始化数据
        self.orderModel.orderAccept = null;
        self.orderModel.orderBuyer = null;
        self.orderModel.orderNo = null;
        self.orderModel.orderPhone = null;
        self.orderModel.isSearchShow = true;
        self.orderModel.isShowDetial = false;
        self.currentIndex = null;
        self.orderModel.isShowInfo = false;
        self.orderModel.isShowDeliver = false;

        //点击事件
        this.onClickFun($scope);
        //初始化绑定model
        $scope.orderModel = self.orderModel;

    },

    onClickFun : function ($scope) {
        var self = this;

        //搜索
        this.scope.searchOrder = function (num, buyer, accept, phone) {
            var params = {};
            if(num != null)
            {
                params.orderId = num
            }
            if(buyer != null)
            {
                params.buyer = buyer;
            }
            if(accept != null)
            {
                params.acceptName = accept
            }
            if(phone != null)
            {
                params.phone = phone;
            }

            if(orderSearchFun.checkParams(num, buyer, accept, phone))
            {
                self.getSearchData($scope, params);
                self.orderModel.isSearchShow = false;
            }
        };

        //返回搜索界面
        this.scope.backToSearch = function(){
            self.orderModel.isSearchShow = true;
        }


    },

    getSearchData : function($scope, params){
        var self = this;

        pageController.pageInit($scope, dataApi.API_SEARCH_ORDER, params, function(data){

            if(pageParams.num != 0)
            {
                var pageNum = Math.ceil(data.count / pageParams.num);
                pageController.pageNum(pageNum);
            }
            self.orderModel.orderListArr = [];

            //处理数据
            for(var i = 0; i < data.orders.length; i++)
            {
                var order = data.orders[i];

                self.orderModel.orderListArr.push({
                    'orderNo': order.order_no,
                    'userId': order.userId,
                    'carriage': order.carriage,//运费
                    'acceptName': order.acceptName,//收货人
                    'addressInfo': order.acceptName + " " + order.province + order.city + order.district + order.address,
                    'mobile': order.mobile,
                    'totalPrice': order.totalPrice,
                    'orderStatus': order.orderStatus,
                    'orderStatusCopy': orderListFun.orderStatus(order.orderStatus),
                    'orderTime': utilities.formatDate(order.orderTime, true),
                    'nickName': order.nickName,
                    'orderGoods': order.orderGoods
                })
            }

            //bing model
            $scope.orderModel = self.orderModel;
            $scope.$apply();

            //查看详情
            $scope.checkDetial = function(curId, curIndex){
                self.orderModel.isShowDeliver = false;//查看详情是发货隐藏
                self.getOrderDetials($scope, curId, 1);
                self.currentIndex = curIndex;

                //上一单
                $scope.prevOrder = function(){
                    if(self.currentIndex == 0 || self.currentIndex == null)
                    {
                        _CommonFuntion.dialog("没有更多数据了，点击下一个订单试试");
                        return;
                    }
                    self.currentIndex--;
                    var curId = self.orderModel.orderListArr[self.currentIndex].orderNo;
                    if(!self.isAlwaysClick)
                    {
                        self.isAlwaysClick = true;
                        self.getOrderDetials($scope, curId, 1);
                    }
                };

                //下一单
                $scope.nextOrder = function(){
                    if(self.currentIndex == self.orderModel.orderListArr.length - 1 || self.currentIndex == null)
                    {
                        _CommonFuntion.dialog("没有更多数据了，点击上一个订单试试");
                        return;
                    }
                    self.currentIndex++;
                    var curId = self.orderModel.orderListArr[self.currentIndex].orderNo;
                    if(!self.isAlwaysClick)
                    {
                        self.isAlwaysClick = true;
                        self.getOrderDetials($scope, curId, 1);
                    }
                };

                //详情返回
                $scope.detialBack = function(){
                    self.orderModel.isShowInfo = false;
                    self.orderModel.isShowDetial = false;
                }

            };


            //查看发货
            self.scope.deliverGoods = function(orderNo){

                orderListFun.getOrderStatus(orderNo, function(data){
                    var orderStatus = data.orderStatus;
                    if(2 != orderStatus)
                    {
                        _CommonFuntion.dialog("订单状态不正确");
                        self.getOrderList();//提交数据后重新加载数据
                    }
                    else
                    {
                        self.checkDeliverGoods(orderNo);
                    }
                });

            };

            //确认收货
            $scope.payBack = function(orderNo){

                orderListFun.getOrderStatus(orderNo, function(data){
                    var orderStatus = data.orderStatus;
                    if(8 != orderStatus)
                    {
                        _CommonFuntion.dialog("订单状态不正确");
                        OrderListCtrl.getOrderList();//提交数据后重新加载数据
                    }
                    else
                    {
                        $("#orderTips").fadeIn();
                        self.orderModel.orderTips = "你确认要退款吗？";

                        var params = {
                            "orderId" : orderNo
                        };
                        //取消
                        self.scope.clickForQuit = function(){
                            $("#orderTips").fadeOut();
                        };

                        //确定
                        self.scope.clickForSure = function(){
                            orderListFun.yesReturnedRefund(params, function(){
                                $("#orderTips").fadeOut();
                                _CommonFuntion.dialog("退款成功");
                                self.getOrderList();//提交数据后重新加载数据
                            });
                        }
                    }
                });
            };

            //审核
            $scope.refundModel = function(orderNo){

                orderListFun.getOrderStatus(orderNo, function(data){
                    var orderStatus = data.orderStatus;
                    if(orderStatus != 6)
                    {
                        _CommonFuntion.dialog("订单状态不正确");
                        OrderListCtrl.getOrderList();//提交数据后重新加载数据
                    }
                    else
                    {
                        self.orderModel.isShowDetial = true;
                        self.orderModel.isRefund = true;//审核页面显示
                        //审核函数
                        self.getReturnRefund($scope, orderNo);
                    }
                });

            };

            //导出
            $scope.exportData2 = function () {
                var blob = new Blob([document.getElementById('exportable2').innerHTML], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                });
                saveAs(blob, "订单文件.xls");
            }

        })
    },

    checkDeliverGoods : function(orderNo){
        var self = this;

        self.orderModel.isShowInfo = false;//发货时详情隐藏
        self.getOrderDetials(self.scope, orderNo, 2);

        //点击发货
        self.scope.deliverOnClick = function(orderNo, logisticsNum, type){
            var params = {
                "orderId" : orderNo
            };
            if(type == 1)
            {
                if(utilities.checkStringEmpty(logisticsNum))
                {
                    _CommonFuntion.dialog("请输入物流单号");
                    return;
                }
                params.logistics_no = logisticsNum;

                //提交数据
                orderListFun.deliverGoods(params, function(){
                    _CommonFuntion.dialog("发货成功");
                    self.orderModel.isShowDetial = false;
                    //self.searchJump();

                    indexCtrl.getReminds();//刷新消息提醒
                })
            }
            else//发送到海关
            {
                $data.HttpRequest(dataApi.API_REPORT_CUSTOMS, params, function(){
                    _CommonFuntion.dialog("上报成功");
                    self.orderModel.isShowDetial = false;
                    self.getOrderList();//提交数据后重新加载数据
                });
            }
        };

        //发货返回
        self.scope.deliverBack = function(){
            self.orderModel.isShowDetial = false;
            self.orderModel.isShowDeliver = false;
        }
    },

    //获取订单详情
    /*
     * curId 当前点击的订单号
     * style 1：查看详情；2：发货；3：审核
     * */
    getOrderDetials : function($scope, curId, style){
        var self = this;
        orderListFun.getOrderInfo(curId, function(data){

            var order = data.orderInfo;
            self.orderDetialModel = data.orderInfo;
            //商品基本信息
            self.orderDetialModel.orderNo = order.order_no;
            self.orderDetialModel.goodsType = JSON.parse(order.goodsType); //1:境内，2：境外
            self.orderDetialModel.addressInfo = order.province + order.city + order.district + order.address;
            self.orderDetialModel.orderStatusCopy = orderListFun.orderStatus(order.orderStatus);
            self.orderDetialModel.payTypeCopy = orderListFun.payType(order.payType);
            self.orderDetialModel.deliveryTypeCopy = orderListFun.deliveType(order.deliveryType);
            self.orderDetialModel.orderTimeCopy = utilities.formatDate(order.orderTime, true);
            self.orderDetialModel.payTimeCopy = utilities.formatDate(order.payTime, true);


            //商品信息
            var orderGoods = order.orderGoods;
            var orderGoodsArr = [];
            for(var i = 0; i < orderGoods.length; i++)
            {
                var imgStr = JSON.parse(orderGoods[i].goodsInfo.goods_img)[0];
                orderGoodsArr.push({
                    'goodImgCopy' : utilities.isContains(imgStr)? imgStr : BASE_IMG_URL + imgStr,
                    'goodNameCopy' : orderGoods[i].goodsInfo.goods_name + " " + orderGoods[i].goodsInfo.goodsSku.goods_sku_name,
                    'goodIdCopy' : orderGoods[i].goodsInfo.goods_id,
                    'goodPriceCopy' : JSON.parse(orderGoods[i].goodsInfo.goodsSku.price),
                    'goodNumCopy' : JSON.parse(orderGoods[i].goodsNum),
                    'goodWeightCopy' : JSON.parse(orderGoods[i].goodsInfo.goodsSku.goods_weight),
                    'goodTotalPrice' : JSON.parse(orderGoods[i].goodsInfo.goodsSku.price) * JSON.parse(orderGoods[i].goodsNum),

                })
            }

            if(style == 1)
            {
                //发票信息
                if(!utilities.checkStringEmpty(order.invoiceInfo))
                {
                    var invoice = JSON.parse(order.invoiceInfo);
                    var invoiceArr = Object.keys(invoice);//该方法返回对象的可枚举属性名组成的数组
                    invoice.lengthCopy = invoiceArr.length;
                    $scope.invoiceModel = invoice;
                    $("#receiptInfo").show();
                }
                else
                {
                    $("#receiptInfo").hide();
                }

                //订单状态
                var orderLogs = order.orderLogs;
                var orderLogsArr = [];
                for(var j = 0; j < orderLogs.length; j++)
                {
                    orderLogsArr.push({
                        'orderStatusCopy': orderListFun.orderStatus(orderLogs[j].orderStatus),
                        'statusTimeCopy': utilities.formatDate(orderLogs[j].statusTime, false)
                    })
                }

                //物流详情
                var tracesCopy = order.traces;
                var tracesArr = [];
                for(var k = 0; k < tracesCopy.length; k++)
                {
                    tracesArr.push({
                        "AcceptTimeCopy" : tracesCopy[k].AcceptTime,
                        "AcceptStationCopy" : tracesCopy[k].AcceptStation
                    })
                }

                //退货物流
                var returnTracesCopy = order.returnTraces;
                var returnTracesArr = [];
                if(returnTracesCopy)
                {
                    for(var i = 0; i < returnTracesCopy.length; i++)
                    {
                        returnTracesArr.push({
                            "AcceptTimeCopy" : returnTracesCopy[i].AcceptTime,
                            "AcceptStationCopy" : returnTracesCopy[i].AcceptStation
                        })
                    }
                }

                $scope.returnTracesModel = returnTracesArr;//退货物流
                $scope.tracesModel = tracesArr;//物流详情订单
                $scope.orderLogsModel = orderLogsArr;//订单状态model
                self.orderModel.isShowInfo = true;

                //切换物流
                $scope.checkTraces = function(){
                    self.orderModel.isTraces = true;
                };
                $scope.checkTraces2 = function(){
                    self.orderModel.isTraces = false;
                };

                //导出
                $scope.toExcel = function () {
                    var blob = new Blob([document.getElementById('htmlToExcel').innerHTML], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                    });
                    saveAs(blob, "详情文件.xls");
                }
            }

            if(style == 2)
            {
                self.orderModel.isShowDeliver = true;
            }

            $scope.orderGoodsModel = orderGoodsArr;
            $scope.orderDetialModel = self.orderDetialModel;
            $scope.$apply();

            //
        });

        self.orderModel.isShowDetial = true;
        self.isAlwaysClick = false;//接口调成功之后才能执行下一次点击事件
    },

    //申请信息
    getReturnRefund : function($scope, orderNo){
        var self = this;
        self.curOrderID = orderNo;
        var params = {
            "orderId" : orderNo
        };
        orderListFun.getReturnRefund(params, function(data){
            var refundInfo = data.refundInfo;
            if(refundInfo != null)
            {
                var refundObj = {};
                refundObj.typeCopy = refundInfo.type;
                refundObj.valueCopy = refundInfo.value;
                refundObj.descCopy = refundInfo.desc;
                refundObj.imageCopy2 = refundInfo.image == ""? 0 : 1;//判断是否显示图片
                refundObj.imageCopy = utilities.isContains(refundInfo.image)? refundInfo.image : BASE_IMG_URL + refundInfo.image;
                refundObj.reasonCopy = orderListFun.reason(refundInfo.reason);

                $scope.refundInfoModel = refundObj;
                $scope.$apply();
            }

            //同意申请
            $scope.agreeRefund = function(){
                var params = {
                    "orderId" : self.curOrderID
                };
                orderListFun.aggreeReturnRefund(params, function(result){
                    self.orderModel.isShowDetial = false;
                    self.orderModel.isRefund = false;//操作成功后恢复隐藏状态
                    _CommonFuntion.dialog("已同意");
                    self.getOrderList($scope);//提交数据后重新加载数据
                })
            };

            //拒绝申请
            $scope.refuseRefund = function(){
                var params = {
                    "orderId" : self.curOrderID
                };
                orderListFun.refuseReturnRefund(params, function(result){
                    self.orderModel.isShowDetial = false;
                    _CommonFuntion.dialog("已同意");
                    self.getOrderList($scope);//提交数据后重新加载数据
                })
            };

            //申请返回
            $scope.refundBack = function(){
                self.orderModel.isRefund = false;//审核页面显示
                self.orderModel.isShowDetial = false;
            }
        })

    }
};

//orderSearch function
var orderSearchFun = {
    checkParams : function(num, buyer, accept, phone){
        if(num == null && buyer == null && accept == null && phone == null)
        {
           _CommonFuntion.dialog("请至少输入一个搜索项");
            return false;
        }
        return true;
    }
};
