import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Team } from '../../model/team';
import { CookieService } from 'ngx-cookie';



@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private token = this._cookieService.get('token');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Auth-Token': this.token
    })
  };
  private teamsUrl = 'https://qtdas-admin.herokuapp.com/api/teams';
  constructor(
    private http: HttpClient,
    private _cookieService: CookieService
  ) { }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.teamsUrl, this.httpOptions);
  }

  addTeams(team): Observable<Team> {
    return this.http.post<Team>(this.teamsUrl, team, this.httpOptions)
      .pipe(
        tap(resp => console.log('createTeam', resp))
      );
  }
}
