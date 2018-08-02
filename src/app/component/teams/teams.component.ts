import { Component, OnInit } from '@angular/core';
import { Team } from '../../model/team';
import { TeamsService } from '../../services/teams/teams.service';
import { FormGroup, FormControl, Validators } from '../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {

  teams: Array<Team> = [];
  teamForm = new FormGroup({
    id: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  constructor(private teamService: TeamsService) { }

  ngOnInit() {
    this.getTeams();
  }

  getTeams() {
    this.teamService.getTeams()
      .subscribe(teams => this.teams = teams);
  }

  addTeam() {
    // const id = this.teamForm.value.id;
    const name = this.teamForm.value.name;
    const description = this.teamForm.value.description;
    this.teamService.addTeams({name, description})
      .subscribe(team => {
        this.teams.push(team);
      });
  }
}
