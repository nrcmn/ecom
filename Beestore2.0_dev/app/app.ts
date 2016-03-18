/*
    -- App codestyle --

    In this app uses camelCase sensitive for variables name. For services uses __{camel-case service name} names.
    Every static variables in classes uses as global variable, and maybe use in other components/services.
    Static variables can be init in every component.

    -- App version --
    version: 0.2.0
*/


// import Angular 2 components
import {Component} from 'angular2/core';
import {Router, Route, RouteData, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

// Import app components
import {MainComponent} from './components/main.component';
import {CollectionsComponent} from './components/collections.component';
import {ProductsListComponent} from './components/products.list.component';
import {DetailProductComponent} from './components/detail.product.component';
import {CartComponent} from './components/cart.component';
import {CartOrderComponent} from './components/cart.order.component';
import {NavigationComponent} from './components/navigation.component';


// Set default component
@Component({
    selector: "app",
    template: `
        <navigation></navigation>
        <router-outlet></router-outlet>
    `,
    directives: [ROUTER_DIRECTIVES, NavigationComponent]
})
// Configurate routing
@RouteConfig([
    new Route({path:'/', name: 'Main', component: MainComponent}),
    new Route({path: '/collections', name: 'Collections', component: CollectionsComponent}),
    new Route({path: '/products', name: 'Products', component: ProductsListComponent}),
    new Route({path: '/products/:id', name: 'Detail', component: DetailProductComponent}),
    new Route({path: '/cart', name: 'Cart', component: CartComponent}),
    new Route({path: '/cart/form/:type', name: 'Delivery', component: CartOrderComponent}),
    new Route({path: '/navigation', name: 'Navi', component: NavigationComponent})
])

export class StaticProperties {
    static API_KEY: string = '852bff3ff459f9886729b9de223e8a0340ce008b'; // key for ecommerce API
    static URL: string = 'https://public.backend.vimpelcom.ru'; // public production API
    // public url: string = 'https://public.backend-test.vimpelcom.ru'; // public test API
    // public url: string = 'http://backend.vimpelcom.ru:8080'; // Internal API
    // public url: string = 'http://backend-test.vimpelcom.ru:8080'; // Internal test API

    static market_region: number = 98140; // market_region number
    static marketCode: string = 'VIP'; // for price plans identification
    static TIMER_VALUE: number = 60; // timer value
    // static shopID: string = '' // #beestore in Yekaterinburg // unused in this app
}

export class GlobalAppComponent extends StaticProperties {
    private webview: string = location.search.replace(/\?id=/g, ''); // webview id for bridge from electron to this app
    constructor () {
        super();
        if (this.webview.indexOf('/') > -1) {
            this.webview = this.webview.replace(/\//g, '');
        }
    }
}

interface ArrayObject {
    name: string;
    order: number;
    id: number;
    img: string;
}

export class Value {

    // Set hardcoded categories list for main page
    public array: ArrayObject[]; // @view_model for main.html
    constructor () {
        this.array = [];
        this.array.push({name: 'Телефоны', order: 1, id: 2, img: './img/phone.jpg'});
        this.array.push({name: 'Планшеты', order: 2, id: 21, img: './img/tablet.jpg'});
        this.array.push({name: 'Модемы и роутеры', order: 3, id: 224, img: './img/router.png'});
        this.array.push({name: 'Гаджеты', order: 4, id: 8, img: './img/watch.png'});
        this.array.push({name: 'Аксессуары', order: 5, id: 9, img: './img/head.jpg'});
    }
}
