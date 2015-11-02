angular.module('services', [])
    .service('__LoadCategories', function ($http, $rootScope) {
        return function (categories) {
            $http({
                method: 'GET',
                url: 'http://beeline-ecommerce.herokuapp.com/api/public/v1/collections/?api_key=' + window.api_key + '&market_region=' + window.market_region
            })
            .success(function (data) {
                $rootScope.categories = {
                    main: [],
                    sub: []
                };

                data.forEach(function (item, i, arr) {
                    if (categories.indexOf(item.id) > -1 && !item.parent) {
                        $rootScope.categories.main.push(item);
                    }
                    else if (categories.indexOf(item.id) > -1 && item.parent) {
                        $rootScope.categories.sub.push(item);
                    }
                })

                console.log($rootScope.categories);
            })
            .error(function () {
                console.error('ERROR! "__LoadCategories"');
            })
        }
    })

    // .service('__LoadLeaders', function ($http) {
    //     return function (id) {
    //
    //     }
    // })
