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


@Injectable({
  providedIn: 'root'
})
export class UserService {

  public headers = new HttpHeaders().set("authorization", "Bearer " + localStorage.getItem("token"));

  constructor(private http:HttpClient,private _router:Router) { }

  public isAdmin(){
    const headers = new HttpHeaders().set("authorization", "Bearer " + localStorage.getItem("token"));
    return this.http.get(`http://localhost:3000/api/auth/is-admin`,{headers:headers})
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
  // login check
  public loginGuard(){
    const headers = new HttpHeaders().set("authorization", "Bearer " + localStorage.getItem("token"));
    return this.http.get(`http://localhost:3000/api/auth/is-loggedIn`,{headers:headers}).toPromise();
  }


  // admin check for routing purposes
  public adminGuard(){
    const headers = new HttpHeaders().set("authorization", "Bearer " + localStorage.getItem("token"));
    return this.http.get(`http://localhost:3000/api/auth/is-admin`,{headers:headers}).toPromise();
  }

  public Login(credentials){
    return this.http.post("http://localhost:3000/api/auth/login",credentials).subscribe(userInfo=>{
      const action = { type: ActionType.LoadUserInfo, payload: userInfo };
      store.dispatch(action);
      this.headers = new HttpHeaders().set("authorization", "Bearer " + localStorage.getItem("token"));
      this.isAdmin()
      this._router.navigate(['/home'])
    });
  }

  public validateRegister(userName){
    return this.http.get(`http://localhost:3000/api/auth/validateInfo/${userName}`).toPromise()
  }

  public register(userInfo){
    console.log(userInfo)
    return this.http.post("http://localhost:3000/api/auth/register",userInfo).subscribe(userAnswer=>{
      const action = { type: ActionType.LoadUserInfo, payload: userAnswer };
      console.log(userAnswer)
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
    return this.http.get<ProductModel[]>(`http://localhost:3000/api/user/getProducts`,{headers:this.headers}).subscribe(products=>{
      const action = { type: ActionType.GetAllProducts, payload: products };
      store.dispatch(action);
    });
  }

  public getOrders(){
    return this.http.get<OrderModel[]>(`http://localhost:3000/api/user/getOrders`,{headers:this.headers}).subscribe(orders=>{
      const action = { type: ActionType.getAllOrders, payload: orders };
      store.dispatch(action);
    });
  }

  public checkIfCartExists(){
    return this.http.get<CartModel>(`http://localhost:3000/api/user/getCart`,{headers:this.headers}).toPromise().then(cart=>{
        const action = { type: ActionType.CreateCartInStore, payload: cart };
        store.dispatch(action);
    })
  }

  public createCart(){
    return this.http.post<CartModel>
    (`http://localhost:3000/api/user/createCart`,'',{headers:this.headers}).toPromise().then(cart=>{
      const action = { type: ActionType.CreateCartInStore, payload: cart };
      store.dispatch(action);
    })
  }

  public addToCart(cart_id,product_id,item){
    return this.http.post<CartItemModel>
    (`http://localhost:3000/api/user/addItemToCart/${cart_id}/${product_id}`,item
    ,{headers:this.headers}).subscribe(product=>{
      const action = { type: ActionType.AddItemToCart, payload: product};
      store.dispatch(action);
    });
  }

  public removeFromCart(item_id,totalPrice){
    return this.http.delete(`http://localhost:3000/api/user/removeItemFromCart/${item_id}`,{headers:this.headers})
    .subscribe(
      next=>{
        const action = { type: ActionType.RemoveItemFromCart, payload: {_id:item_id,price:totalPrice} };
        store.dispatch(action);
      }
      ,error=>{}
      ,()=>{});
  }

  public getExistingItemsToCart(cart_id){
    return this.http.get<CartItemModel[]>(`http://localhost:3000/api/user/itemsInCart/${cart_id}`,{headers:this.headers}).subscribe(items=>{
      const action = { type: ActionType.LoadExistingItemsToCart, payload: items };
      store.dispatch(action);
    });
  }

  public getCompletedOrderItems(cart_id){
    return this.http.get<CartItemModel[]>(`http://localhost:3000/api/user/itemsInCart/${cart_id}`,{headers:this.headers}).toPromise()
  }

  public removeCart(cart_id){
    return this.http.delete(`http://localhost:3000/api/user/removeCart/${cart_id}`,{headers:this.headers})
    .subscribe(
      next=>{
        const action = { type: ActionType.RemoveCart };
        store.dispatch(action);
      }
      ,error=>{}
      ,()=>{});
  }


  public createOrder(order:OrderModel){
    return this.http.post<OrderModel>(`http://localhost:3000/api/user/createOrder`,order,{headers:this.headers}).toPromise().then(async addedOrder=>{
      sessionStorage.clear();
      const action = { type: ActionType.GetOrderInfo, payload:addedOrder};
      store.dispatch(action);
    });
  }

  public completeOrder(cart:CartModel){
    return this.http.patch('http://localhost:3000/api/user/completeCart',cart,{headers:this.headers}).toPromise().then(()=>{
        const action = { type: ActionType.RemoveCart };
        store.dispatch(action);
      })
  }

  public searchProduct(text: string): Promise<ProductModel[]> {
    return this.http.get<ProductModel[]>(`http://localhost:3000/api/user/search/${text}`).toPromise();
  }
  public searchFilteredProduct(text: string,categoryArray): Promise<ProductModel[]> {
    return this.http.post<ProductModel[]>(`http://localhost:3000/api/user/searchFilteredProduct/${text}`,categoryArray).toPromise();
  }

  public getProductsByCategory(categoryArray): Promise<ProductModel[]> {
    return this.http.post<ProductModel[]>(`http://localhost:3000/api/user/getProductsByCategory`,categoryArray).toPromise();
  }


}
