import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder} from '../../../../node_modules/@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../services/user/auth.service';
import { CookieService } from 'ngx-cookie';
import { UserService } from '../../services/user/user.service';
import { MessageService } from '../../services/messages/message.service';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  err: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    private userService: UserService,
    private messageService: MessageService,
    private modalService: ModalService,
    private formBService: FormBuilder
  ) { }

  ngOnInit() {
    this.loginForm = this.formBService.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(5)
      ]]
    });
  }

  setCookie() {
    const user = this.authService.getCurrentUser();
    const authToken = user.token;
    this.cookieService.put('token', authToken);

    localStorage.setItem('token', authToken);
    localStorage.setItem('email', user.email);
  }
  getCookie(key) {
    return this.cookieService.get(key);
  }

  login() {
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
        if (this.messageService.getExists()) {
          this.err = this.messageService.getMessage();
          this.modalService.open('infoModal');
        } else {
          this.authService.setCurrentUser({email, password, token: user.token});
          this.setCookie();
          // 呼叫userService的方法，让订阅者们收到新的值
          this.userService.changeUserStatus('loginSuccess');
          this.router.navigate(['/userinfo']);
        }
    });
  }

  closeModal(id) {
    this.modalService.close(id);
    this.messageService.setMessage(null);
  }
}
