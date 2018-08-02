import { Injectable } from '@angular/core';

import { User } from '../../user';

//necessari per fer add, delete, update
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of} from '../../../../node_modules/rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://qtdas-admin.herokuapp.com/api/users';
  constructor(private http: HttpClient) { }

  addUser(user): Observable<User> {
    return this.http.post<User>(this.url, user, httpOptions).pipe(
      tap((user: User) => console.log(`added user}`)),
      catchError(this.handleError<User>('addUser')))
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

