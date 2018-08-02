import { Injectable } from '@angular/core';

import { User } from '../../model/user';

//  necessari per fer add, delete, update
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private createUserUrl = 'https://qtdas-admin.herokuapp.com/api/users';
  private authrUrl = 'https://qtdas-admin.herokuapp.com/api/auth';
  private currentUser: User;
  constructor(private http: HttpClient) { }


  addUser(user): Observable<User> {
    return this.http.post<User>(this.createUserUrl, user, httpOptions)
      .pipe(
        tap(resp => console.log('createResponse', resp))
      // tap((user: User) => console.log(`added user}`)),
      // catchError(this.handleError<User>('addUser'))
    );
  }

  login(user): Observable<User> {
    return this.http.post<User>(this.authrUrl, user, httpOptions)
    .pipe(
      tap(resp => console.log('loginResponse', resp))
    );

  }
  setCurrentUser(user) {
    this.currentUser = user;
    console.log(user);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

