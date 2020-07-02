import { Component, OnInit, Input } from '@angular/core';
import { CartService } from 'src/app/pages/cart/cart.service';
import { Observable } from 'rxjs';
import { ICartTotals } from '../../models/cart';

@Component({
  selector: 'app-order-totals',
  templateUrl: './order-totals.component.html',
  styleUrls: ['./order-totals.component.scss']
})
export class OrderTotalsComponent implements OnInit {
  @Input() shippingPrice: number;
  @Input() subtotal: number;
  @Input() total: number;
  @Input() totalItem: number;
  cartTotals$: Observable<ICartTotals>;
  constructor(
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.cartTotals$ = this.cartService.cartTotal$;
  }

}
