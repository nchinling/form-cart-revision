import { Component, Input, Output, SimpleChanges, inject } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Customer, Order, Payment } from '../models';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
   //var. all members must be initialised in typescript. 
  //cannot put null as it is its own type.  
  //'!' means is a shorthand to indicate no value at the moment.
  customerForm!: FormGroup
  primaryPayment!: FormGroup
  paymentArray!: FormArray
  
  @Input()
  customer: Customer| null = null

  //@Autorwire
  fb:FormBuilder = inject(FormBuilder)


  @Output()
  onNewCustomer = new Subject<Customer>()

  ngOnInit(): void{
    console.info('>>>Form Component initialising')
     //call the form
    // this.customerForm = this.createForm()

    //with form builder (day32, pg8)
    this.customerForm = this.createFormWithFormBuilder(this.customer)

    // to retrieve info form from browser storage if it exists
    // or sessionStorage
    // code below is just to display at console

    const data = localStorage.getItem('customer')
    if(!!data){
      this.customer = JSON.parse(data);
      console.info('>> customer from storage', this.customer)
    }
   
  }

  ngOnChanges(changes: SimpleChanges): void {
    const c = changes['customer']
    if (c.firstChange)
      return
    this.customerForm = this.createFormWithFormBuilder(c.currentValue as Customer);
  }

  processForm(){
    const customer: Customer = this.customerForm.value;
    console.info('>>Processing form: ', customer);
    //store in browser db. 
    localStorage.setItem('friend', JSON.stringify(customer))
    this.onNewCustomer.next(customer)
    this.customerForm.reset();
  }

  // .dirty is used to prevent invalid messages from appearing 
  //before user has typed anything
  invalidField(ctrlName:string): boolean{
    return !!((this.customerForm.get(ctrlName)?.invalid && this.customerForm.get(ctrlName)?.dirty))
    // return !!(this.customerForm.get(ctrlName)?.invalid)
  }

  invalidCardField(ctrlName: string): boolean {
    const formControl = this.customerForm.get(ctrlName);
  
    const isInvalid = formControl?.invalid && formControl?.dirty;
    const isCardNumberInvalid = formControl ? FormComponent.cardNumberValidator(formControl) : false;
  
    return !!(isInvalid && isCardNumberInvalid);
  }

  //to add empty fields into the array
  addAPayment(){
    //create a group and push it into array
    // const arr = this.customerForm.get('facts') as FormArray
    this.paymentArray.push(
      this.createPaymentMethod(null)
     
    )
  }

  private createMorePayments(otherPaymentMethods: Payment[]): FormArray {
    console.info('>>> Other Payment methods: ',otherPaymentMethods )
    return this.fb.array(
      otherPaymentMethods.map(p => this.createPaymentMethod(p))
      
    )
  }
  private createPayment(p: Payment | null): FormGroup {
    console.info('>>> payment: ',p )
    return this.fb.group({
      nums: this.fb.control<string>(!!p? p.nums: ''),
      altProvider: this.fb.control<string>(!!p? p.altProvider: '')
    
    })
  }

  //initialise empty row
  //use Validators.required too since shouldn't be empty
  private createPaymentMethod(p: Payment | null):FormGroup{
    console.info('>>> payment: ',p )
    return this.fb.group({
      nums: this.fb.control<string>(!!p? p.nums:''),
      altProvider: this.fb.control<string>(!!p? p.altProvider:'', [Validators.minLength(1)])
      // nums: this.fb.control<string>(''),
      // altProviders: this.fb.control<string>('')
    })
  }

  removePaymentMethod(i:number){
    this.paymentArray.removeAt(i)
  }

  //overall form is invalid if any fields are invalid or there are no entry rows
  // if return true, submit button will be disabled
  invalidForm() {
    return this.customerForm.invalid 
  }

  //method 1
  private createFormWithFormBuilder(c:Customer|null): FormGroup{
    // this.paymentArray=this.fb.array(!!c?c.otherPaymentMethods:[])
    this.paymentArray=this.createMorePayments(!!c?c.otherPaymentMethods:[])
    this.primaryPayment = this.fb.group({
      provider: this.fb.control<string>(!!c? c.payment.provider:'', [Validators.required, Validators.minLength(1)]),
      cardNumber: this.fb.control<string>(!!c? c.payment.cardNumber:'', [Validators.required,Validators.minLength(5), FormComponent.cardNumberValidator])
    });
    console.info('>>> selected Customer in form: ', c)
    return this.fb.group({
      name: this.fb.control<string>(!!c? c.name:'',[Validators.required, Validators.minLength(5)]),
      email: this.fb.control<string>(!!c? c.email:'', [Validators.required, Validators.minLength(5)]),
      dob: this.fb.control(!!c? c.dob:'', [Validators.required, this.dateOfBirthValidator]),
      address: this.fb.control<string>(!!c? c.address:'', [Validators.required, Validators.minLength(5)]),
      payment: this.primaryPayment,
      //payment fields are an array of payment methods
      otherPaymentMethods: this.paymentArray
    })
  }



  get value(): Customer|null  {
    return this.customerForm.value as Customer
  }
  //needed for this.taskComp.value = this.todo in app.component
  set value(c: Customer|null) {
    this.customer= c
    this.customerForm = this.createFormWithFormBuilder(c);
  }

  //user >= 12 y.o.
  private dateOfBirthValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    
    // Calculate the date that represents 12 years ago from the current date
    const minDate = new Date();
    minDate.setFullYear(currentDate.getFullYear() - 12);
    
    if (selectedDate > currentDate) {
      return { futureDate: true };
    }
    
    if (selectedDate > minDate) {
      return { minAge: true };
    }
    
    return null;
  }

  //card number validator
  static cardNumberValidator(control: AbstractControl): ValidationErrors | null {
    const cardNumberPattern = /^[0-9]{5,}$/; // Regular expression pattern for numbers with minimum length 5
    if (!cardNumberPattern.test(control.value)) {
      return { invalidCardNumber: true };
    }
    return null;
  }




}
