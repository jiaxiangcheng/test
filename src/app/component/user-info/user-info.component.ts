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


  token = localStorage.getItem('token');
  email = localStorage.getItem('email');

  constructor(
    private authservice: AuthService,
    private _cookieService: CookieService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logOut() {
    this._cookieService.remove('token');
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
