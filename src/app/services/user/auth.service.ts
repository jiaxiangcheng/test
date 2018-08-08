import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../model/user';
// Angular guard
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie';

//  necessari per fer add, delete, update
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from '../messages/message.service';
import { ModalService } from '../modal/modal.service';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private authrUrl = 'https://qtdas-admin.herokuapp.com/api/auth';
  private currentUser: User;
  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
    private cookieService: CookieService,
    private router: Router,
    private messageService: MessageService,
    private modalService: ModalService
  ) { }

  login(user): Observable<User> {
    return this.http.post<User>(this.authrUrl, user, httpOptions)
    .pipe(
      catchError(this.handleError<User>('login')),
      tap(resp => console.log('loginResponse', resp))
    );

  }

  logout() {
    this.cookieService.remove('token');
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  setCurrentUser(user) {
    this.currentUser = user;
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
      console.log('error', error.status);
      if (error.status !== 200) {
        // TODO: send the error to remote logging infrastructure
        console.error(error);
        // TODO: better job of transforming error for user consumption
        console.log(`${operation} failed: ${error.message}`);
        // Catch the status code and do some actions if it is a particular situation
        this.messageService.setMessage(error);
        this.modalService.open('infoModal');
      }
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

