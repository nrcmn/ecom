import {Injectable} from 'angular2/core';
import {RequestOptions, Request, RequestMethod, URLSearchParams, Http, Headers} from 'angular2/http';
import {StaticProperties} from '../app';


@Injectable()
export class __LoadCollections {
    constructor (private http: Http) {}
    request () {
        let params = new URLSearchParams();
        params.set('api_key', StaticProperties.API_KEY);
        params.set('market_region', StaticProperties.market_region.toString());

        let options = new RequestOptions({
            method: RequestMethod.Get,
            url: StaticProperties.URL + '/api/public/v1/collections/',
            search: params
        })

        return this.http.request(new Request(options))
    }
}
