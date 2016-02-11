(function() {
  'use strict';

angular.module('application', ['ui.router','ngAnimate', 'foundation', 'foundation.dynamicRouting', 'foundation.dynamicRouting.animations', 'controllers', 'masonry', 'ngWebSocket'])
    .config(['$urlRouterProvider', '$locationProvider', function ($urlProvider, $locationProvider) {
        $urlProvider.otherwise('/categories');

        $locationProvider.html5Mode({
          enabled:false,
          requireBase: false
        });

        $locationProvider.hashPrefix('!');
    }])

    .run(function ($rootScope, $websocket, FoundationApi) {
        FastClick.attach(document.body);

        // window.version =  "0.0.1";
        // window.id = "I001";

        window.version = prompt('Version of app', '0.0.1');
        window.id = prompt('Id of shop', 'I001');

        $rootScope.needToUpdate = false;

        $rootScope.basket = [];
        $rootScope.productsHistory = [];

        $rootScope.detailOpen = function (product) {
            $rootScope.product = product;
        }

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if (fromState.url == '/products/:article') {
                if ($rootScope.productsHistory.length == 10) {
                    $rootScope.productsHistory.splice(0, 1);
                }

                // ---------------------------------------
                // checking that array haven't this object
                // method: array.some([callback]);
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
                if($rootScope.productsHistory.some(function(item){return item.article == $rootScope.product.article})){
                    return false
                }

                $rootScope.productsHistory.push({
                    image: $rootScope.product.images[0].image,
                    name: $rootScope.product.name,
                    price: $rootScope.product.price,
                    article: $rootScope.product.article
                })
            }
        })

        document.addEventListener('focus', function (elm) {
            if (document.getElementById('focus') != null) {
                document.getElementById('focus').id = null;
            }

            elm.srcElement.id = 'focus';
        }, true);

        $rootScope.$watch('needToUpdate', function () {
            if ($rootScope.needToUpdate == true) {
                FoundationApi.publish('neet-to-update-app', {
                    content: "Необходимо обновить приложение!",
                    color: "alert"
                });
            }
        })

        var dataStream = $websocket('ws://localhost:5000');
        dataStream.onMessage(function(message) {
            var data = JSON.parse(message.data);
            if (data.needToUpdate == true) {
                $rootScope.needToUpdate = true;
                dataStream.send({
                    id: window.id,
                    ver: window.version,
                    status: 15
                });
            }
            else if (data.actualVersion == window.version) {
                dataStream.send({
                    id: window.id,
                    ver: window.version,
                    status: 20
                });
            }
            else if (data.actualVersion != window.version) {
                angular.forEach(data.shops, function (item, i, arr) {
                    if (item.id == window.id && item.version == window.version) {
                        dataStream.send({
                            id: window.id,
                            ver: window.version,
                            status: 20
                        });
                    }
                    else if (item.id == window.id && item.version != window.version) {
                        dataStream.send({
                            id: window.id,
                            ver: window.version,
                            status: 10
                        });
                    }
                    else if (i == (arr.length - 1) && window.version != data.actualVersion) {
                        dataStream.send({
                            id: window.id,
                            ver: window.version,
                            status: 10
                        });
                    }
                })
            }
        });

        dataStream.onClose(function () {
            dataStream.send({
                id: window.id,
                ver: window.version,
                status: 0
            });
        })
    })

    .directive('swiper', function ($rootScope, $timeout) {
        return {
            link: function (scope, element, attributes) {
                $timeout(function () {
                    var swiper = new Swiper('.swiper-container', {
                        pagination: '.swiper-pagination',
                        paginationClickable: '.swiper-pagination',
                        nextButton: '.swiper-button-next',
                        prevButton: '.swiper-button-prev'
                    });
                }, 0.000001);
            }
        }
    })
})();

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

    .controller('ProductsListCtrl', function ($http, $scope, $rootScope, $state) {
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

    .controller('BasketCtrl', function ($scope) {
        var keyboard = {
            keys: [
                {
                    class: 'symbol',
                    value: "`",
                    shift: "~",
                    shiftChange: false
                },
                {
                    class: 'symbol',
                    value: "1",
                    shift: "!",
                    shiftChange: false
                },
                {
                    class: 'symbol',
                    value: "2",
                    shift: "@",
                    shiftChange: false
                },
                {
                    class: 'symbol',
                    value: "3",
                    shift: "#",
                    shiftChange: false
                },
                {
                    class: 'symbol',
                    value: "4",
                    shift: "$",
                    shiftChange: false
                },
                {
                    class: 'symbol',
                    value: "5",
                    shift: "%",
                    shiftChange: false
                },
                {
                    class: 'symbol',
                    value: "6",
                    shift: "^",
                    shiftChange: false
                },
                {
                    class: 'symbol',
                    value: "7",
                    shift: "&",
                    shiftChange: false
                },
                {
                    class: 'symbol',
                    value: "8",
                    shift: "*",
                    shiftChange: false
                },
                {
                    class: 'symbol',
                    value: "9",
                    shift: "(",
                    shiftChange: false
                },
                {
                    class: 'symbol',
                    value: "0",
                    shift: ")",
                    shiftChange: false
                },
                {
                    class: 'symbol',
                    value: "-",
                    shift: "_",
                    shiftChange: false
                },
                {
                    class: 'symbol',
                    value: "=",
                    shift: "+",
                    shiftChange: false
                },
                {
                    class: 'delete lastitem',
                    value: "delete",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'tab',
                    value: "tab",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "q",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "w",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "e",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "r",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "t",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "y",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "u",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "i",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "o",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "p",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'symbol',
                    value: "{",
                    shift: "[",
                    shiftChange: false
                },
                {
                    class: 'symbol',
                    value: "}",
                    shift: "]",
                    shiftChange: false
                },
                {
                    class: 'lastitem',
                    value: "'\'",
                    shift: "|",
                    shiftChange: false
                },
                {
                    class: 'capslock',
                    value: "caps lock",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "a",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "s",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "d",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "f",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "g",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "h",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "j",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "k",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "l",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'symbol',
                    value: ";",
                    shift: ";",
                    shiftChange: false
                },
                {
                    class: 'symbol',
                    value: "'",
                    shift: '&quot;',
                    shiftChange: false
                },
                {
                    class: 'return lastitem',
                    value: "return",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'left-shift',
                    value: "shift",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "z",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "x",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "c",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "v",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "b",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "n",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'letter',
                    value: "m",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'symbol',
                    value: ",",
                    shift: "<",
                    shiftChange: false
                },
                {
                    class: 'symbol',
                    value: ".",
                    shift: ">",
                    shiftChange: false
                },
                {
                    class: 'symbol',
                    value: "/",
                    shift: "?",
                    shiftChange: false
                },
                {
                    class: 'right-shift lastitem',
                    value: "shift",
                    shift: null,
                    shiftChange: false
                },
                {
                    class: 'space lastitem',
                    value: "$nbsp;",
                    shift: null,
                    shiftChange: false
                }
            ]
        }

        $scope.keys = keyboard.keys
        $scope.keyClick = function (key) {

            // keyboard button rules
            if (key.class == 'symbol' && key.shiftChange == false) {
                document.getElementById('focus').value += key.value
            }
            else if (key.class == 'symbol' && key.shiftChange == true) {
                document.getElementById('focus').value += key.shift
            }
            else if (key.class == 'letter') {
                document.getElementById('focus').value += key.value
            }
            else if (key.class == 'letter uppercase') {
                document.getElementById('focus').value += key.value.toUpperCase();
            }
            else if (key.class == 'space lastitem') {
                document.getElementById('focus').value += ' ';
            }
            else if (key.class == 'delete lastitem') {
                var stringArr = document.getElementById('focus').value.split('');
                stringArr.pop();

                document.getElementById('focus').value = stringArr.join('')
            }
            else if (key.class == 'left-shift' || key.class == 'right-shift lastitem') {
                angular.forEach($scope.keys, function (item, i, arr) {
                    item.shiftChange = item.shift != null && item.shiftChange == false ? true : false;
                })


            }
            else if (key.class == 'capslock') {
                angular.forEach($scope.keys, function (item, i, arr) {
                    if (item.class == 'letter')
                        item.class = 'letter uppercase';
                    else if (item.class == 'letter uppercase')
                        item.class = 'letter';
                })
            }
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
