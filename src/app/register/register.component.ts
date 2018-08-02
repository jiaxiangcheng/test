import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';    //per fer servir Reative form de Angular
import { Validators } from '@angular/forms';    //validacions de camp d'input
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
    //console.log(this.profileForm.get('username').value);
    username = username.trim();
    if (!username) return;
    email = email.trim();
    if (!email) return;
    password = password.trim();
    if (!password) return;
    const user:User = {
      name: username,
      email: email,
      password: password
    }
    this.authService.addUser(user)
      .subscribe(user => {
        this.users.push(user);
        console.log(this.users.length)
      });
  }

}