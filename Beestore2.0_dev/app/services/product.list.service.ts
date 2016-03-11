import {Injectable} from 'angular2/core';
import {RequestOptions, Request, RequestMethod, URLSearchParams, Http, Headers} from 'angular2/http';
import {StaticProperties} from '../app';

@Injectable()
export class __LoadProductList {
    constructor (private http?: Http) {}
    request (collection?: string, amount?: string, sort?: string, choices?: string, page?: string) {

        let params = new URLSearchParams();
        params.set('api_key', StaticProperties.API_KEY);
        params.set('market_region', StaticProperties.market_region.toString());
        params.set('collection', collection);
        params.set('amount', amount);
        params.set('sort_by', sort);
        if (choices)
            params.set('intag_choices', choices);
        else if (page)
            params.set('page', page);
        params.set('point_codes', StaticProperties.shopID);

        let options = new RequestOptions({
            method: RequestMethod.Get,
            url: StaticProperties.URL + '/api/public/v1/products/',
            search: params
        })

        return this.http.request(new Request(options))
    }
}
