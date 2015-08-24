(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',

    // foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations',

    // scripts
    'controllers',
    'masonry'
  ])
    .config(['$urlRouterProvider', '$locationProvider', function ($urlProvider, $locationProvider) {
        $urlProvider.otherwise('/categories');

        $locationProvider.html5Mode({
          enabled:false,
          requireBase: false
        });

        $locationProvider.hashPrefix('!');
    }])

    .run(function ($rootScope) {
        FastClick.attach(document.body);

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
