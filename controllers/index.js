'use strict';

angular.module('oneShopWeb.main').controller('IndexController', ['$scope', 'Global',
  function($scope, Global) {
    $scope.global = Global;
  }
]);



angular.module('oneShopWeb').controller('SuperMainController', ['$scope','$state','$rootScope',
  function($scope, $state,$rootScope) {
    $rootScope.currentState = $state.$current.name;
  }
]);
