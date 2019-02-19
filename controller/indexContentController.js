routerApp.controller('indexContentController', ['$scope', function($scope){

    indexContentController.init($scope);
}]);

var indexContentController = {
    scope : null,

    homeModel : {},

    init : function($scope){
        this.scope = $scope;
        var self = this;

        self.getHomeInfo();
    },

    getHomeInfo : function(){
        var self = this;

        indexConFun.getHomeInfo(function(data){
            self.homeModel = data;

            self.scope.homeModel = self.homeModel;
            self.scope.$apply();
        })
    }
};

var indexConFun = {
    getHomeInfo : function(callback){
        $data.HttpRequest(dataApi.API_HOME_INFO, {}, callback);
    }
};