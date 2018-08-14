import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, throwToolbarMixedModesError } from '@angular/material';
import { FormGroup, FormControl, Validators } from '../../../../../node_modules/@angular/forms';
import { TeamsService } from '../../../services/teams/teams.service';
import { MessageService } from '../../../services/messages/message.service';
import { DialogService } from '../../../services/dialog/dialog.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from '../../../services/snackBar/snack-bar.service';
import { ClassificationsService } from '../../../services/classifications/classifications.service';
import { Classification } from '../../../model/classification';
import { GamesService } from '../../../services/games/games.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CountryService } from '../../../services/country/country.service';
import { IndividualService } from '../../../services/individual/individual.service';
import { Individual } from '../../../model/individual';
import { Team } from '../../../model/team';

// 为了在dialog-content能够acces
export interface DialogData {
  mode: string;
  obj: any;
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnDestroy {

  subscriptions: Array<Subscription> = [];      // 为了推出component的时候取消订阅，要不然再次进来的时候回再次订阅就会变成订阅两次

  constructor(
    public dialog: MatDialog,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.dialogService.dialog$.subscribe(mode => {
        // mode 传过来的时候是个obj {mode: 他的action类别, obj: optional的，可以选择传过来任何一个obj如果需要的话}
        if (mode.mode === 'addTeam') {
          this.openDialog(mode);
        }
        if (mode.mode === 'editTeam') {
          this.openDialog(mode);
        }
        if (mode.mode === 'deleteTeam') {
          this.openDialog(mode);
        }
        if (mode.mode === 'infoDialog') {
          this.openDialog(mode);
        }
        if (mode.mode === 'addClassification') {
          this.openDialog(mode);
        }
        if (mode.mode === 'deleteClassification') {
          this.openDialog(mode);
        }
        if (mode.mode === 'editClassification') {
          this.openDialog(mode);
        }
        if (mode.mode === 'addGame') {
          this.openDialog(mode);
        }
        if (mode.mode === 'editGame') {
          this.openDialog(mode);
        }
        if (mode.mode === 'deleteGame') {
          this.openDialog(mode);
        }
        if (mode.mode === 'addIndividual') {
          this.openDialog(mode);
        }
        if (mode.mode === 'editIndividual') {
          this.openDialog(mode);
        }
        if (mode.mode === 'deleteIndividual') {
          this.openDialog(mode);
        }
      })
    );
  }

  openDialog(mode): void {
    const dialogRef = this.dialog.open(DialogContentComponent, {
      width: '300px',
      data: {mode: mode.mode, obj: mode.obj}    // dialog-content 可以通过data来读取dialog.component里面的变量
    });
    dialogRef.afterClosed().subscribe(result => {
      //
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.html',
})
export class DialogContentComponent implements OnInit {

    subscriptions: Array<Subscription> = [];      // 为了推出component的时候取消订阅，要不然再次进来的时候回再次订阅就会变成订阅两次

    classifications: Array<Classification> = [];
    countries: Array<any> = [];
    individuals: Array<Individual> = [];
    teams: Array<Team> = [];

    contestantType;

    gameToDelete;
    teamToDelete;
    individualToDelete;
    classificationToDelete;

    startDate;
    endDate;

    classificationForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      description: new FormControl('', Validators.required)
    });

    gameForm = new FormGroup({
      name: new FormControl('', Validators.required),
      classification: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      typeOfGame: new FormControl('', Validators.required)
    });

