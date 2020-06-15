import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/User';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(`http://localhost:3000/users`);
  }

  register(user: User) {
    return this.http.post(`http://localhost:3000/api/register`, user);
  }
}
