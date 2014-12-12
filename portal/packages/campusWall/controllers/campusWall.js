'use strict';
angular.module('gleepostweb.campusWall')
    .controller('wallCtrl', ['$scope', '$rootScope', '$http', '$location', 'wall','$interval',
        function($scope, $rootScope, $http, $location, wall,$interval) {

            var injector = angular.injector(['gleepostweb.utilities']);
            var util = injector.get('util');

            window.globalVar = "Nadeem";
            $scope.campusPosts=[];
            $scope.scrollPositionOfPage=$(document).scrollTop();
            $scope.postText = null;
            $scope.postFile = null;
            $scope.$watch('scrollPositionOfPage', function(newValue,oldValue) {
                var limit = document.body.offsetHeight - window.innerHeight;
                if(newValue>limit){
                    getPosts({'start':$scope.campusPosts.length},false);
                    //$scope.getMessagesForConversation($scope.selectedConversation,{'start':$scope.selectedConversation.messages.length},false)
                }
            });

            $scope.addPost = function(){
                //alert("Post to be added");
                // util.uploadMedia({

                // }, function(response){

                // }, function(error){

                // });

                wall.addPost({
                   "text": $scope.postText 
                },function(response){
                    console.log(response);
                }, function(error){

                });
            };

            $scope.setFiles = function(file){
                  //   console.log(file);
                  // $scope.$apply(function(scope) {
                  // console.log('files:', element.files);
                  // // Turn the FileList object into an Array
                  // //   scope.files = []
                  // //   for (var i = 0; i < element.files.length; i++) {
                  // //     scope.files.push(element.files[i])
                  // //   }
                  // // scope.progressVisible = false
                  // });
            };

            var getPosts=function(params,isScroll){
                wall.getPosts(params,function(response){
                    for (var i = 0; i < response.length; i++) {
                        var post={};
                        post['id']=response[i].id;
                        post['by']=response[i].by;
                        post['text']=response[i].text;
                        post['time']=moment(response[i].timestamp).fromNow();
                        post['data']=response[i];
                        post['image']=(response[i].images!=null) ? response[i].images[0]: ((response[i].videos==null)? null:response[i].videos[0].thumbnails[0]);
                        if(!_.findWhere($scope.campusPosts, {'id': post.id})){
                            $scope.campusPosts.push(post);
                        }
                    };
                    $scope.$apply();
                    if(isScroll){
                        $interval(function() {
                            $scope.scrollPositionOfPage=$(document).scrollTop();
                        }, 50);
                    }
                },function(){
                    console.log("ERROR")
                })
            };
            getPosts(null,true);

        }
    ]);