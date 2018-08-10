import { Injectable } from '@angular/core';
import { Observable, Subject, of} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { MessageService } from '../messages/message.service';
import { DialogService } from '../../services/dialog/dialog.service';
import { catchError, map, tap } from 'rxjs/operators';
import { Classification } from '../../model/classification';

@Injectable({
  providedIn: 'root'
})
export class ClassificationsService {
  private token = this.cookieService.get('token');
  private classificationsUrl = 'https://qtdas-admin.herokuapp.com/api/classifications';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Auth-Token': this.token
    })
  };

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) { }

  getClassification(): Observable<any> {
    return this.http.get<any>(this.classificationsUrl, this.httpOptions);
  }

  addClassification(classification): Observable<any> {
    return this.http.post<any>(this.classificationsUrl, classification, this.httpOptions)
    .pipe(
      catchError(this.handleError<any>('createClassification')),
      tap(resp => console.log('createClassification', resp))
    );
  }

  deleteClassification(classification): Observable<Classification> {
    return this.http.delete<Classification>(`${this.classificationsUrl}/${classification._id}`, this.httpOptions).pipe(
      catchError(this.handleError<Classification>('deleteClassification')),
      tap(_ => console.log(`deleted classification id=${classification._id}`)
    ));
  }

  updateClassification(classification): Observable<any> {
    return this.http.put(`${this.classificationsUrl}/${classification._id}`, {name: classification.name,
      description: classification.description},  this.httpOptions).pipe(
      catchError(this.handleError<Classification>('updateClassification')),
      tap(_ => console.log(`updated classification id=${classification._id}`)
    ));
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status !== 200) {
        // TODO: send the error to remote logging infrastructure
         console.error(error);
        // TODO: better job of transforming error for user consumption
         console.log(`${operation} failed: ${error.message}`);
        // Catch the status code and do some actions if it is a particular situation
        this.messageService.setMessage(error.error);
      }
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
