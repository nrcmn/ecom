import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

interface CartItems {
    product: number;
    quantity: number;
    img: string;
    name: string;
    price: number;
}
interface Cart {
    totalPrice: number;
    totalCount: number;
    items: CartItems[];
}

@Component({
    selector: 'cart',
    templateUrl: '../templates/cart.list.html',
    directives: [ROUTER_DIRECTIVES]
})
export class CartComponent {
    private cartList: Cart = CartComponent.cart; // @view_model list of products in cart
    static cart: Cart; // static variable for

    addToCart (arg: CartItems) :any {
        // init cart, if not and push data
        if (!CartComponent.cart) {
            CartComponent.cart = {totalPrice: arg.price, totalCount: 1, items: []};
            return CartComponent.cart.items.push(arg);
        }

        let count: number = 0; // variable for total count in cart
        let price: number = 0; // variable for total price in cart
        let update: boolean = true;

        // loop items in cart
        for(let i=0; i < CartComponent.cart.items.length; i++) {
            count += CartComponent.cart.items[i].quantity; // plus count
            price += CartComponent.cart.items[i].price; // plus price

            // if this product was in cart
            if (CartComponent.cart.items[i].product == arg.product) {
                update = false;
                count += 1
                price += arg.price;
                CartComponent.cart.items[i].quantity += 1 // update count in this product
            }
        }

        CartComponent.cart.totalPrice = price; // update price in cart
        CartComponent.cart.totalCount = count; // update count in cart

        // if loop didn't find this product in cart. Push as new product
        if (update) {
            CartComponent.cart.items.push(arg)
            CartComponent.cart.totalPrice += arg.price;
            CartComponent.cart.totalCount += 1;
        }
    }
}
