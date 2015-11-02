angular.module('BeeStore', ['ui.router','ngAnimate', 'foundation', 'foundation.dynamicRouting', 'foundation.dynamicRouting.animations', 'controllers', 'directives', 'services'])

    .config(['$urlRouterProvider', '$locationProvider', function ($urlProvider, $locationProvider) {
        $urlProvider.otherwise('/');

        $locationProvider.html5Mode({
            enabled:false,
            requireBase: false
        });

        $locationProvider.hashPrefix('!');
    }])

    .run(function ($rootScope, FoundationApi, $state) {
        FastClick.attach(document.body);

        window.api_key = '3269460fc771fe1d97f0a3bdc13be279f3d07d96',
            market_region = 98082;
    })
