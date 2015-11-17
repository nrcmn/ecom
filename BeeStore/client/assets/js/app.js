angular.module('BeeStore', ['ui.router','ngAnimate', 'foundation', 'controllers', 'directives', 'services'])

    .config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('main', {
                url: "/",
                templateUrl: "./templates/mainCategories.html",
                title: function () {return 'Главная'}
            })
            .state('categories', {
                url: "/categories",
                templateUrl: "./templates/subCategories.html",
                title: function () {
                    try {
                        return window.category.name
                    } catch (e) {
                        return true
                    }
                }
            })
            .state('products', {
                url: '/categories/products',
                templateUrl: './templates/products.html',
                title: function () {
                    try {
                        return window.subCategory.name
                    } catch (e) {
                        return true
                    }
                }
            })
            .state('detail', {
                url: '/categories/products/{id}',
                templateUrl: './templates/products.detail.html',
                title: function () {
                    try {
                        return window.product.name
                    } catch (e) {
                        return true
                    }
                }
            })
    })

    .run(function ($rootScope, FoundationApi, $state) {
        FastClick.attach(document.body);

        window.api_key = '852bff3ff459f9886729b9de223e8a0340ce008b',
            market_region = 98082,
            filter = {},
            page = 1;


        // Bread scrumbs
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if (toState.url == '/') { // if this is main
                var main = true;
            }

            if (!fromState.title || main) { // delete all data from scrumbs, and push main page
                $rootScope.scrumbs = [];
                $rootScope.scrumbs.push(toState.title());
            }
            else if ($rootScope.scrumbs.indexOf(toState.title()) > -1) { // if scrumbs have this title, delete them (back button event)
                $rootScope.scrumbs.pop()
            }
            else { // for all others conditions
                $rootScope.scrumbs.push(toState.title());
            }
        })
    })
