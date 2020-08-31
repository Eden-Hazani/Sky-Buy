import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { CartItemModel } from 'src/app/models/cart-item-model';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {

  public newItem = new CartItemModel();
  public preSelected = 1;

  constructor(private userServices:UserService,@Inject (MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.newItem.amount = 1;
  }
  formatLabel(value:number) {
    let fixedVal = Math.floor(value);
    this.newItem.totalPrice = fixedVal;
    return fixedVal;
  }


  addToCart(){
     try{
        this.userServices.addToCart(this.data.cart_id,this.data.product_id,this.newItem);
      }catch(err){
        console.log(err.message)
      }
  }

 



  amountFormControl = new FormControl('',[
    Validators.required,
  ])
  

   matcher = new MyErrorStateMatcher();
 }



 export class MyErrorStateMatcher implements ErrorStateMatcher {
   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
     const isSubmitted = form && form.submitted;
     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
   }
}

