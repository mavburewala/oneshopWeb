'use strict';

angular.module('gleepostweb.network')
    .controller('networksCtrl', ['$scope', '$rootScope', '$http', '$location', 'network',
        function($scope, $rootScope, $http, $location, network) {
            $scope.myNetworks=[];
            
            var getNetworks = function() {
                network.getNetworksforUser(null, function(response) {
                    $scope.myNetworks=response;
                    for (var i = 0; i < response.length; i++) {
                         network.getNetwork(response[i].id,null,function(res){
                            if(!res.image)
                                res['image']='assets/images/circle.jpg'
                            console.log(res);
                            if(!_.findWhere($scope.myNetworks,{'id':res.id}))
                                $scope.myNetworks.push(res);
                            $scope.$apply();
                        },function(err){
                            console.log(err);
                        })
                    };
                }, function(error) {
                    alert(error);
                });
            };

            getNetworks(); //method is invoked when the view loads
        }
    ])
    .controller('networkCtrl', ['$scope', '$rootScope', '$http', '$location', 'network','$stateParams',
            function($scope, $rootScope, $http, $location, network,$stateParams) {
                $scope.myNetworks=[];
                $scope.networkId=$stateParams.Id;
                $scope.networkDetails={};
                var getNetwork = function() {
                    network.getNetwork($scope.networkId,null, function(response) {
                        $scope.networkDetails=response;
                        $scope.$apply();
                    }, function(error) {
                        alert(error);
                    });
                };

                getNetwork(); //method is invoked when the view loads
            }
        ])
    .controller('networkPostsCtrl', ['$scope', '$rootScope', '$http', '$location', 'network','$stateParams','$interval',
            function($scope, $rootScope, $http, $location, network,$stateParams,$interval) {
                $scope.myNetworks=[];
                $scope.networkId=$stateParams.Id; window.grpID = $stateParams.Id;
                $scope.campusPosts=[];
                $scope.postText = null;
                $scope.postFile = null;
                $scope.scrollPositionOfPage=$(document).scrollTop();
                $scope.$watch('scrollPositionOfPage', function(newValue,oldValue) {
                    var limit = document.body.offsetHeight - window.innerHeight;
                    if(newValue>limit){
                        getPosts({'start':$scope.campusPosts.length},false);
                        //$scope.getMessagesForConversation($scope.selectedConversation,{'start':$scope.selectedConversation.messages.length},false)
                    }
                });
                $scope.addPost = function() {
                    //alert("Post to be added");
                    // util.uploadMedia({

                    // }, function(response){

                    // }, function(error){

                    // });

                    network.addPostToNetwork($scope.networkId,{
                        "text": $scope.postText
                    }, function(response) {
                        console.log(response);
                    }, function(error) {

                    });
                };
                var getPosts=function(params,isScroll){
                    network.getNetworkPosts($scope.networkId,params,function(response){
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
        ])
.controller('networkMembersCtrl', ['$scope', '$rootScope', '$http', '$location', 'network','$stateParams',
            function($scope, $rootScope, $http, $location, network,$stateParams) {
                $scope.networkId=$stateParams.Id;
                $scope.networkMembers={};
                var getNetworkUsers = function() {
                    network.getNetworkUsers($scope.networkId,null, function(response) {
                        $scope.networkMembers=response;
                        console.log($scope.networkDetails);
                        $scope.$apply();
                    }, function(error) {
                        alert(error);
                    });
                };

                getNetworkUsers(); //method is invoked when the view loads
            }
        ]);