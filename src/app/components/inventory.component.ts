import { Component, Output } from '@angular/core';
import { ITEMS } from '../constants';
import { Subject } from 'rxjs';
import { CartAction } from '../models';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {

  @Output()
  onItemSelection = new Subject<CartAction>();

  items = ITEMS;

  inc(i:number){
    const action: CartAction={
      item: this.items[i],
      quantity: 1
    }
    this.onItemSelection.next(action);
  }

  dec(i:number){
    const action: CartAction={
      item: this.items[i],
      quantity: -1
    }
    this.onItemSelection.next(action);
  }

}