    // Individual 和 Team 共用一个Form
    teamForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      description: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required)
    });

    constructor(
      public dialogRef: MatDialogRef<DialogContentComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
      private teamService: TeamsService,
      private messageService: MessageService,
      private dialogService: DialogService,
      private snackBarService: SnackBarService,
      private classificationsService: ClassificationsService,
      private gamesService: GamesService,
      private countryService: CountryService,
      private individualService: IndividualService
    ) {
      this.gameToDelete = this.data.obj;
      this.teamToDelete = this.data.obj;
      this.classificationToDelete = this.data.obj;
      this.individualToDelete = this.data.obj;
    }

    ngOnInit() {
      this.classificationsService.getAllClassifications(1, this.classificationsService.getTotal())
      .subscribe(res => {
        this.classifications = res.classifications;
      });
      this.individualService.getAllIndividuals(1, this.individualService.getTotal())
      .subscribe(res => {
        this.individuals = res.individuals;
      });
      this.teamService.getAllTeams(1, this.teamService.getTotal())
      .subscribe(res => {
        this.teams = res.teams;
      });
      this.countryService.getCountries().subscribe(res => {
        this.countries = res;
      });
    }

    // 从Date格式转换到Timestamp为了能够储存到DB里面
    addDate(type: string, event: MatDatepickerInputEvent<Date>) {
      let date = new Date();
      date = this.gameForm.value.date;
      if (type === 'start') {
        this.startDate = date.getTime() / 1000 + '';
      }
      if (type === 'end') {
        this.endDate = date.getTime() / 1000 + '';
      }
    }

    onSelectStartDate(date: string) {
      this.startDate = date;
    }
    onSelectEndDate(date: string) {
      this.endDate = date;
    }

    onCancelClick(): void {
      this.dialogRef.close();
    }

    onSaveClick(mode): void {
      const teamName = this.teamForm.value.name;
      const teamDescription = this.teamForm.value.description;
      const teamCountry = this.teamForm.value.country;
      if (mode === 'addTeam') {
        this.teamService.addTeams({name: teamName, description: teamDescription, country: teamCountry})
        .subscribe(team => {
            if (this.messageService.getExists()) {
              this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
              this.messageService.setMessage(null);
            } else {
              this.teamService.teamDataChanged('changed');
              this.snackBarService.openSnackBar({message: 'Added successful!', action: 'Ok'});
              this.onCancelClick();
            }
        });
      }
      if (mode === 'editTeam') {
        const teamToUpdate = this.data.obj;
        const auxTeam = {
          _id: teamToUpdate._id,
          name: this.teamForm.value.name,
          description: this.teamForm.value.description,
          country: this.teamForm.value.country
        };
        this.teamService.updateTeam(auxTeam)
        .subscribe(res => {
          if (this.messageService.getExists()) {
            this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
            this.messageService.setMessage(null);
          } else {
            this.snackBarService.openSnackBar({message: 'Updated successful!', action: 'Ok'});
            this.teamService.teamDataChanged('changed');
            this.onCancelClick();
          }
        });
      }

      if (mode === 'addClassification') {
        const classificationName = this.classificationForm.value.name;
        const classificationDescription = this.classificationForm.value.description;
        this.classificationsService.addClassification({name: classificationName, description: classificationDescription})
        .subscribe(classification => {
            if (this.messageService.getExists()) {
              this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
              this.messageService.setMessage(null);
            } else {
              this.classificationsService.classificationDataChanged('changed');
              this.snackBarService.openSnackBar({message: 'Added successful!', action: 'Ok'});
              this.onCancelClick();
            }
        });
      }
      if (mode === 'editClassification') {
        const classificationToUpdate = this.data.obj;
        const auxClass = {
          _id: classificationToUpdate._id,
          name: this.classificationForm.value.name,
          description: this.classificationForm.value.description
        };
        this.classificationsService.updateClassification(auxClass)
        .subscribe(res => {
          if (this.messageService.getExists()) {
            this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
            this.messageService.setMessage(null);
          } else {
            this.classificationsService.classificationDataChanged('changed');
            this.snackBarService.openSnackBar({message: 'Updated successful!', action: 'Ok'});
            this.onCancelClick();
          }
        });
      }
      if (mode === 'addGame') {
        const gameName = this.gameForm.value.name;
        const classificationID = this.gameForm.value.classification;
        const contestants = this.gameForm.value.typeOfGame;

        const auxGame = {
          name: gameName,
          classification: classificationID,
          startDate: this.startDate,
          endDate: this.endDate,
          contestants: contestants
        };
        this.gamesService.addGames(auxGame)
          .subscribe(res => {
            if (this.messageService.getExists()) {
              this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
              this.messageService.setMessage(null);
            } else {
              this.gamesService.gameDataChanged('changed');
              this.snackBarService.openSnackBar({message: 'Added successful!', action: 'Ok'});
              this.onCancelClick();
            }
          });
      }
      if (mode === 'editGame') {
        const gameToUpdate = this.data.obj;
        const auxGame = {
          _id: gameToUpdate._id,
          classification: gameToUpdate.classification._id,
          name: this.gameForm.value.name,
          startDate: this.startDate,
          endDate: this.endDate,
          contestants: this.gameForm.value.typeOfGame
        };
        this.gamesService.updateGame(auxGame)
        .subscribe(res => {
          if (this.messageService.getExists()) {
            this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
            this.messageService.setMessage(null);
          } else {
            this.gamesService.gameDataChanged('changed');
            this.snackBarService.openSnackBar({message: 'Updated successful!', action: 'Ok'});
            this.onCancelClick();
          }
        });
      }
      if (mode === 'addIndividual') {
        const individualName = this.teamForm.value.name;
        const individualDescription = this.teamForm.value.description;
        const individualCountry = this.teamForm.value.country;
        this.individualService.addIndividual({name: individualName, description: individualDescription, country: individualCountry})
        .subscribe(individual => {
            if (this.messageService.getExists()) {
              this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
              this.messageService.setMessage(null);
            } else {
              this.individualService.individualDataChanged('changed');
              this.snackBarService.openSnackBar({message: 'Added successful!', action: 'Ok'});
              this.onCancelClick();
            }
        });
      }
      if (mode === 'editIndividual') {
        const individualToUpdate = this.data.obj;
        const auxIndividual = {
          _id: individualToUpdate._id,
          name: this.teamForm.value.name,
          description: this.teamForm.value.description,
          country: this.teamForm.value.country
        };
        this.individualService.updateIndividual(auxIndividual)
        .subscribe(res => {
          if (this.messageService.getExists()) {
            this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
            this.messageService.setMessage(null);
          } else {
            this.snackBarService.openSnackBar({message: 'Updated successful!', action: 'Ok'});
            this.individualService.individualDataChanged('changed');
            this.onCancelClick();
          }
        });
      }
    }

    onDeleteClick(mode) {
      if (mode === 'deleteTeam') {
        this.teamService.deleteTeam(this.teamToDelete)
        .subscribe(res => {
          if (this.messageService.getExists()) {
            this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
            this.messageService.setMessage(null);
          } else {
            this.teamService.teamDataChanged('changed');
            this.onCancelClick();
          }
        });
      }
      if (mode === 'deleteClassification') {
        this.classificationsService.deleteClassification(this.classificationToDelete)
        .subscribe(res => {
          if (this.messageService.getExists()) {
            this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
            this.messageService.setMessage(null);
          } else {
            this.classificationsService.classificationDataChanged('changed');
            this.snackBarService.openSnackBar({message: 'Delete successful!', action: 'Ok'});
            this.onCancelClick();
          }
        });
      }
      if (mode === 'deleteGame') {
        this.gamesService.deleteGame(this.gameToDelete)
        .subscribe(res => {
          if (this.messageService.getExists()) {
            this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
            this.messageService.setMessage(null);
          } else {
            this.gamesService.gameDataChanged('changed');
            this.snackBarService.openSnackBar({message: 'Delete successful!', action: 'Ok'});
            this.onCancelClick();
          }
        });
      }
      if (mode === 'deleteIndividual') {
        this.individualService.deleteIndividual(this.individualToDelete)
        .subscribe(res => {
          if (this.messageService.getExists()) {
            this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
            this.messageService.setMessage(null);
          } else {
            this.individualService.individualDataChanged('changed');
            this.snackBarService.openSnackBar({message: 'Delete successful!', action: 'Ok'});
            this.onCancelClick();
          }
        });
      }
    }

    setType(type) {
      this.contestantType = type;
    }
}
