import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';    //per fer servir Reative form de Angular
import { Validators } from '@angular/forms';    //validacions de camp d'input
import { AuthService } from '../../services/user/auth.service' 
import { User } from '../../model/user'
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  users: Array<User> = [];

  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });



  constructor(
    private authService: AuthService, 
    private route: Router,
    private location: Location
  ) { }

  ngOnInit() {
  }

  onSubmit() {

    let name = this.registerForm.value.username;
    let email = this.registerForm.value.email;
    let password = this.registerForm.value.password;

    // TODO: Use EventEmitter with form value
    // console.log(this.profileForm.get('username').value);
    name = name.trim();
    if (!name) return;
    email = email.trim();
    if (!email) return;
    password = password.trim();
    if (!password) return;

    this.authService.addUser({name: name, email: email, password: password})
      .subscribe(user => {
         this.users.push(user);
      });
      this.route.navigate(['/login'])
  }
  goBack() {
    this.location.back();
  }

} 