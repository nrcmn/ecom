import {Injectable, Component} from 'angular2/core';
import {Router} from 'angular2/router';

@Component({
    selector: 'navigation',
    templateUrl: '../templates/navigation.html'
})
export class NavigationComponent {
    private showNavigation: boolean = false; // @view_model init show or hide rule for navigation block
    private backButton: string; // @view_model init display style for back button
    private toMain: string; // @view_model init display style for to main page button

    constructor (private router?: Router) {
        this.router.subscribe(val => {
            switch (val) {
                case '':
                    this.showNavigation = false;
                    this.backButton = 'none';
                    this.toMain = 'none';
                    break;
                case 'collections':
                    this.showNavigation = true;
                    this.backButton = 'block';
                    this.toMain = 'none';
                    break;
                default:
                    this.showNavigation = true;
                    this.backButton = 'block';
                    this.toMain = 'block';
            }
        })
    }

    backButtonEvent () {
        history.back();
    }

    toMainButtonEvent () {
        this.router.navigate(['Main']);
    }
}
