angular.module('application', ['ui.router','ngAnimate', 'foundation', 'foundation.dynamicRouting', 'foundation.dynamicRouting.animations', 'constants', 'controllers', 'services'])

    .config(['$urlRouterProvider', '$locationProvider', function ($urlProvider, $locationProvider) {
        $urlProvider.otherwise('/');

        $locationProvider.html5Mode({
            enabled:false,
            requireBase: false
        });

        $locationProvider.hashPrefix('!');
    }])

    .run(function ($rootScope, FoundationApi, $state, loadCategories) {
        FastClick.attach(document.body);
        window.api_key = '3269460fc771fe1d97f0a3bdc13be279f3d07d96',
                market_region = 98082;


        $rootScope.basket = [];
        $rootScope.productsHistory = [];

        loadCategories();
    })

    .directive('swiper', function ($rootScope, $timeout) {
        return {
            link: function (scope, element, attributes) {
                $timeout(function () {
                    var swiper = new Swiper('.swiper-container', {
                        pagination: '.swiper-pagination',
                        paginationClickable: '.swiper-pagination',
                        nextButton: '.swiper-button-next',
                        prevButton: '.swiper-button-prev'
                    });
                }, 0.000001);
            }
        }
    })
