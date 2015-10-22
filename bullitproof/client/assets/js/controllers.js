angular.module('controllers', [])

    .controller('CategoryCtrl', function ($scope, $rootScope, $state, __CATEGORIES) {
        $scope.openCategory = function (cat) {
            window.categoryId = cat.id;
            $rootScope.categoryMainContent = [];
            __CATEGORIES.forEach(function (item, i, arr) {
                if (item.parent == window.categoryId) {
                    $rootScope.categoryMainContent.push(item);
                }
            })

            $state.go('category');
        }

        $rootScope.headerShow = false;
    })

    .controller('CategoryMainCtrl', function ($scope, $rootScope, $state, __CATEGORIES) {
        $rootScope.categoryMainContent = [];
        __CATEGORIES.forEach(function (item, i, arr) {
            if (item.parent == window.categoryId) {
                $scope.categoryMainContent.push(item);
            }
        })

        $rootScope.headerShow = true;
        $scope.openProductList = function (content) {
            $state.go('products');
        }
    })

    .controller('ProductsCtrl', function ($scope, $state, __ACCESSORIES) {
        $scope.products = __ACCESSORIES;
        $scope.openDetail = function (product) {
            window.product = product;
            $state.go('detail');
        }
    })

    .controller('DetailCtrl', function ($scope) {
        $scope.detail = window.product;
        console.log($scope.detail);
    })
