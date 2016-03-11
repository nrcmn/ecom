import {Injectable} from 'angular2/core';
import {RequestOptions, Request, RequestMethod, URLSearchParams, Http, Headers} from 'angular2/http';
import {StaticProperties} from '../app';

@Injectable()
export class __LoadProductDescription {
    constructor (private http?: Http) {}
    request (id?: string, intags?: string) {
        let params = new URLSearchParams();
        params.set('api_key', StaticProperties.API_KEY);
        params.set('market_region', StaticProperties.market_region.toString());
        params.set('params', intags);

        let options = new RequestOptions({
            method: RequestMethod.Get,
            url: StaticProperties.URL + '/api/public/v1/products/' + id.toString() + '/',
            search: params
        })

        return this.http.request(new Request(options))
    }
}
