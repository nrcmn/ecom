System.register(['angular2/core', 'angular2/http', '../app', '../components/collections.component'], function(exports_1, context_1) {
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
    var core_1, http_1, app_1, collections_component_1;
    var __LoadFilters;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (app_1_1) {
                app_1 = app_1_1;
            },
            function (collections_component_1_1) {
                collections_component_1 = collections_component_1_1;
            }],
        execute: function() {
            let __LoadFilters = class __LoadFilters {
                constructor(http) {
                    this.http = http;
                }
                request(intagChoices) {
                    let params = new http_1.URLSearchParams();
                    params.set('api_key', app_1.StaticProperties.API_KEY);
                    params.set('market_region', app_1.StaticProperties.market_region.toString());
                    if (intagChoices)
                        params.set('intag_choices', intagChoices);
                    let options = new http_1.RequestOptions({
                        method: http_1.RequestMethod.Get,
                        url: app_1.StaticProperties.URL + '/api/public/v1/collections/' + collections_component_1.CollectionsComponent.collection + '/intag_choices/',
                        search: params
                    });
                    return this.http.request(new http_1.Request(options));
                }
            };
            __LoadFilters = __decorate([
                core_1.Injectable(), 
                __metadata('design:paramtypes', [http_1.Http])
            ], __LoadFilters);
            exports_1("__LoadFilters", __LoadFilters);
        }
    }
});
//# sourceMappingURL=filters.load.service.js.map