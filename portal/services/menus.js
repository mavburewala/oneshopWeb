'use strict';

angular.module('gleepostweb.main').factory('Menus', ['$resource',
    function($resource) {
        return $resource('admin/menu/:name', {
            name: '@name',
            defaultMenu: '@defaultMenu'
        });
    }
]);