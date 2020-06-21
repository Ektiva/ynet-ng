import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../../shared/products-carousel/product-dialog/product-dialog.component';
import { AppService } from '../../app.service';
import { Product, Category, IBrand, IProduct } from "../../app.models";
import { Settings, AppSettings } from 'src/app/app.settings';
import { ICategory } from 'src/app/shared/models/category';
import { ShopParams } from "src/app/shared/models/ShopParams";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  // Added by me

  // public productss: Array<IProduct> = [];
  brandss: IBrand[];
  categoriess: ICategory[];
  categoryNameSelected = 'All Categories';
  brandIdSelected: number;
  shopParams = new ShopParams();
  totalCount: number;
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' }
  ];
  // End adding

  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen:boolean = true;
  private sub: any;
  public viewType: string = 'grid';
  public viewCol: number = 25;
  public counts = [12, 24, 36];
  public count:any;
  // public sortings = ['Sort by Default', 'Best match', 'Lowest first', 'Highest first'];
  public sort:any;
  public products: Array<IProduct> = [];
  public categories:Category[];
  public brands: IBrand[];
  public priceFrom: number = 750;
  public priceTo: number = 1599;
  public colors = [
    { name: "#5C6BC0", selected: false },
    { name: "#66BB6A", selected: false },
    { name: "#EF5350", selected: false },
    { name: "#BA68C8", selected: false },
    { name: "#FF4081", selected: false },
    { name: "#9575CD", selected: false },
    { name: "#90CAF9", selected: false },
    { name: "#B2DFDB", selected: false },
    { name: "#DCE775", selected: false },
    { name: "#FFD740", selected: false },
    { name: "#00E676", selected: false },
    { name: "#FBC02D", selected: false },
    { name: "#FF7043", selected: false },
    { name: "#F5F5F5", selected: false },
    { name: "#696969", selected: false }
  ];
  public sizes = [
    { name: "S", selected: false },
    { name: "M", selected: false },
    { name: "L", selected: false },
    { name: "XL", selected: false },
    { name: "2XL", selected: false },
    { name: "32", selected: false },
    { name: "36", selected: false },
    { name: "38", selected: false },
    { name: "46", selected: false },
    { name: "52", selected: false },
    { name: "13.3\"", selected: false },
    { name: "15.4\"", selected: false },
    { name: "17\"", selected: false },
    { name: "21\"", selected: false },
    { name: "23.4\"", selected: false }
  ]; 
  public page:any;
  public settings: Settings;
  constructor(public appSettings:AppSettings, 
              private activatedRoute: ActivatedRoute, 
              public appService:AppService, 
              public dialog: MatDialog, 
              private router: Router
              ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.count = this.counts[0];
    this.sort = this.sortOptions[0].name;
    this.sub = this.activatedRoute.params.subscribe(params => {
      //console.log(params['name']);
    });
    if(window.innerWidth < 960){
      this.sidenavOpen = false;
    };
    if(window.innerWidth < 1280){
      this.viewCol = 33.3;
    };
    // this.getAllProducts();

    // Added by me
    this.getItems();
    this.getBrandss();
    this.getCategories();

    this.appService.currentCategory.subscribe(category => this.categoryNameSelected = category);
    this.appService.currentShopParams.subscribe(shopParams => this.shopParams = shopParams);
    this.appService.currentProducts.subscribe(productss => this.products = productss);
    this.appService.currentTotalCount.subscribe(totalCount => this.totalCount = totalCount);
    this.appService.currentPage.subscribe(page => this.page = page);
    // End adding
  }

  // Added by me
  getItems(/*useCache = false*/) {
    this.router.navigate(['/products', this.categoryNameSelected]);
    this.appService.getItems(this.shopParams).subscribe(response => {
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
    });
    
  }

  getBrandss() {
    this.appService.getBrandss().subscribe(response => {
      this.brands = response /*[{ id: 0, name: 'All' }, ...response]*/;
    }, error => {
      console.log(error);
    });
  }

  public getCategories(){  
    if(this.appService.Data.categories.length == 0) { 
      console.log(this.appService.Data.categories.length);
      this.appService.getCategories().subscribe(data => {
        this.categories = data;
        this.appService.Data.categories = data;
      }, error => {
        console.log(error);
      });
    }
    else{
      this.categories = this.appService.Data.categories;
    }
  }

  onBrandSelected(brandId: number) {
    // const params = this.shopService.getShopParams();
    // params.brandId = brandId;
    // params.pageNumber = 1;
    // this.shopService.setShopParams(params);
    
    const index = this.shopParams.brandId.indexOf(brandId, 0);
    if (index > -1) {
      this.shopParams.brandId.splice(index, 1);
    }else{
      this.shopParams.brandId.push(brandId);
    }
    this.brandIdSelected = brandId;
    this.page = 1;
    this.appService.changeShopParams(this.shopParams);
    this.getItems();
  }

  public onChangeCategory(event){
    if(event.target){
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
        // this.router.navigate(['/products', event.target.innerText.toLowerCase()]);
      }     
    }
    this.appService.changeCategory(event.target.innerText);
    this.appService.changeShopParams(this.shopParams);
    this.getItems();
    this.page = 1;
      console.log('PageChanged category ');
  }

  // onCategorySelected(categoryId: number) {
  //   // const params = this.shopService.getShopParams();
  //   // params.typeId = typeId;
  //   // params.pageNumber = 1;
  //   // this.shopService.setShopParams(params);
  //   this.categoryIdSelected = categoryId;
  //   this.getItems();
  // }

  // public getAllProducts(){
  //   this.appService.getProducts("featured").subscribe(data=>{
  //     this.products = data; 
  //     //for show more product  
  //     for (var index = 0; index < 3; index++) {
  //       this.products = this.products.concat(this.products);        
  //     }
  //   });
  // }

  // public getBrands(){
  //   this.brands = this.appService.getBrands();
  //   this.brands.forEach(brand => { brand.selected = false });
  // }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('window:resize')
  public onWindowResize():void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
    (window.innerWidth < 1280) ? this.viewCol = 33.3 : this.viewCol = 25;
  }

  public changeCount(count){
    this.count = count;
    // this.shopParams.pageSize = count;
    this.appService.changeShopParams(this.shopParams);
    this.getItems();
  }

  public changeSorting(sort){
    this.sort = sort;
    this.appService.changeShopParams(this.shopParams);
  }

  public changeViewType(viewType, viewCol){
    this.viewType = viewType;
    this.viewCol = viewCol;
  }

  public openProductDialog(product){   
    let dialogRef = this.dialog.open(ProductDialogComponent, {
        data: product,
        panelClass: 'product-dialog',
        direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(product => {
      if(product){
        this.router.navigate(['/products', product.id, product.name]); 
      }
    });
  }

  public onPageChanged(event: any){
      this.page = event;
      console.log('PageChanged event = '+event);
      // this.shopParams.pageNumber = event;
      // this.appService.changeShopParams(this.shopParams);
      // this.getItems();
      window.scrollTo(0,0); 
  }

  onSortSelected(sortName: string, sortValue: string) {
    // const params = this.shopService.getShopParams();
    // params.sort = sort;
    // this.shopService.setShopParams(params);
    this.sort = sortName;
    this.shopParams.sort = sortValue;
    this.appService.changeShopParams(this.shopParams);
    this.getItems();
  }

  // onPageChanged(event: any) {
  //   const params = this.shopService.getShopParams();
  //   if (params.pageNumber !== event) {
  //     params.pageNumber = event;
  //     this.shopService.setShopParams(params);
  //     this.getProducts(true);
  //   }
  // }

  // onSearch() {
  //   const params = this.shopService.getShopParams();
  //   params.search = this.searchTerm.nativeElement.value;
  //   params.pageNumber = 1;
  //   this.shopService.setShopParams(params);
  //   this.getProducts();
  // }

  // onReset() {
  //   this.searchTerm.nativeElement.value = '';
  //   this.shopParams = new ShopParams();
  //   this.shopService.setShopParams(this.shopParams);
  //   this.getProducts();
  // }

}
