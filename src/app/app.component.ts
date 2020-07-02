import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from './app.settings';
import { CartService } from './pages/cart/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  loading: boolean = false;
  public settings: Settings;

  constructor(
    public appSettings:AppSettings, 
    public router: Router,
    private cartService: CartService
    ){
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
   // this.router.navigate(['']);  //redirect other pages to homepage on browser refresh    
    this.loadCart();
    // this.loadCurrentUser();
  }

  ngAfterViewInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
          window.scrollTo(0,0);
      }
    })  
  }

  // loadCurrentUser() {
  //   const token = localStorage.getItem('token');
  //   this.accountService.loadCurrentUser(token).subscribe(() => {
  //     console.log('loaded user');
  //   }, error => {
  //     console.log(error);
  //   });
  // }

  loadCart() {
    const cartId = localStorage.getItem('cart_id');
    if (cartId) {
      this.cartService.getCart(cartId).subscribe(() => {
        console.log('initialised cart');
      }, error => {
        console.log(error);
      });
    }
  }
}
