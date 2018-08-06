import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {


  currentUser;

  constructor(
    private authservice: AuthService,
    private _cookieService: CookieService,
    private router: Router
  ) { }

  ngOnInit() {
    this.currentUser = this.authservice.getCurrentUser();
    console.log('this current', this.currentUser);
    console.log('this get', this.authservice.getCurrentUser());
  }

  logOut() {
    this._cookieService.remove('token');
    this.router.navigate(['/login']);
  }
}
