angular.module('application', ['ui.router','ngAnimate', 'foundation', 'foundation.dynamicRouting', 'foundation.dynamicRouting.animations', 'constants', 'controllers'])

    .config(['$urlRouterProvider', '$locationProvider', function ($urlProvider, $locationProvider) {
        $urlProvider.otherwise('/');

        $locationProvider.html5Mode({
            enabled:false,
            requireBase: false
        });

        $locationProvider.hashPrefix('!');
    }])

    .run(function ($rootScope, FoundationApi, $state, __CATEGORIES) {
        FastClick.attach(document.body);

        $rootScope.categories = __CATEGORIES;

    })
