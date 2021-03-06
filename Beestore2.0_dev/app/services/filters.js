System.register(['angular2/core'], function(exports_1, context_1) {
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
    var core_1;
    var arrayCutTop, arrayCutBottom, phoneNumberMask;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            let arrayCutTop = class arrayCutTop {
                transform(value) {
                    let cutVal = [];
                    for (let i in value) {
                        if (Number(i) < 2) {
                            cutVal.push(value[i]);
                        }
                    }
                    return cutVal;
                }
            };
            arrayCutTop = __decorate([
                core_1.Pipe({
                    name: 'arrayCutTop'
                }), 
                __metadata('design:paramtypes', [])
            ], arrayCutTop);
            exports_1("arrayCutTop", arrayCutTop);
            let arrayCutBottom = class arrayCutBottom {
                transform(value) {
                    let cutVal = [];
                    for (let i in value) {
                        if (Number(i) > 1) {
                            cutVal.push(value[i]);
                        }
                    }
                    return cutVal;
                }
            };
            arrayCutBottom = __decorate([
                core_1.Pipe({
                    name: 'arrayCutBottom'
                }), 
                __metadata('design:paramtypes', [])
            ], arrayCutBottom);
            exports_1("arrayCutBottom", arrayCutBottom);
            let phoneNumberMask = class phoneNumberMask {
                transform(value) {
                    var strArr = value.split('');
                    for (let i = 0; i < strArr.length; i++) {
                        if (i == 0) {
                            strArr[i] = '(' + strArr[i];
                        }
                        else if (i == 2) {
                            strArr[i] = strArr[i] + ') ';
                        }
                        else if (i == 5) {
                            strArr[i] = strArr[i] + ' ';
                        }
                        else if (i == 7) {
                            strArr[i] = strArr[i] + ' ';
                        }
                    }
                    return strArr.join('');
                }
            };
            phoneNumberMask = __decorate([
                core_1.Pipe({
                    name: 'phoneNumberMask'
                }), 
                __metadata('design:paramtypes', [])
            ], phoneNumberMask);
            exports_1("phoneNumberMask", phoneNumberMask);
        }
    }
});
//# sourceMappingURL=filters.js.map