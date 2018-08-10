import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, throwToolbarMixedModesError } from '@angular/material';
import { FormGroup, FormControl, Validators } from '../../../../../node_modules/@angular/forms';
import { TeamsService } from '../../../services/teams/teams.service';
import { MessageService } from '../../../services/messages/message.service';
import { DialogService } from '../../../services/dialog/dialog.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SnackBarService } from '../../../services/snackBar/snack-bar.service';
import { ClassificationsService } from '../../../services/classifications/classifications.service';

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
        } else if (mode.mode === 'editTeam') {
          this.openDialog(mode);
        } else if (mode.mode === 'deleteTeam') {
          this.openDialog(mode);
        } else if (mode.mode === 'infoDialog') {
          this.openDialog(mode);
        } else if (mode.mode === 'addClassification') {
          this.openDialog(mode);
        } else if (mode.mode === 'deleteClassification') {
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
export class DialogContentComponent {

  teamToDelete;
  classificationToDelete;

  constructor(
    public dialogRef: MatDialogRef<DialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private teamService: TeamsService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private snackBarService: SnackBarService,
    private classificationsService: ClassificationsService
  ) {
    this.teamToDelete = this.data.obj;
    this.classificationToDelete = this.data.obj;
  }

    Form = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });

    onCancelClick(): void {
      this.dialogRef.close();
    }

    onSaveClick(mode): void {
      const teamName = this.Form.value.name;
      const teamDescription = this.Form.value.description;
      if (mode === 'addTeam') {
        this.teamService.addTeams({name: teamName, description: teamDescription})
        .subscribe(team => {
            if (this.messageService.getExists()) {
              this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
              this.messageService.setMessage(null);
            } else {
              this.teamService.teamDataChanged('changed');
              this.snackBarService.openSnackBar({message: 'Added a new team!', action: 'Ok'});
              this.onCancelClick();
            }
        });
      }
      if (mode === 'editTeam') {
        const teamToUpdate = this.data.obj;
        const auxTeam = {
          _id: teamToUpdate._id,
          name: this.Form.value.name,
          description: this.Form.value.description
        };
        this.teamService.updateTeam(auxTeam)
        .subscribe(res => {
          if (this.messageService.getExists()) {
            this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
            this.messageService.setMessage(null);
          } else {
            this.snackBarService.openSnackBar({message: 'Updated a team!', action: 'Ok'});
            this.teamService.teamDataChanged('changed');
            this.onCancelClick();
          }
        });
      }

      if (mode === 'addClassification') {
        const classificationName = this.Form.value.name;
        const classificationDescription = this.Form.value.description;
        console.log('name', classificationName);
        this.classificationsService.addClassification({name: classificationName, description: classificationDescription})
        .subscribe(classification => {
            if (this.messageService.getExists()) {
              this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
              this.messageService.setMessage(null);
            } else {
              // this.teamService.teamDataChanged('changed');  CANIVARRRRRRRR
              this.snackBarService.openSnackBar({message: 'Added a new classification!', action: 'Ok'});
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
            // this.classificationsService.teamDataChanged('changed');
            this.onCancelClick();
          }
        });
      }
    }

}
