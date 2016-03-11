System.register(['angular2/core', 'angular2/router', '../app.ts', '../services/collections.service', '../services/filters'], function(exports_1, context_1) {
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
    var core_1, router_1, app_ts_1, collections_service_1, filters_1;
    var unacceptableCategories, MainComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (app_ts_1_1) {
                app_ts_1 = app_ts_1_1;
            },
            function (collections_service_1_1) {
                collections_service_1 = collections_service_1_1;
            },
            function (filters_1_1) {
                filters_1 = filters_1_1;
            }],
        execute: function() {
            class unacceptableCategories {
                constructor() {
                    this.unacceptableCategoriesArray = [6, 5, 4, 101, 15, 202, 23, 24, 164, 78, 80, 79, 166, 162, 165, 71, 70, 77, 122, 121, 182, 93, 86, 85, 90, 87, 163];
                }
            }
            let MainComponent_1;
            let MainComponent = MainComponent_1 = class MainComponent extends unacceptableCategories {
                constructor(sample, _router) {
                    super();
                    this.sample = sample;
                    this._router = _router;
                    this.categories = new app_ts_1.Value().array;
                    this.foo = {};
                    if (Object.keys(MainComponent_1.collections).length == 0) {
                        this.sample.request().subscribe(res => {
                            var data = res.json();
                            MainComponent_1.collections['main'] = [];
                            MainComponent_1.collections['sub'] = [];
                            for (let i in data) {
                                if (this.unacceptableCategoriesArray.indexOf(data[i].id) > -1) {
                                    continue;
                                }
                                else if (!data[i].parent) {
                                    MainComponent_1.collections['main'].push(data[i]);
                                }
                                else if (data[i].parent) {
                                    MainComponent_1.collections['sub'].push(data[i]);
                                }
                            }
                        });
                    }
                }
                showMe(arg) {
                    MainComponent_1.mainSection = arg;
                    this._router.navigate(['Collections']);
                }
            };
            MainComponent.collections = {};
            MainComponent = MainComponent_1 = __decorate([
                core_1.Component({
                    selector: 'main',
                    templateUrl: '../templates/main.html',
                    providers: [collections_service_1.__LoadCollections],
                    pipes: [filters_1.arrayCutTop, filters_1.arrayCutBottom]
                }), 
                __metadata('design:paramtypes', [collections_service_1.__LoadCollections, router_1.Router])
            ], MainComponent);
            exports_1("MainComponent", MainComponent);
        }
    }
});
//# sourceMappingURL=main.component.js.map