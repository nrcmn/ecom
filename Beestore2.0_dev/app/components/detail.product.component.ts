import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {CollectionsComponent, baseProductObject} from './collections.component';
import {ProductsListComponent} from './products.list.component';
import {CartComponent} from './cart.component';

// import services
import {__LoadProductDescription} from '../services/product.detail.service';
declare var Swiper: any; // init custom variable for Swiper.js

class intagsList {
    public id: number;
    public name: string;
    public kind: number;
    public intag_choice_id: Array<number>;
    public value: Array<string>;
    public unit: any;
}

class intags {
    public id: number;
    public name: string;
    public intags: Array<intagsList>;
}

interface productDetailDescription extends baseProductObject {
    accessories: Array<number>;
    description_small: string;
    description_yandex: string;
    intags_categories: Array<intags>;
    old_price: number;
    rr_recommendations: Array<number>;
}

@Component({
    selector: 'products-detail',
    templateUrl: '../templates/product.detail.html',
    providers: [__LoadProductDescription, CartComponent]
})
export class DetailProductComponent {
    private product: baseProductObject = ProductsListComponent.product; // @view_model variable for product detail view data
    private swiperInit: string = 'none';
    private showPickupButton: boolean;
    private showCartButton: boolean;


    /*
        If need functions for loading detail page ondemand, you need to update 'this.loadDescription.request' params
        and add optional symbol (for ex: 'product?.name') to templates.
    */
    constructor (private _router: Router, private _routeParams: RouteParams, private loadDescription: __LoadProductDescription, private cartUpdate: CartComponent) {
        let point = localStorage.getItem('shopId');

        // if this product have some balance in this point
        (point in ProductsListComponent.product.extended_remains) ? this.showPickupButton = true : this.showPickupButton = false;

        // if this point have some balance in ecommerce shop
        (ProductsListComponent.product.remain != 'нет' || ProductsListComponent.product.remain != 'временно нет') ? this.showCartButton = true : this.showCartButton = false;


        if (ProductsListComponent.product.images.length > 1) {
            // Swiper.JS codehack
            setTimeout(() :any => {
                this.swiperInit = 'block';
                var mySwiper = new Swiper ('.swiper-container', {
                    // Optional parameters
                    direction: 'horizontal',
                    loop: true,

                    // If we need pagination
                    pagination: '.swiper-pagination',

                    // Navigation arrows
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev'
                })
            }, 1000);
        }

        // Load other data for product description
        this.loadDescription.request(this._routeParams.params['id'].toString(), 'accessories,description_small,description_yandex,intags_categories,old_price,rr_recommendations').subscribe(res => {
            var data = res.json();
            for(let i in ProductsListComponent.product) {data[i] = ProductsListComponent.product[i]}
            this.product = data;
        })
    }

    addToCart () {
        this.cartUpdate.addToCart({
            product: this.product.id,
            quantity: 1,
            img: this.product.images[0],
            name: this.product.name,
            price: this.product.price
        });

        this._router.navigate(['Cart']); // navigate to cart
    }

    pickupOrder () {
        this.cartUpdate.addToPickupCart({
            product: this.product.id,
            quantity: 1,
            img: this.product.images[0],
            name: this.product.name,
            price: this.product.price
        });

        this._router.navigate(['Delivery', {type: 'pickup'}]); // navigate to form with mobile number input field
    }
}
