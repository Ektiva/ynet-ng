import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-only-rating',
  templateUrl: './only-rating.component.html',
  styleUrls: ['./only-rating.component.scss']
})
export class OnlyRatingComponent {
  @Input() ratingsCount:number;
  @Input() ratingsValue:number;
  @Input() direction:string;
  avg:number;
  stars:Array<string>;
  constructor() { }

  ngDoCheck() {
    if(this.ratingsCount && this.ratingsValue && !this.avg) {
      this.calculateAvgValue();      
    }
  }

  rate(value){
    // value = (value + 1)*20;
    // this.ratingsCount++;
    // this.ratingsValue = this.ratingsValue + value;
    // this.calculateAvgValue();
  }

  calculateAvgValue(){
    this.avg = this.ratingsValue / this.ratingsCount;
    switch (true) {
      case this.avg == 1 : {
        this.stars = ['star', 'star_border', 'star_border', 'star_border', 'star_border'];
        break;
    } 
      case this.avg > 1 && this.avg < 2 : {
          this.stars = ['star', 'star_half', 'star_border', 'star_border', 'star_border'];
          break;
      }      
      case this.avg == 2 : {
          this.stars = ['star', 'star', 'star_border', 'star_border', 'star_border'];
          break;
      }      
      case this.avg > 2 && this.avg < 3 : {
          this.stars = ['star', 'star', 'star_half', 'star_border', 'star_border'];
          break;
      }      
      case this.avg == 3 : {
        this.stars = ['star', 'star', 'star', 'star_border', 'star_border'];
          break;
      } 
      case this.avg > 3 && this.avg < 4 : {
          this.stars = ['star', 'star', 'star', 'star_half', 'star_border'];
          break;
      }
      case this.avg == 4 : {
          this.stars = ['star', 'star', 'star', 'star', 'star_border'];
          break;
      }
      case this.avg > 4 && this.avg < 5 : {
          this.stars = ['star', 'star', 'star', 'star', 'star_half'];
          break;
      }
      case this.avg == 5 : {
          this.stars = ['star', 'star', 'star', 'star', 'star'];
          break;
      } 
      default: {
          this.stars = ['star_border', 'star_border', 'star_border', 'star_border', 'star_border'];
          break;
      }
    }
  }

}
