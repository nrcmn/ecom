angular.module('controllers', [])
    .controller('MainCtrl', function ($scope, $state, __LoadCategories) {
        // var categories = [9, 8, 21, 2, 12, 11, 10, 13, 14, 16, 17, 19, 18, 20, 3, 22, 25, 26, 27, 28, 29, 30 223, 76, 81, ]; // approved categories ids

        var unacceptableCategories = [6, 5, 4, 101, 15, 202, 23, 24, 164, 78, 80, 79, 166, 162, 165, 71, 70, 77, 122, 121, 182, 93, 86, 85, 90, 87, ]; // unacceptable categories ids

        __LoadCategories(unacceptableCategories);

        $scope.openCategory = function (arg) {
            window.subCategoryId = arg.id;
            $state.go('categories');
        }
    })

    .controller('SubCategoryCtrl', function ($scope, $rootScope, $state, __LoadProducts, __LoadFilters) {
        $scope.subCategories = [];
        $rootScope.categories.sub.forEach(function (item, i, arr) {
            if (item.parent == window.subCategoryId) {
                $scope.subCategories.push(item);
            }

            ($scope.subCategories.length <= 3) ? $scope.showLeader = true : $scope.showLeader = false;
        })

        $scope.openSubCategory = function (subCategory) {
            window.subCategory = subCategory;
            __LoadProducts(window.subCategory, 15, 1, 'weight');
            __LoadFilters(window.subCategory);

            $state.go('products');
        }
    })

    .controller('ProductListCtrl', function ($scope, $rootScope, __LoadProducts) {
        $rootScope.productsList = undefined;

        // functional programming :)
        window.onscroll = function scrollEvent () {
            console.log(window.pageYOffset, document.body.scrollHeight);
            if (window.pageYOffset == (document.body.scrollHeight - window.innerHeight)) {
                __LoadProducts(window.subCategory, 15, 2, 'weight')
                $rootScope.progress = true;
            }
        }
    })

    .controller('FilterCtrl', function ($scope, $rootScope) {
        $rootScope.checkFilter = function (index) {
            console.log(index);
            $rootScope.filterInd = index;
            // $rootScope.filterValues = filter;
        }
    })
