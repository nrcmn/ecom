import {Injectable} from 'angular2/core';
import {RequestOptions, Request, RequestMethod, URLSearchParams, Http, Headers} from 'angular2/http';
import {StaticProperties} from '../app';
import {CollectionsComponent} from '../components/collections.component';

@Injectable()
export class __LoadFilters {
    constructor (private http?: Http) {}
    request (intagChoices?: string) {
        let params = new URLSearchParams();
        params.set('api_key', StaticProperties.API_KEY);
        params.set('market_region', StaticProperties.market_region.toString());
        if (intagChoices)
            params.set('intag_choices', intagChoices);

        let options = new RequestOptions({
            method: RequestMethod.Get,
            url: StaticProperties.URL + '/api/public/v1/collections/' + CollectionsComponent.collection + '/intag_choices/',
            search: params
        })

        return this.http.request(new Request(options))
    }
}
