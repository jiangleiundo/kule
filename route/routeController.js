
var routerApp = angular.module('adminApp', ['ui.router', 'ngAnimate', 'ngMessages']);

routerApp.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/index_content');
	$stateProvider
        .state('index_content', {
            url: '/index_content',
            templateUrl: 'view/index_content.html',
            controller  : "indexContentController"
        })
	    .state('admin', {
	        url: '/admin',
	        templateUrl: 'view/admin.html',
	        controller : "adminController"
	    })
        .state('adminGeneral', {
	        url: '/adminGeneral',
	        templateUrl: 'view/adminGeneral.html',
	        controller : "adminGeneralCtrl"
	    })
	    .state('modPwd', {
            url: '/modPwd',
	        templateUrl: 'view/modPwd.html',
            controller : "modPwdCtrl"
	    })
        .state('log',{
            url: '/log',
            templateUrl: 'view/log.html',
            controller : "logController"
        })
        .state('goodsClassification',{
            url : '/goods-classification',
            templateUrl : 'view/goods-classification.html',
            controller : 'goodsClassificationCtrl'
        })
        .state('brandManage',{
            url : '/brand-manage',
            templateUrl : 'view/brand-manage.html',
            controller : 'brandManageCtrl'
        })
        .state('goodsList',{
            url : '/goodsList',
            templateUrl : 'view/goodsList.html',
            controller : 'goodsListCtrl'
        })
        .state('postGoods',{
            url : '/postGoods',
            templateUrl : 'view/postGoods.html',
            controller : 'postGoodsCtrl'
        })
        .state('classificationContent',{
            url : '/classificationContent',
            templateUrl : 'view/classificationContent.html',
            controller : 'classificationContentCtrl'
        })

		//OrderListCtrl
        .state('orderList', {
        	url : '/orderList',
        	templateUrl : 'view/jl_view/orderList.html',
        	controller : 'OrderListCtrl'
        })
        .state('orderSearch', {
        	url : '/orderSearch',
        	templateUrl : 'view/jl_view/orderSearch.html',
        	controller : 'OrderSearchCtrl'
        })
        .state('goodsTag', {
            url: '/goodsTag',
            templateUrl: 'view/goodsTag.html',
            controller: 'goodsTagCtrl'
        })
        .state('recycleGoods', {
            url: '/recycleGoods',
            templateUrl: 'view/recycleGoods.html',
            controller: 'recycleGoodsCtrl'
        })

        //会员管理
        .state('userList', {
            url: '/userList',
            templateUrl: 'view/userList.html',
            controller: 'userListCtrl'
        })
        .state('userInfo', {
            url: '/userInfo',
            templateUrl: 'view/userInfo.html',
            controller: 'userInfoCtrl'
        })
        .state('goodsStatistics', {
            url: '/goodsStatistics',
            templateUrl: 'view/goodsStatistics.html',
            controller: 'goodsStatisticsCtrl'
        })
        //发票认证
        .state('certificationVat', {
            url: '/certificationVat',
            templateUrl: 'view/certificationVat.html',
            controller: 'certificationVatCtrl'
        })

        //banner
        .state('homeBanner', {
            url: '/homeBanner',
            templateUrl: 'view/homeBanner.html',
            controller: 'homeBannerCtrl'
        })
        //active
        .state('homeActive', {
            url: '/homeActive',
            templateUrl: 'view/homeActive.html',
            controller: 'homeActiveCtrl'
        })
        //boutique
        .state('homeBoutique', {
            url: '/homeBoutique',
            templateUrl: 'view/homeBoutique.html',
            controller: 'homeBoutiqueCtrl'
        })
        //floor
        .state('homeFloor', {
            url: '/homeFloor',
            templateUrl: 'view/homeFloor.html',
            controller: 'homeFloorCtrl'
        })
        //floorInfo
        .state('homeFloorInfo', {
            url: '/homeFloorInfo',
            templateUrl: 'view/homeFloorInfo.html',
            controller: 'homeFloorInfoCtrl'
        })
        //提现管理
        .state('acountWithdraw', {
        	url: '/accountWithdraw',
        	templateUrl: 'view/accountWithdraw.html',
        	controller: 'accountWithdrawCtrl'
        })
        //全场活动
        .state('allActive', {
            url: '/allActive',
            templateUrl: 'view/allActive.html',
            controller: 'allActiveCtrl'
        })
        //优惠卷
        .state('coupon', {
            url: '/coupon',
            templateUrl: 'view/coupon.html',
            controller: 'couponCtrl'
        })
        //消息管理
        .state('msgManage', {
            url: '/msgManage',
            templateUrl: 'view/msgManage.html',
            controller: 'msgManageCtrl'
        })
        //公告
        .state('announce', {
            url: '/announce',
            templateUrl: 'view/announce.html',
            controller: 'announceCtrl'
        })

});

