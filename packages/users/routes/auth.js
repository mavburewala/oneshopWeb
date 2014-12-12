'use strict';

//Setting up route
angular.module('gleepostweb.users').config(['$stateProvider',
    function($stateProvider) {
        // Check if the user is not connected
        var checkLoggedOut = function($q, $timeout, $http, $location,$cookieStore) {
            // Initialize a new promise
            var deferred = $q.defer();
            console.log("here")
            var currentUser=$cookieStore.get('user');
            console.log(currentUser);
            if(!currentUser)
            {
                $timeout(deferred.reject);
                $location.url('/auth/login');
            }
            else $timeout(deferred.resolve);
            return deferred.promise;

        };

        // states for my app
        $stateProvider
            .state('auth', {
                url: '/auth',
                templateUrl: 'packages/users/views/index.html'
            })
            .state('auth.logout', {
                url: '/logout',
                controller: 'logoutCtrl'
            })
            .state('auth.login', {
                url: '/login',
                templateUrl: 'packages/users/views/login.html',
                resolve: {
                    //loggedin: checkLoggedOut
                }
            })
            .state('auth.register', {
                url: '/register',
                templateUrl: 'packages/users/views/register.html',
                resolve: {
                    //loggedin: checkLoggedOut
                }
            })
            .state('auth.forgot-password', {
                url: '/forgot-password',
                templateUrl: 'packages/users/views/forgot-password.html',
                resolve: {
                    //loggedin: checkLoggedOut
                }
            })
            .state('reset-password', {
                url: '/reset/:tokenId',
                templateUrl: 'users/views/reset-password.html',
                resolve: {
                    //loggedin: checkLoggedOut
                }
            })

            .state('profile', {
                url: '/user/profile/:Id',
                templateUrl: 'packages/users/views/profile.html',
                resolve: {
                    //loggedin: checkLoggedOut
                }
            })

            .state('profile.about', {
                url: '/about',
                templateUrl: 'packages/users/views/profileAbout.html',
                resolve: {
                    loggedin: checkLoggedOut
                }
            })

            .state('profile.interactions', {
                url: '/interactions',
                templateUrl: 'packages/users/views/profileInteractions.html',
                resolve: {
                    loggedin: checkLoggedOut
                }
            })

            .state('profile.posts', {
                url: '/posts',
                templateUrl: 'packages/users/views/profilePosts.html',
                resolve: {
                    loggedin: checkLoggedOut
                }
            })

            .state('profile.badges', {
                url: '/badges',
                templateUrl: 'packages/users/views/profileBadges.html',
                resolve: {
                    loggedin: checkLoggedOut
                }
            });  
    }
]);