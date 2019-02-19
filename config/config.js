/**
 * 配置文件 : by---CN;
 */

/**************基础接口url****************/
 var BASE_URL = "http://meeno.f3322.net:8082/shopex/index.php/";//内网测试地址
//var BASE_URL = "http://mc.meeno.net:8004/meeno_cooliving/server2/index.php/";//内网测试接口（李伟林

var CONST_URL = "http://localhost:63342/admin/index.html#/";
//var BASE_IMG_URL = "http://mc.meeno.net:8004/meeno_cooliving/server2/uploads/photo/";
var BASE_IMG_URL = "http://meeno.f3322.net:8082/shopex/uploads/photo/";

/***************获取数据接口*****************/
var dataApi =
{
    API_GET_TOKEN : BASE_URL + "common/getUploadToken",//	上传单张图片
    API_UPLOAD_IMAGE : BASE_URL + "common/uploadImage",//	上传单张图片

    //首页信息
    API_HOME_INFO : BASE_URL + "admin/getIndexStatistic",//home

    //管理员
	API_ADMIN_LOGIN : BASE_URL + "account/adminLogin",//管理员登陆
    API_GET_ADMIN : BASE_URL + "admin/getAdmins",//获取管理用户列表
    API_ADD_ADMIN : BASE_URL + "admin/addAdmin",//新增普通管理员
    API_DEL_ADMIN : BASE_URL + "admin/delAdmins",//删除普通管理员
    API_CHANGE_PASSWORD : BASE_URL + "admin/changePassword",//修改密码
    API_GET_LOG : BASE_URL + "admin/getBehaviorLogs",//获取管理员日志
    API_MOD_ADMIN : BASE_URL + "admin/modAdmin",//超级管理员修改管理员信息

    //商品分类
    API_GET_GOODS_CATEGORIES_BY_LEVEL : BASE_URL + "admin/getGoodsCategoriesByLevel",//获取商品分类
    API_GET_GOODS_CATEGORIES : BASE_URL + "admin/getGoodsCategories",//获取商品分类
    API_ADD_GOODS_CATEGORY : BASE_URL + "admin/addGoodsCategory",//	添加商品分类
    API_MOD_GOODS_CATEGORY : BASE_URL +　"admin/modGoodsCategory",//	修改商品分类
    API_DEL_GOODS_CATEGORY : BASE_URL + "admin/delGoodsCategory",//	删除商品分类

    //品牌接口
    API_GET_BRANDLIST : BASE_URL + "admin/getBrandList",//获取品牌列表
    API_ADD_BRAND : BASE_URL +　"admin/addBrand",//	添加品牌
    API_MOD_BRAND : BASE_URL + "admin/modBrand",//	修改品牌
    API_DEL_BRAND : BASE_URL + "admin/delBrand",//  删除品牌

    //商品列表
    API_GET_GOODS_LIST : BASE_URL + "admin/getGoodsList",//获取商品列表
    API_GET_SINGLE_GOODS : BASE_URL + "admin/getSingleGoods",//获取商品列表
    API_ADD_GOODS : BASE_URL + "admin/addGoods",//添加商品	goodsType为商品类型,1境内，2境外
    API_MOD_GOODS : BASE_URL + "admin/modGoods",//修改商品	goodsType为商品类型,1境内，2境外
    API_MOD_GOODS_TAG : BASE_URL + "admin/modGoodsTag",//修改商品标签	goodsType为商品类型,1境内，2境外
    API_BATCH_DEAL_GOODS : BASE_URL + "admin/batchDealGoods",//	添加商品	goodsType为商品类型,1境内，2境外

    //订单接口
    API_GET_ORDER_LIST : BASE_URL + "admin/getOrderList",//获取订单列表
    API_SEARCH_ORDER : BASE_URL +　"admin/searchOrderList",//搜索订单
    API_GET_ORDER_INFO : BASE_URL +　"admin/getOrderInfo",//	订单详情
    API_DELIVER_GOODS : BASE_URL +　"admin/deliverGoods",//	点击发货
    API_REPORT_CUSTOMS : BASE_URL +　"admin/reportCustoms",//	上报海关

    API_RETURN_REFUND : BASE_URL +　"admin/returnedRefund",//确认收货并退款
    API_GET_RETURN_REFUND : BASE_URL +　"admin/getReturnRefundInfo",//获得申请信息
    API_AGREE_REFUND : BASE_URL +　"admin/agreeReturnRefund",//同意申请
    API_REFUSE_REFUND : BASE_URL +　"admin/refuseReturnRefund",//驳回

    //商品标签
    API_GET_TAG_LIST : BASE_URL + "admin/getTagList",//获取商品标签列表
    API_ADD_TAG_LIST : BASE_URL +　"admin/addTag",//添加商品标签
    API_MOD_TAG_LIST : BASE_URL + "admin/modTag",//修改商品标签
    API_DEL_TAG_LIST : BASE_URL + "admin/delTags",//删除商品标签

    //分类
    //API_GET_CATEGORY : BASE_URL + "admin/getCategories",//获取商品分类列表
    API_GET_CATEGORY : BASE_URL + "admin/getGoodsCategories",//获取商品分类列表
    API_ADD_GOODS_ATTR_NAME : BASE_URL + "admin/addGoodsAttrName",//添加商品标题名
    API_ADD_GOODS_ATTR_VALUE : BASE_URL + "admin/addGoodsAttrValue",//添加商品属性名
    API_MOD_GOODS_ATTR_VALUE : BASE_URL + "admin/modGoodsAttrValue",//添加商品属性值
    API_DEL_GOODS_ATTR_VALUE : BASE_URL + "admin/delGoodsAttrValue",//删除商品属性值
    API_MOD_GOODS_ATTR_NAME : BASE_URL + "admin/modGoodsAttrName",//修改属性名
    API_DEL_GOODS_ATTR_NAME : BASE_URL + "admin/delGoodsAttrName",//删除属性名
    API_ADD_GOODS_SKU : BASE_URL + "admin/addGoodsSku",//添加商品值
    API_MOD_GOODS_SKU : BASE_URL + "admin/modGoodsSku",//添加商品值

    //下架列表
    API_GOODS_OFF_SALE_LIST : BASE_URL + "admin/getGoodsOffSaleList",//添加商品值

    //会员管理
    API_GET_USER_LIST : BASE_URL + "admin/getUserList",//获取用户列表
    API_GET_USERS_NUM : BASE_URL + "admin/getUsersNum",//获取当前登录用户数量
    API_DEL_USER : BASE_URL + "admin/delUsers",//删除用户
    API_GET_USER_OBJ : BASE_URL + "admin/getUserObj",//获取用户详情
    API_MOD_USER_OBJ : BASE_URL + "admin/modUserInfo",//修改用户余额，积分
    API_SEND_PRIVATE_MSG : BASE_URL + "admin/sendPrivateMessage",//私信

    //增值税认证
    API_GET_VAT_LIST : BASE_URL + "admin/getVatList",//认证列表
    API_GET_VAT_INFO : BASE_URL + "admin/getVatInfo",//认证详情
    API_AGREE_VAT_APPLY : BASE_URL + "admin/agreeVatApply",//同意认证
    API_REFUSE_VAT_APPLY : BASE_URL + "admin/refuseVatApply",//拒绝认证

    //商品统计
    API_GET_GOODS_STATISTIC : BASE_URL + "admin/getGoodsSaleStatistic",//统计商品
    API_GET_ALL_GOODS_STATISTIC : BASE_URL + "admin/getAllGoodsSaleStatistic",//统计商品
    API_GET_GOODS_STATISTIC_INFO : BASE_URL + "admin/getGoodsSaleStatisticDetail",//统计商品详情

    //首页管理
    API_GET_BANNERS : BASE_URL + "admin/getBanners",//获取Banner列表
    API_ADD_BANNER : BASE_URL + "admin/addBanner",//添加Banner
    API_MOD_BANNERS : BASE_URL + "admin/modBanner",//修改Banner
    API_DEL_BANNERS : BASE_URL + "admin/delBanners",//删除Banner

    //活动
    API_GET_HOME_ACTIVE : BASE_URL + "admin/getHomepageActivity",//获得active
    API_ADD_HOME_ACTIVE : BASE_URL + "admin/addHomepageActivity",//添加active
    API_MOD_HOME_ACTIVE : BASE_URL + "admin/modHomepageActivity",//修改active

    //精品推荐
    API_GET_BOUTIQUE : BASE_URL + "admin/getBoutique",//获得精品推荐
    API_ADD_BOUTIQUE : BASE_URL + "admin/addBoutique",//添加精品推荐
    API_MOD_BOUTIQUE : BASE_URL + "admin/modBoutique",//修改精品推荐

    //楼层
    API_GET_FLOOR : BASE_URL + "admin/getFloor",//获得楼层
    API_ADD_FLOOR : BASE_URL + "admin/addFloor",//添加楼层
    API_MOD_FLOOR : BASE_URL + "admin/modFloor",//修改楼层
    API_MOD_FLOOR_ACTIVE : BASE_URL + "admin/modFloorActivityInfo",//修改楼层活动
    API_MOD_FLOOR_LABEL : BASE_URL + "admin/modFloorLabelInfo",//修改楼层标签
    API_MOD_FLOOR_BRAND : BASE_URL + "admin/modFloorBrandInfo",//修改楼层brand

	API_APPLY_WITHDRAWAL : BASE_URL + "admin/getWithdrawalsRecord",//提现
	API_WITHDRAWALS : BASE_URL + "admin/withdrawals",//同意提现

    //全场活动
    API_GET_EVENTS : BASE_URL + "admin/getEvents",//获取全场活动
    API_MOD_EVENTS : BASE_URL + "admin/modEvent",//修改全场活动

    //优惠卷
    API_GET_COUPONS : BASE_URL + "admin/getCoupons",//获得优惠卷
    API_CREATE_COUPONS : BASE_URL + "admin/createCoupon",//添加优惠卷
    API_GIVING_COUPONS : BASE_URL + "admin/givingCoupon",//赠送优惠卷
    API_DEL_COUPONS : BASE_URL + "admin/delCoupons",//删除优惠卷

    //消息
    API_GET_MSG : BASE_URL + "admin/getMessagesList",//消息列表
    API_ADD_MSG : BASE_URL + "admin/addMessages",//添加消息

    //公告
    API_GET_NOTICE : BASE_URL + "admin_notice/getNoticeList",//获得公告
    API_ADD_NOTICE : BASE_URL + "admin_notice/addNotice",//添加公告
    API_MOD_NOTICE : BASE_URL + "admin_notice/modNotice",//修改公告
    API_DEL_NOTICE : BASE_URL + "admin_notice/delNotice",//删除公告
    API_RELEASE_NOTICE : BASE_URL + "admin_notice/releaseNotice",//发布公告

    //提醒
    API_GET_REMINDS : BASE_URL + "admin/getReminds",//tips

    //下载所有
    API_IMPORT_GOODS_LIST : BASE_URL + "import/goodsList",//商品列表所有
    API_IMPORT_ORDER_LIST : BASE_URL + "import/orderList",//订单列表所有
    API_IMPORT_USER_LIST : BASE_URL + "import/userList",//用户列表所有
    API_IMPORT_GOODS_SALE_STATISTIC : BASE_URL + "import/goodsSaleStatistic",//商品销售统计


    //获取当前订单状态
    API_GET_ORDER_STATUS : BASE_URL + "admin/getOrderStatus"//获取当前订单状态
};

