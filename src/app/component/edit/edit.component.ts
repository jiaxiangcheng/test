import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '../../../../node_modules/@angular/forms';
import { TeamsService } from '../../services/teams/teams.service';
import { Location } from '@angular/common';
import { Team } from '../../model/team';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  teamUpdate;
  newTeam;
  updateTeamForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  constructor(
    private teamService: TeamsService,
    private location: Location
  ) { }

  ngOnInit() {
    this.teamUpdate = this.getTeamToUpdate();
  }

  getTeamToUpdate(): Team {
    return this.teamService.getTeamToUpdate();
  }

  updateTeam() {
    this.newTeam = {
      _id: this.teamUpdate._id,
      name: this.updateTeamForm.value.name,
      description: this.updateTeamForm.value.description
    };
    this.teamService.updateTeam(this.newTeam)
      .subscribe(res => {
        this.location.back();
      });
  }

  goBack() {
    this.location.back();
  }
}
