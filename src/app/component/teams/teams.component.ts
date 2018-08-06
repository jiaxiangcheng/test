import { Component, OnInit } from '@angular/core';
import { Team } from '../../model/team';
import { TeamsService } from '../../services/teams/teams.service';
import { FormGroup, FormControl, Validators } from '../../../../node_modules/@angular/forms';
import { ModalService } from '../../services/modal/modal.service';
import { Location } from '../../../../node_modules/@angular/common';
import { MessageService } from '../../services/messages/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {

  teams: Array<Team> = [];
  total: Number;
  teamToDelete: Team = {
    name: '',
    description: ''
  };
  teamForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });
  err: any;
  // showError = false;

  constructor(
    private teamService: TeamsService,
    private modalService: ModalService,
    private location: Location,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getTeams();
  }

  getTeams() {
    this.teamService.getTeams()
      .subscribe(res => {
        console.log(res.total);
        this.total = res.total;
        this.teams = res.teams;
      }
      );
  }
  addTeam() {
    const name = this.teamForm.value.name;
    const description = this.teamForm.value.description;
    this.teamService.addTeams({name, description})
      .subscribe(team => {
        if (this.messageService.getExists()) {
          this.err = this.messageService.getMessage();
          // this.showError = true;
        } else {
          // console.log('addded');
          this.teams.push(team);
        }
      });
  }

  updateTeam(team) {
    this.teamService.setTeamToUpdate(team);
    this.router.navigate(['/teamEdit']);
  }

  deleteTeam() {
    this.teams = this.teams.filter(t => t !== this.teamToDelete);
    this.teamService.deleteTeam(this.teamToDelete).subscribe();
  }

  openDeleteModal(id: string, team: Team) {
    this.teamToDelete = team;
    this.modalService.open(id);
  }

  closeInfoModal(id) {
    this.modalService.close(id);
  }

  closeDeleteModal(id: string, action: string) {
      if (action === 'Yes') {
        this.deleteTeam();
      }
      this.modalService.close(id);
  }
  goBack() {
    this.location.back();
  }
}
