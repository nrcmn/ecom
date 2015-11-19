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
                title: function () {return null} // hide on detail page
            })

            .state('leaders', {
                url: '/leaders/{id}',
                templateUrl: './templates/products.detail.html',
                title: function () {return 'Лидеры'}
            })
    })

    .run(function ($rootScope, FoundationApi, $state) {
        FastClick.attach(document.body);

        window.api_key = '852bff3ff459f9886729b9de223e8a0340ce008b',
            market_region = 98082,
            filter = {},
            page = 2;


        // Bread crumbs
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if (toState.url == '/') { // if this is main page
                var main = true;
                $rootScope.showCrumbs = false;
            }
            else {
                var main = false;
                $rootScope.showCrumbs = true;
            }

            if (main) { // delete all data from crumbs, and push main page
                $rootScope.crumbs = [];
                $rootScope.crumbs.push(toState.title());
            }
            else if (fromState.title() == null || toState.title() == null) {
                return false
            }
            else if ($rootScope.crumbs.indexOf(toState.title()) > -1) { // if crumbs array have this title, delete them (back button event)
                $rootScope.crumbs.pop()
            }
            else if (toState.title() != null) { // for all others conditions
                $rootScope.crumbs.push(toState.title());
            }
        })
    })

    .value('mainCategories', [
        {
            name: 'Телефоны',
            order: 1,
            id: 2,
            img: './assets/img/close.svg'
        },
        {
            name: 'Планшеты',
            order: 2,
            id: 21,
            img: './assets/img/close.svg'
        },
        {
            name: 'Модемы и роутеры',
            order: 3,
            id: 224,
            img: './assets/img/close.svg'
        },
        {
            name: 'Гаджеты',
            order: 4,
            id: 8,
            img: './assets/img/close.svg'
        },
        {
            name: 'Аксессуары',
            order: 5,
            id: 9,
            img: './assets/img/close.svg'
        }
    ])
