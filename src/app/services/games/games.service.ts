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
}
