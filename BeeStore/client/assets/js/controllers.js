angular.module('controllers', [])
    .controller('MainCategoryCtrl', function ($scope, $state, __LoadCategories, mainCategories) {
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
            });
        }

        window.category = {}; // for leaders loader
        $scope.categories = mainCategories;

        $scope.openCategory = function (arg) {
            window.category = arg;
            $state.go('categories');
        }
    })

    .controller('SubCategoryCtrl', function ($scope, $rootScope, $state, __LoadProducts, __LoadFilters) {
        $scope.subCategories = []; // clear subCategories
        $rootScope.productsList = undefined; // clear products list
        $rootScope.intagChoicesList = undefined;
        $rootScope.selectedFilters = undefined // clear selected filters list
        window.intagChoicesList = []; // clear filters
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
            $scope.customSelectActiveClass = '';

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

                __LoadProducts(window.subCategory, 15, window.page += 1, window.sortItem.value, $rootScope.intagChoicesList);
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
                selected: true
            },
            {
                value: 'price',
                label: 'цене: по возрастанию',
                selected: false
            },
            {
                value: '-price',
                label: 'цене: по убыванию',
                selected: false
            }
        ];

        // select item in sort list
        (window.sortItem) ? ($scope.selected = window.sortItem) : (window.sortItem = $scope.selected = $scope.items[0], window.sortItem.index = 0);

        $scope.sortBy = function (arg) {
            $rootScope.productsList = undefined;
            window.page = 1;
            window.sortItem = arg;
            $scope.selected = arg;
            $scope.customSelectActiveClass = ' ';

            __LoadProducts(window.subCategory, 15, 1, window.sortItem.value, $rootScope.intagChoicesList);
        }

        $scope.customSelect = function () {
            return $scope.customSelectActiveClass = (!$scope.customSelectActiveClass) ? 'cs-active' : '';
        }

        $scope.openFilters = function () {
            $scope.customSelectActiveClass = '';
            // document.body.className += ' no-scroll';
        }
    })

    .controller('ProductDetailCtrl', function ($scope, $rootScope, $stateParams, $document, $state, FoundationApi, __LoadOneProduct, __LoadPricePlan, __LoadMockPricePlans, __LoadProductsListByID, ModalFactory) {

        window.scroll(0,0); // scroll to top
        (window.product && window.product.id == $stateParams.id) ? $scope.product = window.product : window.product = undefined; // back from multicard bug fix

        var MULTICARD; // unchangeable variable
        __LoadOneProduct($stateParams.id).then(function (data) {
            data.intags_categories.forEach(function (item, i, arr) { // general intags for detail page
                if (item.id == 61) {
                    data.general_intags = item;
                }

                item.intags.forEach(function (intag_item, intag_i, intag_arr) {
                    if (!intag_item.value[0]) {
                        item.intags.splice(intag_i, 1);
                        intag_i--;
                    }
                })
            })


            /* -- MULTICARD CONFIGURATION --
            @SCHEME
            [
                {
                    name: 'name_of_intag',
                    choices: [
                        {
                            choice: "intag_choice",
                            id: "product_id"
                        }
                    ]
                },
                {
                    etc
                }
            ]
            */

            if (data.multicard_products && Object.keys(data.multicard_products).length > 0) {
                var multicard = {}; // create object for multicard params
                for (var i in data.multicard_products) break; // get first object element
                var first = data.multicard_products[i];

                // crete scheme
                first.forEach(function (item, i, arr) {
                    multicard[item.intag_slug] = {
                        name: item.intag_name,
                        choiceValues: {}
                    }
                })

                for (var i in data.multicard_products) {
                    data.multicard_products[i].forEach(function (item, index, arr) {
                        if (!multicard[item.intag_slug].choiceValues[item.intag_choice]) {
                            multicard[item.intag_slug].choiceValues[item.intag_choice] = {show: true, choices: new Array()};
                        }

                        if (data.id == i) {
                            multicard[item.intag_slug].choiceValues[item.intag_choice].current = true; // add current trigger
                        }

                        multicard[item.intag_slug].choiceValues[item.intag_choice].choices.push(i);
                    })
                }

                MULTICARD = JSON.stringify(multicard); // stringify object, because it unchangeable type (look at multicardButton fn)
                data.multicard = multicard;
            }

            // inheritance data to global product object
            try {
                window.product.__proto__ = data; // load detail after product list page
            } catch (e) {
                window.product = data; // load detail without products list page
            }

            if (window.product.article.indexOf('kit') > -1) {
                // __LoadPricePlan(window.product.description_small); // only for working mobile backend
                __LoadMockPricePlans(window.product.description_small); // service with mock PricePlans data
            }

            $scope.product = window.product; // set scope
            $scope.modalIntags = window.product.intags_categories[0]; // set opened intag
        })

        $scope.multicardButton = function (arg) {
            $scope.availableCount = arg.choices;
            product.multicard = JSON.parse(MULTICARD); // set default values for multicard
            arg.choices.forEach(function (item) {
                for (var i in product.multicard) {
                    for (var a in product.multicard[i].choiceValues) {
                        if (product.multicard[i].choiceValues[a].choices.indexOf(item) < 0 && !product.multicard[i].choiceValues[a].save) {
                            product.multicard[i].choiceValues[a].show = false;
                        }
                        else if (product.multicard[i].choiceValues[a].choices.indexOf(item) > -1) {
                            product.multicard[i].choiceValues[a].show = true;
                            product.multicard[i].choiceValues[a].save = true;
                        }
                    }
                }
            })
        }

        $scope.multicardSearchButton = function () {
            if ($scope.availableCount.length == 1) {
                $state.go('detail', {id: $scope.availableCount[0]})
            }
            else {
                __LoadProductsListByID($scope.availableCount).then(function (data) {
                    $scope.multicardProductsList = data;
                });
            }
        }

        // open field in intags
        $scope.openField = function (f) {
            $scope.modalIntags = f;
        }

        // active style for intags
        $scope.setActiveClass = function (condition) {
            if (condition) {
                return 'active-item'
            }
            else {
                return ''
            }
        }

        $scope.openCard = function (key) {
            delete window.product;
            $state.go('detail', {id: key});
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
        // $rootScope.intagChoicesList = window.intagChoicesList; // array for intag_choices ids
        if (window.intagChoicesList.length == 0) {
            $rootScope.filtersModalButtonConfig = {
                label: 'выберите',
                class: 'secondary'
            }
        }

        $rootScope.filterInd = 0;
        window.selectedFilters = {};

        $rootScope.checkFilter = function (index) {
            $rootScope.filterInd = index;
        }

        $rootScope.check = function ($event, val) {
            var checkbox = $event.target;

            // check filter
            if (checkbox.checked) {
                window.intagChoicesList.push(checkbox.value); // add to global intagChoicesList array
                val.check = true; // set check true

                /* -- selected filters list -- */
                // window.selectedFilters is object.
                // if object haven't this name as key, create them.
                if (!window.selectedFilters[$rootScope.productsListFilter[$rootScope.filterInd].name]) {
                    window.selectedFilters[$rootScope.productsListFilter[$rootScope.filterInd].name] = []; // create array
                    window.selectedFilters[$rootScope.productsListFilter[$rootScope.filterInd].name].push({ // push mock data
                        id: val.id,
                        value: val.value
                    })
                }
                else {
                    // if object have this name as key
                    window.selectedFilters[$rootScope.productsListFilter[$rootScope.filterInd].name].push({ // push new value
                        id: val.id,
                        value: val.value
                    })
                }
            }
            else if (!checkbox.checked) {
                window.intagChoicesList.splice(window.intagChoicesList.indexOf(checkbox.value), 1); // remove this value from global intagChoicesList array
                val.check = false; // set check false

                /* -- selected filters list -- */
                // get this object with this name as key, and remove from array item, with this value id
                window.selectedFilters[$rootScope.productsListFilter[$rootScope.filterInd].name].forEach(function (item, i, arr) {
                    if (item.id == val.id) { // check condition
                        window.selectedFilters[$rootScope.productsListFilter[$rootScope.filterInd].name].splice(i, 1); // and remove value
                    }
                })

                // if array of this object is empty, remove key
                if (window.selectedFilters[$rootScope.productsListFilter[$rootScope.filterInd].name].length == 0) {
                    delete window.selectedFilters[$rootScope.productsListFilter[$rootScope.filterInd].name];
                }
            }

            // set selected filters list
            $rootScope.selectedFilters = window.selectedFilters;
        }

        $rootScope.setFilter = function () {
            $rootScope.intagChoicesList = window.intagChoicesList;
            __LoadProducts(window.subCategory, 15, 1, window.sortItem.value, $rootScope.intagChoicesList);
            $rootScope.productsList = undefined;
            window.page = 1;

            if (window.intagChoicesList > 0) {
                $rootScope.filtersModalButtonConfig = {
                    label: 'выбрано',
                    class: 'warning'
                }
            }
            else {
                $rootScope.filtersModalButtonConfig = {
                    label: 'выберите',
                    class: 'secondary'
                }
            }
        }

        $rootScope.clearFilter = function () {
            $rootScope.intagChoicesList = window.intagChoicesList.length = 0; // clear global intag choices array
            $rootScope.selectedFilters = window.selectedFilters = {}; // clear selected filters

            // delete all checked filters
            window.filter[window.subCategory.id].forEach(function (item, i, arr) {
                item.choices.forEach(function (_item, _i, _arr) {
                    delete _item['check'];
                })
            })

            $rootScope.productsList = undefined;
            $rootScope.progress = true; // show progress bar
            __LoadProducts(window.subCategory, 15, 1, window.sortItem.value, $rootScope.intagChoicesList);
            window.page = 1;

            $rootScope.filtersModalButtonConfig = {
                label: 'выберите параметры',
                class: 'secondary'
            }
        }

        $rootScope.setActiveClass = function (condition) {
            if (condition) {
                return 'active-item'
            }
            else {
                return ''
            }
        }
    })

    .controller('BasketProductListCtrl', function ($scope, $rootScope, $state) {
        // clear crumbs
        // $rootScope.crumbs.length = 0;

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

        $scope.placeAnOrder = function () {
            console.log($scope.form);
            $rootScope.basket.length = 0;
            $timeout(function () {
                $state.go('main')
            }, 2000)
        }
    })
