'use strict';

angular.module('gleepostweb.main').controller('IndexController', ['$scope', 'Global',
  function($scope, Global) {
    $scope.global = Global;
  }
]);
