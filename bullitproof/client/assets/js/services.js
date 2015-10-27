angular.module('services', [])

    .service('loadCategories', function ($http, $rootScope) {
        return function () {
            $http.get('http://beeline-ecommerce.herokuapp.com/api/public/v1/collections/?api_key=' + window.api_key + '&market_region=' + window.market_region).success(function (data) {
                window.categories = [];

                // Delete rates
                data.forEach(function (item, i, arr) {
                    if (item.id == 6 || item.id == 5 || item.id == 4 || item.id == 101 || item.id == 202 || item.id == 15) {
                        return false
                    }
                    else {
                        window.categories.push(item)
                    }
                })

                $rootScope.categories = window.categories;
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
