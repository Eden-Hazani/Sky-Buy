import { Component, OnInit, OnDestroy } from '@angular/core';
import { Unsubscribe } from 'redux';
import { store } from 'src/app/redux/store';
import { CartItemModel } from 'src/app/models/cart-item-model';
import { UserService } from 'src/app/services/user.service';
import { CartModel } from 'src/app/models/cart-model';
import { OrderModel } from 'src/app/models/order-model';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { UserModel } from 'src/app/models/user-info';
import swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { PlaceOrderComponent } from '../place-order/place-order.component';
import { Router } from '@angular/router';
import {baseUrl} from 'src/environments/environment';
@Component({
  selector: 'app-review-order',
  templateUrl: './review-order.component.html',
  styleUrls: ['./review-order.component.css']
})
export class ReviewOrderComponent implements OnInit, OnDestroy {

  private unsubscribe: Unsubscribe;
  public order = new OrderModel();
  public cities;
  public orderedProducts: CartItemModel[];
  public timer:boolean;
  public cart:CartModel;
  public userInfo:UserModel = JSON.parse(localStorage.getItem("userInfo"));
  public totalPrice:number =  store.getState().totalToPay;
  public completedOrder:OrderModel;
  public cardIcon:string;
  public baseUrl = baseUrl;

  constructor(private dialog: MatDialog, private userServices:UserService,private _router:Router) { }

  async ngOnInit() {
    setTimeout(() => {
      this.timer = true
    }, 2000);
    this.unsubscribe = store.subscribe(()=>{
      this.orderedProducts = store.getState().cartItems;
      this.cart = store.getState().cart;
      this.completedOrder = store.getState().order;
      this.totalPrice =  store.getState().totalToPay;
    })
    this.order.addressCity = this.userInfo.address.city;
    this.order.addressStreet = this.userInfo.address.street;
    this.cities = await this.userServices.getCityList();
    this.orderedProducts = store.getState().cartItems;
    this.completedOrder = store.getState().order;
    this.cart = store.getState().cart;
    if(this.orderedProducts.length === 0){
      await this.userServices.checkIfCartExists().then(()=>{
          if(this.cart === null){
            this._router.navigate(['/home']);
            return;
          }
          this.userServices.getExistingItemsToCart(this.cart._id);
      })
    }
  }

  ngOnDestroy(){
    this.unsubscribe();
  }

  public shipDateChange(date:Date){
    this.order.shippingDate = date;
  }

  public insertCredit(credit){
    const firstDigit = credit.substr(0, 1);
    this.cardIcon = `card${firstDigit}`;
    if(this.creditCardFormControl.valid){
      const lastDigits = credit.substr(credit.length - 4);
      this.order.lastFourDigitsOfCard = lastDigits;
    }
  }

  public isValid(){
    return this.addressCityFormControl
    &&this.shippingDateFormControl
    && this.addressStreetFormControl
    && this.creditCardFormControl
  }


  public async submitOrder(){
    try{
      if(!this.isValid()){
        swal.fire({
          title: 'Fix The Form',
          text: "Please fix the errors on the form",
          icon: 'error',
          confirmButtonText: 'O.K'
        })
      }
        this.order.totalPrice = this.totalPrice;
        this.order.shoppingCartId = this.cart._id;
        await this.userServices.createOrder(this.order).then(()=>{
          this.dialog.open(PlaceOrderComponent,{
            data:{
              order: this.completedOrder,
              products:this.orderedProducts,
              cart:this.cart
              }
            });
        });
    }catch(err){
      console.log(err.message)
    }
  }

  dateValidator(control: FormControl) {
    const  date = new Date(control.value)
    if(date <= new Date()){
      return  {
        error:{
          matchError:"Cannot be past date"
        }
      }
    }
    return null;
     
 }


  addressCityFormControl = new FormControl('',[
    Validators.required,
  ])

  shippingDateFormControl = new FormControl('',[
    Validators.required,
    this.dateValidator
  ])

  addressStreetFormControl = new FormControl('',[
    Validators.required,
    Validators.minLength(3)
  ])
  creditCardFormControl = new FormControl('',[
    Validators.required,
    Validators.minLength(19),
    Validators.maxLength(19),
    Validators.pattern("^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$")
  ])





  matcher = new MyErrorStateMatcher();
 }



 export class MyErrorStateMatcher implements ErrorStateMatcher {
   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
     const isSubmitted = form && form.submitted;
     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
   }
}
