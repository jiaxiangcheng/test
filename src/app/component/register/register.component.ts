import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';    // per fer servir Reative form de Angular
import { Validators } from '@angular/forms';    // validacions de camp d'input
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { MessageService } from '../../services/messages/message.service';
import { DialogService } from '../../services/dialog/dialog.service';

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
    private messageService: MessageService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
  }

  onSubmit() {

    let name = this.registerForm.value.username;
    let email = this.registerForm.value.email;
    let password = this.registerForm.value.password;

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
          this.dialogService.openDialog({mode: 'infoDialog', obj: this.messageService.getMessage()});
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
