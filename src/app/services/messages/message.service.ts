import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  message: any;
  exists = false;
  constructor() { }

  setMessage(message: any) {
    this.message = message;
    this.exists = true;
  }

  getMessage() {
    return this.message;
  }

  getExists() {
    return this.exists;
  }
}
