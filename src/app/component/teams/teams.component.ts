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
  totalTeams;
  numPerPage = 10;
  loopTimes;
  teamToDelete: Team = {
    name: '',
    description: ''
  };
  teamToUpdate;

  teamForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });
  updateTeamForm = new FormGroup({
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
    // this.getTeams();
    this.getTeamsPara(1);
    console.log('total teams', this.totalTeams);
  }

  setPageSize(event) {
    this.numPerPage = event.target.value;
    this.getTeamsPara(1);
  }

  // getTeams() {
  //   this.teamService.getTeams()
  //     .subscribe(res => {
  //       console.log(res.total);
  //       this.total = res.total;
  //       this.teams = res.teams;
  //     }
  //     );
  // }
  getTeamsPara(pageNumber) {
    this.teamService.getTeamsPara(pageNumber, this.numPerPage)
      .subscribe(res => {
        this.totalTeams = res.total;
        const totalPage = Math.ceil(Number(this.totalTeams) / this.numPerPage);
        // console.log('totalpage: ', totalPage);
        this.loopTimes = Array(totalPage).fill(0).map((x, i) => i);
        this.teams = res.teams;
      });

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
          this.getTeamsPara(1);
        }
        this.closeModal('addTeamModal');
      });
  }

  updateTeam() {
    const auxTeam = {
      _id: this.teamToUpdate._id,
      name: this.updateTeamForm.value.name,
      description: this.updateTeamForm.value.description
    };

    this.teamService.updateTeam(auxTeam)
    .subscribe(res => {
      this.closeModal('editTeamModal');
      this.getTeamsPara(1);
    });
  }

  deleteTeam() {
    this.teams = this.teams.filter(t => t !== this.teamToDelete);
    this.teamService.deleteTeam(this.teamToDelete)
      .subscribe(res => {
        this.getTeamsPara(1);
      });
  }

  openDeleteModal(id: string, team: Team) {
    this.teamToDelete = team;
    this.modalService.open(id);
  }

  openEditModal(id, team) {
    this.teamToUpdate = team;
    // console.log('team to uptdate', this.teamToUpdate);
    this.modalService.open(id);
  }

  openModal(id) {
    this.modalService.open(id);
  }

  closeModal(id) {
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
