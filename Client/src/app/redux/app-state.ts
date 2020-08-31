import {UserModel} from '../models/user-info'
import { ProductModel } from '../models/product-model';
import { CartModel } from '../models/cart-model';
import { CartItemModel } from '../models/cart-item-model';
import { OrderModel } from '../models/order-model';


export class AppState{
    public isAdmin: boolean;
    public user: UserModel;
    public token:string;
    public products:ProductModel[];
    public cart:CartModel;
    public cartItems: CartItemModel[] = [];
    public totalToPay:number = 0;
    public order:OrderModel;
    public orders:OrderModel[];
    public constructor(){
        const json = localStorage.getItem("userInfo");
        if(json){
            const appState = JSON.parse(json);
            this.user = appState
        }else{
            this.user = null;
        }
    }
}