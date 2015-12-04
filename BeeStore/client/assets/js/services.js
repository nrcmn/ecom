angular.module('services', [])
    .service('__LoadCategories', function ($http, $q) {
        var deferred = $q.defer();
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
                // url: 'http://beeline-ecommerce.herokuapp.com/api/public/v1/products/',
                url: 'https://public.backend-test.vimpelcom.ru/api/public/v1/products/',
                params: {
                    "api_key": window.api_key,
                    "market_region": window.market_region,
                    collection: subCategory.id,
                    amount: amount,
                    page: page,
                    sort_by: sort,
                    intag_choices: intags
                }
            })
            .success(function (data) {
                if (data.length < amount) {
                    window.scrollLoad = false;
                    $rootScope.progress = false;
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
                url: 'https://public.backend.vimpelcom.ru/api/public/v1/collections/' + id + '/filters/',
                params: {
                    "api_key": window.api_key,
                    "market_region": window.market_region
                }
            })
            .success(function (data) {
                window.filter[window.subCategory.id] = data;
                $rootScope.productsListFilter = data;
                // $rootScope.filterShow = true;
            })
            .error(function () {
                console.error('ERROR! "__LoadFilters"');
                // $rootScope.filterShow = false;
            })
        }
    })

    .service('__LoadOneProduct', function ($http, $rootScope, $q) {
        var deferred = $q.defer();
        return function (id) {

            var params = (!window.product) ? 'id,name,remain,price,images,article,description,old_price,intags_categories,badges,accessories,rr_recommendations,multicard_products' : 'description,old_price,intags_categories,badges,accessories,rr_recommendations,multicard_products';

            $http({
                method: 'GET',
                url: 'https://public.backend-test.vimpelcom.ru/api/public/v1/products/' + id + '/',
                params: {
                    "api_key": window.api_key,
                    "market_region": window.market_region,
                    params: params
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
