import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from './app.settings';
import { HttpClient } from '@angular/common/http';
import { IProduct } from './models/product';
import { IPagination } from './models/pagination';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  loading: boolean = false;
  public settings: Settings;
  products: IProduct[];

  constructor(public appSettings:AppSettings, public router: Router,
    private http: HttpClient){
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
   // this.router.navigate(['']);  //redirect other pages to homepage on browser refresh    
   this.http.get('https://localhost:44373/api/products?pageSize=50').subscribe((
     response: IPagination) => {
    this.products = response.data;
   }, error => {
    console.log(error);
   });
  }

  ngAfterViewInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
          window.scrollTo(0,0);
      }
    })  
  }
}
