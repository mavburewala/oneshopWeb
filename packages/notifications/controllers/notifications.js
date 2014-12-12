'use strict';
angular.module('gleepostweb.notifications')
    .controller('notificationsCtrl', ['$scope', '$rootScope', '$http', '$location', 'notifications',
        function($scope, $rootScope, $http, $location, notifications) {
            // This object will be filled by the form
            $scope.notifications=null;
            var getNotifications = function() {
                notifications.getNotifications({
                    "include_seen" : true
                }, function(response) {
                    console.log(response);
                    $scope.notifications=response;
                    $rootScope.notification=[];
                    $scope.$apply();
                    markNotificationsRead();
                }, function(error) {
                    //alert(error);
                });
            };
            var markNotificationsRead=function(){
                $rootScope.$broadcast('clearNotifications',null);
                notifications.markSeenNotifications({
                    "seen":$scope.notifications[$scope.notifications.length-1]
                }, function(response) {
                    console.log(response);
                    
                }, function(error) {
                    //alert(error);
                });
            }
            getNotifications(); //method is invoked when the view loads
           /* $scope.$on('newNotificationReceived',function(event,notification){
                console.log("notification received");
                for (var i = 0; i < notification.length; i++) {
                    $scope.notifications.push(notification[i].data);
                };
                console.log(notification);
                $scope.$apply();
            });*/
        }
    ])