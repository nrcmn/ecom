System.register(['angular2/core', 'angular2/router'], function(exports_1, context_1) {
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
    var core_1, router_1;
    var NavigationComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            let NavigationComponent_1;
            let NavigationComponent = NavigationComponent_1 = class NavigationComponent {
                constructor(router) {
                    this.router = router;
                    this.showNavigation = false; // @view_model init show or hide rule for navigation block
                    this.backButton = 'none'; // @view_model init display style for back button
                    this.toMain = 'none'; // @view_model init display style for to main page button
                    this.router.subscribe(val => {
                        NavigationComponent_1.history.push(val);
                        if (val == '' || val == 'slidebox') {
                            NavigationComponent_1.history = new Array();
                            this.showNavigation = false;
                            this.backButton = 'none';
                            this.toMain = 'none';
                        }
                        else if (val == 'collections') {
                            this.showNavigation = true;
                            this.backButton = 'block';
                            this.toMain = 'none';
                        }
                        else if (NavigationComponent_1.history.length <= 1) {
                            this.showNavigation = true;
                            this.backButton = 'none';
                            this.toMain = 'block';
                        }
                        else {
                            this.showNavigation = true;
                            this.backButton = 'block';
                            this.toMain = 'block';
                        }
                    });
                }
                backButtonEvent() {
                    history.back();
                }
                toMainButtonEvent() {
                    this.router.navigate(['Main']);
                }
            };
            NavigationComponent.history = new Array(); // static variable with histories;
            NavigationComponent = NavigationComponent_1 = __decorate([
                core_1.Component({
                    selector: 'navigation',
                    templateUrl: '../templates/navigation.html'
                }), 
                __metadata('design:paramtypes', [router_1.Router])
            ], NavigationComponent);
            exports_1("NavigationComponent", NavigationComponent);
        }
    }
});
//# sourceMappingURL=navigation.component.js.map