//监听事件 是否加载完毕
routerApp.directive('onFinishRenderFilters', function ($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
});

//管理员
routerApp.controller("adminController",function ($scope) {
    adminController.init($scope);
});

//修改密码
routerApp.controller('modPwdCtrl', function($scope){
    modPwdCtrl.init($scope);
});

//商品大类管理
routerApp.controller("goodsClassificationCtrl",function ($scope) {
    goodsClassificationCtrl.init($scope);
});

//日志
routerApp.controller("logController",function ($scope) {
    logController.init($scope);
});

//品牌管理
routerApp.controller("brandManageCtrl",function ($scope) {
    brandManageCtrl.init($scope);
});

//商品列表
routerApp.controller("goodsListCtrl",function ($scope) {
    goodsListCtrl.init($scope);
});

//类别详情
routerApp.controller("classificationContentCtrl",function ($scope) {
    classificationContentCtrl.init($scope);
});

//商品标签
routerApp.controller('goodsTagCtrl', function($scope){
    goodsTagCtrl.init($scope);
});

//发布商品
routerApp.controller('postGoodsCtrl', function($scope){
    postGoodsCtrl.init($scope);
    postModalCtr.init($scope);
});

//商品回收站
routerApp.controller('recycleGoodsCtrl', function($scope){
    recycleGoodsCtrl.init($scope);
});

//会员管理
routerApp.controller('userListCtrl', function($scope){
    userListCtrl.init($scope);
});

//用户信息
routerApp.controller('userInfoCtrl', function($scope){
    userInfoCtrl.init($scope);
});

//用户统计
routerApp.controller('goodsStatisticsCtrl', function($scope){
    goodsStatisticsCtrl.init($scope);
    goodsStatisticsInfoCtrl.init($scope);
});

//发票认证
routerApp.controller('certificationVatCtrl', function($scope){
    certificationVatCtrl.init($scope);
    certificationVatInfoCtrl.init($scope);
});

//banner
routerApp.controller('homeBannerCtrl', function($scope){
    homeBannerCtrl.init($scope);
});

//active
routerApp.controller('homeActiveCtrl', function($scope){
    homeActiveCtrl.init($scope);
});

//boutique
routerApp.controller('homeBoutiqueCtrl', function($scope){
    homeBoutiqueCtrl.init($scope);
});

//floor
routerApp.controller('homeFloorCtrl', function($scope){
    homeFloorCtrl.init($scope);
});

//floor
routerApp.controller('homeFloorInfoCtrl', function($scope){
    homeFloorInfoCtrl.init($scope);
    floorThemeCtrl.init($scope);
    floorActiveCtrl.init($scope);
    floorLabelCtrl.init($scope);
    floorBrandCtrl.init($scope);
});

//提现管理
routerApp.controller('accountWithdrawCtrl', function($scope){
	accountWithdrawCtrl.init($scope);
});

//全场活动
routerApp.controller('allActiveCtrl', function($scope){
    allActiveCtrl.init($scope);
});

//优惠卷
routerApp.controller('couponCtrl', function($scope){
    couponCtrl.init($scope);
});

//消息管理
routerApp.controller('msgManageCtrl', function($scope){
    msgManageCtrl.init($scope);
});



