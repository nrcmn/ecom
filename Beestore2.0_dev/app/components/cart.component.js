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
    var CartComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            let CartComponent_1;
            let CartComponent = CartComponent_1 = class CartComponent {
                constructor() {
                    this.cartList = CartComponent_1.cart; // @view_model list of products in cart
                }
                addToCart(arg) {
                    // init cart, if not and push data
                    if (!CartComponent_1.cart) {
                        CartComponent_1.cart = { totalPrice: arg.price, totalCount: 1, items: [] };
                        return CartComponent_1.cart.items.push(arg);
                    }
                    let count = 0; // variable for total count in cart
                    let price = 0; // variable for total price in cart
                    let update = true;
                    // loop items in cart
                    for (let i = 0; i < CartComponent_1.cart.items.length; i++) {
                        count += CartComponent_1.cart.items[i].quantity; // plus count
                        price += CartComponent_1.cart.items[i].price; // plus price
                        // if this product was in cart
                        if (CartComponent_1.cart.items[i].product == arg.product) {
                            update = false;
                            count += 1;
                            price += arg.price;
                            CartComponent_1.cart.items[i].quantity += 1; // update count in this product
                        }
                    }
                    CartComponent_1.cart.totalPrice = price; // update price in cart
                    CartComponent_1.cart.totalCount = count; // update count in cart
                    // if loop didn't find this product in cart. Push as new product
                    if (update) {
                        CartComponent_1.cart.items.push(arg);
                        CartComponent_1.cart.totalPrice += arg.price;
                        CartComponent_1.cart.totalCount += 1;
                    }
                }
            };
            CartComponent = CartComponent_1 = __decorate([
                core_1.Component({
                    selector: 'cart',
                    templateUrl: '../templates/cart.list.html',
                    directives: [router_1.ROUTER_DIRECTIVES]
                }), 
                __metadata('design:paramtypes', [])
            ], CartComponent);
            exports_1("CartComponent", CartComponent);
        }
    }
});
//# sourceMappingURL=cart.component.js.map