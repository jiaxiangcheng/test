import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from '../services/user/auth.service'
import { User } from '../user'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  profileForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  users: User[];

  constructor(private authService: AuthService) { }


  ngOnInit() {
  }

  onSubmit(username, email, password) {
    // TODO: Use EventEmitter with form value
    console.log(this.profileForm.get('username').value);
    username = username.trim();
    if (!username) return;
    email = email.trim();
    if (!email) return;
    password = password.trim();
    if (!password) return;
    const user = {
      username: username,
      email: email,
      password: password
    }
    this.authService.addUser(user)
      .subscribe(this.users.push(user));
  }

}
