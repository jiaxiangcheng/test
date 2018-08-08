import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/user/auth.service';
import { UserService } from '../../../services/user/user.service';
import { SidebarService } from '../../../services/sidebar/sidebar-service.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  logged;
  email;
  sidebarOpened = false;
  constructor (
    private authService: AuthService,
    private userService: UserService,
    private sidebarService: SidebarService
    ) {

    // 可以从任何组件来订阅user$，来获取改变的值
    this.userService.user$.subscribe(r => {
      if (r === 'loginSuccess') {
        this.logged = localStorage.getItem('token');
        this.email = localStorage.getItem('email');
      }
    });
  }

  logout() {
    this.authService.logout();
    this.logged = null;
  }

  ngOnInit() {
  }

  toggle() {
    if (this.sidebarOpened) {
      this.sidebarService.changeSidebarStatus('close');
      this.sidebarOpened = false;
    } else {
      this.sidebarService.changeSidebarStatus('open');
      this.sidebarOpened = true;
    }

  }
}
