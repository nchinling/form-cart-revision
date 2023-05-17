import { Component, ViewChild } from '@angular/core';
import { CartItem, CartAction, Order, Customer } from './models';
import { FormComponent } from './components/form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'form-cart-revision';

  cart:CartItem[] = []
  orders: Order[] =[]
  order!:Order
  customer!: Customer

  //@ViewChild(TaskComponent)
  @ViewChild('form')
  formComp!: FormComponent

    ngAfterViewInit(): void {
      console.info('>>. onAfterViewInit: ', this.formComp)
      // Performing manual attribute binding
      //setter method is in task component
      this.formComp.value = this.customer
      //alerted to changes in @Output at task component
      this.formComp.onNewCustomer.subscribe(
        (event: Customer ) => {
          console.info('new customer: ', event)
          //call placeNewOrder method. Codes are below.
          this.placeNewOrder(event, this.cart)
        }
      )
      
      
  }

  process(action: CartAction){
    //Determine if it's existing item. 'i' is the found item
    //Iterate through each item in the cart
    let foundItem = this.cart.find(item => item.item == action.item);

    //for increment
    if (action.quantity > 0){
      //if item doesn't exist in cart
      if(!foundItem){
        /*
        let newItem: CartItem = {...action}
        {item: action.item, quantity: action.quantity}
        */
        this.cart.push({...action} as CartItem);
      } 
      //else add quantity to item quantity in cart. 
      else {
        foundItem.quantity += action.quantity;
      }
    }

    //for decrement ie. action.quantity < 0
    else{
      if(foundItem){
        foundItem.quantity += action.quantity;
        // If the quantity of i is now zero or less, remove it from the cart
        if (foundItem.quantity <= 0) {
          this.cart.splice(this.cart.indexOf(foundItem), 1);
        }
      }

    }
    console.info('cart:', this.cart);

  }

  placeNewOrder(cust: Customer, cart:CartItem[]) {
    const newOrder: Order = {
      customer: cust,
      cartItem: cart
    };
  
    this.orders.push(newOrder);
    this.cart = [];
    console.info('>>>>new order: ', newOrder)
  }

  selectedOrder(order: Order) {
    this.order = order
    console.info('>> selected Order: ', this.order)
    const cust = this.order.customer
    const cartItem = this.order.cartItem
    console.info('>> selected Customer: ', cust)
    console.info('>> selected cartItem: ', cartItem)
    this.customer = cust
    this.cart = cartItem

  }

  editOrder(order: Order){

  }

  deleteOrder() {
    const name = this.formComp.customerForm.get('name')?.value;
  
    if (name !== null) {
      const index = this.orders.findIndex(order => order.customer.name === name);
      if (index !== -1) {
        const deletedOrder = this.orders.splice(index, 1)[0];
        console.info('>>> Order deleted:', deletedOrder);
        this.formComp.customerForm.reset(); // Clear the form values
      }
    } else {
      console.log('>>> It is null');
    }
  }


}
