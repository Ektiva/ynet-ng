import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent {

  @Input() categories;
  @Input() categoryParentId;
  @Input() categoryUp;
  @Output() change: EventEmitter<any> = new EventEmitter();

  public categorySelected: number;

  // @Output() click  = new EventEmitter();
  mainCategories;

  constructor(public appService:AppService) { }

  public ngDoCheck() {
    if(this.categories && !this.mainCategories) {
      this.mainCategories = this.categories.filter(category => category.parentId == this.categoryParentId); 
    }
  }

  public stopClickPropagate(event: any){
    if(window.innerWidth < 960){
      event.stopPropagation();
      event.preventDefault();
    }    
  }

  public changeCategory(event){
    this.change.emit(event);
    if(event.target){
      if(event.target.innerText.toLowerCase() === 'all categories'){
        this.categorySelected = 0;
      }else{
        var keepGoing = true;
        this.categories.forEach(cat => {
          if(keepGoing){
            if (cat.name.toLowerCase() === event.target.innerText.toLowerCase()) {
              this.categorySelected = cat.id;
              keepGoing = false;
            }
          }
        });
      }  
    }    
    this.appService.changeCategory(event.target.innerText);
  }

}