/*
 * by jack
 * 
 */

var accountWithdrawCtrl = {
	scope : null,
	
	withdrawModel : {
		modelArr : [],
		selectAll : false,
		isShowInfo : false,
		withdrawId : null
		
	},
	
	init : function($scope){
		var self = this;
		
		self.scope = $scope;
		
		self.scope.withdrawModel = self.withdrawModel;
		
		self.getWithdrawals();
		
		self.onClickFun();

		indexCtrl.getReminds();//刷新消息提醒
	},
	
	getWithdrawals : function(){
		var self = this;

        pageController.pageInit(self.scope, dataApi.API_APPLY_WITHDRAWAL, {}, function(data){
            if(!utilities.checkStringEmpty(pageParams.num))
            {
                var pageNumn = Math.ceil(data.count / pageParams.num);
                pageController.pageNum(pageNumn);
            }

            self.withdrawModel.modelArr = data.withdrawals;
			for( var i=0; i<data.withdrawals.length; i++)
			{
				self.withdrawModel.modelArr[i].selected = false;
			}
			
            self.scope.$apply();
        })
	},
	
	onClickFun : function(){
		var self = this;
		self.scope.aggreeWithdraw = function(id){
			self.withdrawModel.withdrawId = id;
			var params = {
				"applyIdArr": '[' + self.withdrawModel.withdrawId + ']'
			};
			
			$data.newJQueryAjax(dataApi.API_WITHDRAWALS,params,function(){});
			
		};
		
		
		self.scope.aggreeAllWithdraw = function(){
			var params = {
				"applyIdArr" : []
			};
			params.applyIdArr = _CommonFuntion.findSelIds(self.withdrawModel, 'id', '请选择至少一个选项');
			if(params.applyIdArr != null){
				$data.newJQueryAjax(dataApi.API_WITHDRAWALS,params,function(){});
			}
			
		};
		
		self.scope.oneSel = function(id){
            _CommonFuntion.switchSelOne(id, self.withdrawModel, 'id');
        };

        self.scope.allSel = function(){
            _CommonFuntion.switchSelAll(self.withdrawModel);
        };
	}
};

