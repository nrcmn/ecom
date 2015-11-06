angular.module('services', [])
    .service('__LoadCategories', function ($http, $rootScope) {
        return function (categories) {
            $http({
                method: 'GET',
                url: 'http://beeline-ecommerce.herokuapp.com/api/public/v1/collections/',
                params: {
                    "api_key": window.api_key,
                    "market_region": window.market_region
                }
            })
            .success(function (data) {
                $rootScope.categories = {
                    main: [],
                    sub: []
                };

                data.forEach(function (item, i, arr) {
                    if (categories.indexOf(item.id) > -1) {
                        return false
                    }
                    else if (!item.parent) {
                        $rootScope.categories.main.push(item);
                    }
                    else if (item.parent) {
                        $rootScope.categories.sub.push(item);
                    }
                })
            })
            .error(function () {
                console.error('ERROR! "__LoadCategories"');
            })
        }
    })


    .service('__LoadProducts', function ($http, $rootScope) {
        return function (subCategory, amount, page, sort) {
            $http({
                method: 'GET',
                url: 'http://beeline-ecommerce.herokuapp.com/api/public/v1/products/',
                params: {
                    "api_key": window.api_key,
                    "market_region": window.market_region,
                    collection: subCategory.id,
                    amount: amount,
                    page: page,
                    sort_by: sort
                }
            })
            .success(function (data) {
                if (!$rootScope.productsList) {
                    $rootScope.productsList = data;
                }
                else {
                    data.forEach(function (item, i, arr) {
                        $rootScope.productsList.push(item);
                    })
                }

                $rootScope.progress = false;
            })
            .error(function () {
                console.error('ERROR! "__LoadProducts"');
            })
        }
    })

    .service('__LoadFilters', function($http, $rootScope) {
        return function (subCategory) {
            $http({
                method: 'GET',
                url: 'https://public.backend.vimpelcom.ru/api/public/v1/collections/' + subCategory.id + '/filters/',
                // url: 'http://beeline-ecommerce.herokuapp.com/api/public/v1/filters/',
                // url: 'http://localhost:7000/filters',
                params: {
                    "api_key": window.api_key,
                    "market_region": window.market_region
                }
            })
            .success(function (data) {
                $rootScope.productsListFilter = data;
            })
            .error(function () {
                console.error('ERROR! "__LoadFilters"');
            })
        }
    })

    .service('__LoadLeaders', function ($http) {
        return function (id) {

        }
    })
