import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/user/auth.service'

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  private currentUser = this.authservice.getCurrentUser();

  constructor(private authservice: AuthService) { }

  ngOnInit() {
  }

  
}
