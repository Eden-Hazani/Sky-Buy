import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { ProductModel } from 'src/app/models/product-model';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  public newProduct = new ProductModel();
  public timer = false;
  public preSelected = '';
  public categories;
  fileToUpload: File = null;


  constructor(private adminServices:AdminService) { }

  async ngOnInit() {
    setTimeout(() => {
      this.timer = true;
    }, 2000);
    this.categories = await this.adminServices.getCategories();
  }

  isValid(){
    return this.productNameFormControl.valid
    && this.priceFormControl.valid
    &&this.descriptionFormControl.valid
    &&this.categoryFormControl.valid
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
}

  add(){
    try{
        if(!this.isValid()){
          return;
        }
      this.adminServices.addProduct(this.newProduct,this.fileToUpload);
    }catch(err){
      console.log(err.message)
    }
  }

  productNameFormControl = new FormControl('',[
    Validators.required,
    Validators.minLength(3),
    Validators.pattern(/^([^0-9]*)$/)
  ])
  
  descriptionFormControl = new FormControl('',[
    Validators.required,
    Validators.minLength(20),
    Validators.maxLength(50)
  ])
  
  priceFormControl = new FormControl('',[
    Validators.required,
    Validators.min(1)
  ])
  categoryFormControl = new FormControl('',[
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