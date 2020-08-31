import { ProductModel } from './product-model';

export class CartItemModel {
    constructor(
        public _id?:string,
        public amount?:number,
        public totalPrice?:number,
        public productId?:ProductModel,
        public shoppingCartId?:string
    ){
        if(!productId){
            this.productId = new ProductModel();
        }
    }
}
