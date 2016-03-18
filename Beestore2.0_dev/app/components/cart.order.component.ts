import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {CartComponent} from './cart.component';
import {phoneNumberMask} from '../services/filters';


@Component({
    selector: 'delivery',
    templateUrl: '../templates/cart.order.html',
    pipes: [phoneNumberMask]
})
export class CartOrderComponent {
    private phoneNumber: string = ''; // @view_model phone number
    private totalPrice: number = CartComponent.cart.totalPrice; // @view_model total price of cart
    private showSteps: boolean = (this._routeParams.params['type'] == 'delivery') ? true : false;; // @view_model if delivery type - show steps in other variants - hide this block

    constructor (private _routeParams: RouteParams) {}

    phoneKeyPress (value?: string, type?: string) :void {
        if (this.phoneNumber.length == 10 && type == 'key') {
            return
        }

        switch(type) {
            case 'key':
                this.phoneNumber += value;
                break;
            case 'clear':
                this.phoneNumber = '';
                break;
            case 'backspace':
                let strArr = this.phoneNumber.split('');
                strArr.pop();

                this.phoneNumber = strArr.join('');
                break;
        }
    }

    preOrderButton () {
        if (this._routeParams.params['type'] == 'delivery') {
            console.info(CartComponent.cart, '<-- delivery cart');
        }
        else if (this._routeParams.params['type'] == 'pickup') {
            console.info(CartComponent.pickupCart, '<-- pickup cart');
        }
    }
}
