angular.module('controllers', [])
    .controller('MainCtrl', function ($scope, $state, __LoadCategories) {
        var unacceptableCategories = [6, 5, 4, 101, 15, 202, 23, 24, 164, 78, 80, 79, 166, 162, 165, 71, 70, 77, 122, 121, 182, 93, 86, 85, 90, 87, ]; // unacceptable categories ids

        // if haven't categories data, load them
        if(!window.categories){
            __LoadCategories(unacceptableCategories).then(function (data) {
                window.categories = {
                    main: [],
                    sub: []
                }

                data.forEach(function (item, i, arr) {
                    if (unacceptableCategories.indexOf(item.id) > -1) {
                        return false
                    }
                    else if (!item.parent) {
                        window.categories.main.push(item);
                    }
                    else if (item.parent) {
                        window.categories.sub.push(item);
                    }
                })

                $scope.categories = window.categories;
            });
        }
        // if have categories data initialize to variable
        else {
            $scope.categories = window.categories;
        }

        $scope.openCategory = function (arg) {
            window.subCategoryId = arg.id;
            $state.go('categories');
        }
    })

    .controller('SubCategoryCtrl', function ($scope, $rootScope, $state, __LoadProducts, __LoadFilters) {
        $scope.subCategories = [];
        window.categories.sub.forEach(function (item, i, arr) {
            if (item.parent == window.subCategoryId) {
                $scope.subCategories.push(item);
            }

            ($scope.subCategories.length <= 3) ? $scope.showLeader = true : $scope.showLeader = false;
        })

        $scope.openSubCategory = function (subCategory) {
            window.subCategory = subCategory;
            __LoadProducts(window.subCategory, 15, 1, 'weight');

            if (!window.filter[window.subCategory.id]) {
                __LoadFilters(window.subCategory.id);
            }
            else {
                $rootScope.productsListFilter = window.filter[window.subCategory.id];
            }

            $state.go('products');
        }
    })

    .controller('ProductListCtrl', function ($scope, $rootScope, $state, __LoadProducts) {
        $rootScope.productsList = undefined;
        window.onscroll = function scrollEvent () {
            if (window.pageYOffset == (document.body.scrollHeight - window.innerHeight)) {
                __LoadProducts(window.subCategory, 15, window.page += 1, 'weight')
                $rootScope.progress = true;
            }
        }

        $scope.openProduct = function (product) {
            window.product = product;
            $state.go('detail', {id: product.id});
        }
    })

    .controller('ProductDetailCtrl', function ($scope, $rootScope, $stateParams, __LoadOneProduct) {
        if (!window.product) {
            __LoadOneProduct($stateParams.id).then(function (data) {
                $scope.product = data;
            })
        }
        else {
            $scope.product = window.product;
        }

        $scope.openField = function (f) {
            $scope.modalIntags = f.intags;
        }
    })

    .controller('FilterCtrl', function ($scope, $rootScope) {
        $rootScope.checkFilter = function (index) {
            $rootScope.filterInd = index;
            // $rootScope.filterValues = filter;
        }
    })
