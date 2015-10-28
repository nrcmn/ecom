angular.module('controllers', [])

    .controller('CategoryCtrl', function ($scope, $rootScope, $state, loadProducts) {
        $scope.openCategoryDetail = function (cat) {
            window.categoryId = cat.id;
            $state.go('category');
        }

        $scope.openDetail = function (product) {
            window.product = product;
            $scope.detailProduct = window.product;

            $state.go('detail');
        }

        loadProducts(10, 1, 5, null, 'weight');
        loadProducts(10, 1, 5, null, '-weight');
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
            loadProducts(content.id, 1, 15, content.name, null)
        }
    })

    .controller('ProductsCtrl', function ($scope, $state) {
        $scope.openDetail = function (product) {
            window.product = product;
            $scope.detailProduct = window.product;

            $state.go('detail');
        }
    })

    .controller('ModalCtrl', function ($scope) {
        $scope.showVariants = false;

        $scope.openFilter = function (arg) {
            console.log('ok');
            $scope.showVariants = true;
            $scope.variant = arg;
        }
    })

    .controller('DetailCtrl', function ($scope, loadProducts) {
        $scope.detailProduct = window.product;

        $scope.openDetail = function (product) {
            window.product = product;
            $scope.detailProduct = window.product;
        }

        loadProducts(10, 1, 5, null, 'weight');
        loadProducts(10, 1, 5, null, '-weight');
    })
