import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '../../../../node_modules/@angular/forms';
import { AuthService } from '../../services/user/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login() {
    let email = this.loginForm.value.email;
    let password = this.loginForm.value.password;
    email = email.trim();
    if (!email) return;
    password = password.trim();
    if (!password) return;

    this.authService.login({email: email, password: password})
      .subscribe(user => {
        console.log(user)
        this.authService.setCurrentUser({email: email, password: password})
        this.router.navigate(['/userinfo'])
    });
  }
}
