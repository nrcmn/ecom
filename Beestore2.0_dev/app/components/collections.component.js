System.register(['angular2/core', 'angular2/router', './main.component', '../services/product.list.service', '../services/filters.load.service'], function(exports_1, context_1) {
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
    var core_1, router_1, main_component_1, product_list_service_1, filters_load_service_1;
    var CollectionsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (main_component_1_1) {
                main_component_1 = main_component_1_1;
            },
            function (product_list_service_1_1) {
                product_list_service_1 = product_list_service_1_1;
            },
            function (filters_load_service_1_1) {
                filters_load_service_1 = filters_load_service_1_1;
            }],
        execute: function() {
            let CollectionsComponent_1;
            let CollectionsComponent = CollectionsComponent_1 = class CollectionsComponent {
                constructor(productsLoader, filtersLoader, _router) {
                    this.productsLoader = productsLoader;
                    this.filtersLoader = filtersLoader;
                    this._router = _router;
                    this.currentCollection = []; // @view_model init current collection scope
                    // For loop, which push in currentCollection only current collection data
                    for (let i in main_component_1.MainComponent.collections['sub']) {
                        if (main_component_1.MainComponent.collections['sub'][i].parent == main_component_1.MainComponent.mainSection.id) {
                            this.currentCollection.push(main_component_1.MainComponent.collections['sub'][i]);
                        }
                    }
                    CollectionsComponent_1.selectedFilterIntagChoices = new Array(); // clean already selected filters
                }
                openCollection(arg) {
                    // open collection function
                    CollectionsComponent_1.collection = arg.id.toString(); // set selected collection ID
                    var promises = [
                        new Promise((resolve, reject) => {
                            // load product list
                            this.productsLoader.request(arg.id.toString(), '15', '-weight', null, null, false, resolve, reject);
                        }),
                        new Promise((resolve, reject) => {
                            // load filters for this collection
                            this.filtersLoader.request().subscribe(res => {
                                var data = res.json();
                                for (let i = 0; i < data.results.length; i++) {
                                    if (data.results[i].id == 659 || data.results[i].choices.length == 0) {
                                        data.results.splice(i, 1);
                                        i--;
                                    }
                                }
                                CollectionsComponent_1.filters = data;
                                resolve();
                            });
                        })
                    ];
                    Promise.all(promises).then((values) => {
                        this._router.navigate(['Products']);
                    });
                }
            };
            CollectionsComponent.productsList = new Array(); // init global variable for products list
            CollectionsComponent.selectedFilterIntagChoices = new Array(); // list of selected filters
            CollectionsComponent = CollectionsComponent_1 = __decorate([
                core_1.Component({
                    selector: 'collections',
                    templateUrl: '../templates/collections.html',
                    providers: [main_component_1.MainComponent, product_list_service_1.__LoadProductList, filters_load_service_1.__LoadFilters]
                }), 
                __metadata('design:paramtypes', [product_list_service_1.__LoadProductList, filters_load_service_1.__LoadFilters, router_1.Router])
            ], CollectionsComponent);
            exports_1("CollectionsComponent", CollectionsComponent);
        }
    }
});
//# sourceMappingURL=collections.component.js.map