import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {UserService} from '../services/user.service'
import { Injectable } from '@angular/core';


@Injectable()

export class LoginGuardService implements CanActivate{
  constructor(private userServices:UserService,private _router:Router){}
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const token = !!localStorage.getItem("token");
    try{
      if(token){
        return await this.userServices.loginGuard().then(result=>{
          if(result){
            return true;
          }
        });
      }else{
        this._router.navigate(['/login'])
        return false;
      }
    }catch(err){
      this._router.navigate(['/login'])
    }
  };
}
