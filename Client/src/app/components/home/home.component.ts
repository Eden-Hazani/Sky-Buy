import { Component, OnInit,OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import {ProductModel} from '../../models/product-model'
import {CartModel} from '../../models/cart-model'
import { Unsubscribe } from 'redux';
import { store } from 'src/app/redux/store';
import { CartItemModel } from 'src/app/models/cart-item-model';
import { MatDialog } from '@angular/material/dialog';
import {AddItemComponent} from '../add-item/add-item.component'
import { AdminService } from 'src/app/services/admin.service';
import { CategoryModel } from 'src/app/models/category-model';
import { UserModel } from 'src/app/models/user-info';
import { ActionType } from 'src/app/redux/actionType';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,OnDestroy {

  public products ;
  public timer = false;
  private unsubscribe: Unsubscribe;
  public cart = new CartModel();
  public cartItems: CartItemModel[];
  public searchedProducts = [];
  public itemsPickedByCategory : ProductModel[] = [];
  public categories;
  public pickedCategories = [];
  public userInfo = new UserModel();
  public totalPrice:number;
  public menuOpen:boolean;

  constructor(private adminServices:AdminService,private dialog: MatDialog,private userServices:UserService) { }

  ngOnDestroy(){
    this.unsubscribe();
  }


  // This controls searching with categories picked and without categories picked,
  // If the user selected categories manually and THEN searched the resulting items will 
  // always be within the related categories.
  public async searchItem(text){
    if (text.trim() === "") {
      this.searchedProducts = [];
      return;
    }
    if(this.itemsPickedByCategory.length > 0){
      try {
        this.searchedProducts = await this.userServices
        .searchFilteredProduct(text,this.pickedCategories);
      }
    catch (err) {
        alert(err.message);
      } 
      return;
    }else{
      try {
        this.searchedProducts = await this.userServices.searchProduct(text);
        }
      catch (err) {
          alert(err.message);
        } 
    }
  }

  public openOrCloseMenu(){
    if(!this.menuOpen){
      this.menuOpen = true;
    }else{
      this.menuOpen = false;
    }
  }

  public async pickCategories(value){
    this.pickedCategories = value
    this.userServices.getProductsByCategory(value).then((p:any)=>{
    this.itemsPickedByCategory = p;
    })
  }

  public async getCartItems(){
    if(this.cart){
      return;
    }
    this.userServices.checkIfCartExists().then(async()=>{
      if(this.cart !== null){
        if(this.cart.payedAndCompleted){
          await this.userServices.createCart().then(()=> {
            this.cart = store.getState().cart
          });
        }
        this.userServices.getExistingItemsToCart(this.cart._id)
      }
    });
  }

  async ngOnInit() {
    setTimeout(() => {
      this.timer = true
    }, 2000);
    this.categories = await this.adminServices.getCategories();
    this.userServices.getProducts();
    this.unsubscribe = store.subscribe(() =>{
      this.cart = store.getState().cart;
      this.products = store.getState().products;
      this.cartItems = store.getState().cartItems;
      this.userInfo = store.getState().user;
      this.totalPrice = store.getState().totalToPay;
    });
    this.cart = store.getState().cart;
    this.products = store.getState().products;
    this.cartItems = store.getState().cartItems;
    this.userInfo = store.getState().user;
    this.getCartItems();
    this.totalPrice = parseInt(sessionStorage.getItem('total'));
  }

  //if the cart drops to zero products it auto deletes, when the user selects a new product 
  //A new cart will be created
  public removeItemFromCart(item_id,totalPrice){
    const _id = this.cart._id;
      this.userServices.removeFromCart(item_id,totalPrice);
      setTimeout(() => {
        if(this.cartItems.length === 0){
         this.userServices.removeCart(_id)
         store.dispatch({ type: ActionType.RemoveCart});
        }
      }, 1500);
  }

  public removeCart(){
      this.userServices.removeCart(this.cart._id);
  }

  //Opens a dialog modal to insert a new item to the cart, uses data as transfer object.
  public async openDialogAddItem(product_id,productPrice){
    try{
      if(this.cart === null){
        await this.userServices.createCart().then(()=> this.cart = store.getState().cart);
      }
      this.dialog.open(AddItemComponent,{
        data:{
          product_id:product_id,
          cart_id:this.cart._id,
          productPrice:productPrice
          }
      });
    }catch(err){
      console.log(err.message)
    }
  }

}
