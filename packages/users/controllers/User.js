'use strict';
angular.module('gleepostweb.users')
    .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', 'Auth','$state','Profile','$timeout','$cookieStore',
        function($scope, $rootScope, $http, $location, Auth,$state,Profile,$timeout,$cookieStore) {
            // This object will be filled by the form
            $scope.user = {};
            $scope.returnUri = $location.search().returnUri;
            console.log($scope.returnUri);
            // Register the login() function
            $rootScope.currentState = $state.$current.name;
            console.log($rootScope.currentState)
            $scope.login = function() {
                Pace.restart();

                Auth.login({
                        email: $scope.user.email,
                        pass: $scope.user.password
                    },
                    function(res) {
                        console.log(res);
                        Profile.getUserDetails(res.id,{'id':res.id,'token':res.token},function(response){
                            console.log(response);
                            console.log("good");
                            window.isLoggedIn=true
                            var cookie=$cookieStore.get('user');
                            cookie['full_name']=response.full_name;
                            cookie['profile_image']=response.profile_image;
                            $cookieStore.put('user',cookie);
                            console.log($cookieStore.get('user'));
                            if($scope.returnUri&&($scope.returnUri).length>0){
                                $rootScope.currentState = '';
                                console.log($scope.returnUri);
                                $location.url($scope.returnUri);
                                $scope.$apply();
                            }
                            else{
                                $location.url("/wall");
                                $rootScope.currentState = '';
                                $scope.$apply();
                            }
                                //$location.url('')
                            $rootScope.outSide = false;
                        },function(){
                            console.log("Error");
                        })
                    },
                    function(err) {
                        $rootScope.error = "Failed to login";
                    });
            }
        }
    ])
    /*  $scope.login = function() {
        $http.post('/login', {
          email: $scope.user.email,
          password: $scope.user.password
        })
          .success(function(response) {
            // authentication OK
            $scope.loginError = 0;
            $rootScope.user = response.user;
            $rootScope.$emit('loggedin');
            if (response.redirect) {
              if (window.location.href === response.redirect) {
                //This is so an admin user will get full admin page
                window.location.reload();
              } else {
                window.location = response.redirect;
              }
            } else {
              $location.url('/');
            }
          })
          .error(function() {
            $scope.loginerror = 'Authentication failed.';
          });
      };
    }
  ])*/ 
    .controller('RegisterCtrl', ['$scope', '$rootScope', '$http', '$location', 'Auth',
        function($scope, $rootScope, $http, $location, Auth) {
            $scope.user = {};

            $scope.register = function() {
                $scope.usernameError = null;
                $scope.registerError = null;
                Auth.register({
                    first: $scope.user.fname,
                    last: $scope.user.lname,
                    email: $scope.user.email,
                    pass: $scope.user.pass
                }, function(res) {
                    //success function
                    alert("success");
                }, function(err) {
                    //error function
                    alert("There Registration Failed ")
                });
            };
        }
    ])
    .controller('logoutCtrl', ['$scope', '$rootScope', '$http', '$location', 'Auth',
        function($scope, $rootScope, $http, $location, Auth) {
            $scope.user = {};
            Auth.logout(function(){
                $location.url('/auth/login');
                window.isLoggedIn=false;
                $(".proView").slideUp("fast");
                //$scope.$apply();
            });
        }
    ])
    .controller('ForgotPasswordCtrl', ['$scope', '$rootScope', '$http', '$location', 'Auth',
        function($scope, $rootScope, $http, $location, Auth) {
            $scope.user = {};
            $scope.forgotpassword = function() {
                Auth.forgotPassword({
                    email: $scope.user.email
                }, function(res) {
                    alert("Forgot Password Successful");
                }, function(err) {
                    alert("Forgot Password Failed");
                });
            };
        }
    ])
    .controller('ResetPasswordCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams',
        function($scope, $rootScope, $http, $location, $stateParams) {
            $scope.user = {};
            $scope.resetpassword = function() {
                $http.post('/reset/' + $stateParams.tokenId, {
                        password: $scope.user.password,
                        confirmPassword: $scope.user.confirmPassword
                    })
                    .success(function(response) {
                        $rootScope.user = response.user;
                        $rootScope.$emit('loggedin');
                        if (response.redirect) {
                            if (window.location.href === response.redirect) {
                                //This is so an admin user will get full admin page
                                window.location.reload();
                            } else {
                                window.location = response.redirect;
                            }
                        } else {
                            $location.url('/');
                        }
                    })
                    .error(function(error) {
                        if (error.msg === 'Token invalid or expired')
                            $scope.resetpassworderror = 'Could not update password as token is invalid or may have expired';
                        else
                            $scope.validationError = error;
                    });
            };
        }
    ])

    .controller('ProfileCtrl', ['$scope', '$rootScope', '$http', '$location', 'Profile', '$stateParams',
            function($scope, $rootScope, $http, $location, Profile, $stateParams) {
                $scope.user = {};

                var initProfile = function(){
                  
                    var userID = $stateParams.Id;
                        Profile.getUserDetails(userID, null, function(response){
                            console.log(response);
                            $scope.user = response;
                            $scope.$apply();
                        }, function(error){

                        });

                       // $scope.$apply();
                  
                };

                initProfile();
            }
    ])
    .controller('userPostsCtrl', ['$scope', '$rootScope', '$http', '$location', 'Profile','$stateParams','$interval','$cookieStore',
            function($scope, $rootScope, $http, $location, Profile,$stateParams,$interval,$cookieStore) {
                $scope.myNetworks=[];
                $scope.networkId=$stateParams.Id;
                $scope.campusPosts=[];
                $scope.scrollPositionOfPage=$(document).scrollTop();
                $scope.$watch('scrollPositionOfPage', function(newValue,oldValue) {
                    var limit = document.body.offsetHeight - window.innerHeight;
                    if(newValue>limit){
                        getPosts({'start':$scope.campusPosts.length},false);
                        //$scope.getMessagesForConversation($scope.selectedConversation,{'start':$scope.selectedConversation.messages.length},false)
                    }
                });
                var getPosts=function(params,isScroll){
                    Profile.getUserPosts($cookieStore.get('user').id,params,function(response){
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

        .controller('InteractionsCtrl', ['$scope', '$rootScope', '$http', '$location', 'Profile', '$stateParams','$cookieStore',
            function($scope, $rootScope, $http, $location, Profile, $stateParams, $cookieStore) {

                $scope.getViews = function(){
                    //alert("Get Views");
                    var data =  {
                              "xScale": "ordinal",
                              "yScale": "linear",
                              "type": "line-dotted",
                              "main": [
                                {
                                  "className": ".pizza",
                                  "data": [
                                    {
                                      "x": "12/8/2014",
                                      "y": 12
                                    },
                                    {
                                      "x": "14/8/2014",
                                      "y": 8
                                    },
                                    {
                                      "x": "18/8/2014",
                                      "y": 15
                                    },
                                    {
                                      "x": "19/8/2014",
                                      "y": 13
                                    },
                                    {
                                      "x": "28/8/2014",
                                      "y": 17
                                    },
                                    {
                                      "x": "05/9/2014",
                                      "y": 25
                                    },
                                    {
                                      "x": "10/9/2014",
                                      "y": 23
                                    }
                                  ]
                                }
                              ]
                            };

                            var myChart = new xChart('line-dotted', data, '#interactionsGraph');  
                };

                $scope.getLikes = function(){
                     var data =  {
                              "xScale": "ordinal",
                              "yScale": "linear",
                              "type": "line-dotted",
                              "main": [
                                {
                                  "className": ".pizza",
                                  "data": [
                                    {
                                      "x": "12/8/2014",
                                      "y": 8
                                    },
                                    {
                                      "x": "14/8/2014",
                                      "y": 69
                                    },
                                    {
                                      "x": "18/8/2014",
                                      "y": 70
                                    },
                                    {
                                      "x": "19/8/2014",
                                      "y": 54
                                    },
                                    {
                                      "x": "28/8/2014",
                                      "y": 1
                                    },
                                    {
                                      "x": "05/9/2014",
                                      "y": 8
                                    },
                                    {
                                      "x": "10/9/2014",
                                      "y": 58
                                    }
                                  ]
                                }
                              ]
                            };

                            var myChart = new xChart('line-dotted', data, '#interactionsGraph');
                };

                 $scope.getComments = function(){
                     var data =  {
                              "xScale": "ordinal",
                              "yScale": "linear",
                              "type": "line-dotted",
                              "main": [
                                {
                                  "className": ".pizza",
                                  "data": [
                                    {
                                      "x": "12/8/2014",
                                      "y": 80
                                    },
                                    {
                                      "x": "14/8/2014",
                                      "y": 54
                                    },
                                    {
                                      "x": "18/8/2014",
                                      "y": 69
                                    },
                                    {
                                      "x": "19/8/2014",
                                      "y": 5
                                    },
                                    {
                                      "x": "28/8/2014",
                                      "y": 45
                                    },
                                    {
                                      "x": "05/9/2014",
                                      "y": 7
                                    },
                                    {
                                      "x": "10/9/2014",
                                      "y": 36
                                    }
                                  ]
                                }
                              ]
                            };

                            var myChart = new xChart('line-dotted', data, '#interactionsGraph');
                };

                $scope.getShares = function(){
                     var data =  {
                              "xScale": "ordinal",
                              "yScale": "linear",
                              "type": "line-dotted",
                              "main": [
                                {
                                  "className": ".pizza",
                                  "data": [
                                    {
                                      "x": "12/8/2014",
                                      "y": 10
                                    },
                                    {
                                      "x": "14/8/2014",
                                      "y": 5
                                    },
                                    {
                                      "x": "18/8/2014",
                                      "y": 1
                                    }
                                  ]
                                }
                              ]
                            };

                            var myChart = new xChart('line-dotted', data, '#interactionsGraph');
                };
                $scope.getInteractionStats = function(){
                   // alert("Clicked");
                   Profile.getUserStats($cookieStore.get('user').id, "posts", "week", "2013-01-31T19:00:00Z", "2014-09-26T13:15:06Z", null, 
                    function(response){
                        console.log(response);
                    }, function(error){

                    });

                         var data =  {
                              "xScale": "ordinal",
                              "yScale": "linear",
                              "type": "line-dotted",
                              "main": [
                                {
                                  "className": ".pizza",
                                  "data": [
                                    {
                                      "x": "12/8/2014",
                                      "y": 12
                                    },
                                    {
                                      "x": "14/8/2014",
                                      "y": 8
                                    },
                                    {
                                      "x": "18/8/2014",
                                      "y": 15
                                    },
                                    {
                                      "x": "19/8/2014",
                                      "y": 13
                                    },
                                    {
                                      "x": "28/8/2014",
                                      "y": 17
                                    },
                                    {
                                      "x": "05/9/2014",
                                      "y": 25
                                    },
                                    {
                                      "x": "10/9/2014",
                                      "y": 23
                                    }
                                  ]
                                }
                              ]
                            };

                            var myChart = new xChart('line-dotted', data, '#interactionsGraph');        
                };

                $scope.getInteractionStats();
            }
        ]);