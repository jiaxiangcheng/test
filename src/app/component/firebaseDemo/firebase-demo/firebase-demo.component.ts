import { ProductService } from '../../../services/product/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../model/product';
import { MessageService } from '../../../services/messages/message.service';
import { DialogService } from '../../../services/dialog/dialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-firebase-demo',
  templateUrl: './firebase-demo.component.html',
  styleUrls: ['./firebase-demo.component.scss']
})
export class FirebaseDemoComponent implements OnInit {
  productList: Product[] = [];

  constructor(
    private productService: ProductService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getProduct();
    // this.productService.addProduct({
    //   $key: '',
    //   name: 'apple',
    //   category: 'fruit',
    //   location: 'china',
    //   price: 6
    // });
  }

  getProduct() {
    this.productService.getProducts()
      .snapshotChanges().subscribe(item => {
        this.productList = [];
        item.forEach(element => {
          const x = element.payload.toJSON();
          x['$key'] = element.key;
          this.productList.push(x as Product);
        });
      });
  }

  goBack() {
    this.router.navigate(['/userinfo']);
  }

  openModal(mode) {
    this.dialogService.openDialog(mode);
  }
}
