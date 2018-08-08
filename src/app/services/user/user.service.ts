import { MessageService } from '../../services/messages/message.service';
import { ModalService } from '../../services/modal/modal.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, of} from 'rxjs';
import { User } from '../../model/user';
import { catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';




const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})


export class UserService {

  private user = new Subject<string>(); // 发送器，通知有变化
  user$ = this.user.asObservable();    // 数据储存的地方， 可以被subscribe()然后就可以获取数据

  private createUserUrl = 'https://qtdas-admin.herokuapp.com/api/users';
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  addUser(user): Observable<User> {
    return this.http.post<User>(this.createUserUrl, user, httpOptions)
      .pipe(
        catchError(this.handleError<User>('addUser')),
        tap(resp => console.log('createResponse', resp))
    );
  }

  changeUserStatus(value) {
    this.user.next(value);  // emit有变化，并且传送新的value
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status !== 200) {
        // TODO: send the error to remote logging infrastructure
        console.error(error);
        // TODO: better job of transforming error for user consumption
        console.log(`${operation} failed: ${error.message}`);
        // Catch the status code and do some actions if it is a particular situation
        this.messageService.setMessage(error);
      }
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
