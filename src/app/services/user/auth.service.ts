import { Injectable } from '@angular/core';

import { User } from '../../model/user';
// Angular guard
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie';

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
  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
    private cookieService: CookieService
  ) { }


  addUser(user): Observable<User> {
    return this.http.post<User>(this.createUserUrl, user, httpOptions)
      .pipe(
        tap(resp => console.log('createResponse', resp))
      // tap((user: User) => console.log(`added user}`)),
      // catchError(this.handleError<User>('addUser'))
    );
  }

  login(user): Observable<User> {
    console.log('33333d');
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

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    // console.log('==>', token);
    if (token) {
      // Check whether the token is expired and return
      // true or false
      // return !this.jwtHelper.isTokenExpired(token);
      return true;
    } else {
      return false;
    }
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

