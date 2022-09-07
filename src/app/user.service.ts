import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from 'src/models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userData: User = {
    "username": "johndoe"
  }

  constructor() { }

  getUser(): Observable<User> {
    return of(this.userData);
  }
}
