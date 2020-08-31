import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {UserService} from '../services/user.service'
import { Injectable } from '@angular/core';


@Injectable()

export class AlreadyLoggedService implements CanActivate{
  constructor(private userServices:UserService,private _router:Router){}
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const token = !!localStorage.getItem("token");
    try{
      if(token){
        return await this.userServices.loginGuard().then(result=>{
          if(result){
            return this._router.navigate(['/home']);
          }
        });
      }else{
        return true;
      }
    }catch(err){
      this._router.navigate(['/login'])
    }
  };
}
