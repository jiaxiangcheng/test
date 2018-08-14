import { Component, OnInit } from '@angular/core';
import { Classification } from '../../../model/classification';
import { ClassificationsService } from '../../../services/classifications/classifications.service';
import { DialogService } from '../../../services/dialog/dialog.service';
import { MessageService } from '../../../services/messages/message.service';
import { Location } from '../../../../../node_modules/@angular/common';
import { Router } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-classifications',
  templateUrl: './classifications.component.html',
  styleUrls: ['./classifications.component.scss']
})
export class ClassificationsComponent implements OnInit {

  classifications: Array<Classification> = [];
  totalClassifications;
  numPerPage;
  loopTimes;

  constructor(
    private classificationsService: ClassificationsService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    this.getClassificationsPara(1);
    this.classificationsService.classification$.subscribe(classificationTable => {
      if (classificationTable === 'changed') {
        this.getClassificationsPara(this.classificationsService.getCurrentPageNumber());
      }
    });
  }

  setPageSize(event) {
    const numPerPage = event.target.value;
    this.classificationsService.setCurrentPageSize(numPerPage);
    this.getClassificationsPara(1);
  }

  // 这是一个Get方法，但是他需要提供第一页和每页数量
  getClassificationsPara(pageNumber) {
    this.classificationsService.setCurrentPageNumber(pageNumber);
    this.classificationsService.getClassificationsPara(this.classificationsService.getCurrentPageNumber(),
    this.classificationsService.getCurrentPageSize())
      .subscribe(res => {
        if (this.messageService.getExists()) {
          this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
          this.messageService.setMessage(null);
        } else {
          this.totalClassifications = res.total;
          this.classificationsService.setTotal(this.totalClassifications);
          const totalPage = Math.ceil(Number(this.totalClassifications) / this.classificationsService.getCurrentPageSize());
          this.loopTimes = Array(totalPage).fill(0).map((x, i) => i);
          this.classifications = res.classifications;
        }
      });
  }

  openModal(mode) {
    this.dialogService.openDialog(mode);
  }

  goBack() {
    this.router.navigate(['/userinfo']);
  }
}
