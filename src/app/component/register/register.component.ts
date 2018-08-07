import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';    // per fer servir Reative form de Angular
import { Validators } from '@angular/forms';    // validacions de camp d'input
import { User } from '../../model/user';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { MessageService } from '../../services/messages/message.service';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  err: any;


  constructor(
    private userService: UserService,
    private route: Router,
    private location: Location,
    private messageService: MessageService,
    private modalService: ModalService
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
          this.modalService.open('infoModal');
          this.messageService.setMessage(null);
        } else {
          this.route.navigate(['/login']);
        }
      });
  }
  goBack() {
    this.route.navigate(['/login']);
  }

  closeModal(id) {
    this.modalService.close(id);
  }

}
