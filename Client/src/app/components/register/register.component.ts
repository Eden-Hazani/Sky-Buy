import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user-info';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, AbstractControl, FormGroup, FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import swal from 'sweetalert2';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit  {

  public newUser = new UserModel();
  public userInfo;
  public cities;
  public preSelected = '';
  public startTimer = false;
  public secondStage = false;
  public fileToUpload: File = null;

  constructor( private userServices:UserService, private _router:Router) { }


  async ngOnInit(){
    setTimeout(() => {
      this.startTimer = true
    }, 2000);
    this.cities = await this.userServices.getCityList();
  }

   passwordValidator(control: FormControl) {
     const  confirm = control.value;
     const password = this.passwordFormControl.value;
      if( confirm !== password){
        return  {
          error:{
            matchError:"PassWordMisMatch"
          }
        }
      }
      return null;
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  async validateFirstStage(){
    if(!this.validFirstStage()){
      return
    }
    else{
      try{
          await this.userServices.validateRegister(this.newUser.usernameEmail).then(e=>{
            console.log(e)
          });
      }catch(err){
        if(err.status === 403){
          swal.fire({
            title: 'Please try again',
            text: "A user with this email address already exists",
            icon: 'error',
            confirmButtonText: 'O.K'
          })
        }
        console.log(err.message)
        return;
      }
      this.startTimer = false;
      setTimeout(() => {
        this.startTimer = true;
        this.secondStage = true;
      }, 2000);
    }
  }

  async register(){
    try{
      if(!this.validForm()){
        return;
      }
      this.userInfo = await this.userServices.register(this.newUser,this.fileToUpload);
    }catch(err){
      if(err.status === 403){
        swal.fire({
          title: 'Please try again',
          text: "A user with this email address already exists",
          icon: 'error',
          confirmButtonText: 'O.K'
        })
      }
      console.log(err.message)
    }
  }

  validForm(){
    return this.usernameFormControl.valid
    && this.passwordFormControl.valid
    && this.IdentificationNumberFormControl.valid
    && this.firstNameFormControl.valid
    &&this.lastNameFormControl.valid
    && this.addressCityFormControl.valid
    && this.addressStreetFormControl.valid
    && this.ZipFormControl.valid
    && this.confirmPassFormControl.valid

  }

  validFirstStage(){
    return this.usernameFormControl.valid
    && this.passwordFormControl.valid
    && this.IdentificationNumberFormControl.valid
    && this.confirmPassFormControl.valid
  }


   usernameFormControl = new FormControl('', [
     Validators.required,
     Validators.pattern("^.+\@.+\..+$")
   ]);

   passwordFormControl = new FormControl('', [
     Validators.required,
     Validators.minLength(5),
     Validators.maxLength(15),
     Validators.pattern("^(?=.*[A-Z].*[A-Z])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{5,}$")
   ]);

   firstNameFormControl = new FormControl('', [
     Validators.required,
     Validators.minLength(3),
     Validators.pattern("^[A-Z][A-z]{2,}$"),
   ]);

   lastNameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  IdentificationNumberFormControl = new FormControl('',[
    Validators.required,
    Validators.minLength(9),
    Validators.maxLength(9),
    Validators.pattern("^(0|[1-9][0-9]*)$")
  ])

  addressCityFormControl = new FormControl('',[
    Validators.required
  ])
  addressStreetFormControl = new FormControl('',[
    Validators.required
  ])
  ZipFormControl = new FormControl('',[
    Validators.required,
    Validators.min(1),
    Validators.minLength(5)
  ])
  confirmPassFormControl = new FormControl('',[
    Validators.required,
    this.passwordValidator.bind(this)
  ])




   matcher = new MyErrorStateMatcher();
 }

 export class MyErrorStateMatcher implements ErrorStateMatcher {
   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
     const isSubmitted = form && form.submitted;
     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
   }
}

