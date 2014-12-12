

angular.element(document).ready(function() {
    //Fixing facebook bug with redirect
    //  console.log("hello");
    if (window.location.hash === '#_=_') {
        window.location.hash = '#!';
    }

    //Then init the app
    //angular.bootstrap(document, ['gleepostweb']);

});

// Default modules
var modules = ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router',
    'oneShopWeb.main', 'oneShopWeb.campusWall','oneShopWeb.users'
];

// Combined modules
angular.module('oneShopWeb', modules)
.run(function($rootScope,$cookieStore,Profile,$timeout) {

});