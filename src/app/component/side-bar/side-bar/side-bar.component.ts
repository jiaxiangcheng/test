import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})



export class SideBarComponent implements OnInit {

  opened: boolean;
  active = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    if (window.location.pathname === '/teams') {
      this.active = true;
    }
  }
}
