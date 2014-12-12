'use strict';

angular.module('gleepostweb').controller('HeaderCtrl', ['$scope', '$rootScope','notifications',
  function($scope, $rootScope,notifications) {
    console.log($rootScope);
    $scope.notifications=[];
    var getNotifications = function() {
        notifications.getNotifications({
            "include_seen" : false
        }, function(response) {
            console.log(response);
            $scope.notifications=response;
            $rootScope.notification=[];
            $scope.$apply();
        }, function(error) {
//            alert(error);
        });
    };
    getNotifications();
    $scope.$on('clearNotifications',function(event,data){
    	$scope.notifications=[];
    	$scope.$apply();
    })
  }
]);
