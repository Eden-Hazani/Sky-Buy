import { Component, OnInit,OnDestroy } from '@angular/core';
import { Unsubscribe } from 'redux';
import { store } from 'src/app/redux/store';
import {UserService} from '../../services/user.service'
import {AdminService} from '../../services/admin.service'
import { MatDialog } from '@angular/material/dialog';
import { ModifyProductComponent } from '../modify-product/modify-product.component';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {CategoryModel} from '../../models/category-model'
import swal from 'sweetalert2';
import { AddProductComponent } from '../add-product/add-product.component';
import {baseUrl} from 'src/environments/environment'
import { ProductModel } from 'src/app/models/product-model';

@Component({
  selector: 'app-admin-zone',
  templateUrl: './admin-zone.component.html',
  styleUrls: ['./admin-zone.component.css']
})
export class AdminZoneComponent implements OnInit,OnDestroy  {

  private unsubscribe: Unsubscribe;
  public products:ProductModel[];
  public timer = false
  public newCategory = new CategoryModel();
  public baseUrl = baseUrl;

  constructor(private dialog: MatDialog, private userServices:UserService,private adminService:AdminService) { }
  ngOnDestroy(){
    this.unsubscribe();
  }

  public deleteItem(_id){
    try{
         this.adminService.deleteProduct(_id);
    }catch(err){
      console.log(err)
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.timer = true;
    }, 2000);
    this.userServices.getProducts()
    this.unsubscribe = store.subscribe(() => this.products = store.getState().products);
    this.products = store.getState().products
  }

  public openDialogModify(product_id,productImg){
    this.dialog.open(ModifyProductComponent,{
      data:{
        _id:product_id,
        productImg:productImg
        }
      });
  }

  public openDialogAdd(){
    this.dialog.open(AddProductComponent)
  }

  submitCategory(){
    try{
      console.log(this.categoryFormControl.valid)
      if(!this.categoryFormControl.valid){
        swal.fire({
          title: 'Error',
          text: "Please fix the form",
          icon: 'error',
        })
        return;
      }
      this.adminService.addCategory(this.newCategory);
      swal.fire({
        title: 'Success',
        text: "Category has been submitted.",
        icon: 'success',
      })
      this.newCategory.categoryName = '';
    }catch(err){
      console.log(err.message)
    }
  }



  categoryFormControl = new FormControl('',[
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(20)
  ])
  

   matcher = new MyErrorStateMatcher();
 }

 export class MyErrorStateMatcher implements ErrorStateMatcher {
   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
     const isSubmitted = form && form.submitted;
     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
   }
}

