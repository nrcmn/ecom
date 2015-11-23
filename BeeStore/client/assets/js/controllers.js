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
        $scope.subCategories = []; // clear subCategories
        $rootScope.intagChoicesList = undefined; // clear filters
        window.page = 1; // set page number in products list
        window.sortItem = undefined;
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
        $scope.leftFilter = false; //hide filter on left side
        window.scrollLoad = true; // progress bar status
        __LoadProducts(window.subCategory, 5, 2, '-weight', null); // load other for empty array except
        console.log($rootScope.intagChoicesList, 1);
        if (!Array.isArray($rootScope.intagChoicesList)) {
            $rootScope.intagChoicesList = [];
        }

        console.log($rootScope.intagChoicesList, 2)

        // -- LAZY loading block
        window.onscroll = function () {

            if ($state.current.name != "products") {
                return false
            }

            if (Number(window.pageYOffset.toFixed()) > 250) {
                $scope.leftFilter = true;
                $scope.$apply();
            }
            else {
                $scope.leftFilter = false;
                $scope.$apply();
            }

            if (window.scrollLoad && (Number(window.pageYOffset.toFixed()) - (document.body.scrollHeight - window.innerHeight) >= -2)) {
                __LoadProducts(window.subCategory, 15, window.page += 1, '-weight', $rootScope.intagChoicesList);
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

        try {
            $scope.selected = $scope.items[window.sortItem.index]
        } catch (e) {
            window.sortItem = $scope.selected = $scope.items[0];
            window.sortItem.index = 0;
        }

        $scope.sortBy = function () {
            $rootScope.productsList = undefined;

            window.page = 1;
            window.sortItem = $scope.selected;
            $scope.items.forEach(function (item, i, arr) {
                if (item.value == $scope.selected.value) {
                    window.sortItem.index = i;
                }
            })

            __LoadProducts(window.subCategory, 15, 1, $scope.selected.value, $rootScope.intagChoicesList);
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

                $scope.modalIntags = window.product.intags_categories[0]; // set opened intag
            })
        }
        else {
            $scope.product = window.product;
            $scope.modalIntags = window.product.intags_categories[0]; // set opened intag
        }

        // open field in intags
        $scope.openField = function (f) {
            $scope.modalIntags = f;
        }

        // active style for intags
        $scope.setActiveStyle = function (condition) {
            if (condition) {
                return {background: '#fff'}
            }
            else {
                return {background: '#ccc'}
            }
        }

        $scope.addToBasket = function () {
            window.product.quantity = 1;
            $rootScope.basket.push(window.product);
        }
    })

    .controller('FilterCtrl', function ($scope, $rootScope, __LoadProducts) {
        // $rootScope.intagChoicesList = []; // array for intag_choices ids
        $rootScope.filterInd = 0;
        $rootScope.checkFilter = function (index) {
            $rootScope.filterInd = index;
        }

        $rootScope.check = function ($event, val) {
            var checkbox = $event.target;
            if (checkbox.checked) {
                $rootScope.intagChoicesList.push(checkbox.value);
                val.check = true;
            }
            else if (!checkbox.checked) {
                $rootScope.intagChoicesList.splice($rootScope.intagChoicesList.indexOf(checkbox.value), 1);
                val.check = false;
            }
        }

        $rootScope.setFilter = function () {
            __LoadProducts(window.subCategory, 15, 1, window.sortItem.value, $rootScope.intagChoicesList);
            $rootScope.productsList = undefined;
        }

        $rootScope.clearFilter = function () {
            $rootScope.intagChoicesList.length = 0; // clear global intag choices array

            // delete all checked filters
            window.filter[window.subCategory.id].forEach(function (item, i, arr) {
                item.choices.forEach(function (_item, _i, _arr) {
                    delete _item['check'];
                })
            })

            $rootScope.productsList = undefined;
            $rootScope.progress = true; // show progress bar
            __LoadProducts(window.subCategory, 15, 1, window.sortItem.value, $rootScope.intagChoicesList);
        }

        $rootScope.cancelFilter = function () {

            // if ($rootScope.intagChoicesList.length != 0) {
                // $rootScope.intagChoicesList.length = 0;
                // $rootScope.productsList = undefined;
                // __LoadProducts(window.subCategory, 15, 1, '-weight', $rootScope.intagChoicesList);
            // }
        }

        $rootScope.setActiveStyle = function (condition) {
            if (condition) {
                return {background: '#fff'}
            }
            else {
                return {background: '#ccc'}
            }
        }
    })
