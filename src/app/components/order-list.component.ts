import { Component, Input, Output } from '@angular/core';
import { Order } from '../models';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent {

  @Input()
  orders: Order[] = []

  @Output()
  onSelectedOrder = new Subject<Order>()

  
  selected(i: number) {
    this.onSelectedOrder.next(this.orders[i])
  }

}
