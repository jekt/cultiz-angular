(function(){
	var app = angular.module('Cultiz', ['homepage-directives']);

	app.filter('safeHtml', function($sce) {
	    return function(val) {
	        return $sce.trustAsHtml(val);
	    };
	});

})();