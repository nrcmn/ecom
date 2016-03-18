/*
    -- App codestyle --

    In this app uses camelCase sensitive for variables name. For services uses __{camel-case service name} names.
    Every static variables in classes uses as global variable, and maybe use in other components/services.
    Static variables can be init in every component.

    -- App version --
    version: 0.2.0
*/
System.register(['angular2/core', 'angular2/router', './components/slidebox.component', './components/main.component', './components/collections.component', './components/products.list.component', './components/detail.product.component', './components/cart.component', './components/cart.order.component', './components/navigation.component'], function(exports_1, context_1) {
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
    var core_1, router_1, slidebox_component_1, main_component_1, collections_component_1, products_list_component_1, detail_product_component_1, cart_component_1, cart_order_component_1, navigation_component_1;
    var StaticProperties, GlobalAppComponent, Value;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (slidebox_component_1_1) {
                slidebox_component_1 = slidebox_component_1_1;
            },
            function (main_component_1_1) {
                main_component_1 = main_component_1_1;
            },
            function (collections_component_1_1) {
                collections_component_1 = collections_component_1_1;
            },
            function (products_list_component_1_1) {
                products_list_component_1 = products_list_component_1_1;
            },
            function (detail_product_component_1_1) {
                detail_product_component_1 = detail_product_component_1_1;
            },
            function (cart_component_1_1) {
                cart_component_1 = cart_component_1_1;
            },
            function (cart_order_component_1_1) {
                cart_order_component_1 = cart_order_component_1_1;
            },
            function (navigation_component_1_1) {
                navigation_component_1 = navigation_component_1_1;
            }],
        execute: function() {
            // Set default component
            let StaticProperties = class StaticProperties {
            };
            StaticProperties.API_KEY = '852bff3ff459f9886729b9de223e8a0340ce008b'; // key for ecommerce API
            StaticProperties.URL = 'https://public.backend.vimpelcom.ru'; // public production API
            // public url: string = 'https://public.backend-test.vimpelcom.ru'; // public test API
            // public url: string = 'http://backend.vimpelcom.ru:8080'; // Internal API
            // public url: string = 'http://backend-test.vimpelcom.ru:8080'; // Internal test API
            StaticProperties.market_region = 98140; // market_region number
            StaticProperties.marketCode = 'VIP'; // for price plans identification
            StaticProperties.TIMER_VALUE = 60; // timer value
            StaticProperties = __decorate([
                core_1.Component({
                    selector: "app",
                    template: `
        <navigation></navigation>
        <router-outlet></router-outlet>
    `,
                    directives: [router_1.ROUTER_DIRECTIVES, navigation_component_1.NavigationComponent]
                }),
                router_1.RouteConfig([
                    new router_1.Route({ path: '/slidebox', name: 'Slidebox', component: slidebox_component_1.SlideboxComponent, useAsDefault: true }),
                    new router_1.Route({ path: '/', name: 'Main', component: main_component_1.MainComponent }),
                    new router_1.Route({ path: '/collections', name: 'Collections', component: collections_component_1.CollectionsComponent }),
                    new router_1.Route({ path: '/products', name: 'Products', component: products_list_component_1.ProductsListComponent }),
                    new router_1.Route({ path: '/products/:id', name: 'Detail', component: detail_product_component_1.DetailProductComponent }),
                    new router_1.Route({ path: '/cart', name: 'Cart', component: cart_component_1.CartComponent }),
                    new router_1.Route({ path: '/cart/form/:type', name: 'Delivery', component: cart_order_component_1.CartOrderComponent }),
                    new router_1.Route({ path: '/navigation', name: 'Navi', component: navigation_component_1.NavigationComponent })
                ]), 
                __metadata('design:paramtypes', [])
            ], StaticProperties);
            exports_1("StaticProperties", StaticProperties);
            class GlobalAppComponent extends StaticProperties {
                constructor() {
                    super();
                    this.webview = location.search.replace(/\?id=/g, ''); // webview id for bridge from electron to this app
                    if (this.webview.indexOf('/') > -1) {
                        this.webview = this.webview.replace(/\//g, '');
                    }
                }
            }
            exports_1("GlobalAppComponent", GlobalAppComponent);
            class Value {
                constructor() {
                    this.array = [];
                    this.array.push({ name: 'Телефоны', order: 1, id: 2, img: './img/phone.jpg' });
                    this.array.push({ name: 'Планшеты', order: 2, id: 21, img: './img/tablet.jpg' });
                    this.array.push({ name: 'Модемы и роутеры', order: 3, id: 224, img: './img/router.png' });
                    this.array.push({ name: 'Гаджеты', order: 4, id: 8, img: './img/watch.png' });
                    this.array.push({ name: 'Аксессуары', order: 5, id: 9, img: './img/head.jpg' });
                }
            }
            exports_1("Value", Value);
        }
    }
});
//# sourceMappingURL=app.js.map