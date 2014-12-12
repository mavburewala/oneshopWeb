'use strict';

//Setting up route
angular.module('gleepostweb.network').config(['$stateProvider',
    function($stateProvider) {
        // Check if the user is not connected
        var checkLoggedOut = function($q, $timeout, $http, $location,$cookieStore) {
            // Initialize a new promise
            var deferred = $q.defer();
            var currentUser=$cookieStore.get('user');
            console.log(currentUser);
            if(!currentUser)
            {
                $timeout(deferred.reject);
                var currentUri=$location.$$url;
                $location.url('/auth/login?returnUri='+'/network');
            }
            else $timeout(deferred.resolve);
            return deferred.promise;

        };
        // states for my app
        $stateProvider
            .state('networks', {
                url: '/allnetwork',
                templateUrl: 'packages/network/views/allnetworks.html',
                resolve:{
                    loggedin:checkLoggedOut
                }
            })
            .state('network', {
                url: '/network/:Id',
                templateUrl: 'packages/network/views/index.html',
                resolve:{
                    loggedin:checkLoggedOut
                }
            })
            .state('network.posts', {
                url: '/posts',
                templateUrl: 'packages/network/views/posts.html',
                resolve:{
                    loggedin:checkLoggedOut
                }
            })
            .state('network.messages', {
                url: '/messages',
                templateUrl: 'packages/network/views/messages.html',
                resolve:{
                    loggedin:checkLoggedOut
                }
            })
            .state('network.events', {
                url: '/events',
                templateUrl: 'packages/network/views/events.html',
                resolve:{
                    loggedin:checkLoggedOut
                }
            })
            .state('network.members', {
                url: '/members',
                templateUrl: 'packages/network/views/members.html',
                resolve:{
                    loggedin:checkLoggedOut
                }
            })
            // .state('auth.login', {
            //   url: '/login',
            //   templateUrl: 'packages/users/views/login.html',
            //   resolve: {
            //     //loggedin: checkLoggedOut
            //   }
            // })
            // .state('auth.register', {
            //   url: '/register',
            //   templateUrl: 'packages/users/views/register.html',
            //   resolve: {
            //     //loggedin: checkLoggedOut
            //   }
            // })
            // .state('auth.forgot-password', {
            //   url: '/forgot-password',
            //   templateUrl: 'packages/users/views/forgot-password.html',
            //   resolve: {
            //     //loggedin: checkLoggedOut
            //   }
            // })
            // .state('reset-password', {
            //   url: '/reset/:tokenId',
            //   templateUrl: 'users/views/reset-password.html',
            //   resolve: {
            //     //loggedin: checkLoggedOut
            //   }
            // });
    }
]);