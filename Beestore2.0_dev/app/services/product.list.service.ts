import {Injectable} from 'angular2/core';
import {RequestOptions, Request, RequestMethod, URLSearchParams, Http, Headers} from 'angular2/http';
import {StaticProperties} from '../app';
import {CollectionsComponent} from '../components/collections.component';
import {ProductsListComponent} from '../components/products.list.component';


@Injectable()
export class __LoadProductList {
    constructor (private http?: Http) {}
    request (collection: string, amount: string, sort: string, choices: string, page: string, point: boolean, resolve: any, reject: any) {
        let params = new URLSearchParams();

        params.set('api_key', StaticProperties.API_KEY);
        params.set('market_region', StaticProperties.market_region.toString());
        params.set('collection', collection);
        params.set('amount', amount);
        params.set('sort_by', sort);
        params.set('params', 'article,id,name,images,price,remain,extended_remains');
        if (choices)
            params.set('intag_choices', choices);
        if (page)
            params.set('page', page);
        if (point)
            params.set('point_codes', localStorage.getItem('shopId'));

        let options = new RequestOptions({
            method: RequestMethod.Get,
            url: StaticProperties.URL + '/api/public/v1/products/',
            search: params
        })

        this.http.request(new Request(options)).subscribe(res => {
            var data = res.json();

            if (page != '1') {
                data.forEach((item,i,arr) => {
                    CollectionsComponent.productsList.push(item); // add new data to static variable
                });
            }
            else {
                CollectionsComponent.productsList = data;
            }

            (data.length < 15) ? CollectionsComponent.loadProductsStatus = false : CollectionsComponent.loadProductsStatus = true; // if length of data is lower then 15 - set false for lazy loading status variable

            resolve(data);
        });
    }
}
