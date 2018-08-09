import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SnackBarService } from '../../../services/snackBar/snack-bar.service';

/**
 * @title Basic snack-bar
 */
@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit {
  constructor(public snackBar: MatSnackBar,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit() {
    this.snackBarService.snackBar$.subscribe(res => {
      this.openSnackBar(res.message, res.action);
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }
}
