import { Component, OnInit } from '@angular/core';
import { Classification } from '../../../model/classification';
import { ClassificationsService } from '../../../services/classifications/classifications.service';
import { DialogService } from '../../../services/dialog/dialog.service';
import { MessageService } from '../../../services/messages/message.service';


@Component({
  selector: 'app-classifications',
  templateUrl: './classifications.component.html',
  styleUrls: ['./classifications.component.scss']
})
export class ClassificationsComponent implements OnInit {

  classifications: Array<Classification> = [];

  constructor(
    private classificationsService: ClassificationsService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getClassifications();
  }

  getClassifications() {
    return this.classificationsService.getClassification()
    .subscribe(res => {
      if (this.messageService.getExists()) {
        this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
        this.messageService.setMessage(null);
      } else {
        this.classifications = res;
      }
    });
  }

  openModal(mode) {
    this.dialogService.openDialog(mode);
  }
}
