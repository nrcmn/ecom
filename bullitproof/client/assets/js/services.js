angular.module('services', [])

    .service('loadCategories', function ($http, $rootScope) {
        return function () {
            $http.get('http://beeline-ecommerce.herokuapp.com/api/public/v1/collections/?api_key=' + window.api_key + '&market_region=' + window.market_region).success(function (data) {
                // Delete rates
                data.forEach(function (item, i, arr) {
                    if (item.id == 101) {
                        data.splice(i, 1);
                    }
                })

                window.categories = data;
                $rootScope.categories = data;
            })
        }
    })

    .service('loadProducts', function ($http, $state, $rootScope) {
        return function (id, page, amount, name, sort) {
            $http({
                method: 'GET',
                url: 'http://beeline-ecommerce.herokuapp.com/api/public/v1/products/',
                params: {
                    api_key: window.api_key,
                    market_region: window.market_region,
                    collection: id,
                    amount: amount,
                    page: page,
                    sort_by: sort
                }
            })
            .success(function (data) {
                switch (sort) {
                    case null:
                        $rootScope.productsListName = name;
                        $rootScope.products = data;
                        $state.go('products');
                        break;
                    case 'weight':
                        $rootScope.leaders = data;
                        break;
                    case '-weight':
                        $rootScope.lastProducts = data;
                        break;
                }
            })
            .error(function (data) {
                console.log(data);
            })
        }
    })
