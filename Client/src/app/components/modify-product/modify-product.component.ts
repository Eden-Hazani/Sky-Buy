import { Component, OnInit, Inject } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { ProductModel } from 'src/app/models/product-model';
import { AdminService } from 'src/app/services/admin.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-modify-product',
  templateUrl: './modify-product.component.html',
  styleUrls: ['./modify-product.component.css']
})
export class ModifyProductComponent implements OnInit {

public product = new ProductModel();
public preSelected = ''
public categories 
public timer = false;
fileToUpload: File = null;

  constructor(private adminServices:AdminService, @Inject (MAT_DIALOG_DATA) public data: any) { }

  async ngOnInit() {
    setTimeout(() => {
      this.timer = true;
    }, 2000);
    this.categories = await this.adminServices.getCategories();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
}


  async modify(){
    try{
        this.product._id = this.data._id;
        this.adminServices.modifyProduct(this.product,this.fileToUpload);
    }catch(err){
      console.log(err.message)
    }
  }

  productNameFormControl = new FormControl('',[
    Validators.minLength(3),
    Validators.pattern(/^([^0-9]*)$/)
  ])
  
  descriptionFormControl = new FormControl('',[
    Validators.minLength(20),
  ])
  
  priceFormControl = new FormControl('',[
    Validators.min(1)
  ])
  categoryFormControl = new FormControl('',[
  ])
  

   matcher = new MyErrorStateMatcher();
 }

 export class MyErrorStateMatcher implements ErrorStateMatcher {
   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
     const isSubmitted = form && form.submitted;
     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
   }
}

