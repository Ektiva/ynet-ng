import { Component, OnInit, Input} from '@angular/core';
import { Category, IProduct, CategoryLevel } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { ShopParams } from 'src/app/shared/models/ShopParams';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public categoriesLevel:CategoryLevel;
  public categoryLevel1:Category[];
  public categoryLevel2:Category[];
  public categoryLevel3:Category[];

  public category:Category;
  public products: Array<IProduct> = [];
  public categorySelected: number;
  public categoryNameSelected = 'All Categories';
  public page:any;
  shopParams = new ShopParams();
  totalCount: number;
  router: any;
  
  constructor(public appService:AppService) { }

  ngOnInit() {
    this.getCategoryLevel(2);
    this.getCategoryLevel(3);
    this.getCategoryLevel(4);
    this.appService.currentCategory.subscribe(category => this.categoryNameSelected = category);
   }

   public getCategoryLevel(level){  
    this.appService.getCategoryLevel(level).subscribe(data => {
      if(level === 2){
        this.categoryLevel1 = data;
      } else if(level === 3){
        this.categoryLevel2 = data;
      } else if(level === 4){
        this.categoryLevel3 = data;
      }
    }, error => {
      console.log(error);
    });

  }

    // public changeCategory(event){
    //   if(event.target){
    //     this.category = this.categories.filter(category => category.name == event.target.innerText)[0];
    //     this.categoryNameSelected = event.target.innerText.toLowerCase();
    //     if(event.target.innerText.toLowerCase() === 'all categories'){
    //       this.shopParams.CategoryId = 0;
    //     }else{
    //       var keepGoing = true;
    //       this.categories.forEach(cat => {
    //         if(keepGoing){
    //           if (cat.name.toLowerCase() === event.target.innerText.toLowerCase()) {
    //             this.shopParams.CategoryId = cat.id;
    //             keepGoing = false;
    //           }
    //         }
    //       });
    //     }  
    //   }
      
    //   this.appService.changeCategory(event.target.innerText);
    //   this.appService.changeShopParams(this.shopParams);
    //   this.page = 1;
    //   this.appService.changePage(this.page);
    //   // this.getItems();
    //   this.getItems().subscribe(res => {
    //     this.appService.changeProducts(res.data);
    //     this.appService.changeTotalCount(this.totalCount);
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

  openMegaMenu(){
    let pane = document.getElementsByClassName('cdk-overlay-pane');
    [].forEach.call(pane, function (el) {
        if(el.children.length > 0){
          if(el.children[0].classList.contains('mega-menu')){
            el.classList.add('mega-menu-pane');
          }
        }        
    });
  }

}
