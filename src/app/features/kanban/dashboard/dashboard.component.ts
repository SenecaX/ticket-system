import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDragExit,
  CdkDragEnter,
  CdkDragEnd,
  CdkDragStart
} from '@angular/cdk/drag-drop';
import { TaskService } from 'src/app/shared/services/task.service.api';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Board } from 'src/app/shared/models/board';
import { Column } from 'src/app/shared/models/column';
import {
  faTimes,
  faEdit,
  faPlus,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { Task } from 'src/app/shared/models/task';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public decodedToken: any;
  public todo: string[];
  public done: string[];
  public progress: string[];
  public board: any;
  public tasks: Task[] | any;
  public draggedTask: any;
  public editTaskName: boolean;
  public addTaskName: boolean;
  public saveEdit: boolean;

  //icons
  public faTimes = faTimes;
  public faEdit = faEdit;
  public faPlus = faPlus;
  public faCheck = faCheck;

  constructor(private readonly taskService: TaskService) {
    const helper = new JwtHelperService();
    const getToken = localStorage.getItem('access_token');
    this.decodedToken = helper.decodeToken(getToken);

    //columns
    this.todo = [];
    this.done = [];
    this.progress = [];

    this.editTaskName = false;
    this.addTaskName = false;

    this.board = new Board('Test board', [
      new Column('Todo', this.todo),
      new Column('In Progress', this.progress),
      new Column('Done', this.done)
    ]);
  }

  ngOnInit() {
    this.getTask();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  public addTask(): void {
    this.addTaskName = true;
  }

  public saveTask(item, status): void {
    console.log('item', item);
    let task: Task = {
      status: status,
      taskName: item,
      userId: this.decodedToken._id
    };
    this.taskService.createTask(task).subscribe(tasks => {
      this.addTaskName = false;
      this.getTask();
    });
  }

  public getTask(): void {
    this.taskService.getTasks(this.decodedToken._id).subscribe(tasks => {
      this.tasks = tasks;
      this.tasks.forEach(element => {
        if (element.status === 0) {
          this.todo.push(element);
        } else if (element.status === 1) {
          this.progress.push(element);
        } else {
          this.done.push(element);
        }
      });
    });
  }

  public editTask(task): void {
    console.log('edit', task);
    this.saveEdit = true;
    this.editTaskName = true;

    this.taskService.updateTask(task).subscribe(data => {
      this.getTask();
      this.saveEdit = false;
    });
  }

  public deleteTask(task): void {
    this.taskService.deleteTask(task).subscribe(data => {
      this.getTask();
    });
  }
}
