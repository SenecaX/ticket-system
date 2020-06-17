import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Task } from '../models/task';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private readonly http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  getTasks(userId: string) {
    return this.http.get('http://localhost:3001/api/task/' + userId);
  }

  createTask(task: Task) {
    return this.http.post('http://localhost:3001/api/task/', task);
  }

  updateStatus(task: Task): Observable<Task> {
    console.log('entered');
    this.httpOptions.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, DELETE'
    );
    return this.http
      .put<Task>(
        'http://localhost:3001/api/task/updateStatus/' + task._id,
        task,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  deleteTask(task: Task): Observable<Task> {
    this.httpOptions.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, DELETE'
    );
    return this.http
      .delete<Task>(
        'http://localhost:3001/api/task/' + task._id,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  updateTask(task: Task): Observable<Task> {
    console.log('entered');
    this.httpOptions.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, DELETE'
    );
    return this.http
      .put<Task>(
        'http://localhost:3001/api/task/' + task._id,
        task,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
