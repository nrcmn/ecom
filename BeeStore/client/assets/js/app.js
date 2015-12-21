angular.module('BeeStore', ['ui.router','ngAnimate', 'foundation', 'foundation.dynamicRouting.animations', 'controllers', 'directives', 'services', 'duScroll'])

    .config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('main', {
                url: "/",
                templateUrl: "./templates/mainCategories.html",
                getTitle: function () {return 'Главная'},
                controller: function ($rootScope) {
                    $rootScope.shadowShow = false;
                    $rootScope.basketBottomShow = true;
                    $rootScope.showHistoryBlock = false;
                },
                show: false,
                id: 1,
                animation: {
                    enter: 'fadeIn'
                }
            })
            .state('categories', {
                url: "/categories",
                templateUrl: "./templates/subCategories.html",
                getTitle: function () {
                    try {
                        return window.category.name
                    } catch (e) {
                        return true
                    }
                },
                controller: function ($rootScope) {
                    $rootScope.shadowShow = false;
                    $rootScope.basketBottomShow = true;
                    $rootScope.showHistoryBlock = true;
                },
                show: true,
                id: 2,
                animation: {
                    enter: 'fadeIn'
                }
            })
            .state('products', {
                url: '/categories/products',
                templateUrl: './templates/products.html',
                getTitle: function () {
                    try {
                        return window.subCategory.name
                    } catch (e) {
                        return true
                    }
                },
                controller: function ($rootScope) {
                    $rootScope.shadowShow = true;
                    $rootScope.basketBottomShow = true;
                    $rootScope.showHistoryBlock = true;
                },
                show: true,
                id: 3,
                animation: {
                    enter: 'fadeIn'
                }
            })
            .state('detail', {
                url: '/categories/products/{id}',
                templateUrl: './templates/products.detail.html',
                getTitle: function () {return null}, // hide on detail page
                controller: function ($rootScope, $scope) {
                    $rootScope.shadowShow = true;
                    $rootScope.basketBottomShow = true;
                    $rootScope.showHistoryBlock = true;
                },
                show: false,
                id: 4,
                animation: {
                    enter: 'fadeIn'
                }
            })

            .state('leaders', {
                url: '/leaders/{id}',
                templateUrl: './templates/products.detail.html',
                getTitle: function () {return 'Лидеры'},
                controller: function ($rootScope) {
                    $rootScope.shadowShow = true;
                    $rootScope.basketBottomShow = true;
                    $rootScope.showHistoryBlock = true;
                },
                show: true,
                id: 5,
                animation: {
                    enter: 'fadeIn'
                }
            })
            .state('basket', {
                url: '/basket',
                templateUrl: './templates/basket.html',
                abstract: true
            })
            .state('basket.products', {
                url: '/products',
                templateUrl: './templates/basket.products.html',
                getTitle: function () {return 'Корзина'},
                controller: function ($rootScope) {
                    $rootScope.shadowShow = false;
                    $rootScope.basketBottomShow = false;
                    $rootScope.showHistoryBlock = true;
                },
                show: true,
                id: 6,
                animation: {
                    enter: 'fadeIn'
                }
            })
            .state('basket.form', {
                url: '/form',
                templateUrl: './templates/basket.form.html',
                getTitle: function () {return 'Оформление заказа'},
                controller: function ($rootScope) {
                    $rootScope.shadowShow = false;
                    $rootScope.basketBottomShow = false;
                    $rootScope.showHistoryBlock = true;
                },
                show: true,
                id: 7,
                animation: {
                    enter: 'fadeIn'
                }
            })
            .state('basketDetail', {
                url: '/basket/products/{id}',
                templateUrl: './templates/products.detail.html',
                getTitle: function () {return null}, // hide on detail page
                controller: function ($rootScope, $scope) {
                    $rootScope.shadowShow = true;
                    $rootScope.basketBottomShow = true;
                    $rootScope.showHistoryBlock = true;
                },
                show: false,
                id: 8,
                animation: {
                    enter: 'fadeIn'
                }
            })

            .state('plans', {
                url: '/plans',
                templateUrl: './templates/plans.html',
                getTitle: function () {return 'Тарифы'},
                show: false,
                id: 9,
                animation: {
                    enter: 'fadeIn'
                }
            })
    })

    .run(function ($rootScope, FoundationApi, $state) {
        FastClick.attach(document.body);

        unacceptableCategories = [6, 5, 4, 101, 15, 202, 23, 24, 164, 78, 80, 79, 166, 162, 165, 71, 70, 77, 122, 121, 182, 93, 86, 85, 90, 87, 163]; // unacceptable categories ids

        window.api_key = '852bff3ff459f9886729b9de223e8a0340ce008b',
            // url = 'https://public.backend.vimpelcom.ru', // public
            url = 'https://public.backend-test.vimpelcom.ru', // public test
            // url = 'http://backend.vimpelcom.ru:8080', // internal
            // url = 'http://backend-test.vimpelcom.ru:8080', // internal test

            market_region = 98082, // Moscow
            // market_region = 98220, // Ekaterinburg
            filter = {},
            page = 2,
            marketCode = 'VIP';

        // Bread crumbs
        $rootScope.crumbs = []; // crumbs
        $rootScope.basket = []; // basket
        $rootScope.basketProductsCount = $rootScope.basket.length; // basket products summary count

        $rootScope.$watch('basketProductsCount', function () { // basket summary price
            var price = 0;
            $rootScope.basket.forEach(function (item, i, arr) {
                if (item.quantity) {
                    price += (item.price * item.quantity);
                }
                else {
                    price += item.price;
                }
            })

            return $rootScope.basketPrice = price; // basket summary price variable
        })

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){

            toState.title = toState.getTitle(); // get readable crumb name

            // condition for main page
            if (toState.url == '/') {
                return $rootScope.crumbs.length = 0, toState.show = false, $rootScope.crumbs.push(toState);
            }

            // for other pages
            for (var i = 0; i < $rootScope.crumbs.length; i++) {
                var crumb = $rootScope.crumbs[i];
                if (crumb.id == toState.id) {
                    return $rootScope.crumbs.splice(i + 1, 10); // back button event
                }
            }

            try {
                $rootScope.crumbs[0].show = true; // show first state in other states
            } catch (e) {console.log('ok');}

            return $rootScope.crumbs.push(toState);
        })

        $rootScope.openCrumb = function (crumb) {
            $state.go(crumb.name);
        }
    })

    .value('mainCategories', [
        {
            name: 'Телефоны',
            order: 1,
            id: 2,
            img: './assets/img/phone.jpg'
        },
        {
            name: 'Планшеты',
            order: 2,
            id: 21,
            img: './assets/img/tablet.jpg'
        },
        {
            name: 'Модемы и роутеры',
            order: 3,
            id: 224,
            img: './assets/img/router.png'
        },
        {
            name: 'Гаджеты',
            order: 4,
            id: 8,
            img: './assets/img/watch.png'
        },
        {
            name: 'Аксессуары',
            order: 5,
            id: 9,
            img: './assets/img/head.jpg'
        }
    ])

    .filter('price', function () {
        return function (price) {
            var priceMask = price.toString().split('');
            priceMask.splice(-3, 0, ' ');
            return price = priceMask.join('');
        };
    })

    .filter('color', function () {
        return function (value) {
            try {
                value.forEach(function (item, i, arr) {
                    if (item.id == 21 && item.value.length < 2) {
                        item.value = item.value[0].split(';')
                    }
                })

                return value;
            } catch (e) {
                return value;
            }
        }
    })

    .filter('multiCardColor', function () {
        return function (color) {
            return color.split(';').pop();
        }
    })
