angular.module('directives', [])
    .directive("leaders", function ($timeout) {
        return {
            templateUrl: 'templates/leaders.html',
            replace: true,
            scope: {},
            controller: function ($scope, $http, $q, $state) {
                function loadLeaders () {
                    var deferred = $q.defer();
                    var idsForLeaders = [9, 8, 10, 3];
                    var leaders = [];

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
                                amount: 5,
                                sort_by: '-weight'
                            }
                        })
                        .success(function (data) {
                            leaders.push(data);

                            if (i == idsForLeaders.length - 1) {
                                deferred.resolve(leaders);
                            }
                        })
                    }

                    return deferred.promise;
                }

                loadLeaders().then(function (leaders) {
                    $scope.leaders = leaders;
                })

                $scope.openLeader = function (item) {
                    window.product = item;
                    $state.go('detail', {id: item.id});
                }
            },
            link: function(scope, element, attributes) {
                $timeout(function () {
                    var swiper = new Swiper('.swiper-container', {
                        pagination: '.swiper-pagination',
                        paginationClickable: '.swiper-pagination',
                        nextButton: '.swiper-button-next',
                        prevButton: '.swiper-button-prev',
                        freeMode: true
                    });
                }, 1000);
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
