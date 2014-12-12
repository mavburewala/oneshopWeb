'use strict';

//Setting up route
angular.module('gleepostweb.main').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        // For unmatched routes:
        var checkLoggedOut = function($q, $timeout, $http, $location,$cookieStore,$state) {
            // Initialize a new promise
            var deferred = $q.defer();
            var currentUser=$cookieStore.get('user');
            console.log(currentUser);
            if(!currentUser)
            {
                $timeout(deferred.reject);
                $location.url('/auth/login?returnUri='+'/wall');
            }
            else $timeout(deferred.resolve);
            return deferred.promise;

        };
        $urlRouterProvider.otherwise('/');
            // states for my app
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/index.html',
                resolve:{
                    loggedin:checkLoggedOut
                }
            });
    }
]).config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);