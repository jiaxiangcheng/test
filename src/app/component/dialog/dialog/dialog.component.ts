import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, throwToolbarMixedModesError } from '@angular/material';
import { FormGroup, FormControl, Validators } from '../../../../../node_modules/@angular/forms';
import { TeamsService } from '../../../services/teams/teams.service';
import { MessageService } from '../../../services/messages/message.service';
import { DialogService } from '../../../services/dialog/dialog.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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

  subscriptions: Array<Subscription> = [];

  constructor(
    public dialog: MatDialog,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.dialogService.dialog$.subscribe(mode => {
        if (mode.mode === 'addTeam') {
          this.openDialog(mode);
        } else if (mode.mode === 'editTeam') {
          this.openDialog(mode);
        } else if (mode.mode === 'deleteTeam') {
          this.openDialog(mode);
        } else if (mode.mode === 'infoDialog') {
          this.openDialog(mode);
        }
      })
    );
  }

  openDialog(mode): void {
    const dialogRef = this.dialog.open(DialogContentComponent, {
      width: '300px',
      data: {mode: mode.mode, obj: mode.obj}
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
export class DialogContentComponent {

  teamToDelete;

  constructor(
    public dialogRef: MatDialogRef<DialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private teamService: TeamsService,
    private messageService: MessageService,
    private router: Router,
    private dialogService: DialogService
  ) {
    this.teamToDelete = this.data.obj;
  }

    teamForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });

    onCancelClick(): void {
      this.dialogRef.close();
    }

    onSaveClick(mode): void {
      const name = this.teamForm.value.name;
      const description = this.teamForm.value.description;
      if (mode === 'addTeam') {
        this.teamService.addTeams({name, description})
        .subscribe(team => {
            this.teamService.teamDataChanged('changed');
            this.onCancelClick();
        });
      }
      if (mode === 'editTeam') {
        const teamToUpdate = this.data.obj;
        const auxTeam = {
          _id: teamToUpdate._id,
          name: this.teamForm.value.name,
          description: this.teamForm.value.description
        };
        this.teamService.updateTeam(auxTeam)
        .subscribe(res => {
           this.teamService.teamDataChanged('changed');
          this.onCancelClick();
        });
      }
    }

    onDeleteClick() {
      this.teamService.deleteTeam(this.teamToDelete)
      .subscribe(res => {
        this.teamService.teamDataChanged('changed');
        this.onCancelClick();
      });
    }

}
