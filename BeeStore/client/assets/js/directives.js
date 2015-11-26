angular.module('directives', [])
    .directive("leaders", function ($timeout) {
        return {
            templateUrl: 'templates/leaders.html',
            replace: true,
            scope: {},
            controller: function ($scope, $http, $q, $state) {
                function loadLeaders () {
                    var deferred = $q.defer();
                    var idsForLeaders = [76, 10];

                    if (Array.isArray(window.leaders)) { // cache leaders
                        deferred.resolve(window.leaders);
                        return deferred.promise;
                    }
                    else {
                        window.leaders = [];
                    }

                    idsForLeaders.forEach(function (item, i, arr) {
                        load(item, i);
                    })

                    function load (id, i) {
                        $http({
                            method: 'GET',
                            url: 'http://beeline-ecommerce.herokuapp.com/api/public/v1/products/',
                            params: {
                                api_key: window.api_key,
                                market_region: window.market_region,
                                collection: id,
                                amount: 8,
                                sort_by: '-weight'
                            }
                        })
                        .success(function (data) {
                            data.forEach(function (item, i, arr) {
                                window.leaders.push(item);
                            })

                            if (i == idsForLeaders.length - 1) {
                                deferred.resolve(window.leaders);
                            }
                        })
                    }

                    return deferred.promise;
                }

                loadLeaders().then(function (leaders) {
                    $scope.leaders = leaders;
                })

                $scope.openLeader = function (data) {
                    data.intags_categories.forEach(function (item, i, arr) { // general intags for detail page
                        if (item.id == 61) {
                            data.general_intags = item;
                        }
                    })

                    window.product = data;
                    $state.go('leaders', {id: data.id});
                }
            },
            link: function(scope, element, attributes) {
                $timeout(function () {
                    var swiper = new Swiper('.swiper-container', {
                        pagination: '.swiper-pagination',
                        paginationClickable: '.swiper-pagination',
                        nextButton: '.swiper-button-next',
                        prevButton: '.swiper-button-prev',
                        freeMode: true,
                        slidesPerView: 3.5,
                    });
                }, 1500);
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
                    // var swiper = new Swiper('.swiper-container', {
                    //     pagination: '.swiper-pagination',
                    //     paginationClickable: '.swiper-pagination',
                    //     nextButton: '.swiper-button-next',
                    //     prevButton: '.swiper-button-prev'
                    // });
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
