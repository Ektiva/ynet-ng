import { Component, OnInit, HostListener, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core'; 
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from '../app.settings';
import { AppService } from '../app.service';
import { Category, Product, IProduct } from '../app.models';
import { SidenavMenuService } from '../theme/components/sidenav-menu/sidenav-menu.service';
import { ShopParams } from '../shared/models/ShopParams';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  providers: [ SidenavMenuService ]
})
export class PagesComponent implements OnInit {

  @ViewChild('search', {static: true}) searchTerm: ElementRef;
  
  public products: Array<IProduct> = [];
  public categorySelected: number;
  public categoryNameSelected = 'All Categories';
  public page:any;
  shopParams = new ShopParams();
  totalCount: number;

  public showBackToTop:boolean = false; 
  public categories:Category[];
  public category:Category;
  public sidenavMenuItems:Array<any>;
  @ViewChild('sidenav', { static: true }) sidenav:any;

  

  public settings: Settings;
  constructor(public appSettings:AppSettings, 
              public appService:AppService, 
              public sidenavMenuService:SidenavMenuService,
              public router:Router) { 
    this.settings = this.appSettings.settings; 
  }
  
  ngOnInit() {
    this.getCategories();
    this.appService.currentCategory.subscribe(category => this.categoryNameSelected = category);
    // this.getItems();
    this.sidenavMenuItems = this.sidenavMenuService.getSidenavMenuItems();
  } 

  

  public getCategories(){    
    this.appService.getCategories().subscribe(data => {
      this.categories = data;
      this.category = data[0];
      this.appService.Data.categories = data;
    })
  }

  public changeCategory(event){
    if(event.target){
      this.category = this.categories.filter(category => category.name == event.target.innerText)[0];
      this.categoryNameSelected = event.target.innerText.toLowerCase();
      if(event.target.innerText.toLowerCase() === 'all categories'){
        this.shopParams.CategoryId = 0;
      }else{
        var keepGoing = true;
        this.categories.forEach(cat => {
          if(keepGoing){
            if (cat.name.toLowerCase() === event.target.innerText.toLowerCase()) {
              this.shopParams.CategoryId = cat.id;
              keepGoing = false;
            }
          }
        });
      }  
    }
    
    this.appService.changeCategory(event.target.innerText);
    this.appService.changeShopParams(this.shopParams);
    this.page = 1;
    this.appService.changePage(this.page);
    // this.getItems();
    this.getItems().subscribe(res => {
      this.appService.changeProducts(res.data);
      this.appService.changeTotalCount(this.totalCount);
    });
    if(window.innerWidth < 960){
      this.stopClickPropagate(event);
    } 
  }

  public remove(product) {
      const index: number = this.appService.Data.cartList.indexOf(product);
      if (index !== -1) {
          this.appService.Data.cartList.splice(index, 1);
          this.appService.Data.totalPrice = this.appService.Data.totalPrice - product.newPrice*product.cartCount;
          this.appService.Data.totalCartCount = this.appService.Data.totalCartCount - product.cartCount;
          this.appService.resetProductCartCount(product);
      }        
  }

  public clear(){
    this.appService.Data.cartList.forEach(product=>{
      this.appService.resetProductCartCount(product);
    });
    this.appService.Data.cartList.length = 0;
    this.appService.Data.totalPrice = 0;
    this.appService.Data.totalCartCount = 0;
  }
 

  public changeTheme(theme){
    this.settings.theme = theme;       
  }

  public stopClickPropagate(event: any){
    event.stopPropagation();
    event.preventDefault();
  }

  public search(){}

 
  public scrollToTop(){
    var scrollDuration = 200;
    var scrollStep = -window.pageYOffset  / (scrollDuration / 20);
    var scrollInterval = setInterval(()=>{
      if(window.pageYOffset != 0){
         window.scrollBy(0, scrollStep);
      }
      else{
        clearInterval(scrollInterval); 
      }
    },10);
    if(window.innerWidth <= 768){
      setTimeout(() => { window.scrollTo(0,0) });
    }
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    ($event.target.documentElement.scrollTop > 300) ? this.showBackToTop = true : this.showBackToTop = false;  
  }

  ngAfterViewInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) { 
        this.sidenav.close(); 
      }                
    });
    this.sidenavMenuService.expandActiveSubMenu(this.sidenavMenuService.getSidenavMenuItems());
  }

  public closeSubMenus(){
    if(window.innerWidth < 960){
      this.sidenavMenuService.closeAllSubMenus();
    }    
  }

  // getItems(/*useCache = false*/) {
  //   this.router.navigate(['/products', this.categoryNameSelected]);
  //   this.appService.getItems(this.shopParams).subscribe(response => {
  //     this.products = response.data;
  //     this.appService.changeProducts(this.products);
  //     this.products.forEach(function (value){
  //       if(value.oldPrice == value.newPrice){
  //         value.oldPrice = null;
  //       }
  //     });
  //     this.shopParams.pageNumber = response.pageIndex;
  //     this.shopParams.pageSize = response.pageSize;
  //     this.totalCount = response.count;
  //   }, error => {
  //     console.log(error);
  //   });
  // }

  getItems() {
    this.router.navigate(['/products', this.categoryNameSelected]);
    return this.appService.getItems(this.shopParams).pipe(tap((response) => {
      this.products = response.data;
      this.products.forEach(function (value){
        if(value.oldPrice == value.newPrice){
          value.oldPrice = null;
        }
      });
      this.shopParams.pageNumber = response.pageIndex;
      this.shopParams.pageSize = response.pageSize;
      this.totalCount = response.count;
    }, error => {
      console.log(error);
    }));   
  }

  onSearch() {
    // const params = this.shopService.getShopParams();
    // params.search = this.searchTerm.nativeElement.value;
    // params.pageNumber = 1;
    // this.shopService.setShopParams(params);
    console.log('I am onSearch');
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.page = 1;

    this.getItems().subscribe(res => {
      this.appService.changeProducts(res.data);
      this.appService.changeTotalCount(this.totalCount);
      this.appService.changePage(this.page);
    });
  }

  onReset() {
    // this.searchTerm.nativeElement.value = '';
    // this.shopParams = new ShopParams();
    // this.shopService.setShopParams(this.shopParams);
    this.searchTerm.nativeElement.value = undefined;
    this.shopParams = new ShopParams();
    this.getItems().subscribe(res => {
      this.appService.changeProducts(res.data);
      this.appService.changeTotalCount(this.totalCount);
    });
  }
}