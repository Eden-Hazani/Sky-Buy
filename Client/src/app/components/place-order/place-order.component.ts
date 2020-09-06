import { Component, OnInit, Inject } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service'; 
import { PdfGenService } from 'src/app/services/pdf-gen.service'; 
import { Router } from '@angular/router';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {

  public correctDate;
  public timer:number = 3;


  constructor(private pdfGen:PdfGenService, private userServices:UserService,@Inject (MAT_DIALOG_DATA) public data: any,private _router:Router) { }

  //opens a dialog window with a timer,
  //after timer runs out a receipt is represented to the user.
  ngOnInit(): void {
    console.log(this.data)
    this.correctDate = this.data.order.addedOrder.shippingDate
      .substring(0, this.data.order.addedOrder.shippingDate.indexOf('T'));
      setInterval(() => {
        if(this.timer === 0){
          return;
        }
        this.timer = this.timer - 1;
      }, 1000);
      setTimeout(() => {
        console.log(this.data)
        this.pdfGen.generatePdf(this.data.order.addedOrder,this.data.products);
        this.userServices.completeOrder(this.data.cart);
        this._router.navigate(['/home'])
      }, 3000);
  }


}