/**************配置常量*******************/
var errCode = {
	success : 0,
	tokenFailed : 3
};

var pageParams = {
	num : 10,
    count : 9999
};

//基础常量
var strKey = {
	KPHPSESSID : "KPHPSESSID",
	KrememberSta : "KrememberSta",
	KuserName : "KuserName",
	Kpwd : "Kpwd",
	KAdminType : "KAdminType",
	KAdminEntries : "KAdminEntries",
	TEMP_SUPPLIER_ID : "TEMP_SUPPLIER_ID"
};

var $modal = {
	adminModal : $("#adminModal")
};

var URL_CONST = {
    EDIT_GOODS : CONST_URL + 'postGoods',//发布商品
    GOODS_LIST : CONST_URL + 'goodsList',//商品列表
    USER_INFO : CONST_URL + 'userInfo',//用户信息
    USER_LIST : CONST_URL + 'userList',//用户列表
    INDEX_CONTENT : CONST_URL + 'index_content',//首页
    MOD_PWD : CONST_URL + 'modPwd',//密码
    CERTIFICATION_VAT : CONST_URL + 'certificationVat',//驳回
    HOME_FLOOR_INFO : CONST_URL + 'homeFloorInfo',//楼层管理
    HOME_FLOOR : CONST_URL + 'homeFloor',//楼层
    ADD_COUPON : CONST_URL + 'couponAdd',//添加优惠卷
    ORDER_LIST : CONST_URL + 'orderList',//订单列表
    VAT_LIST : CONST_URL + 'certificationVat'//增值税列表
};

