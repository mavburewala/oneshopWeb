'use strict';

//Setting up route
angular.module('gleepostweb.messenger').config(['$stateProvider',
    function($stateProvider) {
        // Check if the user is not connected
        var checkLoggedOut = function($q, $timeout, $http, $location,$cookieStore,$state) {
            // Initialize a new promise
            var deferred = $q.defer();
            var currentUser=$cookieStore.get('user');
            console.log(currentUser);
            if(!currentUser)
            {
                $timeout(deferred.reject);
                $location.url('/auth/login?returnUri='+'/messages');
            }
            else $timeout(deferred.resolve);
            return deferred.promise;

        };


        // states for my app
        $stateProvider
            .state('messages', {
                url: '/messages',
                templateUrl: 'packages/messenger/views/index.html',
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