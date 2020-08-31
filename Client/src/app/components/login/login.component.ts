import { Component } from '@angular/core';
import {UserModel} from '../../models/user-info'
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent   {

  public user = new UserModel();
  public loginInfo


  constructor(private userServices: UserService,private _router:Router) { }



  async login(){
    try{
      if(!this.validForm()){
        return;
      }
      this.loginInfo = await this.userServices.Login(this.user);
    }catch(err){
      if(err.status === 401){
        swal.fire({
          title: 'Wrong Credentials',
          text: "Please try again :)",
          icon: 'error',
        })
      }
      console.log(err.message)
    }
  }

  validForm(){
    return this.usernameFormControl.valid
    && this.passwordFormControl.valid
  }
  usernameFormControl = new FormControl('', [
    Validators.required

  ]);
  passwordFormControl = new FormControl('', [
    Validators.required
  ]);


  matcher = new MyErrorStateMatcher();


}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
