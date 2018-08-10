import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder} from '../../../../node_modules/@angular/forms';
import { DialogService } from '../../services/dialog/dialog.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/user/auth.service';
import { CookieService } from 'ngx-cookie';
import { UserService } from '../../services/user/user.service';
import { MessageService } from '../../services/messages/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    private userService: UserService,
    private messageService: MessageService,
    private formBService: FormBuilder,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBService.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(7)
      ]]
    });
  }

  setCookie(email, password, token) {
    this.cookieService.put('token', token);
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
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
          this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
          this.messageService.setMessage(null);
        } else {
          this.setCookie(email, password, user.token);
          // 呼叫userService的方法，让订阅者们收到新的值
          this.userService.changeUserStatus('loginSuccess');
          this.router.navigate(['/userinfo']);
        }
    });
  }
}
