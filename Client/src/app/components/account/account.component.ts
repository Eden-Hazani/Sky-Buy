import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user-info';
import {baseUrl} from 'src/environments/environment';
import swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';
import { Unsubscribe } from 'redux';
import { store } from 'src/app/redux/store';
import { FormBuilder, AbstractControl, FormGroup, FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  public baseUrl = baseUrl;
  public userInfo:UserModel = JSON.parse(localStorage.getItem("userInfo"));
  public fileToUpload:File = null;
  private unsubscribe: Unsubscribe;
  public newUserInfo = new UserModel();
  public oldPassword:string;

  constructor(private userService:UserService,private _router:Router) { }

  ngOnInit() {
    this.unsubscribe = store.subscribe(() =>{
      this.userInfo = store.getState().user;
    })
    this.newUserInfo = this.userInfo;
  }


  public changeUserDetails(){
    if(!this.isOldPassValid()){
      return;
    }
    if(!this.isValid()){
      return;
    }
    this.userService.changeUserInformation(this.newUserInfo,null);
    swal.fire(
      'Password Changed!',
      'Please log in again with your new credentials',
      'success'
    )
    localStorage.clear();
    this._router.navigate(["/login"])
    window.location.reload();
  }

  public isValid(){
    return this.passwordFormControl.valid
  }

  public isOldPassValid(){
    const userName = this.userInfo.usernameEmail;
    const pass = this.oldPassword;
    return this.userService.validateUser(userName,pass).then(answer=>{
      return answer
    }).catch(err=>{
      swal.fire({
        title: 'Wrong Password',
        icon: 'error',
      })
      return false;
    })
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    swal.fire({
      title: 'Upload?',
      text: "This will change your profile image",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Upload The Image!'
    }).then((result) => {
      if (result.value) {
        this.userService.changeUserInformation(this.userInfo,this.fileToUpload)
        swal.fire(
          'Profile Image Changed!',
          'You look beautiful :)',
          'success'
        )
      }
    })
}

passwordFormControl = new FormControl('', [
  Validators.required,
  Validators.minLength(5),
  Validators.maxLength(15),
  Validators.pattern("^(?=.*[A-Z].*[A-Z])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{5,}$")
]);

oldPasswordFormControl = new FormControl('', [
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

