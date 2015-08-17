angular.module('controllers', [])

    .controller('CategoriesCtrl', function ($scope, $http, $location, $state, $rootScope) {
        $location.$$path

        switch ($location.$$path) {
            case '/categories.phones':
                loadCategory($location.$$path)
                $scope.categoryName = 'Телефоны'
                break;
        }

        function loadCategory(hash) {
            $http.get('assets/http/categories.json').success(function (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].categoryHash == hash) {
                        $scope.categoryData = data[i];
                        break
                    }
                }
            })
        }

        $scope.openCategory = function (arg) {
            $state.go('products');
            $rootScope.productListName = arg.name
        }
    })

    .controller('ProductsListCtrl', function ($http, $scope, $rootScope) {
        $http.get('assets/http/smartphones_list_catalog_21_page_1.json').success(function (data) {
            $scope.productList = data;
        })
    })

    .controller('DetailPageCtrl', function ($http, $rootScope, $scope, FoundationApi) {
        $scope.loadDetailData = false;
        $http.get('assets/http/phone_detail_page(' + $rootScope.product.article + ').json').success(function (data) {
            $scope.loadDetailData = true;
            $rootScope.product = data.results[0];
        })

        $scope.toBasket = function (product) {

            function showNotify(argument) {
                FoundationApi.publish('to-basket-notify', {
                    content: 'Товар добавлен в корзину.',
                    color: "success",
                    autoclose: "2000"
                });
            }

            for (var i = 0; i < $rootScope.basket.length; i++) {
                if ($rootScope.basket[i].article == product.article) {
                    $rootScope.basket[i].count += 1;
                    showNotify();

                    return true
                }
            }

            $rootScope.basket.push({
                count: 1,
                article: product.article,
                image: product.images[0].image,
                price: product.price,
                name: product.name
            })

            showNotify();
        }
    })

    .controller('BasketProductListCtrl', function ($scope, $rootScope, $state) {
        // $rootScope.basket = [
        //     {
        //         "count":1,
        //         "article":"3700000630",
        //         "image":"/media/goods/fullsize/a4a5eb44-d261-4b48-bd76-ea84a8828c44.jpg",
        //         "price":100,
        //         "name":"Смартфон Apple iPhone 6 16Gb Space Gray"
        //     }
        // ]

        $scope.minusCount = function ($index) {
            if ($rootScope.basket[$index].count == 1) {
                return false
            }

            $rootScope.basket[$index].count -= 1
        }

        $scope.plusCount = function ($index) {
            $rootScope.basket[$index].count += 1
        }

        $scope.deleteItem = function ($index) {
            $rootScope.basket.splice($index, 1);
        }

        $scope.onward = function () {
            $state.go('basket.delivery.courier');
        }
    })

    .controller('BasketDeliveryFormCtrl', function ($scope) {

    })

    .controller('CourierDeliveryCtrl', function ($scope, $state, $rootScope) {
        $rootScope.form = {};

        $scope.deliveryTime = [
            {
                id: 1,
                time: 'С 9:00 до 10:00'
            },
            {
                id: 2,
                time: 'С 10:00 до 11:00'
            }
        ];
        $scope.form.time = $scope.deliveryTime[0]

        $scope.onward = function () {
            $state.go('basket.confirm')
        }

        return $rootScope.form
    })

    .controller('PickupDeliveryCtrl', function ($scope, $state, $rootScope) {
        $rootScope.form = {};
        $scope.onward = function () {
            $state.go('basket.confirm')
        }

        return $rootScope.form
    })

    .controller('BasketConfirmCtrl', function ($scope, $state, $rootScope, FoundationApi, $timeout) {
        console.log($rootScope.form);

        // $rootScope.basket = [
        //     {
        //         "count":1,
        //         "article":"3700000630",
        //         "image":"/media/goods/fullsize/a4a5eb44-d261-4b48-bd76-ea84a8828c44.jpg",
        //         "price":100,
        //         "name":"Смартфон Apple iPhone 6 16Gb Space Gray"
        //     }
        // ]

        $scope.onward = function () {
            FoundationApi.publish('confirm-notify', {
                content: 'Спасибо!\nВаш заказ отправлен в никуда..',
                color: "success",
                autoclose: "4000"
            });

            $timeout(function () {
                $state.go('phones');
            }, 4000)
        }

        $scope.deleteItem = function ($index) {
            if ($rootScope.basket.length == 1) {
                FoundationApi.publish('confirm-notify', {
                    content: "Невозможно удалить последний товар.",
                    color: "alert",
                    autoclose: "4000"
                });

                return false
            }

            $rootScope.basket.splice($index, 1);
        }


    })
