System.register(['angular2/core', './cart.component', '../services/filters'], function(exports_1, context_1) {
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
    var core_1, cart_component_1, filters_1;
    var CartOrderComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (cart_component_1_1) {
                cart_component_1 = cart_component_1_1;
            },
            function (filters_1_1) {
                filters_1 = filters_1_1;
            }],
        execute: function() {
            let CartOrderComponent = class CartOrderComponent {
                constructor() {
                    this.phoneNumber = ''; // @view_model phone number
                    this.totalPrice = cart_component_1.CartComponent.cart.totalPrice; // @view_model total price of cart
                }
                phoneKeyPress(value, type) {
                    if (this.phoneNumber.length == 10 && type == 'key') {
                        return;
                    }
                    switch (type) {
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
                preOrderButton() {
                }
            };
            CartOrderComponent = __decorate([
                core_1.Component({
                    selector: 'delivery',
                    templateUrl: '../templates/cart.order.html',
                    pipes: [filters_1.phoneNumberMask]
                }), 
                __metadata('design:paramtypes', [])
            ], CartOrderComponent);
            exports_1("CartOrderComponent", CartOrderComponent);
        }
    }
});
//# sourceMappingURL=cart.order.component.js.map