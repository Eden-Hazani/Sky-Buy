import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {OrderModel} from '../models/order-model'
import {CartItemModel} from '../models/cart-item-model'
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfGenService {

  constructor() { }


  async generatePdf(order:OrderModel,itemArray:CartItemModel[]){
    const documentDefinition = { content: [
      {
        image: await this.getBase64ImageFromURL('assets/images-and-gifs/SiteLogo.png'),
        width:75,
        height:100,
        alignment: 'center',
        margin: [0, 0, 0, 5]
      },
      {
        text: `Order number ${order._id}`,
        bold: true,
        fontSize: 15,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      itemArray.map(item=>{
        return { text: `x ${item.amount} - ${item.productId.productName} - ${item.totalPrice}  \u20AA
                -------------------------------------------------------`
          ,fontSize: 8, alignment: 'left',margin: [0, 0, 0, 10]}
      }),
      {
        text: `Total: ${order.totalPrice} \u20AA`,
        fontSize: 12,
      }
    ] };
    pdfMake.createPdf(documentDefinition).open();
   }

   getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        let dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }

}
