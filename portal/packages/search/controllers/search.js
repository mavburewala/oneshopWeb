'use strict';
angular.module('gleepostweb.search')
    .controller('searchCtrl', ['$scope', '$rootScope', '$http', '$location', 'wall','$interval',
        function($scope, $rootScope, $http, $location, wall,$interval) {

            var injector = angular.injector(['gleepostweb.utilities']);
            var util = injector.get('util');

            $scope.init = function(){

            };

        }
    ]);