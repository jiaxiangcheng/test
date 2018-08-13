import { Component, OnInit } from '@angular/core';
import { GamesService } from '../../../services/games/games.service';
import { DialogService } from '../../../services/dialog/dialog.service';
import { MessageService } from '../../../services/messages/message.service';
import { Game } from '../../../model/game';
import { Location } from '../../../../../node_modules/@angular/common';
import { Router } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

  games: Array<Game> = [];
  totalGames;
  numPerPage;
  loopTimes;

  constructor(
    private gamesService: GamesService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    this.getGamesPara(1);
    this.gamesService.game$.subscribe(teamTable => {
      if (teamTable === 'changed') {
        this.getGamesPara(this.gamesService.getCurrentPageNumber());
      }
    });
  }

  setPageSize(event) {
    const numPerPage = event.target.value;
    this.gamesService.setCurrentPageSize(numPerPage);
    this.getGamesPara(1);
  }

  getGamesPara(pageNumber) {
    this.gamesService.setCurrentPageNumber(pageNumber);
    this.gamesService.getGamesPara(this.gamesService.getCurrentPageNumber(), this.gamesService.getCurrentPageSize())
      .subscribe(res => {
        if (this.messageService.getExists()) {
          this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
          this.messageService.setMessage(null);
        } else {
          this.totalGames = res.total;
          const totalPage = Math.ceil(Number(this.totalGames) / this.gamesService.getCurrentPageSize());
          // console.log('totalpage: ', totalPage);
          this.loopTimes = Array(totalPage).fill(0).map((x, i) => i);
          this.games = res.games;
        }
      });
  }

  openModal(mode) {
    this.dialogService.openDialog(mode);
  }
  goBack() {
    this.router.navigate(['/userinfo']);
  }
}
