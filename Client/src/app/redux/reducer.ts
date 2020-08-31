import { AppState } from "./app-state";
import { Action } from "./action";
import { ActionType } from "./actionType";
import { CartModel } from '../models/cart-model';

export function reducer(currentState:AppState,action:Action):AppState{
    const newState={...currentState} 
    switch(action.type){
        case ActionType.LoadUserInfo:
            newState.user = action.payload.user
            newState.token = action.payload.token
            localStorage.setItem("token",JSON.stringify(action.payload.token));
            break;

        case ActionType.AddProduct:
            newState.products.push(action.payload.newProduct);
            break;

        case ActionType.GetAllProducts:
            newState.products = action.payload.products;
            break;

        case ActionType.DeleteProduct: 
            const index = newState.products.findIndex(p => p._id === action.payload);
            newState.products.splice(index, 1);
            break;

        case ActionType.ModifyProduct:
            const ModifyIndex = newState.products.findIndex(p => p._id === action.payload.product._id);
            newState.products[ModifyIndex] = action.payload.product;
            break;

        case ActionType.isAdmin:
            newState.isAdmin = action.payload
            break;

        case ActionType.CreateCartInStore:
            newState.cart = action.payload.cart;
            break;

        case ActionType.LoadExistingItemsToCart:
            newState.cartItems = action.payload;
            for(let item of newState.cartItems){
                newState.totalToPay = newState.totalToPay + item.totalPrice;
            }
            break;
        
        case ActionType.AddItemToCart:
            newState.totalToPay = newState.totalToPay + action.payload.updatedCart.totalPrice;
            sessionStorage.setItem('total',`${newState.totalToPay}`)
            newState.cartItems.push(action.payload.updatedCart);
            break;
            
        case ActionType.RemoveItemFromCart:
            newState.totalToPay = newState.totalToPay - action.payload.price
            sessionStorage.setItem('total',`${newState.totalToPay}`)
            const itemIndex = newState.cartItems.findIndex(i => i._id === action.payload._id);
            newState.cartItems.splice(itemIndex, 1);
            break;

        case ActionType.RemoveCart:
            sessionStorage.clear();
            newState.cart = null;
            newState.cartItems = [];
            break;

        case ActionType.GetOrderInfo:
            newState.order = action.payload;
            break;

        case ActionType.getAllOrders:
            for(let item of action.payload){
                item.orderCreationDate = item.orderCreationDate
                .substring(0, item.orderCreationDate.indexOf('T'));
                item.shippingDate= item.shippingDate
                .substring(0, item.shippingDate.indexOf('T'));
            }
            newState.orders = action.payload;
            break;
    }

    return newState
}