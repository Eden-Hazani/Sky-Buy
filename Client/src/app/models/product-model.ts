export class ProductModel {
    constructor(
        public _id?:string,
        public productName?:string,
        public productDescription?:string,
        public productPrice?:number,
        public productImg?:string,
        public categoryId?:string){}
}
