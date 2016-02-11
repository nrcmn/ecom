import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'my-app',
    template: `
        <h1>Component Router</h1>
        <nav>
            <a [routerLink]="['CrisisCenter']">Crisis Center</a>
            <a [routerLink]="['Heroes']">Heroes</a>
        </nav>
        <router-outlet></router-outlet>
    `,
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    {path:'/crisis-center', name: 'CrisisCenter', component: AppComponent},
])

export class AppComponent { }
