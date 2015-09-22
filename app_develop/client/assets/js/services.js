angular.module('services', [])

    .service('__SPINER', function ($rootScope) {
        return {
            show: function () {
                $rootScope.spinnerShow = true;
            },
            hide: function () {
                $rootScope.spinnerShow = false;
            }
        }
    })

    .service('loadCategories', function ($http, $rootScope, __SPINER) {
        return function () {
            __SPINER.show();
            $http.get('https://backend.vimpelcom.ru/api/public/v1/collections/?api_key=' + window.api_key + '&market_region=' + window.market_region).success(function (data) {
                window.categories = data;

                $rootScope.menuData = [];
                $rootScope.sectionData = {};

                data.forEach(function (item, i, arr) {
                    if (item.parent == null) {
                        $rootScope.menuData.push(item);
                        $rootScope.sectionData[item.id] = [];
                    }
                    else if (item.parent != null) {
                        $rootScope.sectionData[item.parent].push(item);
                    }
                })

                $rootScope.categoryInfo = {
                    name: $rootScope.menuData[0].name,
                    id: $rootScope.menuData[0].id
                };

                __SPINER.hide();
            })
        }
    })

    .service('loadProducts', function ($http, $state, $rootScope, __SPINER) {
        return function (id, page) {
            __SPINER.show();
            $http({
                method: 'GET',
                url: 'https://backend.vimpelcom.ru/api/public/v1/products/',
                params: {
                    api_key: window.api_key,
                    market_region: window.market_region,
                    collection: id,
                    amount: 15,
                    page: page
                }
            })
            .success(function (data) {
                console.log(data);
                $rootScope.products = data;
                $state.go('products');
            })
            .error(function (data) {
                console.log(data);
                __SPINER.hide();
            })
        }
    })

    .service('loadRecomendations', function ($http, $rootScope) {
        return function (id) {
            $http({
                method: 'GET',
                url: 'https://backend.vimpelcom.ru/api/public/v1/products/' + id + '/',
                params: {
                    api_key: window.api_key,
                    market_region: window.market_region
                }
            })
            .success(function (data) {
                $rootScope.recomendations.push(data);
            })
        }
    })
