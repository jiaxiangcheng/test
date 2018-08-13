import { Injectable } from '@angular/core';
import { Observable, Subject, of} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Individual } from '../../model/individual';
import { CookieService } from 'ngx-cookie';
import { MessageService } from '../messages/message.service';

@Injectable({
  providedIn: 'root'
})
export class IndividualService {
  private token = this.cookieService.get('token');
  private individualUrl = 'https://qtdas-admin.herokuapp.com/api/individuals';
  private currentPagesize = 10;         // default pagesize is 10
  private currentPageNumber = 1;              // default pageNumber is 1

  private individualSubject = new Subject<any>(); // 发送器，通知有变化
  individual$ = this.individualSubject.asObservable();    // 数据储存的地方， 可以被subscribe()然后就可以获取数据

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
  ) { }

  getIndividualsPara(pageNumber, pageSize): Observable<any> {
    this.currentPagesize = pageSize;
    return this.http.get<any>(`${this.individualUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  addIndividual(team): Observable<Individual> {
    return this.http.post<Individual>(this.individualUrl, team, this.httpOptions)
      .pipe(
        catchError(this.handleError<Individual>('createTeam')),
        tap(resp => console.log('createTeam', resp))
      );
  }

  setCurrentPageSize(num) {
    this.currentPagesize = num;
  }
  getCurrentPageSize() {
    return this.currentPagesize;
  }
  setCurrentPageNumber(num) {
    this.currentPageNumber = num;
  }
  getCurrentPageNumber() {
    return this.currentPageNumber;
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

  individualDataChanged(mode) {
    this.individualSubject.next(mode);  // emit有变化，并且传送新的value
  }

}
