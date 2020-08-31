import {AddressModel} from './address'
export class UserModel {
    public constructor(
        public _id?:string,
        public usernameEmail?:string,
        public password?:string,
        public firstName?:string,
        public lastName?:string,
        public IdentificationNumber?:number,
        public address?: AddressModel
        ,public isAdmin?:string
        ){
            if(!address){
                this.address = new AddressModel();
            }
        }
}
