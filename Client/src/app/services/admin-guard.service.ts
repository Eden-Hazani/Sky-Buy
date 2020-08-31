import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {UserService} from '../services/user.service'
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements  CanActivate {


  constructor(private userServices:UserService,private _router:Router){}
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
  const token = !!localStorage.getItem("token");
  try{
    if(token){
      return await this.userServices.adminGuard().then(result=>{
        if(result){
          return true;
        }
      });
    }else{
      this._router.navigate(['/login'])
      return false
    }
  }catch(err){
    if(err.status === 403){
      this._router.navigate(['/home'])
    }
  }
};

}