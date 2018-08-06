import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '../../../../node_modules/@angular/forms';


import { Router } from '@angular/router';
import { AuthService } from '../../services/user/auth.service';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private _cookieService: CookieService
  ) { }

  ngOnInit() {

  }

  login() {
    console.log('asdasdasd');
    let email = this.loginForm.value.email;
    let password = this.loginForm.value.password;
    email = email.trim();
    if (!email) {
      return;
    }
    password = password.trim();
    if (!password) {
      return;
    }
    this.authService.login({email: email, password: password})
      .subscribe(user => {
        // console.log(user);
        this.authService.setCurrentUser({email, password, token: user.token});
        this.router.navigate(['/userinfo']);
        this.setCookie();
        // console.log(this.getCookie('token'));
    });
  }
  setCookie() {
    const user = this.authService.getCurrentUser();
    const authToken = user.token;
    this._cookieService.put('token', authToken);

    localStorage.setItem('token', authToken);
    localStorage.setItem('email', user.email);
  }

  getCookie(key) {
    return this._cookieService.get(key);
  }
}
