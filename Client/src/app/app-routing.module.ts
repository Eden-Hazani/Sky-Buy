import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LoginGuardService } from './services/login-guard.service';
import { AdminZoneComponent } from './components/admin-zone/admin-zone.component';
import { AdminGuardService } from './services/admin-guard.service';
import { AlreadyLoggedService } from './services/already-logged.service';
import { PlaceOrderComponent } from './components/place-order/place-order.component';
import { ReviewOrderComponent } from './components/review-order/review-order.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AboutComponent } from './components/about/about.component';
import { AccountComponent } from './components/account/account.component';


const routes: Routes = [
  {path:"home",component:HomeComponent, canActivate:[LoginGuardService]},
  {path:"login",component:LoginComponent, canActivate:[AlreadyLoggedService]},
  {path:"register",component:RegisterComponent, canActivate:[AlreadyLoggedService]},
  {path:"admin",component:AdminZoneComponent, canActivate:[AdminGuardService]},
  {path:"order", component:PlaceOrderComponent, canActivate:[LoginGuardService]},
  {path:"reviewOrder",component:ReviewOrderComponent, canActivate:[LoginGuardService]},
  {path:"orderHistory",component:OrderHistoryComponent,canActivate:[LoginGuardService]},
  {path:"about",component:AboutComponent,canActivate:[LoginGuardService]},
  {path:"account",component:AccountComponent,canActivate:[LoginGuardService]},
  {path:"",redirectTo:"/home",pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
