import {Component} from 'angular2/core';

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
    templateUrl: '../templates/cart.list.html'
})
export class CartComponent {
    private cartList: Cart = CartComponent.cart; // @view_model list of products in cart
    static cart: Cart;
    constructor () {}

    addToCart (arg: CartItems) :any {
        if (!CartComponent.cart) {
            CartComponent.cart = {totalPrice: arg.price, totalCount: 1, items: []};
            return CartComponent.cart.items.push(arg);
        }

        let count: number = 0; // variable for total count in cart
        let price: number = 0; // variable for total price in cart
        let update: boolean = true;

        for(let i=0; i < CartComponent.cart.items.length; i++) {
            count += CartComponent.cart.items[i].quantity;
            price += CartComponent.cart.items[i].price;

            if (CartComponent.cart.items[i].product == arg.product) {
                update = false;
                count += 1
                price += arg.price;
                CartComponent.cart.items[i].quantity += 1
            }
        }

        CartComponent.cart.totalPrice = price;
        CartComponent.cart.totalCount = count;
        if (update) {
            CartComponent.cart.items.push(arg)
            CartComponent.cart.totalPrice += arg.price;
            CartComponent.cart.totalCount += 1;
        }
    }
}
