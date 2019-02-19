routerApp.controller('OrderListCtrl', ['$scope', function($scope){
	OrderListCtrl.init($scope);
}]);

var OrderListCtrl = {
	scope : null,

    orderModel : {
        orderListArr : [], //订单数组
        searchName : "", //搜索参数
        isShowDetial : false, //是否显示详情
        isShowDeliver : false, //是否显示发货
        isShowInfo : false, //是否显示详情
        logisticsNum : null, //物流单号
        orderTips : null, //退货提示
        isTraces : true, //物流与退货物流
        isRefund : false //申请
    },

    refuseModel : {
        msgCon : null,
        modalTitle : null
    },

    orderDetialModel : {},


    selModel : {
        optionArr : [], //订单选项
        curSel : null //当前选项
    },

    currentIndex : null,//当前点击对象的index
    isAlwaysClick : false,//防止用户连续点击
    curOrderID : null,//当前订单ID

	
	init : function($scope){
		this.scope = $scope;
		var self = this;
		
		//初始化orderList
		self.getOrderList(0);

        self.scope.refuseModel = self.refuseModel;

        self.scope.selModel = self.selModel;

        self.reFresh();

        self.onClickFn();
	},

    onClickFn : function(){
        var self = this;
        //导出全部
        self.scope.import = dataApi.API_IMPORT_ORDER_LIST;
    },

    reFresh : function(){
        var self = this;

        //初始化数据
        self.orderModel.isShowDetial = false;
        self.orderModel.isShowInfo = false;
        self.orderModel.isShowDeliver = false;
        self.orderModel.isRefund = false;
        self.currentIndex = null;
    },
    //提示跳转过来
    searchJump : function(){
        var self = this;

        self.selModel.curSel = 2;

        var params = {} ;
        params.orderStatus = 2;

        pageController.searchChange(params);
    },

	//orderList
	getOrderList : function(){
		var self = this;

        pageController.pageInit(self.scope, dataApi.API_GET_ORDER_LIST, {}, function(data){
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
                    'price' : order.price,
                    'totalPrice': order.totalPrice,
                    'orderStatus': order.orderStatus,
                    'orderStatusCopy': orderListFun.orderStatus(order.orderStatus),
                    'orderTime': utilities.formatDate(order.orderTime, true),
                    'nickName': order.nickName,
                    'orderGoods': order.orderGoods
                })
            }

            //bing model
            self.scope.orderModel = self.orderModel;
            self.scope.$apply();

            //查看详情
            self.scope.checkDetial = function(curId, curIndex){
                self.orderModel.isShowDeliver = false;//查看详情是发货隐藏
                self.getOrderDetials(self.scope, curId, 1);
                self.currentIndex = curIndex;

                //上一单
                self.scope.prevOrder = function(){
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
                        self.getOrderDetials(self.scope, curId, 1);
                    }
                };

                //下一单
                self.scope.nextOrder = function(){
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
                        self.getOrderDetials(self.scope, curId, 1);
                    }
                };

                //详情返回
                self.scope.detialBack = function(){
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
                        OrderListCtrl.getOrderList();//提交数据后重新加载数据
                    }
                    else
                    {
                        self.checkDeliverGoods(orderNo);
                    }
                });

            };

            //退款
            self.scope.payBack = function(orderNo){

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
            self.scope.refundModel = function(orderNo){

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
                        self.getReturnRefund(self.scope, orderNo);
                    }
                });

            };

            //搜索
            self.scope.searchOrder = function(optionSel, searchName){
                var sTime = $("#startTime").val();
                var eTime = $("#endTime").val();

                var startTime = sTime + ' ' + '00:00:00';
                var endTime = eTime + ' ' + '23:59:59';
                var params = {};
                if(optionSel != null)
                {
                    params.orderStatus = optionSel;
                }
                if(searchName != "")
                {
                    params.keywords = searchName;
                }
                if(!utilities.checkStringEmpty(sTime) && !utilities.checkStringEmpty(eTime))
                {
                    params.beginTime = utilities.formatStamp(startTime) / 1000;
                    params.endTime = utilities.formatStamp(endTime) / 1000;
                }
                pageController.searchChange(params);
            };

            //导出
            self.scope.exportData = function () {
                var blob = new Blob([document.getElementById('exportable').innerHTML], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                });
                saveAs(blob, "订单文件.xls");
            }
        });

        //订单状态
        self.scope.selModelArr = [
            {
                "id": 0,
                "name": "已经取消"
            },
            {
                "id": 1,
                "name": "尚未支付"
            },
            {
                "id": 2,
                "name": "等待发货"
            },
            {
                "id": 3,
                "name": "已发货"
            },
            {
                "id": 4,
                "name": "等待评价"
            },
            {
                "id": 5,
                "name": "已经评价"
            },
            {
                "id": 6,
                "name": "申请退货/退款"
            },
            {
                "id": 7,
                "name": "同意申请退货"
            },
            {
                "id": 8,
                "name": "等待卖家收货"
            },
            {
                "id": 9,
                "name": "交易完成"
            }
        ]
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
                    'goodTotalPrice' : JSON.parse(orderGoods[i].goodsInfo.goodsSku.price) * JSON.parse(orderGoods[i].goodsNum)
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
                if(!utilities.checkStringEmpty(order.traces))
                {
                    var tracesCopy = order.traces;
                    var tracesArr = [];
                    for(var k = 0; k < tracesCopy.length; k++)
                    {
                        tracesArr.push({
                            "AcceptTimeCopy" : tracesCopy[k].AcceptTime,
                            "AcceptStationCopy" : tracesCopy[k].AcceptStation
                        })
                    }
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
                orderListFun.aggreeReturnRefund(params, function(){
                    self.orderModel.isShowDetial = false;
                    self.orderModel.isRefund = false;//操作成功后恢复隐藏状态
                    _CommonFuntion.dialog("已同意");
                    self.getOrderList($scope);//提交数据后重新加载数据
                })
            };

            //拒绝申请
            $scope.refuseRefund = function(){
                self.refuseModel.modalTitle = "回复驳回内容";
                $("#refuseModal").modal("show");
            };

            self.scope.submitVat = function(msgCon){

                var params = {
                    "orderId" : self.curOrderID
                };
                if(!utilities.checkStringEmpty(msgCon))
                {
                    params.refuseReason = msgCon;
                }
                else
                {
                    _CommonFuntion.dialog("请输入驳回理由");
                    return;
                }

                orderListFun.refuseReturnRefund(params, function(){
                    self.orderModel.isShowDetial = false;
                    $("#refuseModal").modal("hide");
                    _CommonFuntion.dialog("已驳回");
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

//orderList方法
var orderListFun = {
    //订单状态
    orderStatus : function(status){
        var orderStatus = null;
        switch(parseInt(status)){
            case 0:
                orderStatus = "已经取消";
                break;
            case 1:
                orderStatus = "尚未支付";
                break;
            case 2:
                orderStatus = "等待发货";
                break;
            case 3:
                orderStatus = "已发货";
                break;
            case 4:
                orderStatus = "等待评价";
                break;
            case 5:
                orderStatus = "已经评价";
                break;
            case 6:
                orderStatus = "申请退货/退款";
                break;
            case 7:
                orderStatus = "同意申请退货";
                break;
            case 8:
                orderStatus = "等待卖家收货";
                break;
            case 9:
                orderStatus = "交易完成";
                break;
            default :
                orderStatus = "";
        }
        return orderStatus;
    },

    //支付方式
    payType : function(type){
        var payType = "";
        switch (parseInt(type)){
            case 1:
                payType = "支付宝";
                break;
            case 2:
                payType = "余额";
                break;
            default :
                payType = "";
        }
        return payType;
    },

    //配送方式
    deliveType : function(type){
        var deliveType = "";
        switch (parseInt(type)){
            case 1:
                deliveType = "顺丰速运";
                break;
            case 2:
                deliveType = "圆通快递";
                break;
            case 3:
                deliveType = "顺丰速运";
                break;
            case 4:
                deliveType = "圆通快递";
                break;
            default :
                deliveType = "";
        }
        return deliveType;
    },

    //退货理由
    reason : function(type){
        var reasonType = "";
        switch (parseInt(type)){
            case 1:
                reasonType = "款项不符";
                break;
            case 2:
                reasonType = "商品不符";
                break;
            case 3:
                reasonType = "包装损坏";
                break;
            case 4:
                reasonType = "商品瑕疵";
                break;

            default :
                reasonType = "";
        }
        return reasonType;
    },


    //获取order详情
    getOrderInfo : function(curId, callback){
        var params = {
            "orderId" : curId
        };
        $data.HttpRequest(dataApi.API_GET_ORDER_INFO, params, callback);
    },

    //发货
    deliverGoods : function(params, callback){
        $data.HttpRequest(dataApi.API_DELIVER_GOODS,params, callback);
    },

    //确定退款
    yesReturnedRefund : function(params, callback){
        $data.HttpRequest(dataApi.API_RETURN_REFUND, params, callback);
    },

    //获得申请信息
    getReturnRefund : function(params, callback){
        $data.HttpRequest(dataApi.API_GET_RETURN_REFUND, params, callback);
    },

    //同意申请
    aggreeReturnRefund : function(params, callback){
        $data.HttpRequest(dataApi.API_AGREE_REFUND, params, callback);
    },

    //拒绝申请
    refuseReturnRefund : function(params, callback){
        $data.HttpRequest(dataApi.API_REFUSE_REFUND, params, callback);
    },

    //当前订单状态
    getOrderStatus : function(orderId, callback)
    {
        var params = {
            "orderId" : orderId
        };
        $data.HttpRequest(dataApi.API_GET_ORDER_STATUS, params, callback);
    }
};
