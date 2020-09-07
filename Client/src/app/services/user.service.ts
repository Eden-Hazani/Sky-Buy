import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http' 
import { ProductModel } from '../models/product-model';
import { ActionType } from '../redux/actionType';
import { store } from '../redux/store';
import { Router } from '@angular/router';
import { CartModel } from '../models/cart-model';
import { CartItemModel } from '../models/cart-item-model';
import swal from 'sweetalert2';
import { OrderModel } from '../models/order-model';
import {baseUrl} from 'src/environments/environment' 
import { UserModel } from '../models/user-info';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  public headers = new HttpHeaders().set("authorization", "Bearer " + localStorage.getItem("token"));

  constructor(private http:HttpClient,private _router:Router) { }

  //admin check for store, also logs out any user with an expired session
  public isAdmin(){
    const headers = new HttpHeaders().set("authorization", "Bearer " + localStorage.getItem("token"));
    return this.http.get(`${baseUrl}api/auth/is-admin`,{headers:headers})
    .subscribe(
      next=>{
        const action = { type: ActionType.isAdmin, payload: next };
        store.dispatch(action)
      }
      ,error=>{
        if(error.error === 'Your Logging session has expired'){
          swal.fire({
            title: 'Your Logging session has expired',
            text: "Please Login again",
            icon: 'error',
          })
          localStorage.clear();
          this._router.navigate(["/login"])
        }}
      ,()=>{});
  }
  // login check for the login canActivate
  public loginGuard(){
    const headers = new HttpHeaders().set("authorization", "Bearer " + localStorage.getItem("token"));
    return this.http.get(`${baseUrl}api/auth/is-loggedIn`,{headers:headers}).toPromise();
  }


  // admin check for admin canActivate
  public adminGuard(){
    const headers = new HttpHeaders().set("authorization", "Bearer " + localStorage.getItem("token"));
    return this.http.get(`${baseUrl}api/auth/is-admin`,{headers:headers}).toPromise();
  }

  public Login(credentials){
    return this.http.post(`${baseUrl}api/auth/login`,credentials).subscribe(
      userInfo=>{
      const action = { type: ActionType.LoadUserInfo, payload: userInfo };
      store.dispatch(action);
      localStorage.setItem('firstLogin','true');
      this.headers = new HttpHeaders().set("authorization", "Bearer " + localStorage.getItem("token"));
      this.isAdmin()
      this._router.navigate(['/home'])
    },err=>{
      if(err.status === 401){
        swal.fire({
          title: 'Wrong Credentials',
          text: "Please try again :)",
          icon: 'error',
        })
      }
    });
  }

  public changeUserInformation(user:UserModel,fileToUpload:File){
    let formData: FormData = new FormData();
    if(fileToUpload){
      formData.append("file", fileToUpload ,fileToUpload.name);
    } 
    formData.append("info",JSON.stringify(user))
    return this.http.patch(`${baseUrl}api/auth/updateUserInfo/${user._id}`,formData,{headers:this.headers}).subscribe(user=>{
      const action = { type: ActionType.UpdateUserInfo, payload: user };
      store.dispatch(action);
    })
  }

  //validate user existing in DB
  public validateUser(username,password){
    const credentials = new UserModel(null,username,password)
    return this.http.post(`${baseUrl}api/auth/validUserInfo`,credentials,{headers:this.headers}).toPromise();
  }

  //validates an existing username in DB for registration 
  public validateRegister(userName){
    return this.http.get(`${baseUrl}api/auth/validateInfo/${userName}`).toPromise()
  }


  public register(userInfo,fileToUpload:File){
    let formData: FormData = new FormData();
    if(fileToUpload){
      formData.append("file", fileToUpload ,fileToUpload.name);
    } 
    formData.append("info",JSON.stringify(userInfo))
    return this.http.post(`${baseUrl}api/auth/register`,formData).subscribe(userAnswer=>{
      const action = { type: ActionType.LoadUserInfo, payload: userAnswer };
      store.dispatch(action);
      this.headers = new HttpHeaders().set("authorization", "Bearer " + localStorage.getItem("token"));
      this.isAdmin()
      this._router.navigate(['/home'])
    });
  }
  public getCityList(){
    return this.http.get("https://data.gov.il/api/3/action/datastore_search?resource_id=eb548bfa-a7ba-45c4-be7d-2e8271f55f70&").toPromise();
  }

  public getProducts(){
    return this.http.get<ProductModel[]>(`${baseUrl}api/user/getProducts`,{headers:this.headers}).subscribe(products=>{
      const action = { type: ActionType.GetAllProducts, payload: products };
      store.dispatch(action);
    });
  }

  public getOrders(){
    return this.http.get<OrderModel[]>(`${baseUrl}api/user/getOrders`,{headers:this.headers}).subscribe(orders=>{
      const action = { type: ActionType.getAllOrders, payload: orders };
      store.dispatch(action);
    });
  }

  public checkIfCartExists(){
    return this.http.get<CartModel>(`${baseUrl}api/user/getCart`,{headers:this.headers}).toPromise().then(cart=>{
        const action = { type: ActionType.CreateCartInStore, payload: cart };
        store.dispatch(action);
    })
  }

  public createCart(){
    return this.http.post<CartModel>
    (`${baseUrl}api/user/createCart`,'',{headers:this.headers}).toPromise().then(cart=>{
      const action = { type: ActionType.CreateCartInStore, payload: cart };
      store.dispatch(action);
    })
  }

  public addToCart(cart_id,product_id,item){
    return this.http.post<CartItemModel>
    (`${baseUrl}api/user/addItemToCart/${cart_id}/${product_id}`,item
    ,{headers:this.headers}).subscribe(product=>{
      const action = { type: ActionType.AddItemToCart, payload: product};
      store.dispatch(action);
    });
  }

  public removeFromCart(item_id,totalPrice,cart_id){
    return this.http.delete(`${baseUrl}api/user/removeItemFromCart/${item_id}`,{headers:this.headers})
    .subscribe(
      next=>{
        const action = { type: ActionType.RemoveItemFromCart, payload: {_id:item_id,price:totalPrice} };
        store.dispatch(action);
        if(store.getState().cartItems.length === 0){
          this.removeCart(cart_id);
        }
      }
      ,error=>{}
      ,()=>{});
  }

  public getExistingItemsToCart(cart_id){
    return this.http.get<CartItemModel[]>(`${baseUrl}api/user/itemsInCart/${cart_id}`,{headers:this.headers}).subscribe(items=>{
      const action = { type: ActionType.LoadExistingItemsToCart, payload: items };
      store.dispatch(action);
    });
  }

  public getCompletedOrderItems(cart_id){
    return this.http.get<CartItemModel[]>(`${baseUrl}api/user/itemsInCart/${cart_id}`,{headers:this.headers}).toPromise()
  }

  public removeCart(cart_id){
    return this.http.delete(`${baseUrl}api/user/removeCart/${cart_id}`,{headers:this.headers})
    .subscribe(
      next=>{
        const action = { type: ActionType.RemoveCart };
        store.dispatch(action);
      }
      ,error=>{}
      ,()=>{});
  }


  public createOrder(order:OrderModel){
    return this.http.post<OrderModel>(`${baseUrl}api/user/createOrder`,order,{headers:this.headers}).toPromise().then(async addedOrder=>{
      sessionStorage.clear();
      const action = { type: ActionType.GetOrderInfo, payload:addedOrder};
      store.dispatch(action);
    });
  }

  public completeOrder(cart:CartModel){
    return this.http.patch(`${baseUrl}api/user/completeCart`,cart,{headers:this.headers}).toPromise().then(()=>{
        const action = { type: ActionType.RemoveCart };
        store.dispatch(action);
      })
  }

  public searchProduct(text: string): Promise<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${baseUrl}api/user/search/${text}`).toPromise();
  }
  public searchFilteredProduct(text: string,categoryArray): Promise<ProductModel[]> {
    return this.http.post<ProductModel[]>(`${baseUrl}api/user/searchFilteredProduct/${text}`,categoryArray).toPromise();
  }

  public getProductsByCategory(categoryArray): Promise<ProductModel[]> {
    return this.http.post<ProductModel[]>(`${baseUrl}api/user/getProductsByCategory`,categoryArray).toPromise();
  }


}
