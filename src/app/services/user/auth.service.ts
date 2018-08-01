import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://qtdas-admin.herokuapp.com/api/users';
  constructor(private http: HttpClient) { }

  addUser(user) {
    
  }
}
