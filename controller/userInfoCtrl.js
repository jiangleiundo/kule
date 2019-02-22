
var userInfoCtrl = {
    scope : null,

    userInfoModel : {
        selectAll : false,
        modelArr : [], //公共的数组名
        curID : null,
        modalTitle : null,
        modalType : null,//1修改余额，2修改积分
        isInvoice : true,
        isShowOrderInfo : false
    },

    orderModel : {
        isTraces : false,
        isHideBox : true
    },

    orderDetialModel : {},

    init : function($scope){
        var self = this;
        self.scope = $scope;

        self.scope.userInfoModel = self.userInfoModel;

        self.scope.orderModel = self.orderModel;

        self.isJump();

        self.onClickFun();
    },

    //获取跳转用户的ID
    getUserId : function(id){
        var self = this;
        self.userInfoModel.curID = id;

    },

    isJump : function(){
        var self = this;
        self.userInfoModel.isShowOrderInfo = false;
        if(!utilities.checkStringEmpty(self.userInfoModel.curID))
        {
            self.getOrderList();
            self.getUserObj();
        }
    },

    getUserObj : function(){
        var self = this;
        var params = {
            "userId": self.userInfoModel.curID
        };

        userListFun.getUserObj(params, function(data){
            var obj = data.userObj;

            self.scope.userInfoObj = obj;

            var adminType = localStorage.getItem(strKey.KAdminType);
            if(adminType == '0')
            {
                self.scope.isAdmin = true;//普通管理员没有操作权限
            }

            //modal
            self.scope.integral = obj.integral;
            self.scope.balance = obj.balance;

            if(!utilities.checkStringEmpty(data.addressList))
            {
                self.scope.addressArr = data.addressList;
            }
            if(!utilities.checkStringEmpty(obj.realNameInfo))
            {
                self.scope.realNameModel = obj.realNameInfo;
                var userIdImg = JSON.parse(obj.realNameInfo.idCardImage);
                if(!utilities.checkStringEmpty(userIdImg.front))
                {
                    self.scope.front = utilities.isContains(userIdImg.front)? JSON.parse(userIdImg.front) : BASE_IMG_URL + JSON.parse(userIdImg.front);
                }
                if(!utilities.checkStringEmpty(userIdImg.back))
                {
                    self.scope.back = utilities.isContains(userIdImg.back)? JSON.parse(userIdImg.back) : BASE_IMG_URL + JSON.parse(userIdImg.back);
                }

            }
            if(!utilities.checkStringEmpty(obj.receiptInfo))
            {
                self.scope.invoiceModel2 = obj.receiptInfo;
            }

            if(!utilities.checkStringEmpty(obj.vatInfo))
            {
                self.scope.invoiceModel = obj.vatInfo;
            }
            if(!utilities.checkStringEmpty(obj.headIcon))
            {
                self.scope.headIcon = utilities.isContains(obj.headIcon)? obj.headIcon : BASE_IMG_URL + obj.headIcon;
            }
            self.scope.$apply();
        })
    },

    getOrderList : function(){
        var self = this;
        var params = {
                'userId': self.userInfoModel.curID
        };

        pageController.pageInit(self.scope, dataApi.API_GET_ORDER_LIST, params, function(data) {
            if (pageParams.num != 0) {
                var pageNum = Math.ceil(data.count / pageParams.num);
                pageController.pageNum(pageNum);
            }
            self.userInfoModel.modelArr = [];

            //处理数据
            for (var i = 0; i < data.orders.length; i++) {
                var order = data.orders[i];
                self.userInfoModel.modelArr.push({
                    'orderNo': order.order_no,
                    'addressInfo': order.acceptName + " " + order.province + order.city + order.district + order.address,
                    'price': order.price,//实际支付
                    'totalPrice': order.totalPrice,
                    'orderStatus': order.orderStatus,
                    'orderStatusCopy': orderListFun.orderStatus(order.orderStatus),
                    'orderTime': utilities.formatDate(order.orderTime, true),
                    'nickName': order.nickName
                })
            }

            self.scope.$apply();
        });
    },

    onClickFun : function(){
        var self = this;

        //切换发票类型tab
        self.scope.switchInvoice = function(){
            self.userInfoModel.isInvoice = !self.userInfoModel.isInvoice;
        };

        self.scope.addChange = function(type){
            $("#userInfoModal").modal("show");
            self.userInfoModel.modalType = type;
            if(type == 1)
            {
                self.userInfoModel.modalTitle = "修改余额";
            }
            if(type == 2)
            {
                self.userInfoModel.modalTitle = "修改积分";
            }

        };

        self.scope.submitBalance = function(integral, balance){
            var params = {
                "userId": self.userInfoModel.curID
            };
            var modData = {};
            if( self.userInfoModel.modalType == 1)
            {
                modData.balance = balance;
            }
            if( self.userInfoModel.modalType == 2)
            {
                modData.integral = integral;
            }
            params.modData = JSON.stringify(modData);

            userListFun.modUserObj(params, function(){
                _CommonFuntion.dialog("修改成功");
                $("#userInfoModal").modal("hide");
                self.getUserObj();
            })
        };

        self.scope.backToUserList = function(){
            location.href = URL_CONST.USER_LIST;
        };

        self.scope.checkOrderInfo = function(orderNo){
            self.getOrderDetials(orderNo);
        };

        self.scope.detialBack = function(){
            self.userInfoModel.isShowOrderInfo = false;
        }
    },

    //获取订单详情
    /*
     * curId 当前点击的订单号
     * */
    getOrderDetials : function(curId){
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

            //发票信息
            if(!utilities.checkStringEmpty(order.invoiceInfo))
            {
                var invoice = JSON.parse(order.invoiceInfo);
                var invoiceArr = Object.keys(invoice);//该方法返回对象的可枚举属性名组成的数组
                invoice.lengthCopy = invoiceArr.length;
                self.scope.invoiceModel = invoice;
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
                for(var m = 0; m < returnTracesCopy.length; m++)
                {
                    returnTracesArr.push({
                        "AcceptTimeCopy" : returnTracesCopy[m].AcceptTime,
                        "AcceptStationCopy" : returnTracesCopy[m].AcceptStation
                    })
                }
            }

            self.scope.returnTracesModel = returnTracesArr;//退货物流
            self.scope.tracesModel = tracesArr;//物流详情订单
            self.scope.orderLogsModel = orderLogsArr;//订单状态model

            //切换物流
            self.scope.checkTraces = function(){
                self.orderModel.isTraces = true;
            };
            self.scope.checkTraces2 = function(){
                self.orderModel.isTraces = false;
            };

            self.scope.orderGoodsModel = orderGoodsArr;
            self.scope.orderDetialModel = self.orderDetialModel;
            self.scope.$apply();

        });

        self.userInfoModel.isShowOrderInfo = true;
    }
};