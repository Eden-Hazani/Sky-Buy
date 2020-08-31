import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Unsubscribe } from 'redux';
import { store } from 'src/app/redux/store';
import { OrderModel } from 'src/app/models/order-model';
import { CartItemModel } from 'src/app/models/cart-item-model';
import { PdfGenService } from 'src/app/services/pdf-gen.service';


@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit, OnDestroy {

  private unsubscribe: Unsubscribe;
  public orders:OrderModel[];
  public timer:boolean = false;
  public pickedOrderItems:CartItemModel[];
  public pickedOrder:OrderModel;
  public orderSwitch:boolean;

  constructor(private userServices:UserService, private pdfService:PdfGenService) { }

  ngOnInit() {
    setTimeout(() => {
      this.timer = true;
    }, 2000);
    this.unsubscribe = store.subscribe(() =>{
      this.orders = store.getState().orders;
    });
    this.userServices.getOrders();
  }
  ngOnDestroy(){
    this.unsubscribe()
  }

  public openOrder(order){
    this.orderSwitch = true;
    setTimeout(() => {
      this.orderSwitch = false;
    }, 1000);
    this.pickedOrder = order;
      this.userServices.getCompletedOrderItems(order.shoppingCartId).then(items=>{
        this.pickedOrderItems = items;
      })
  }
  public getReceipt(order){
    this.pdfService.generatePdf(order,this.pickedOrderItems)
  }

}
