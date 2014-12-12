'use strict';
angular.module('gleepostweb.notifications')
    .controller('notificationsCtrl', ['$scope', '$rootScope', '$http', '$location', 'notifications',
        function($scope, $rootScope, $http, $location, notifications) {
            // This object will be filled by the form
            $rootScope['notification']=[];
            var notificationsData = null;
            $scope.notificationsToday = [];
            $scope.notificationsYest = [];
            $scope.notificationsOld = [];

            $scope.newToday = false;
            $scope.newYest = false;
            $scope.newOld = false;

            $scope.user = {};

            var getTimeSpan = function(notificationTime){
                  var now = moment();
                  var notificationDate =moment(notificationTime);
                  var diff = now.diff(notificationDate, 'days');
                  console.log(diff);
                  return diff;
            };

            var convertToDate = function(date){
                var a =moment(date);
                return a.format("MMM Do YYYY");
            };

            var convertToTime = function(date){
                return moment(date).format('HH:mm');
            };

            var createNotificationMessage = function(notificationObj){
                if(notificationObj.type === 'liked'){
                    return {
                        "name": notificationObj.user.name,
                        "Id" : notificationObj.user.id,
                        "profile_image":notificationObj.user.profile_image,
                        "action": "liked",
                        "boldPart": "Your Post",
                        "date" : convertToDate(notificationObj.time),
                        "time": convertToTime(notificationObj.time)
                    };
                }
                else if (notificationObj.type === 'added_group'){
                    return {
                        "name": notificationObj.user.name,
                        "Id" : notificationObj.user.id,
                        "profile_image":notificationObj.user.profile_image,
                        "action": "",
                        "boldPart": "Added you in Group",
                        "date" : convertToDate(notificationObj.time),
                        "time": convertToTime(notificationObj.time)
                    };
                }  
                else if (notificationObj.type === 'commented'){
                    return {
                        "name": notificationObj.user.name,
                        "Id" : notificationObj.user.id,
                        "profile_image":notificationObj.user.profile_image,
                        "action": "commented",
                        "boldPart": "on your post",
                        "date" : convertToDate(notificationObj.time),
                        "time": convertToTime(notificationObj.time)
                    };
                }
                else if (notificationObj.type === 'accepted_you'){
                    return {
                        "name": notificationObj.user.name,
                        "Id" : notificationObj.user.id,
                        "profile_image":notificationObj.user.profile_image,
                        "action": "accepted",
                        "boldPart": "your request",
                        "date" : convertToDate(notificationObj.time),
                        "time": convertToTime(notificationObj.time)
                    };
                }
                else if (notificationObj.type === 'added_you'){
                    return {
                        "name": notificationObj.user.name,
                        "Id" : notificationObj.user.id,
                        "profile_image":notificationObj.user.profile_image,
                        "action": "",
                        "boldPart": "added you",
                        "date" : convertToDate(notificationObj.time),
                        "time": convertToTime(notificationObj.time)
                    };
                }

                else if(notificationObj.type === 'group_post'){
                      return {
                        "name": notificationObj.user.name,
                        "Id" : notificationObj.user.id,
                        "profile_image":notificationObj.user.profile_image,
                        "action": "",
                        "boldPart": "posted in group",
                        "date" : convertToDate(notificationObj.time),
                        "time": convertToTime(notificationObj.time)
                    };
                } 
                else{
                    return null;
                }     
            };
           
            // Register the login() function
            var getNotifications = function() {
                notifications.getNotifications({
                    "include_seen" : true
                }, function(response) {
                    console.log(response);
                    for(var i = 0 ; i < response.length ; i++){
                        var dateDiff = getTimeSpan(response[i].time);
                        if(dateDiff === 0){
                            //today's notifications
                            console.log("Today");
                            $scope.notificationsToday.push(createNotificationMessage(response[i]));
                        }
                        else if(dateDiff === 1){
                            //yesterday notifications
                            console.log("Yesterday");
                            $scope.notificationsYest.push(createNotificationMessage(response[i]));
                        }
                        else{
                            //old notifications
                            console.log("Old");
                            $scope.notificationsOld.push(createNotificationMessage(response[i]));
                            console.log($scope.notificationsOld);
                        }
                    }
                    $scope.$apply();

                    if($scope.notificationsToday.length === 0){
                        $scope.newToday = true;
                    }
                    if($scope.notificationsYest.length === 0){
                        $scope.newYest = true;
                    }
                    if($scope.notificationsOld.length === 0){
                        $scope.newOld = true;
                    }

                }, function(error) {
                    alert(error);
                });
            };

            getNotifications(); //method is invoked when the view loads
        }
    ])