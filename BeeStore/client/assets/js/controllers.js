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

        window.category = {}; // for leaders loader
        $scope.categories = mainCategories;

        $scope.openCategory = function (arg) {
            window.category = arg;
            $state.go('categories');
        }
    })

    .controller('SubCategoryCtrl', function ($scope, $rootScope, $state, __LoadProducts, __LoadFilters) {
        $scope.subCategories = []; // clear subCategories
        $rootScope.intagChoicesList = []; // clear filters
        $rootScope.productsList = undefined; // clear products list
        window.scroll(0,0); // scroll to top
        window.page = 1; // set page number in products list
        window.sortItem = undefined; // set sortItem
        window.categories.sub.forEach(function (item, i, arr) { // all subcategories to global scope
            if (item.parent == window.category.id) {
                $scope.subCategories.push(item);
            }

            ($scope.subCategories.length <= 3) ? $scope.showLeader = true : $scope.showLeader = false; // show leader rule
        })

        $scope.openSubCategory = function (subCategory) {
            window.subCategory = subCategory; // set subCategory to global variable
            $rootScope.progress = true; // show progress bar
            __LoadProducts(window.subCategory, 15, 1, '-weight', null); // load products


            /* Cache filters */
            if (!window.filter[window.subCategory.id]) {
                __LoadFilters(window.subCategory.id);
            }
            else {
                // delete all checked filters
                window.filter[window.subCategory.id].forEach(function (item, i, arr) {
                    item.choices.forEach(function (_item, _i, _arr) {
                        delete _item['check'];
                    })
                })

                $rootScope.productsListFilter = window.filter[window.subCategory.id];
            }

            $state.go('products');
        }
    })

    .controller('ProductListCtrl', function ($scope, $rootScope, $state, $document, __LoadProducts) {

        $scope.leftFilter = false; //hide filter on left side
        window.scrollLoad = true; // progress bar status

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

            if (window.scrollLoad && (Number(window.pageYOffset.toFixed()) - (document.body.scrollHeight - window.innerHeight) >= -1500)) {
                if (lazyLoadNow) {return false} // if loading process running later

                __LoadProducts(window.subCategory, 15, window.page += 1, '-weight', $rootScope.intagChoicesList);
                $rootScope.progress = true;
                window.lazyLoadNow = true; // start lazy loading process
            }
        }

        $scope.scrollToTop = function () {
            $document.scrollTop(0, 1200).then(function() {});
        }

        $scope.openProduct = function (data) {
            data.collectionId = window.subCategory.id; // set collectionId to product data
            // product.intags_categories.forEach(function (item, i, arr) { // general intags for detail page
            //     if (item.id == 61) {
            //         product.general_intags = item;
            //     }
            // })

            window.product = data; // set this product to global variable
            $state.go('detail', {id: data.id});
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

    .controller('ProductDetailCtrl', function ($scope, $rootScope, $stateParams, $document, $state, FoundationApi, __LoadOneProduct) {
        window.scroll(0,0); // scroll to top
        $scope.product = window.product;

        __LoadOneProduct($stateParams.id).then(function (data) {
            data.intags_categories.forEach(function (item, i, arr) { // general intags for detail page
                if (item.id == 61) {
                    data.general_intags = item;
                }
            })

            try {
                window.product.__proto__ = data; // load detail after product list page
            } catch (e) {
                window.product = data; // load detail without products list page
            }

            $scope.product = window.product;
            $scope.modalIntags = window.product.intags_categories[0]; // set opened intag
        })

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
            $rootScope.basketBottomShow = false;

            if (!window.product.quantity) {
                window.product.quantity = 1;
            }

            for (var i = 0; i < $rootScope.basket.length; i++) {
                if ($rootScope.basket[i].id == window.product.id) {
                    if ($rootScope.basket[i].quantity == 5) {
                        FoundationApi.publish('orderNotify', { title: 'В корзину', content: 'Количество одинаковых позиций не может быть больше 5', color: 'alert', autoclose: '5000'});
                        return false
                    }
                    else {
                        FoundationApi.publish('orderNotify', { title: 'В корзину', content: 'Товар добавлен в корзину', color: 'success', autoclose: '5000'});
                        return $rootScope.basket[i].quantity += 1, $rootScope.basketProductsCount += 1, $state.go('basket.products');
                    }
                }
            }

            $rootScope.basket.push(window.product);
            $rootScope.basketProductsCount += 1;
            $state.go('basket.products');

            // FoundationApi.publish('orderNotify', { title: 'В корзину', content: 'Товар добавлен в корзину', color: 'success', autoclose: '5000'});
        }
    })

    .controller('FilterCtrl', function ($scope, $rootScope, __LoadProducts) {
        // $rootScope.intagChoicesList = []; // array for intag_choices ids
        $rootScope.filterInd = 1;
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

        $rootScope.setActiveStyle = function (condition) {
            if (condition) {
                return {background: '#fff'}
            }
            else {
                return {background: '#ccc'}
            }
        }
    })

    .controller('BasketProductListCtrl', function ($scope, $rootScope, $state) {
        // clear crumbs
        $rootScope.crumbs.length = 0;

        // push mock main state
        $rootScope.crumbs.push(
            {
                animation: {
                    enter: 'fadeIn'
                },
                controller: function ($rootScope) {$rootScope.shadowShow = false;},
                getTitle: function () {return 'На главную'},
                id: 1,
                show: true,
                title: 'На главную',
                name: 'main'
            }
        )

        $scope.quantity = function (bool, item) {
            if (item.quantity == 5 && bool) {
                return false
            }
            else if (item.quantity == 1 && !bool) {
                return false
            }

            (bool) ? (item.quantity += 1, $rootScope.basketProductsCount += 1) : (item.quantity -= 1, $rootScope.basketProductsCount -= 1);
        }

        $scope.deleteItem = function (product, $index) {
            $rootScope.basketProductsCount -= product.quantity;
            $rootScope.basket.splice($index, 1);

            if ($rootScope.basket.length == 0) {
                $rootScope.basketProductsCount = 0;
            }
        }

        $scope.openProduct = function (product) {
            var cart = $state.current; // set mock "back to cart" crumb
            cart.title = 'Назад в корзину';
            cart.show = true;
            $rootScope.crumbs.push(cart);

            window.product = product;
            $state.go('basketDetail', {id: product.id});
        }
    })

    .controller('BasketFormCtrl', function ($scope, $rootScope, $timeout, $state) {
        $scope.form = {};
        $scope.form.phone = '';

        // $scope.checkNews = function ($event) {
        //     $scope.form.news = $event.target.checked;
        // }

        $scope.placeAnOrder = function () {
            console.log($scope.form);
            $rootScope.basket.length = 0;
            $timeout(function () {
                $state.go('main')
            }, 2000)
        }
    })
