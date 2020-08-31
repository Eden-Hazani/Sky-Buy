import { Component, OnInit, OnDestroy } from '@angular/core';
import {UserService} from '../../services/user.service'
import { Router } from '@angular/router';
import { Unsubscribe } from 'redux';
import { store } from 'src/app/redux/store';
import { UserModel } from 'src/app/models/user-info';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {

  public adminAnswer;
  public userInfo:UserModel
  private unsubscribe: Unsubscribe;


  constructor(private _router:Router, private userServices:UserService) { }

  ngOnDestroy(){
    this.unsubscribe();
  }

  async ngOnInit() {
    this.unsubscribe = store.subscribe(() => {
      this.userInfo = store.getState().user;
      this.adminAnswer = store.getState().isAdmin;
    });
    this.userInfo = store.getState().user;
    this.adminAnswer = store.getState().isAdmin;
    this.adminCheck();
  }

  async adminCheck(){
    const user = this.userInfo
    if(user === null){
      return;
    }
      this.adminAnswer = this.userServices.isAdmin();
  }


  isLogged(){
    const token = localStorage.getItem('token');
    if(token){
      return true
    }
    return false
  } 

  logout(){
    localStorage.clear()
    this._router.navigate(["/login"])
    window.location.reload();
  }

}
