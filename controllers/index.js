'use strict';

angular.module('gleepostweb.main').controller('IndexController', ['$scope', 'Global',
  function($scope, Global) {
    $scope.global = Global;
  }
]);



angular.module('gleepostweb').controller('SuperMainController', ['$scope','$state','$rootScope',
  function($scope, $state,$rootScope) {
    $rootScope.currentState = $state.$current.name;
  }
]);
