angular.module('gleepostweb.messenger')
	.filter('calendar', function () {
  		return function (item) {
    		return moment(item).calendar();
  		};
	})
	.filter('fromNow', function () {
  		return function (item) {
    		return moment(item).fromNow();
  		};
	})
	.filter('short', function () {
  		return function (item) {
    		return moment(item).format('lll');
  		};
	})
	.filter('orderObjectBy', function() {
		return function(items, field, reverse) {
			var filtered = [];
			angular.forEach(items, function(item) {
				filtered.push(item);
			});
			filtered.sort(function (a, b) {
				return (a[field] > b[field] ? 1 : -1);
			});
			if(reverse) filtered.reverse();
			return filtered;
		};
	})
	.filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);
