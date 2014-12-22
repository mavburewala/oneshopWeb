'use strict';

angular.module('oneShopWeb.main').controller('IndexController', ['$scope', 'Global',
  function($scope, Global) {
    $scope.global = Global;
  }
]);

angular.module('oneShopWeb.main').controller('MainController', ['$scope', 
  function($scope) {
  	
  	$scope.initAddressSelector = function(){
  		var addressPicker = new AddressPicker();
  		var elAddress = angular.element( document.querySelector( '#address' ) );

  		elAddress.typeahead(null, {
		  displayKey: 'description',
		  source: addressPicker.ttAdapter()
		});
  		
	};

	$scope.initAddressSelector();
  }
]);


angular.module('oneShopWeb').controller('SuperMainController', ['$scope','$state','$rootScope',
  function($scope, $state,$rootScope) {
    $rootScope.currentState = $state.$current.name;
  }
]);
