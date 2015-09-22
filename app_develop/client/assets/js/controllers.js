angular.module('controllers', [])

    .controller('MenuGroupCtrl', function ($scope, $http, $rootScope, $state, loadCategories) {
        loadCategories();
        $scope.openSection = function (category) {
            $rootScope.categoryInfo = {
                name: category.name,
                id: category.id
            };
        }
    })

    .controller('CategoriesCtrl', function ($scope, $rootScope, loadProducts) {
        $scope.openCategory = function (section) {
            console.log(section);
            loadProducts(section.id, 1);
        }

        function imageLoadProgress () {
            console.log('Progress');
        }
    })

    .controller('ProductsListCtrl', function ($http, $scope, $rootScope, $state, __SPINER) {
        __SPINER.hide();
        $scope.detailOpen = function (product) {
            window.product = product;
        }
    })

    .controller('DetailPageCtrl', function ($http, $rootScope, $scope, FoundationApi, loadRecomendations) {
        // recomendations loader
        $rootScope.recomendations = [];
        window.product.recommendations.forEach(function (item, i, arr) {
            loadRecomendations(item);
        })

        $scope.loadDetailData = false;
        window.product.intags_leftColumn = [];
        window.product.intags_rightColumn = [];
        var intagsLength = window.product.intags_categories.length;

        window.product.intags_categories.forEach(function (item, i, arr) {
            if (i <= (intagsLength / 2).toFixed()) {
                window.product.intags_leftColumn.push(item);
            }
            else if (i > (intagsLength / 2).toFixed()) {
                window.product.intags_rightColumn.push(item);
            }
        })

        $scope.product = window.product;

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
                image: product.images[0],
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
        //         "article":"1409001020",
        //         "image":"http://static.beeline.ru/shop/media/goods/fullsize/5c942c5b-7732-4419-acfb-82cfa2212f66.jpg",
        //         "price":590,
        //         "name":"Ремешок Samsung ET-SR350B для Samsung Gear Fit Gray/Silver"
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
        // $rootScope.basket = [
        //     {
        //         "count":1,
        //         "article":"1409001020",
        //         "image":"http://static.beeline.ru/shop/media/goods/fullsize/5c942c5b-7732-4419-acfb-82cfa2212f66.jpg",
        //         "price":590,
        //         "name":"Ремешок Samsung ET-SR350B для Samsung Gear Fit Gray/Silver"
        //     }
        // ]
        //
        // $rootScope.form = {
        //     city: "mo",
        //     date: '2015-09-25T00:00:00.511Z',
        //     email: "mail.ru",
        //     flat: "3",
        //     house: "2",
        //     housing: "1",
        //     name: "qwerty",
        //     paymentType: "Наличными",
        //     street: "test",
        //     tel: "9162255977",
        //     time: {
        //         id: 1,
        //         time: 'С 9:00 до 10:00'
        //     },
        //     id: 2,
        //     time: "С 10:00 до 11:00"
        // }

        $scope.onward = function () {
            FoundationApi.publish('confirm-notify', {
                content: 'Спасибо!\nВаш заказ отправлен!',
                color: "success",
                autoclose: "4000"
            });

            $timeout(function () {
                $state.go('categories');
                $rootScope.basket = [];
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
