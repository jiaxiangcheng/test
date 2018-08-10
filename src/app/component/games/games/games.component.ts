import { Component, OnInit } from '@angular/core';
import { GamesService } from '../../../services/games/games.service';
import { DialogService } from '../../../services/dialog/dialog.service';
import { MessageService } from '../../../services/messages/message.service';
import { Game } from '../../../model/game';
import { Location } from '../../../../../node_modules/@angular/common';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

  games: Array<Game> = [];

  constructor(
    private gamesService: GamesService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private location: Location,
  ) { }

  ngOnInit() {
    this.getGames();
  }

  getGames() {
    return this.gamesService.getGames()
    .subscribe(res => {
      if (this.messageService.getExists()) {
        this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
        this.messageService.setMessage(null);
      } else {
        this.games = res;
      }
    });
  }

  openModal(mode) {
    this.dialogService.openDialog(mode);
  }
  goBack() {
    this.location.back();
  }
}
