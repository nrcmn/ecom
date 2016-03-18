import {Injectable, Component} from 'angular2/core';
import {Router} from 'angular2/router';

@Component({
    selector: 'navigation',
    templateUrl: '../templates/navigation.html'
})
export class NavigationComponent {
    private showNavigation: boolean = false; // @view_model init show or hide rule for navigation block
    private backButton: string = 'none'; // @view_model init display style for back button
    private toMain: string = 'none'; // @view_model init display style for to main page button

    static history: Array<string> = new Array(); // static variable with histories;

    constructor (private router?: Router) {
        this.router.subscribe(val => {
            NavigationComponent.history.push(val);

            if (val == '' || val == 'slidebox') {
                NavigationComponent.history = new Array();
                this.showNavigation = false;
                this.backButton = 'none';
                this.toMain = 'none';
            }
            else if (val == 'collections') {
                this.showNavigation = true;
                this.backButton = 'block';
                this.toMain = 'none';
            }
            else if (NavigationComponent.history.length <= 1) {
                this.showNavigation = true;
                this.backButton = 'none';
                this.toMain = 'block';
            }
            else {
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
