import { Component, OnInit } from '@angular/core';
import { Individual } from '../../../model/individual';
import { IndividualService } from '../../../services/individual/individual.service';
import { MessageService } from '../../../services/messages/message.service';
import { DialogService } from '../../../services/dialog/dialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-individuals',
  templateUrl: './individuals.component.html',
  styleUrls: ['./individuals.component.scss']
})
export class IndividualsComponent implements OnInit {
  individuals: Array<Individual> = [];
  totalIndividual;
  numPerPage;
  loopTimes;

  constructor(
    private individualService: IndividualService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getIndividualsPara(1);
    this.individualService.individual$.subscribe(teamTable => {
      if (teamTable === 'changed') {
        this.getIndividualsPara(this.individualService.getCurrentPageNumber());
      }
    });
  }

  getIndividualsPara(pageNumber) {
    this.individualService.setCurrentPageNumber(pageNumber);
    this.individualService.getIndividualsPara(this.individualService.getCurrentPageNumber(), this.individualService.getCurrentPageSize())
      .subscribe(res => {
        if (this.messageService.getExists()) {
          this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
          this.messageService.setMessage(null);
        } else {
          this.totalIndividual = res.total;
          const totalPage = Math.ceil(Number(this.totalIndividual) / this.individualService.getCurrentPageSize());
          this.individualService.setTotal(this.totalIndividual);
          this.loopTimes = Array(totalPage).fill(0).map((x, i) => i);
          this.individuals = res.individuals;
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
