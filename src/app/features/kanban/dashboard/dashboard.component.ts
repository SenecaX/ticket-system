import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { TaskService } from 'src/app/shared/services/task.service.api';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Board } from 'src/app/shared/models/board';
import { Column } from 'src/app/shared/models/column';
import {
  faTimes,
  faEdit,
  faPlus,
  faCheck,
  faDumpster
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
  public containerEmpty: boolean;

  public currentAddIndex = -1;
  public currentEditTaskId = null;
  public changeName = '';
  public errorMsg = '';

  // icons
  public faTimes = faTimes;
  public faEdit = faEdit;
  public faPlus = faPlus;
  public faCheck = faCheck;
  public faDumpster = faDumpster;

  constructor(private readonly taskService: TaskService) {
    const helper = new JwtHelperService();
    const getToken = localStorage.getItem('access_token');
    this.decodedToken = helper.decodeToken(getToken);

    // columns
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

  drop(event: CdkDragDrop<string[]>, columnIndex) {
    if (event.previousContainer === event.container) {
      const task: Task = event.item.data;
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      task.status = columnIndex;
      this.taskService.updateTask(task).subscribe(el => {});
    } else {
      const task: Task = event.item.data;
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      task.status = columnIndex;
      this.taskService.updateTask(task).subscribe(el => {});
    }
  }

  public addTask(i): void {
    this.currentAddIndex = i;
    this.addTaskName = true;
  }

  public cancelAdd(): void {
    this.addTaskName = false;
    console.log('entere');
    this.getTask();
  }

  public saveTask(item, status): void {
    const task: Task = {
      status,
      taskName: item,
      userId: this.decodedToken._id
    };
    this.taskService.createTask(task).subscribe(
      tasks => {
        this.addTaskName = false;
        this.getTask();
        this.currentAddIndex = -1;
      },
      err => (this.errorMsg = 'Task name is required')
    );
  }

  public getTask(): void {
    this.taskService.getTasks(this.decodedToken._id).subscribe(tasks => {
      this.tasks = tasks;
      this.todo = [];
      this.done = [];
      this.progress = [];
      this.tasks.forEach(element => {
        if (element.status === 0) {
          this.todo.push(element);
        } else if (element.status === 1) {
          this.progress.push(element);
        } else {
          this.done.push(element);
        }

        if (this.todo.length === 0) {
          this.containerEmpty = true;
        } else if (this.done.length === 0) {
          this.containerEmpty = true;
        } else if (this.progress.length === 0) {
          this.containerEmpty = true;
        }
      });
      this.board = new Board('Test board', [
        new Column('Todo', this.todo),
        new Column('In Progress', this.progress),
        new Column('Done', this.done)
      ]);
    });
  }

  public cancelTask(): void {
    this.getTask();
    this.editTaskName = false;
  }

  public editTask(task, name?): void {
    this.changeName = task.taskName;
    this.currentEditTaskId = task._id;
    this.saveEdit = true;
    this.editTaskName = true;
    task.taskName = name;

    if (name) {
      this.taskService.updateTask(task).subscribe(data => {
        this.todo = [];
        this.progress = [];
        this.done = [];
        this.editTaskName = false;
        this.getTask();
        this.saveEdit = false;
      });
    }
  }

  public deleteTask(task): void {
    this.taskService.deleteTask(task).subscribe(data => {
      this.getTask();
    });
  }
}
