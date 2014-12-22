'use strict';

angular.module('oneShopWeb.main').controller('IndexController', ['$scope', 'Global',
  function($scope, Global) {
    $scope.global = Global;
  }
]);

angular.module('oneShopWeb.main').controller('MainController', ['$scope', 
  function($scope) {
  	//alert("This is Main controller")
  }
]);


angular.module('oneShopWeb').controller('SuperMainController', ['$scope','$state','$rootScope',
  function($scope, $state,$rootScope) {
    $rootScope.currentState = $state.$current.name;
  }
]);
