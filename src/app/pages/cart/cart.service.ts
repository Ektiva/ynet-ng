import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ICart, ICartItem, Cart, ICartTotals } from 'src/app/shared/models/cart';
import { map } from 'rxjs/operators';
import { IProduct } from '../../app.models';
import { IDeliveryMethod } from 'src/app/shared/models/deliveryMethod';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseUrl = environment.apiUrl;
  private cartSource = new BehaviorSubject<ICart>(null);
  cart$ = this.cartSource.asObservable();
  private cartTotalSource = new BehaviorSubject<ICartTotals>(null);
  cartTotal$ = this.cartTotalSource.asObservable();
  shipping = 0;
  changed: boolean;

  constructor(
    public snackBar: MatSnackBar,
    private http: HttpClient
    ) { }

  createPaymentIntent() {
    return this.http.post(this.baseUrl + 'payments/' + this.getCurrentCartValue().id, {})
      .pipe(
        map((cart: ICart) => {
          this.cartSource.next(cart);
        })
      );
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.shipping = deliveryMethod.price;
    const cart = this.getCurrentCartValue();
    cart.deliveryMethodId = deliveryMethod.id;
    cart.shippingPrice = deliveryMethod.price;
    this.calculateTotals();
    this.setCart(cart);
  }

  getCart(id: string) {
    return this.http.get(this.baseUrl + 'basket1?id=' + id)
      .pipe(
        map((cart: ICart) => {
          this.cartSource.next(cart);
          this.shipping = cart.shippingPrice;
          this.calculateTotals();
        })
      );
  }

  setCart(cart: ICart) {
    return this.http.post(this.baseUrl + 'basket1', cart).subscribe((response: ICart) => {
      this.cartSource.next(response);
      this.calculateTotals();
    }, error => {
      console.log(error);
    });
  }

  getCurrentCartValue() {
    return this.cartSource.value;
  }

  addItemToCart(item: IProduct, quantity = 1) {
    let message, status;
    const itemToAdd: ICartItem = this.mapProductItemToCartItem(item, quantity);
    let cart = this.getCurrentCartValue();
    if (cart === null) {
      cart = this.createCart();
     
    }
    const prevItems = cart.items;
    cart.items = this.addOrUpdateItem(cart.items, itemToAdd, quantity);
    if(this.changed){
      this.setCart(cart);
      message = 'The product ' + item.name + ' has been added to cart.'; 
      status = 'success';
      this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
    }
  }

  incrementItemQuantity(item: ICartItem) { 
    const cart = this.getCurrentCartValue();
    const foundItemIndex = cart.items.findIndex(x => x.id === item.id);
    if(cart.items[foundItemIndex].availibilityCount > cart.items[foundItemIndex].quantity){ 
      cart.items[foundItemIndex].quantity++;
      this.setCart(cart);
    }else{
      this.snackBar.open('You can not choose more items than available. In stock ' + cart.items[foundItemIndex].availibilityCount + ' items.', '×', 
        { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
    }
  }

  decrementItemQuantity(item: ICartItem) {
    const cart = this.getCurrentCartValue();
    const foundItemIndex = cart.items.findIndex(x => x.id === item.id);
    if (cart.items[foundItemIndex].quantity > 1) {
      cart.items[foundItemIndex].quantity--;
      this.setCart(cart);
    } else {
      this.removeItemFromCart(item);
    }
  }

  removeItemFromCart(item: ICartItem) {
    const cart = this.getCurrentCartValue();
    if (cart.items.some(x => x.id === item.id)) {
      cart.items = cart.items.filter(i => i.id !== item.id);
      if (cart.items.length > 0) {
        this.setCart(cart);
      } else {
        this.deleteCart(cart);
      }
    }
  }

  deleteLocalCart(id: string) {
    this.cartSource.next(null);
    this.cartTotalSource.next(null);
    localStorage.removeItem('cart_id');
  }

  deleteCart(cart: ICart) {
    return this.http.delete(this.baseUrl + 'basket1?id=' + cart.id).subscribe(() => {
      this.cartSource.next(null);
      this.cartTotalSource.next(null);
      localStorage.removeItem('cart_id');
    }, error => {
      console.log(error);
    });
  }

  private calculateTotals() {
    const cart = this.getCurrentCartValue();
    const shipping = this.shipping;
    const subtotal = cart.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subtotal + shipping;
    const totalItem = cart.items.reduce((a, b) => (b.quantity) + a, 0);
    this.cartTotalSource.next({shipping, total, subtotal, totalItem});
  }

  private addOrUpdateItem(items: ICartItem[], itemToAdd: ICartItem, quantity: number): ICartItem[] {
    const index = items.findIndex(i => i.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
      this.changed = true;
    } else {
      items[index].quantity += quantity;
      if(items[index].quantity > items[index].availibilityCount){
        items[index].quantity -= quantity;
        this.changed = false;
        this.snackBar.open('You can not add more items than available. In stock ' + items[index].availibilityCount + ' items and you already added ' + items[index].quantity + ' item to your cart', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        return items;
      }else{
        this.changed = true;
      }
    }
    return items;
  }

  private createCart(): ICart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }

  public mapProductItemToCartItem(item: IProduct, quantity: number): ICartItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.newPrice,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.brandName,
      category: item.categoryName,
      availibilityCount: item.availibilityCount,
      ratingsCount: item.ratingsCount,
      ratingsValue: item.ratingsValue,
      cartCount: item.cartCount,
      weight: item.weight
    };
  }
}
