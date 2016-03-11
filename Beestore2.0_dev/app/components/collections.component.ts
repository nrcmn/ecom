import {Component, Injectable} from 'angular2/core';
import {Router} from 'angular2/router';
import {MainComponent, collectionObjectMap} from './main.component';
import {ProductsListComponent} from './products.list.component';

// Import services
import {__LoadProductList} from  '../services/product.list.service';
import {__LoadFilters} from '../services/filters.load.service';

export interface baseProductObject {
    article: string;
    id: number;
    images: Array<string>;
    name: string;
    price: number;
    remain: string;
}

export interface FiltersResults {
    choices: FilterChoices[];
    id: number;
    name: string;
}

export interface FilterChoices {
    id: number;
    value: string;
    checked?: boolean;
    disable?: boolean;
}

export interface Filters {
    max_price: number;
    min_price: number;
    product_count: number;
    results: FiltersResults[];
}

@Component({
    selector: 'collections',
    templateUrl: '../templates/collections.html',
    providers: [MainComponent, __LoadProductList, __LoadFilters]
})
export class CollectionsComponent {
    private currentCollection: collectionObjectMap[] = []; // @view_model init current collection scope

    static productsList: baseProductObject[]; // init global variable for products list
    static collection: string; // init selected collection ID
    static filters: Filters; // init global variables for filters data
    static selectedFilterIntagChoices: Array<number> = new Array(); // list of selected filters


    constructor (private productsLoader: __LoadProductList, private filtersLoader: __LoadFilters, private _router: Router) {
        // For loop, which push in currentCollection only current collection data
        for(let i in MainComponent.collections['sub']) {
            if (MainComponent.collections['sub'][i].parent == MainComponent.mainSection.id) {
                this.currentCollection.push(MainComponent.collections['sub'][i]);
            }
        }

        CollectionsComponent.selectedFilterIntagChoices = new Array(); // clean already selected filters
    }

    openCollection (arg: collectionObjectMap) {
        // open collection function
        CollectionsComponent.collection = arg.id.toString(); // set selected collection ID

        var promises = [
            new Promise ((resolve, reject) => {
                // load product list
                this.productsLoader.request(arg.id.toString(), '15', '-weight').subscribe(res => {
                    var data = res.json();
                    CollectionsComponent.productsList = data;

                    (data.length < 15) ? ProductsListComponent.loadProductsStatus = false : ProductsListComponent.loadProductsStatus = true; // if length of data is lower then 15 - set false for lazy loading status variable

                    resolve();
                });
            }),
            new Promise ((resolve, reject) => {
                // load filters for this collection
                this.filtersLoader.request().subscribe(res => {
                    var data = res.json();
                    for (let i=0; i < data.results.length; i++) {
                        if (data.results[i].id == 659 || data.results[i].choices.length == 0) {
                            data.results.splice(i, 1);
                            i--;
                        }
                    }

                    CollectionsComponent.filters = data;
                    resolve();
                })
            })
        ];

        Promise.all(promises).then((values) => {
            this._router.navigate(['Products']);
        })
    }
}
