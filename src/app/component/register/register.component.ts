import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';    // per fer servir Reative form de Angular
import { Validators } from '@angular/forms';    // validacions de camp d'input
import { User } from '../../model/user';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { MessageService } from '../../services/messages/message.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(7)
    ])
  });
  err: any;


  constructor(
    private userService: UserService,
    private route: Router,
    private location: Location,
    private messageService: MessageService,
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
    if (!name) {
      return;
    }
    email = email.trim();
    if (!email) {
      return;
    }
    password = password.trim();
    if (!password) {
      return;
    }
    this.userService.addUser({name: name, email: email, password: password})
      .subscribe(user => {
        if (this.messageService.getExists()) {
          this.err = this.messageService.getMessage();
          this.messageService.setMessage(null);
        } else {
          this.route.navigate(['/login']);
        }
      });
  }
  goBack() {
    this.route.navigate(['/login']);
  }
}
