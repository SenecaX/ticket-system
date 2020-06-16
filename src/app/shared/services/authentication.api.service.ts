import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  public decodedToken: any;

  constructor(private readonly http: HttpClient) {
    const retrievedToken = JSON.parse(localStorage.getItem('access_token'));

    this.currentUserSubject = new BehaviorSubject<any>(retrievedToken);

    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  public login(name, password) {
    return this.http
      .post<any>(`http://localhost:3000/api/login`, {
        name,
        password
      })
      .pipe(
        map(user => {
          localStorage.setItem('access_token', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  public logout() {
    localStorage.removeItem('access_token');
    this.currentUserSubject.next(null);
  }
}
