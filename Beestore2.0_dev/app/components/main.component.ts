import {Component, Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {Router} from 'angular2/router';
import {Value} from '../app.ts';

import {__LoadCollections} from '../services/collections.service';
import {arrayCutTop, arrayCutBottom} from '../services/filters';

export interface collectionObjectMap {
    name: string;
    order: number;
    id: number;
    img?: string;
    image?: string;
    parent?: number;
}

class unacceptableCategories {
    public unacceptableCategoriesArray: Array<number> = [6, 5, 4, 101, 15, 202, 23, 24, 164, 78, 80, 79, 166, 162, 165, 71, 70, 77, 122, 121, 182, 93, 86, 85, 90, 87, 163];
}


@Component({
    selector: 'main',
    templateUrl: '../templates/main.html',
    providers: [__LoadCollections],
    pipes: [arrayCutTop, arrayCutBottom]
})

export class MainComponent extends unacceptableCategories {
    private categories = new Value().array;
    private data: any;

    static mainSection: collectionObjectMap;
    static collections: Object = {};

    private foo: Object = {}

    constructor (private sample?: __LoadCollections, private _router?: Router) {
        super();

        if (Object.keys(MainComponent.collections).length == 0) {
            this.sample.request().subscribe(res => {
                var data = res.json();
                MainComponent.collections['main'] = [];
                MainComponent.collections['sub'] = [];

                for(let i in data) {
                    if (this.unacceptableCategoriesArray.indexOf(data[i].id) > -1) {
                        continue
                    }
                    else if (!data[i].parent) {
                        MainComponent.collections['main'].push(data[i]);
                    }
                    else if (data[i].parent) {
                        MainComponent.collections['sub'].push(data[i]);
                    }
                }
            })
        }
    }

    showMe (arg: collectionObjectMap) {
        MainComponent.mainSection = arg;
        this._router.navigate(['Collections']);
    }
}
