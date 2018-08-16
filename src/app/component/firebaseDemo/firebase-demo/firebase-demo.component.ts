import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-firebase-demo',
  templateUrl: './firebase-demo.component.html',
  styleUrls: ['./firebase-demo.component.scss']
})
export class FirebaseDemoComponent implements OnInit {
  products: any[];

  constructor(
    db: AngularFireDatabase
  ) {
    // No obtain the key value of each item
    // db.list('/products').valueChanges()
    //   .subscribe(products => {
    //     this.products = products;
    //     console.log(this.products);
    //   });
    // Example result ===> {name: "apple", price: 5}

    // To obtain the key value of each item
    db.list('/products').snapshotChanges().pipe(
      map(actions =>
        actions.map(a => ({ key: a.key, ...a.payload.val() }))
      )
    ).subscribe(products => {
      products.map(item => item.key);
      this.products = products;
      console.log(this.products);
    });
    // Example result ===> {key: "product1", name: "apple", price: 5}
  }

  ngOnInit() {
  }

}
