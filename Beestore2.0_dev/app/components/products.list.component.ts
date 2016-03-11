import {Component} from 'angular2/core';
import {Router} from 'angular2/router';
import {CollectionsComponent, baseProductObject, Filters, FilterChoices, FiltersResults} from './collections.component';

// import services
import {__LoadProductList} from  '../services/product.list.service';
import {__LoadFilters} from '../services/filters.load.service';
declare var skrollr: any; // init universal variable for skrollr library

interface Sorting {
    value: string;
    name: string;
}

@Component({
    selector: 'products-list',
    templateUrl: '../templates/products.list.html',
    providers: [__LoadProductList, __LoadFilters]
})
export class ProductsListComponent {
    public products: baseProductObject[] = CollectionsComponent.productsList; // @view_model init products list to view
    public filters: Filters = CollectionsComponent.filters; // @view_model init filters list to view
    public filterChoices: FilterChoices[]; // @view_model init filter choices list to view

    private page: number = 2; // set page for lazy loading functions
    private sortingArr: Sorting[] = [{value: '-weight', name: 'популярности'}, {value: 'price', name: 'цене: по возрастанию'}, {value: '-price', name: 'цене: по убыванию'}]; // init values for sorting list
    private sortType: string = this.sortingArr[0].value; // set default sort value
    private filtersShow: string = 'none'; // hide filters popup window
    private filterNameIndex: number; // this variable save index of current selected filter

    static product: baseProductObject; // save data for product detail description
    static loadProductsStatus: boolean; // init lazy loading statuses variable
    static sort: string = '-weight'; // set default sort value for other services

    constructor (private _router?: Router, private productsLoader?: __LoadProductList, private filtersLoader?: __LoadFilters) {}

    // Open product detail description function
    openProduct (arg: baseProductObject) {
        ProductsListComponent.product = arg;
        this._router.navigate(['Detail', {id: arg.id}]);
    }

    // Lazyloading function
    onScroll (event: Event) {
        if ((Number(window.pageYOffset.toFixed()) - (document.body.scrollHeight - window.innerHeight) >= -1500) && ProductsListComponent.loadProductsStatus) {
            ProductsListComponent.loadProductsStatus = false;
            this.productsLoader.request(CollectionsComponent.collection, '15', ProductsListComponent.sort, null, this.page.toString()).subscribe(res => {
                ProductsListComponent.loadProductsStatus = true;
                this.page += 1;

                var data = res.json();
                (data.length < 15) ? ProductsListComponent.loadProductsStatus = false : ProductsListComponent.loadProductsStatus = true;

                for(let i=0; i < data.length; i++) {
                    this.products.push(data[i]);
                }
            })
        }
    }

    // Sorting functions
    selectSortType () :void {
        ProductsListComponent.sort = this.sortType;
        this.productsLoader.request(CollectionsComponent.collection, '15', ProductsListComponent.sort).subscribe(res => {
            var data = res.json();
            CollectionsComponent.productsList = data;
            this.products = CollectionsComponent.productsList;
        })
    }

    // Show filters popup window
    filterVisibleFunc () :void {
        if (this.filtersShow == 'none') {
            this.loop(0);
            this.filterChoices = CollectionsComponent.filters.results[0].choices;
            this.filtersShow = 'block';
            document.body.style.overflow = 'hidden';
        }
        else {
            this.filtersShow = 'none';
            document.body.style.overflow = 'scroll';
        }
    }

    // Select filter name (such as - manufacture, size etc.)
    checkFilterName (filter: FiltersResults, i: number) :any {
        this.loop(i);
        return this.filterChoices = CollectionsComponent.filters.results[i].choices, this.filterNameIndex = i;
    }

    // This for loop get list of selected choices and checked them on view
    loop (ind: number) :void {
        for (let i=0; i < CollectionsComponent.filters.results[ind].choices.length; i++) {
            let choice = CollectionsComponent.filters.results[ind].choices[i];
            if (CollectionsComponent.selectedFilterIntagChoices.indexOf(choice.id) > -1) {
                choice.checked = true;
            }
            else {
                choice.checked = false;
            }
        }

        return;
    }


    // Select value in filter and save them in global variable for filtering
    selectFilterChoice (event: any, choice: FilterChoices) :void {
        if (event.target.checked) {
            choice.checked = true;
            CollectionsComponent.selectedFilterIntagChoices.push(choice.id);
            this.filtersLiveConfigure(true);
        }
        else {
            choice.checked = false;
            let removeIndex = CollectionsComponent.selectedFilterIntagChoices.indexOf(choice.id);
            CollectionsComponent.selectedFilterIntagChoices.splice(removeIndex, 1);
            this.filtersLiveConfigure(false);
        }

        // return CollectionsComponent.selectedFilterIntagChoices;
    }

    filtersLiveConfigure (enter: boolean) :void {
        this.filtersLoader.request(CollectionsComponent.selectedFilterIntagChoices.join(',')).subscribe(res => {
            let data = res.json();
            let listOfFilteredIntags = new Array();

            for (let i=0; i < data.results.length; i++) {
                data.results[i].choices.forEach((item, i, arr) => {
                    listOfFilteredIntags.push(item.id)
                })
            }

            for (let i=0; i < this.filters.results.length; i++) {
                if (i == this.filterNameIndex && enter) {
                    continue
                }

                this.filters.results[i].choices.forEach((item, index, arr) => {
                    if (listOfFilteredIntags.indexOf(this.filters.results[i].choices[index].id) < 0) {
                        this.filters.results[i].choices[index].checked = false;
                        this.filters.results[i].choices[index].disable = true;


                        // CollectionsComponent.selectedFilterIntagChoices.splice(CollectionsComponent.selectedFilterIntagChoices.indexOf(this.filters.results[i].choices[index].id), 1);
                    }
                    else {
                        this.filters.results[i].choices[index].disable = false;
                    }
                })
            }
        })
    }

    // Filter data and load filtered products list
    filtering () :void {}

    // Cancel all changes in filters popup
    cancel () :void {
        CollectionsComponent.selectedFilterIntagChoices = new Array();
        for (let i=0; i < this.filters.results.length; i++) {
            this.filters.results[i].choices.forEach((item, index, arr) => {
                item.disable = false;
                item.checked = false;
            })
        }
    }
}
