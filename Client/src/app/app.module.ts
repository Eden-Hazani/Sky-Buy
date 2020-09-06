import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { LayoutComponent } from './components/layout/layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LoginGuardService } from './services/login-guard.service';
import { AdminGuardService } from './services/admin-guard.service';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AdminZoneComponent } from './components/admin-zone/admin-zone.component';
import { ModifyProductComponent } from './components/modify-product/modify-product.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import {MatSliderModule} from '@angular/material/slider';
import { PlaceOrderComponent } from './components/place-order/place-order.component';
import { ReviewOrderComponent } from './components/review-order/review-order.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AlreadyLoggedService } from './services/already-logged.service';
import { AboutComponent } from './components/about/about.component';
import { AccountComponent } from './components/account/account.component';




@NgModule({
  declarations: [
    LayoutComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AdminZoneComponent,
    ModifyProductComponent,
    AddProductComponent,
    AddItemComponent,
    PlaceOrderComponent,
    ReviewOrderComponent,
    OrderHistoryComponent,
    AboutComponent,
    AccountComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    HttpClientModule,
    SweetAlert2Module.forRoot(),
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ],
  providers: [
    LoginGuardService,
    AdminGuardService,
    AlreadyLoggedService
    
  ],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
