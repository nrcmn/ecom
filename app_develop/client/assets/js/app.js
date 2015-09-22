angular.module('application', ['ui.router','ngAnimate', 'foundation', 'foundation.dynamicRouting', 'foundation.dynamicRouting.animations', 'controllers', 'masonry', 'ngWebSocket', 'services'])

    .config(['$urlRouterProvider', '$locationProvider', function ($urlProvider, $locationProvider) {
        $urlProvider.otherwise('/categories.9');

        $locationProvider.html5Mode({
          enabled:false,
          requireBase: false
        });

        $locationProvider.hashPrefix('!');
    }])

    .run(function ($rootScope, $websocket, FoundationApi, $state) {
        FastClick.attach(document.body);

        window.version =  "0.0.1";
        window.id = "I001";
        window.api_key = '3269460fc771fe1d97f0a3bdc13be279f3d07d96',
                market_region = 98082;

        // window.version = prompt('Version of app', '0.0.1');
        // window.id = prompt('Id of shop', 'I001');

        $rootScope.needToUpdate = false;

        $rootScope.basket = [];
        $rootScope.productsHistory = [];

        $rootScope.detailOpen = function (product) {
            $rootScope.product = product;
        }

        $rootScope.statesNavigation = {
            lastState: function () {
                console.log('back');
                history.back();
            },
            forwardState: function () {
                console.log('forward');
                $state.go(window.forwState)
            }
        }

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            var back,
                forward;

            // for first app run
            if (fromState.name == '') {
                back = false;
                forward = false
            }

            // products navigation
            if (fromState.name == "products" && toState.name == "detail") {
                back = true;
                forward: false;
            }


            $rootScope.navBack = back;
            $rootScope.navForw = forward;
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

    .directive('keyboard', function () {
        return {
            controller: function ($scope, $rootScope) {
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
                            value: "",
                            shift: null,
                            shiftChange: false
                        }
                    ]
                }

                $scope.keys = keyboard.keys
                $scope.keyClick = function (key) {
                    var elm = document.getElementById('focus');
                    if (!$rootScope.form[elm.name])
                        $rootScope.form[elm.name] = '';

                    // keyboard button rules
                    if (key.class == 'symbol' && key.shiftChange == false) {
                        elm.value += key.value;
                        $rootScope.form[elm.name] += key.value;
                    }
                    else if (key.class == 'symbol' && key.shiftChange == true) {
                        elm.value += key.shift;
                        $rootScope.form[elm.name] += key.shift;
                    }
                    else if (key.class == 'letter') {
                        elm.value += key.value;
                        $rootScope.form[elm.name] += key.value;
                    }
                    else if (key.class == 'letter uppercase') {
                        elm.value += key.value.toUpperCase();
                        $rootScope.form[elm.name] += key.value.toUpperCase();
                    }
                    else if (key.class == 'space lastitem') {
                        elm.value += ' ';
                        $rootScope.form[elm.name] += ' ';
                    }
                    else if (key.class == 'delete lastitem') {
                        var stringArr = elm.value.split('');
                        stringArr.pop();

                        elm.value = stringArr.join('')
                        $rootScope.form[elm.name] = elm.value;
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
            }
        }
    })

    .directive('imageonload', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, rootScope) {
                element.bind('load', function() {
                    window.masonry.layout()
                });
            }
        };
    });
