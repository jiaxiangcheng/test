import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  token;
  email;

  constructor(
  ) { }

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.email = localStorage.getItem('email');
  }
}
