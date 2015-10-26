angular.module('controllers', [])

    .controller('CategoryCtrl', function ($scope, $rootScope, $state) {
        $scope.openCategoryDetail = function (cat) {
            window.categoryId = cat.id;
            $state.go('category');
        }
    })

    .controller('CategoryMainCtrl', function ($scope, $rootScope, $state, loadProducts) {
        $scope.sections = [];
        window.categories.forEach(function (item, i, arr) {
            if (item.parent == window.categoryId) {
                $scope.sections.push(item);
            }
        })

        $scope.openProductList = function (content) {
            console.log(content);
            loadProducts(content.id, 1, content.name)
        }
    })

    .controller('ProductsCtrl', function ($scope, $state) {
        $scope.openDetail = function (product) {
            window.product = product;
            $state.go('detail');
        }
    })

    .controller('DetailCtrl', function ($scope) {
        $scope.detailProduct = window.product;
        console.log($scope.detailProduct);
    })
