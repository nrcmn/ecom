angular.module('services', [])
    .service('__LoadCategories', function ($http, $q) {
        var deferred = $q.defer();
        return function (categories) {
            $http({
                method: 'GET',
                url: window.url + '/api/public/v1/collections/',
                params: {
                    "api_key": window.api_key,
                    "market_region": window.market_region
                }
            })
            .success(function (data) {
                deferred.resolve(data);
            })
            .error(function () {
                deferred.reject('ERROR! "__LoadOneProduct"');
            })

            return deferred.promise;
        }
    })

    .service('__LoadProducts', function ($http, $rootScope) {
        return function (subCategory, amount, page, sort, intags) {
            $http({
                method: 'GET',
                url: window.url + '/api/public/v1/products/',
                params: {
                    "api_key": window.api_key,
                    "market_region": window.market_region,
                    collection: subCategory.id,
                    amount: amount,
                    page: page,
                    sort_by: sort,
                    intag_choices: intags,
                    point_codes: "0952"
                    // point_codes: "0055"
                }
            })
            .success(function (data) {
                if (data.length < amount) {
                    window.scrollLoad = false;
                    $rootScope.progress = false;
                }
                else if (data.length >= amount) {
                    window.scrollLoad = true;
                }

                if (intags && page == 1) {
                    $rootScope.productsList = data;
                    return true
                }

                // for lazy loading function
                if (!$rootScope.productsList) {
                    $rootScope.productsList = data;
                }
                else {
                    data.forEach(function (item, i, arr) {
                        $rootScope.productsList.push(item);
                    })
                }

                window.lazyLoadNow = false; // end lazy loading process
            })
            .error(function () {
                console.error('ERROR! "__LoadProducts"');
            })
        }
    })

    .service('__LoadFilters', function ($http, $rootScope) {
        return function (id) {
            $http({
                method: 'GET',
                url: window.url + '/api/public/v1/collections/' + id + '/filters/',
                params: {
                    "api_key": window.api_key,
                    "market_region": window.market_region
                }
            })
            .success(function (data) {
                // remove sales from data
                data.forEach(function (item, i, arr) {
                    if (item.id == 659) {
                        data.splice(i, 1);
                    }
                })

                window.filter[window.subCategory.id] = data;
                $rootScope.productsListFilter = data;
            })
            .error(function () {
                console.error('ERROR! "__LoadFilters"');
            })
        }
    })

    .service('__LoadOneProduct', function ($http, $rootScope, $q) {
        return function (id) {
            var deferred = $q.defer();
            var params = (!window.product) ? 'id,name,remain,price,images,article,description_yandex,old_price,intags_categories,accessories,rr_recommendations,multicard_products,description_small' : 'description_yandex,old_price,intags_categories,accessories,rr_recommendations,multicard_products,id,extended_remains,description_small';
            // TODO: add "description_small" parameter in 1.21 release

            $http({
                method: 'GET',
                url: window.url + '/api/public/v1/products/' + id + '/',
                params: {
                    "api_key": window.api_key,
                    "market_region": window.market_region,
                    params: params,
                    point_codes: "0952"
                    // "point_codes": "0055"
                }
            })
            .success(function (data) {
                deferred.resolve(data);
            })
            .error(function () {
                deferred.reject('ERROR! "__LoadOneProduct"');
            })

            return deferred.promise;
        }
    })

    .service('__LoadProductsListByID', function ($http, $rootScope, $q) {
        return function (idsList) {
            var deferred = $q.defer();
            $rootScope.multicardFilterProductList = new Array();
            $rootScope.$watchCollection('multicardFilterProductList', function(newNames, oldNames) {
                if ($rootScope.multicardFilterProductList.length == idsList.length) {
                    deferred.resolve($rootScope.multicardFilterProductList);
                };
            }, false);

            idsList.forEach(function (item, i, arr) {
                $http({
                    method: 'GET',
                    url: window.url + '/api/public/v1/products/' + item + '/',
                    params: {
                        "api_key": window.api_key,
                        "market_region": window.market_region,
                        point_codes: "0952"
                        // "point_codes": "0055"
                    }
                })
                .success(function (data) {
                    $rootScope.multicardFilterProductList.push(data)
                })
            })

            return deferred.promise;
        }
    })

    .service('__LoadMockPricePlans', function ($http, $rootScope) {
        return function (arg) {
            var soc = arg.split(';')[0];
            $http.get('./assets/http/pricePlans.json')
            .success(function (data) {
                $rootScope.showPricePlanPopup = true;
                data.forEach(function (item, i, arr) {
                    if (item.plans[0].code[0].name == soc) {
                        window.currentPricePlan = item.plans[0];
                        return $rootScope.pricePlansData = item.plans[0];
                    }
                })
            })
        }
    })

    .service('__LoadPricePlan', function ($http, $rootScope) {
        return function (arg) {
            var soc = arg.split(';')[0];
            $http({
                method: 'GET',
                url: 'http://api.beeline.ru/api/products/mobile/priceplans/query/marketandsocs',
                headers: {
                    Accept: 'application/vnd.beeline.api.v1.mobapp+json'
                },
                params: {
                    marketCode: window.marketCode,
                    arrSoc: soc
                }
            })
            .success(function (data) {
                console.log(data);
                $rootScope.showPricePlanPopup = true;
            })
        }
    })

    .service('__closeWebView', function ($http) {
        return function () {
            $http({
                method: 'GET',
                url: 'http://localhost:3000/close',
                params: {
                    id: window.webview
                }
            })
        }
    })

    .service('__Ordering', function ($http, $q) {
        return function (checkoutData) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: window.url + '/api/public/v1/orders/',
                params: {
                    "api_key": window.api_key
                },
                data: checkoutData
            })
            .success(function (response) {
                deferred.resolve(response);
            })
            .error(function (response) {
                deferred.reject(response);
            })

            return deferred.promise;
        }
    })
