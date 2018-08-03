import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Team } from '../../model/team';
import { CookieService } from 'ngx-cookie';
import { MessageService } from '../messages/message.service';
import { ModalService } from '../modal/modal.service';



@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private token = this._cookieService.get('token');
  private teamsUrl = 'https://qtdas-admin.herokuapp.com/api/teams';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Auth-Token': this.token
    })
  };

  constructor(
    private http: HttpClient,
    private _cookieService: CookieService,
    private messageService: MessageService,
    private modalService: ModalService
  ) { }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.teamsUrl, this.httpOptions);
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

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status !== 200) {
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
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
