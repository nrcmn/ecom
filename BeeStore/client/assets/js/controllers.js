angular.module('controllers', [])
    .controller('MainCtrl', function ($scope, $state, __LoadCategories) {
        var unacceptableCategories = [6, 5, 4, 101, 15, 202, 23, 24, 164, 78, 80, 79, 166, 162, 165, 71, 70, 77, 122, 121, 182, 93, 86, 85, 90, 87, 224]; // unacceptable categories ids

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
            __LoadProducts(window.subCategory, 15, 1, '-weight', window.intagChoices);

            if (!window.filter[window.subCategory.id]) {
                __LoadFilters(window.subCategory.id);
                $rootScope.filterShow = false;
            }
            else {
                $rootScope.cancelFilter(); // delete all later checked params
                $rootScope.productsListFilter = window.filter[window.subCategory.id];
                $rootScope.filterShow = true;
            }

            $state.go('products');
        }
    })

    .controller('ProductListCtrl', function ($scope, $rootScope, $state, __LoadProducts) {
        if (!window.product || window.product.main_collection.id != window.subCategory.id) {
            $rootScope.productsList = undefined;
        }
        else {
            window.product = undefined;
        }
        window.intagChoices = []; // delete filter history

        window.onscroll = function scrollEvent () {
            console.log(window.pageYOffset == (document.body.scrollHeight - window.innerHeight));

            // lazy loading
            if (window.pageYOffset == (document.body.scrollHeight - window.innerHeight)) {
                __LoadProducts(window.subCategory, 15, window.page += 1, '-weight', window.intagChoices)
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

    .controller('FilterCtrl', function ($scope, $rootScope, __LoadProducts) {
        window.intagChoices = [];
        $rootScope.checkFilter = function (index) {
            $rootScope.filterInd = index;
        }

        $rootScope.check = function ($event, val) {
            var checkbox = $event.target;
            if (checkbox.checked) {
                intagChoices.push(checkbox.value);
                val.check = true;
            }
            else if (!checkbox.checked) {
                intagChoices.splice(intagChoices.indexOf(checkbox.value), 1);
                val.check = false;
            }
        }

        $rootScope.setFilter = function () {
            __LoadProducts(window.subCategory, 15, 1, '-weight', window.intagChoices);
            $rootScope.productsList = undefined;
        }

        $rootScope.clearFilter = function () {
            window.intagChoices.length = 0; // clear global intag choices array

            // delete all checked filters
            window.filter[window.subCategory.id].forEach(function (item, i, arr) {
                item.choices.forEach(function (_item, _i, _arr) {
                    delete _item['check'];
                })
            })
        }

        $rootScope.cancelFilter = function () {

            // if (window.intagChoices.length != 0) {
                // window.intagChoices.length = 0;
                // $rootScope.productsList = undefined;
                // __LoadProducts(window.subCategory, 15, 1, '-weight', window.intagChoices);
            // }
        }
    })
