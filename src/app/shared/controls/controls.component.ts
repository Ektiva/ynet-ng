import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data, AppService } from '../../app.service';
import { Product, IProduct } from '../../app.models';
import { CartService } from 'src/app/pages/cart/cart.service';
import { Observable } from 'rxjs';
import { ICartTotals, ICart, ICartItem } from '../models/cart';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {
  @Input() product: IProduct;
  @Input() type: string;
  @Output() onOpenProductDialog: EventEmitter<any> = new EventEmitter();
  @Output() onQuantityChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() quantity: number;
  public count:number = 1;
  public align = 'center center';

  cart$: Observable<ICart>;
  cartTotals$: Observable<ICartTotals>;
  // @Input() productx: IProduct;

  constructor(
    public appService:AppService,
    public snackBar: MatSnackBar,
    public cartService:CartService,
    ) { }

  ngOnInit() {
    if(this.product){
      if(this.product.cartCount > 0){
        this.count = this.product.cartCount;
      }
    }
    this.layoutAlign();
    this.cart$ = this.cartService.cart$;
    this.cartTotals$ = this.cartService.cartTotal$;
  }

  public layoutAlign(){
    if(this.type === 'all'){
      this.align = 'space-between center';
    }
    else if(this.type === 'wish'){
      this.align = 'start center';
    }
    else{
      this.align = 'center center';
    }
  }



  public increment(quantity){
    if(this.quantity < this.product.availibilityCount){
      this.quantity++;
      // this.count++;
      // let obj = {
      //   productId: this.product.id,
      //   soldQuantity: this.count,
      //   total: this.count * this.product.newPrice
      // }
      // this.changeQuantity(obj);
    }
    else{
      this.snackBar.open('You can not choose more items than available. In stock ' + this.product.availibilityCount +
        ' items.', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
    }
  }

  public decrement(quantity){
    // if(this.count > 1){
    //   this.count--;
    //   let obj = {
    //     productId: this.product.id,
    //     soldQuantity: this.count,
    //     total: this.count * this.product.newPrice
    //   }
    //   this.changeQuantity(obj);
    // }
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  public addToCompare(product:Product){
    this.appService.addToCompare(product);
  }

  public addToWishList(product:Product){
    this.appService.addToWishList(product);
  }

  public addToCart(product:Product){
    // let currentProduct = this.appService.Data.cartList.filter(item=>item.id == product.id)[0];
    // if(currentProduct){
    //   if((currentProduct.cartCount + this.count) <= this.product.availibilityCount){
    //     product.cartCount = currentProduct.cartCount + this.count;
    //   }
    //   else{
    //     this.snackBar.open('You can not add more items than available. In stock ' + this.product.availibilityCount + ' items and you already added ' + currentProduct.cartCount + ' item to your cart', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
    //     return false;
    //   }
    // }
    // else{
    //   product.cartCount = this.count;
    // }
    // this.appService.addToCart(product);
    // let currentProduct = this.cart$.filter(item=>item.id == product.id)[0];
    this.appService.addToCart(product);

  }

  addItemToCart(product) {
    // let currentCart;
    // this.cart$.subscribe({
    //   next(cart) {
    //     // console.log('Current Cart: ', cart);
    //     currentCart = cart;
    //   },
    //   error(msg) {
    //     console.log('Error Getting Cart: ', msg);
    //   }
    // });
    // if (currentCart !== null) {
    //   const foundItemIndex = currentCart.items.findIndex(x => x.id === product.id);
    //   if(foundItemIndex !== -1){
    //     let currentProduct = currentCart.items[foundItemIndex];
    //     // console.log('Add to cart existing quntity '+currentProduct.quantity);
    //     console.log('Add to cart availibility '+this.product.availibilityCount);
    //     if(currentProduct.quantity <= this.product.availibilityCount){
    //       console.log('Current product quantity '+currentProduct.quantity);
    //       currentProduct.quantity += currentProduct.quantity;
    //       console.log('Add to cart new quantity Found and less than available '+qty);
    //     }
    //     else{
    //       this.snackBar.open('You can not add more items than available. In stock ' + this.product.availibilityCount + ' items and you already added ' + currentProduct.quantity + ' item to your cart', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
    //       return false;
    //     }
    //   }
    //   else{
    //     currentProduct.quantity++;
    //     console.log('Add to cart new quantity Not Found '+qty);
    //   }
    // }else{
    //   qty++;
    //   console.log('Add to cart new quantity Empty Cart '+qty);
    // }
    // const itemToAdd: ICartItem = this.cartService.mapProductItemToCartItem(item, quantity);
    this.cartService.addItemToCart(product, this.quantity);
  }
  public openProductDialog(event){
    this.onOpenProductDialog.emit(event);
  }

  public changeQuantity(value){
      this.onQuantityChange.emit(value);
  }

}