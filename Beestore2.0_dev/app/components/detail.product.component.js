System.register(['angular2/core', 'angular2/router', './products.list.component', './cart.component', '../services/product.detail.service'], function(exports_1, context_1) {
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
    var core_1, router_1, products_list_component_1, cart_component_1, product_detail_service_1;
    var intagsList, intags, DetailProductComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (products_list_component_1_1) {
                products_list_component_1 = products_list_component_1_1;
            },
            function (cart_component_1_1) {
                cart_component_1 = cart_component_1_1;
            },
            function (product_detail_service_1_1) {
                product_detail_service_1 = product_detail_service_1_1;
            }],
        execute: function() {
            class intagsList {
            }
            class intags {
            }
            let DetailProductComponent = class DetailProductComponent {
                /*
                    If need functions for loading detail page ondemand, you need to update 'this.loadDescription.request' params
                    and add optional symbol (for ex: 'product?.name') to templates.
                */
                constructor(_router, _routeParams, loadDescription, cartUpdate) {
                    this._router = _router;
                    this._routeParams = _routeParams;
                    this.loadDescription = loadDescription;
                    this.cartUpdate = cartUpdate;
                    this.product = products_list_component_1.ProductsListComponent.product; // @view_model variable for product detail view data
                    this.swiperInit = 'none';
                    let point = localStorage.getItem('shopId');
                    // if this product have some balance in this point
                    (point in products_list_component_1.ProductsListComponent.product.extended_remains) ? this.showPickupButton = true : this.showPickupButton = false;
                    // if this point have some balance in ecommerce shop
                    (products_list_component_1.ProductsListComponent.product.remain != 'нет' || products_list_component_1.ProductsListComponent.product.remain != 'временно нет') ? this.showCartButton = true : this.showCartButton = false;
                    if (products_list_component_1.ProductsListComponent.product.images.length > 1) {
                        // Swiper.JS codehack
                        setTimeout(() => {
                            this.swiperInit = 'block';
                            var mySwiper = new Swiper('.swiper-container', {
                                // Optional parameters
                                direction: 'horizontal',
                                loop: true,
                                // If we need pagination
                                pagination: '.swiper-pagination',
                                // Navigation arrows
                                nextButton: '.swiper-button-next',
                                prevButton: '.swiper-button-prev'
                            });
                        }, 1000);
                    }
                    // Load other data for product description
                    this.loadDescription.request(this._routeParams.params['id'].toString(), 'accessories,description_small,description_yandex,intags_categories,old_price,rr_recommendations').subscribe(res => {
                        var data = res.json();
                        for (let i in products_list_component_1.ProductsListComponent.product) {
                            data[i] = products_list_component_1.ProductsListComponent.product[i];
                        }
                        this.product = data;
                    });
                }
                addToCart() {
                    this.cartUpdate.addToCart({
                        product: this.product.id,
                        quantity: 1,
                        img: this.product.images[0],
                        name: this.product.name,
                        price: this.product.price
                    });
                    this._router.navigate(['Cart']); // navigate to cart
                }
            };
            DetailProductComponent = __decorate([
                core_1.Component({
                    selector: 'products-detail',
                    templateUrl: '../templates/product.detail.html',
                    providers: [product_detail_service_1.__LoadProductDescription, cart_component_1.CartComponent]
                }), 
                __metadata('design:paramtypes', [router_1.Router, router_1.RouteParams, product_detail_service_1.__LoadProductDescription, cart_component_1.CartComponent])
            ], DetailProductComponent);
            exports_1("DetailProductComponent", DetailProductComponent);
        }
    }
});
//# sourceMappingURL=detail.product.component.js.map