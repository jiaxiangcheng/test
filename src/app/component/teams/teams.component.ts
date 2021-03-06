import { Component, OnInit } from '@angular/core';
import { Team } from '../../model/team';
import { TeamsService } from '../../services/teams/teams.service';
import { MessageService } from '../../services/messages/message.service';
import { DialogService } from '../../services/dialog/dialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {

  teams: Array<Team> = [];
  totalTeams;
  numPerPage;
  loopTimes;

  constructor(
    private teamService: TeamsService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getTeamsPara(1);
    this.teamService.team$.subscribe(teamTable => {
      if (teamTable === 'changed') {
        this.getTeamsPara(this.teamService.getCurrentPageNumber());
      }
    });
  }

  setPageSize(event) {
    const numPerPage = event.target.value;
    this.teamService.setCurrentPageSize(numPerPage);
    this.getTeamsPara(1);
  }

  getTeamsPara(pageNumber) {
    this.teamService.setCurrentPageNumber(pageNumber);
    this.teamService.getTeamsPara(this.teamService.getCurrentPageNumber(), this.teamService.getCurrentPageSize())
      .subscribe(res => {
        if (this.messageService.getExists()) {
          this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
          this.messageService.setMessage(null);
        } else {
          this.totalTeams = res.total;
          const totalPage = Math.ceil(Number(this.totalTeams) / this.teamService.getCurrentPageSize());
          this.teamService.setTotal(this.totalTeams);
          this.loopTimes = Array(totalPage).fill(0).map((x, i) => i);
          this.teams = res.teams;
        }
      });
  }

  goBack() {
    this.router.navigate(['/userinfo']);
  }

  openModal(mode) {
    this.dialogService.openDialog(mode);
  }
}
