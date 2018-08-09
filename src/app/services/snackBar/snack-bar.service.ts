import { Injectable } from '@angular/core';
import { Observable, Subject, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor() { }

  private snackBar = new Subject<any>(); // 发送器，通知有变化
  snackBar$ = this.snackBar.asObservable();    // 数据储存的地方， 可以被subscribe()然后就可以获取数据

  openSnackBar(value) {
    this.snackBar.next(value);
  }

}
