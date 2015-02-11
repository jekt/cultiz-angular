(function(){
	var app = angular.module('homepage-directives', []);

	app.directive('homepageList', function(){
		return {
			restrict: 'E',
			templateUrl: 'components/homepage/homepage-list.html',
			controller: ['$http', function($http){
				var hp = this;
				hp.articleList = [];
				hp.currentArticle = 0;

				$http.get('components/homepage/simulation-hp.json')
					.success(function(data){
						hp.articleList = data.posts;
					});

				hp.isShown = function(articleID){
					return hp.currentArticle === articleID;
				};

				hp.showArticle = function(articleID){
					hp.currentArticle = !hp.isShown(articleID) ?
										hp.currentArticle = articleID :
										hp.currentArticle = 0;
				};
			}],
			controllerAs: 'hp'
		};
	})
})();