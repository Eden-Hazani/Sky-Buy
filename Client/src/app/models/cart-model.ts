export class CartModel {
    constructor(public _id?:string, 
        public creationDate?:Date,
        public userId?:string,
        public payedAndCompleted?:boolean){}
}
