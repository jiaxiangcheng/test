import { Injectable } from '@angular/core';
import { Observable, Subject, of} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Team } from '../../model/team';
import { CookieService } from 'ngx-cookie';
import { MessageService } from '../messages/message.service';
import { DialogService } from '../../services/dialog/dialog.service';


@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private token = this.cookieService.get('token');
  private teamsUrl = 'https://qtdas-admin.herokuapp.com/api/teams';
  private currentPagesize = 10;         // default pagesize is 10
  private currentPageNumber = 1;              // default pageNumber is 1

  private teamSubject = new Subject<any>(); // 发送器，通知有变化
  team$ = this.teamSubject.asObservable();    // 数据储存的地方， 可以被subscribe()然后就可以获取数据

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

  getTeams(): Observable<any> {
    return this.http.get<any>(this.teamsUrl, this.httpOptions);
  }

  getTeamsPara(pageNumber, pageSize): Observable<any> {
    this.currentPagesize = pageSize;
    return this.http.get<any>(`${this.teamsUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
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

  addTeams(team): Observable<Team> {
    return this.http.post<Team>(this.teamsUrl, team, this.httpOptions)
      .pipe(
        catchError(this.handleError<Team>('createTeam')),
        tap(resp => console.log('createTeam', resp))
      );
  }

  deleteTeam(team): Observable<Team> {
    return this.http.delete<Team>(`${this.teamsUrl}/${team._id}`, this.httpOptions).pipe(
      catchError(this.handleError<Team>('deleteTeam')),
      tap(_ => console.log(`deleted team id=${team._id}`)
    ));
  }

  updateTeam(team): Observable<any> {
    return this.http.put(`${this.teamsUrl}/${team._id}`, {name: team.name, description: team.description, country: team.country},
    this.httpOptions).pipe(
      catchError(this.handleError<Team>('updateTeam')),
      tap(_ => console.log(`updated team id=${team._id}`)
    ));
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

  teamDataChanged(mode) {
    this.teamSubject.next(mode);  // emit有变化，并且传送新的value
  }
}
