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

        window.api_key = '852bff3ff459f9886729b9de223e8a0340ce008b',
            market_region = 98082;
    })
