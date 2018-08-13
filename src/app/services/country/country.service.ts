import { Injectable } from '@angular/core';
import { Observable, Subject, of} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie';
import { MessageService } from '../messages/message.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private token = this.cookieService.get('token');
  private countriesUrl = 'https://qtdas-admin.herokuapp.com/api/countries';
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private messageService: MessageService,
  ) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Auth-Token': this.token
    })
  };

  getCountries(): Observable<any> {
    return this.http.get<any>(this.countriesUrl, this.httpOptions).pipe(
      catchError(this.handleError<any>('getCountries')),
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status !== 200) {
        // TODO: send the error to remote logging infrastructure
        // console.error(error);
        // TODO: better job of transforming error for user consumption
        // console.log(`${operation} failed: ${error.message}`);
        // Catch the status code and do some actions if it is a particular situation
        this.messageService.setMessage(error.error);
      }
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
