import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/user/auth.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  logged;
  email;
  constructor (
    private authService: AuthService,
    private userService: UserService,
    ) {

    // 可以从任何组件来订阅user$，来获取改变的值
    this.userService.user$.subscribe(r => {
      if (r === 'loginSuccess') {
        this.logged = localStorage.getItem('token');
      }
    });
  }

  logout() {
    this.authService.logout();
    this.logged = null;
  }

  ngOnInit() {
    this.logged = localStorage.getItem('token');
    this.email = localStorage.getItem('email');
  }

}
