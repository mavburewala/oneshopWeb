'use strict';

angular.module('oneShopWeb.main').factory('Menus', ['$resource',
    function($resource) {
        return $resource('admin/menu/:name', {
            name: '@name',
            defaultMenu: '@defaultMenu'
        });
    }
]);