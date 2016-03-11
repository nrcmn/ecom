System.register(['angular2/core', 'angular2/router', './collections.component', '../services/product.list.service', '../services/filters.load.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, collections_component_1, product_list_service_1, filters_load_service_1;
    var ProductsListComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (collections_component_1_1) {
                collections_component_1 = collections_component_1_1;
            },
            function (product_list_service_1_1) {
                product_list_service_1 = product_list_service_1_1;
            },
            function (filters_load_service_1_1) {
                filters_load_service_1 = filters_load_service_1_1;
            }],
        execute: function() {
            let ProductsListComponent_1;
            let ProductsListComponent = ProductsListComponent_1 = class ProductsListComponent {
                constructor(_router, productsLoader, filtersLoader) {
                    this._router = _router;
                    this.productsLoader = productsLoader;
                    this.filtersLoader = filtersLoader;
                    this.products = collections_component_1.CollectionsComponent.productsList; // @view_model init products list to view
                    this.filters = collections_component_1.CollectionsComponent.filters; // @view_model init filters list to view
                    this.page = 2; // set page for lazy loading functions
                    this.sortingArr = [{ value: '-weight', name: 'популярности' }, { value: 'price', name: 'цене: по возрастанию' }, { value: '-price', name: 'цене: по убыванию' }]; // init values for sorting list
                    this.sortType = this.sortingArr[0].value; // set default sort value
                    this.filtersShow = 'none'; // hide filters popup window
                }
                // Open product detail description function
                openProduct(arg) {
                    ProductsListComponent_1.product = arg;
                    this._router.navigate(['Detail', { id: arg.id }]);
                }
                // Lazyloading function
                onScroll(event) {
                    if ((Number(window.pageYOffset.toFixed()) - (document.body.scrollHeight - window.innerHeight) >= -1500) && ProductsListComponent_1.loadProductsStatus) {
                        ProductsListComponent_1.loadProductsStatus = false;
                        this.productsLoader.request(collections_component_1.CollectionsComponent.collection, '15', ProductsListComponent_1.sort, null, this.page.toString()).subscribe(res => {
                            ProductsListComponent_1.loadProductsStatus = true;
                            this.page += 1;
                            var data = res.json();
                            (data.length < 15) ? ProductsListComponent_1.loadProductsStatus = false : ProductsListComponent_1.loadProductsStatus = true;
                            for (let i = 0; i < data.length; i++) {
                                this.products.push(data[i]);
                            }
                        });
                    }
                }
                // Sorting functions
                selectSortType() {
                    ProductsListComponent_1.sort = this.sortType;
                    this.productsLoader.request(collections_component_1.CollectionsComponent.collection, '15', ProductsListComponent_1.sort).subscribe(res => {
                        var data = res.json();
                        collections_component_1.CollectionsComponent.productsList = data;
                        this.products = collections_component_1.CollectionsComponent.productsList;
                    });
                }
                // Show filters popup window
                filterVisibleFunc() {
                    if (this.filtersShow == 'none') {
                        this.loop(0);
                        this.filterChoices = collections_component_1.CollectionsComponent.filters.results[0].choices;
                        this.filtersShow = 'block';
                        document.body.style.overflow = 'hidden';
                    }
                    else {
                        this.filtersShow = 'none';
                        document.body.style.overflow = 'scroll';
                    }
                }
                // Select filter name (such as - manufacture, size etc.)
                checkFilterName(filter, i) {
                    this.loop(i);
                    return this.filterChoices = collections_component_1.CollectionsComponent.filters.results[i].choices, this.filterNameIndex = i;
                }
                // This for loop get list of selected choices and checked them on view
                loop(ind) {
                    for (let i = 0; i < collections_component_1.CollectionsComponent.filters.results[ind].choices.length; i++) {
                        let choice = collections_component_1.CollectionsComponent.filters.results[ind].choices[i];
                        if (collections_component_1.CollectionsComponent.selectedFilterIntagChoices.indexOf(choice.id) > -1) {
                            choice.checked = true;
                        }
                        else {
                            choice.checked = false;
                        }
                    }
                    return;
                }
                // Select value in filter and save them in global variable for filtering
                selectFilterChoice(event, choice) {
                    if (event.target.checked) {
                        choice.checked = true;
                        collections_component_1.CollectionsComponent.selectedFilterIntagChoices.push(choice.id);
                        this.filtersLiveConfigure(true);
                    }
                    else {
                        choice.checked = false;
                        let removeIndex = collections_component_1.CollectionsComponent.selectedFilterIntagChoices.indexOf(choice.id);
                        collections_component_1.CollectionsComponent.selectedFilterIntagChoices.splice(removeIndex, 1);
                        this.filtersLiveConfigure(false);
                    }
                    // return CollectionsComponent.selectedFilterIntagChoices;
                }
                filtersLiveConfigure(enter) {
                    this.filtersLoader.request(collections_component_1.CollectionsComponent.selectedFilterIntagChoices.join(',')).subscribe(res => {
                        let data = res.json();
                        let listOfFilteredIntags = new Array();
                        for (let i = 0; i < data.results.length; i++) {
                            data.results[i].choices.forEach((item, i, arr) => {
                                listOfFilteredIntags.push(item.id);
                            });
                        }
                        for (let i = 0; i < this.filters.results.length; i++) {
                            if (i == this.filterNameIndex && enter) {
                                continue;
                            }
                            this.filters.results[i].choices.forEach((item, index, arr) => {
                                if (listOfFilteredIntags.indexOf(this.filters.results[i].choices[index].id) < 0) {
                                    this.filters.results[i].choices[index].checked = false;
                                    this.filters.results[i].choices[index].disable = true;
                                }
                                else {
                                    this.filters.results[i].choices[index].disable = false;
                                }
                            });
                        }
                    });
                }
                // Filter data and load filtered products list
                filtering() { }
                // Cancel all changes in filters popup
                cancel() {
                    collections_component_1.CollectionsComponent.selectedFilterIntagChoices = new Array();
                    for (let i = 0; i < this.filters.results.length; i++) {
                        this.filters.results[i].choices.forEach((item, index, arr) => {
                            item.disable = false;
                            item.checked = false;
                        });
                    }
                }
            };
            ProductsListComponent.sort = '-weight'; // set default sort value for other services
            ProductsListComponent = ProductsListComponent_1 = __decorate([
                core_1.Component({
                    selector: 'products-list',
                    templateUrl: '../templates/products.list.html',
                    providers: [product_list_service_1.__LoadProductList, filters_load_service_1.__LoadFilters]
                }), 
                __metadata('design:paramtypes', [router_1.Router, product_list_service_1.__LoadProductList, filters_load_service_1.__LoadFilters])
            ], ProductsListComponent);
            exports_1("ProductsListComponent", ProductsListComponent);
        }
    }
});
//# sourceMappingURL=products.list.component.js.map