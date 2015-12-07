angular.module('directives', [])
    .directive("leaders", function ($timeout, $q, $http) {
        return {
            templateUrl: 'templates/leaders.html',
            replace: true,
            scope: {},
            controller: function ($scope, $http, $q, $state) {
                $scope.leaders = undefined;
                $scope.openLeader = function (data) {
                    console.log(data);
                    window.product = data;
                    $state.go('leaders', {id: data.id});
                }
            },
            link: function(scope, element, attributes) {
                (function load() {
                    var deferred = $q.defer();
                    var categories = [2, 21, 8, 9];

                    $http({
                        method: 'GET',
                        url: 'https://public.backend-test.vimpelcom.ru/api/public/v1/recommendation/popular/',
                        params: {
                            api_key: window.api_key,
                            market_region: window.market_region,
                            collection: window.category.id || categories[Math.floor(Math.random() * categories.length)]
                        }
                    })
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function () {
                        console.error('load leaders error');
                    })

                    return deferred.promise;
                })().then(function (result) {
                    scope.leaders = window.leaders = result;
                    $timeout(function () {
                        var swiper = new Swiper('.swiper-container', {
                            pagination: '.swiper-pagination',
                            paginationClickable: '.swiper-pagination',
                            nextButton: '.swiper-button-next',
                            prevButton: '.swiper-button-prev',
                            freeMode: true,
                            slidesPerView: 3.5,
                        });
                    }, 0.0001);
                })
            }
        }
    })

    .directive("recommendations", function ($q, $http, $timeout) {
        return {
            templateUrl: 'templates/recommendations.html',
            replace: true,
            scope: {list: '@'},
            link: function(scope, element, attributes) {
                (function () {
                    var deferred = $q.defer();
                    var i = 0;
                    window.recommendations = [];

                    function load() {
                        if (arr.length == 0) {
                            return false;
                        }

                        var index = Math.random() * ((arr.length - 1) - 0) + 0;

                        $http({
                            method: 'GET',
                            url: 'https://public.backend-test.vimpelcom.ru/api/public/v1/products/' + arr[index.toFixed()] + '/',
                            params: {
                                api_key: window.api_key,
                                market_region: window.market_region,
                                params: 'article,id,images,name,price,remain,kind'
                            }
                        })
                        .success(function (data) {
                            arr.splice(index, 1);
                            if (data.kind.id != 30) {
                                window.recommendations.push(data);
                                i++;
                            }

                            if (i == 4) {
                                deferred.resolve();
                                return false
                            }

                            load();
                        })
                        .error(function () {
                            console.error('load recommendation error');
                        })
                    }

                    scope.$watch('list', function () {
                        if (scope.list != '') {
                            arr = scope.list.replace(/[\[\]']+/g,'').split(','); // to global variable
                            load();
                        }
                    })

                    return deferred.promise;
                })().then(function () {
                    scope.recommendations = window.recommendations;
                    $timeout(function () {
                        var swiper = new Swiper('.recomendation-swiper', {
                            nextButton: '.swiper-button-next-recomend',
                            prevButton: '.swiper-button-prev-recomend',
                            freeMode: true,
                            slidesPerView: 4,
                        });
                    }, 0.000001);
                })
            }
        }
    })

    .directive("images", function ($timeout) {
        return {
            templateUrl: 'templates/images.html',
            replace: true,
            scope: false,
            link: function () {
                $timeout(function () {
                    //two-way control swiper
                    var swiper1 = new Swiper('.gallery-top', {
                        nextButton: '.swiper-button-next',
                        prevButton: '.swiper-button-prev',
                        spaceBetween: 10,
                    });
                    var swiper2 = new Swiper('.gallery-thumbs', {
                        spaceBetween: 10,
                        centeredSlides: true,
                        slidesPerView: 'auto',
                        touchRatio: 0.2,
                        slideToClickedSlide: true
                    });

                    swiper1.params.control = swiper2;
                    swiper2.params.control = swiper1;
                }, 1000);
            }
        }
    })

    .directive('key', function () {
        return {
            restrict: 'C',
            controller: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    var phoneLength = $scope.form.phone.length;
                    switch (phoneLength) {
                        case 0:
                            $scope.form.phone += '(';
                            break;
                        case 4:
                            $scope.form.phone += ') ';
                            break;
                        case 9:
                            $scope.form.phone += ' ';
                            break;
                        case 12:
                            $scope.form.phone += ' ';
                            break;
                        case 15:
                            return false
                    }

                    $scope.form.phone += $element[0].innerText;
                    $scope.$apply();
                })
            }
        }
    })

    .directive('clear', function () {
        return {
            restrict: 'C',
            controller: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    $scope.form = {};
                    $scope.form.phone = '';
                    $scope.$apply();
                })
            }
        }
    })

    .directive('backspace', function () {
        return {
            restrict: 'C',
            controller: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    var a = $scope.form.phone.split('');
                    a.pop();

                    $scope.form.phone = a.join('');
                    $scope.$apply();
                })
            }
        }
    })

    // basket form
    .directive('field', function () {
        return {
            controller: function ($scope, $element, $attrs) {
                $element.on('focus', function () { // listen focus on input
                    window.selectedInput = $attrs.field; // set global variable with input model name
                })
            }
        }
    })

    /* --- KEYBOARD BLOCK --- */
    .directive('keyboard', function () {
        return {
            templateUrl: 'templates/keyboard.html',
            replace: true,
            controller: function () {
                // document.addEventListener("blur", function( $event ) {
                //     // console.log($event.srcElement);
                //     window.selectedInput = null;
                // }, true);
            }
        }
    })

    // keyboard buttons
    .directive('letter', function () {
        return {
            restrict: 'C',
            controller: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    if ($scope.form[window.selectedInput] == undefined) {
                        $scope.form[window.selectedInput] = ''
                    }

                    $scope.form[window.selectedInput] += $element[0].innerText;
                    $scope.$apply();
                })
            }
        }
    })
    .directive('symbol', function () {
        return {
            restrict: 'C',
            controller: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    if ($scope.form[window.selectedInput] == undefined) {
                        $scope.form[window.selectedInput] = ''
                    }

                    $scope.form[window.selectedInput] += $element[0].innerText;
                    $scope.$apply();
                })
            }
        }
    })
    .directive('delete', function () {
        return {
            restrict: 'C',
            controller: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    if ($scope.form[window.selectedInput] == undefined) {
                        $scope.form[window.selectedInput] = ''
                    }

                    var a = $scope.form[window.selectedInput].split('');
                    a.pop();

                    $scope.form[window.selectedInput] = a.join('');
                    $scope.$apply();
                })
            }
        }
    })
    .directive('capslock', function () {
        return {
            restrict: 'C',
            controller: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    var letters = document.querySelectorAll('.letter');
                    var uppercase = document.querySelectorAll('.uppercase');

                    if (uppercase.length != 0) {
                        for (var i = 0; i < uppercase.length; i++) {
                            var arr = uppercase[i].className.split(' ');
                            arr.splice(arr.indexOf('uppercase'), 1);

                            uppercase[i].className = arr.join('');
                        }

                        return true
                    }

                    for (var i = 0; i < letters.length; i++) {
                        letters[i].className += ' uppercase';
                    }
                })
            }
        }
    })
    .directive('shift', function () {
        return {
            restrict: 'C',
            controller: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    var letters = document.querySelectorAll('.letter');
                    var uppercase = document.querySelectorAll('.uppercase');

                    if (uppercase.length != 0) {
                        for (var i = 0; i < uppercase.length; i++) {
                            var arr = uppercase[i].className.split(' ');
                            arr.splice(arr.indexOf('uppercase'), 1);

                            uppercase[i].className = arr.join('');
                        }

                        return true
                    }

                    for (var i = 0; i < letters.length; i++) {
                        letters[i].className += ' uppercase';
                    }

                    var listen = $scope.$watch('form', function () {
                        var uppercase = document.querySelectorAll('.uppercase');
                        for (var i = 0; i < uppercase.length; i++) {
                            var arr = uppercase[i].className.split(' ');
                            arr.splice(arr.indexOf('uppercase'), 1);

                            uppercase[i].className = arr.join('');
                        }

                        listen();
                    })
                })
            }
        }
    })
    .directive('space', function () {
        return {
            restrict: 'C',
            controller: function ($scope, $element, $attrs) {
                $element.on('click', function () {
                    if ($scope.form[window.selectedInput] == undefined) {
                        $scope.form[window.selectedInput] = ''
                    }

                    $scope.form[window.selectedInput] += ' ';
                    $scope.$apply();
                })
            }
        }
    })
