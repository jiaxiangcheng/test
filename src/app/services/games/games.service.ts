import { Injectable } from '@angular/core';
import { Observable, Subject, of} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Game } from '../../model/game';
import { CookieService } from 'ngx-cookie';
import { MessageService } from '../messages/message.service';
import { DialogService } from '../../services/dialog/dialog.service';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private token = this.cookieService.get('token');
  private gamesUrl = 'https://qtdas-admin.herokuapp.com/api/games';
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


  getGames(): Observable<any> {
    return this.http.get<any>(this.gamesUrl, this.httpOptions);
  }

  addGames(game): Observable<Game> {
    return this.http.post<Game>(this.gamesUrl, game, this.httpOptions)
      .pipe(
        catchError(this.handleError<Game>('creategame')),
        tap(resp => console.log('creategame', resp))
      );
  }

  deleteGame(game): Observable<Game> {
    return this.http.delete<Game>(`${this.gamesUrl}/${game._id}`, this.httpOptions).pipe(
      catchError(this.handleError<Game>('deleteGame')),
      tap(_ => console.log(`deleted Game id=${game._id}`)
    ));
  }

  updateGame(game): Observable<any> {
    return this.http.put(`${this.gamesUrl}/${game._id}`, {name: game.name, description: game.description},  this.httpOptions).pipe(
      catchError(this.handleError<Game>('updategame')),
      tap(_ => console.log(`updated game id=${game._id}`)
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
}