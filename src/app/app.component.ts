import { Component, OnInit } from '@angular/core';
import { SidebarService } from './services/sidebar/sidebar-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  opened = false;

  constructor(
    private sidebarService: SidebarService
  ) {
    this.sidebarService.opened$.subscribe(r => {
      if (r === 'open') {
        this.opened = true;
      } else {
        this.opened = false;
      }
    });
  }

  ngOnInit() {
  }
}
