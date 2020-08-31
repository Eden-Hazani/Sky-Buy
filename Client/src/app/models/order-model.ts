export class OrderModel {
    constructor(
        public _id?:string,
        public totalPrice?:number,
        public addressCity?:string,
        public addressStreet?:string,
        public shippingDate?:Date,
        public orderCreationDate?:Date,
        public lastFourDigitsOfCard?:number,
        public userId?: string,
        public shoppingCartId?:string
    ){}
}
