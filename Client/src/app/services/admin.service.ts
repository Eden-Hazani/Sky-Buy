import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http' 
import { ActionType } from '../redux/actionType';
import { store } from '../redux/store';
import {baseUrl} from 'src/environments/environment' 



@Injectable({
  providedIn: 'root'
})
export class AdminService {


  public headers = new HttpHeaders().set("authorization", "Bearer " + localStorage.getItem("token"));

  constructor(private http:HttpClient) { }




  public addProduct(product,fileToUpload: File){
    let formData: FormData = new FormData();
    formData.append("file", fileToUpload ,fileToUpload.name);
    formData.append("info",JSON.stringify(product))
    return this.http.post(baseUrl+"api/admin/addProduct",formData,
    {headers:this.headers}).subscribe(productInfo=>{
      const action = { type: ActionType.AddProduct, payload: productInfo };
      store.dispatch(action);
    });
  }

  public deleteProduct(_id){
    return this.http.delete(`${baseUrl}api/admin/deleteProduct/${_id}`,{headers:this.headers}).subscribe(()=>{
      const action = { type: ActionType.DeleteProduct, payload: _id };
      store.dispatch(action);
    });
  }

  public modifyProduct(product,fileToUpload: File){
    console.log(product)
    let formData: FormData = new FormData();
    if(fileToUpload){
      formData.append("file", fileToUpload ,fileToUpload.name);
    } 
    formData.append("info",JSON.stringify(product));
    this.http.patch(`${baseUrl}api/admin/update/${product._id}`,formData,{headers:this.headers}).toPromise().then(()=>{
      return this.http.get(`${baseUrl}api/admin/getOneProduct/${product._id}`,{headers:this.headers}).subscribe(product=>{
        const action = { type: ActionType.ModifyProduct, payload: product };
        store.dispatch(action);
      })
    })
  }

  public addCategory(category){
    this.http.post(`${baseUrl}api/admin/postCategory`,category,{headers:this.headers}).toPromise();
  }

  public getCategories(){
    return this.http.get(`${baseUrl}api/admin/getCategories`,{headers:this.headers}).toPromise();
  }
}
