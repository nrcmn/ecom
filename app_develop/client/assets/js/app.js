angular.module('application', ['ui.router','ngAnimate', 'foundation', 'foundation.dynamicRouting', 'foundation.dynamicRouting.animations', 'controllers', 'masonry', 'ngWebSocket', 'services'])

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

        window.version =  "0.0.1";
        window.id = "I001";
        window.api_key = '852bff3ff459f9886729b9de223e8a0340ce008b'

        // window.version = prompt('Version of app', '0.0.1');
        // window.id = prompt('Id of shop', 'I001');

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
