'use strict';
angular.module('gleepostweb.posts')
    .controller('PostsCtrl', ['$scope', '$rootScope', '$http', '$location', 'posts','$stateParams','$interval','$cookieStore',
        function($scope, $rootScope, $http, $location, posts,$stateParams,$interval,$cookieStore) {
            // This object will be filled by the form
            $scope.myNetworks=[];
            $scope.networkId=$stateParams.Id;
            $scope.userPosts=[];
            $scope.lastRetrieved=0;
            $scope.scrollPositionOfPage=$(document).scrollTop();
            $scope.$watch('scrollPositionOfPage', function(newValue,oldValue) {
                $(window).scroll(function() {
                    if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
                            if($scope.userPosts.length>$scope.lastRetrieved){
                            $scope.lastRetrieved=$scope.userPosts.length;
                            getPosts({'start':$scope.userPosts.length},false);
                        }
                    }
                });
              /*  var limit = document.body.offsetHeight - window.innerHeight;
                console.log(limit);
                console.log(newValue);
                if(newValue<limit){
                    getPosts({'start':$scope.userPosts.length},false);
                    //$scope.getMessagesForConversation($scope.selectedConversation,{'start':$scope.selectedConversation.messages.length},false)
                }*/
            });
            var getPosts=function(params,isScroll){
                posts.getUserPosts($cookieStore.get('user').id,params,function(response){
                    for (var i = 0; i < response.length; i++) {
                        var post={};
                        post['id']=response[i].id;
                        post['by']=response[i].by;
                        post['text']=response[i].text;
                        post['time']=moment(response[i].timestamp).fromNow();
                        post['data']=response[i];
                        post['image']=(response[i].images!=null) ? response[i].images[0]: ((response[i].videos==null)? null:response[i].videos[0].thumbnails[0]);
                        post['like_count']=response[i].like_count;
                        post['comment_count']=response[i].comment_count;
                        post['likes']=response[i].likes;
                        if(!_.findWhere($scope.userPosts, {'id': post.id})){
                            $scope.userPosts.push(post);
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
    ])
   