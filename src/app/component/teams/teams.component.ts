import { Component, OnInit } from '@angular/core';
import { Team } from '../../model/team'
import { TeamsService } from '../../services/teams/teams.service'

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {

  teams: Array<Team> = [];

  constructor(private teamService: TeamsService) { }

  ngOnInit() {
    this.getTeams();
  }

  getTeams() {
    this.teamService.getTeams()
      .subscribe(teams => this.teams = teams)
  }
}
