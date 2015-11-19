angular.module('controllers', [])
    .controller('MainCategoryCtrl', function ($scope, $state, __LoadCategories, mainCategories) {
        var unacceptableCategories = [6, 5, 4, 101, 15, 202, 23, 24, 164, 78, 80, 79, 166, 162, 165, 71, 70, 77, 122, 121, 182, 93, 86, 85, 90, 87, 163]; // unacceptable categories ids

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

                // $scope.categories = window.categories;

            });
        }
        // if have categories data initialize to variable
        // else {
        //     $scope.categories = window.categories;
        // }

        $scope.categories = mainCategories;

        $scope.openCategory = function (arg) {
            window.category = arg;
            $state.go('categories');
        }
    })

    .controller('SubCategoryCtrl', function ($scope, $rootScope, $state, __LoadProducts, __LoadFilters) {
        $scope.subCategories = [];
        window.page = 1; // set page number in products list
        window.categories.sub.forEach(function (item, i, arr) { // all subcategories to global scope
            if (item.parent == window.category.id) {
                $scope.subCategories.push(item);
            }

            ($scope.subCategories.length <= 3) ? $scope.showLeader = true : $scope.showLeader = false; // show leader rule
        })

        $scope.openSubCategory = function (subCategory) {
            window.subCategory = subCategory; // set subCategory to global variable
            __LoadProducts(window.subCategory, 10, 1, '-weight', null); // load products


            /* Cache filters */
            if (!window.filter[window.subCategory.id]) {
                __LoadFilters(window.subCategory.id);
            }
            else {
                $rootScope.cancelFilter(); // delete all later checked params
                $rootScope.productsListFilter = window.filter[window.subCategory.id];
            }

            $state.go('products');
        }
    })

    .controller('ProductListCtrl', function ($scope, $rootScope, $state, __LoadProducts) {

        // productsList cleaner
        if (!window.product || window.product.collectionId != window.subCategory.id) {
            $rootScope.productsList = undefined;
        }
        else {
            window.product = undefined;
        }

        $rootScope.progress = true; // show progress bar
        window.scrollLoad = true;
        __LoadProducts(window.subCategory, 5, 2, '-weight', null); // load other for empty array except
        window.intagChoices = []; // delete filter history

        // -- LAZY loading block
        window.onscroll = function () {
            if (window.scrollLoad && (Number(window.pageYOffset.toFixed()) - (document.body.scrollHeight - window.innerHeight) >= -2)) {
                __LoadProducts(window.subCategory, 15, window.page += 1, '-weight', window.intagChoices);
                $rootScope.progress = true;
            }
        }

        $scope.openProduct = function (product) {
            product.collectionId = window.subCategory.id; // set collectionId to product data
            product.intags_categories.forEach(function (item, i, arr) { // general intags for detail page
                if (item.id == 61) {
                    product.general_intags = item;
                }
            })

            window.product = product; // set this product to global variable
            $state.go('detail', {id: product.id});
        }

        // -- SORT block
        $scope.items = [
            {
                value: '-weight',
                label: 'популярности',
            },
            {
                value: 'price',
                label: 'цене: по возрастанию',
            },
            {
                value: '-price',
                label: 'цене: по убыванию',
            }
        ];

        $scope.selected = $scope.items[0];
        $scope.sortBy = function () {
            window.page = 1;
            window.sortItem = $scope.selected.value;
            $rootScope.productsList = undefined;
            __LoadProducts(window.subCategory, 15, 1, $scope.selected.value, window.intagChoices);
        }
    })

    .controller('ProductDetailCtrl', function ($scope, $rootScope, $stateParams, __LoadOneProduct) {
        window.scroll(0,0); // scroll to top

        if (!window.product) {
            __LoadOneProduct($stateParams.id).then(function (data) {
                data.intags_categories.forEach(function (item, i, arr) { // general intags for detail page
                    if (item.id == 61) {
                        data.general_intags = item;
                    }
                })

                $scope.product = data;
                window.product = data;
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
        window.intagChoices = []; // array for intag_choices ids
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
            __LoadProducts(window.subCategory, 15, 1, window.sortItem, window.intagChoices);
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
