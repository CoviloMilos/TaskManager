import { Task } from './../../models/task.model';
import { TaskService } from './../../services/task.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { List } from 'src/app/models/list.model';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  lists: List[];
  tasks: Task[];

  constructor(private taskService: TaskService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.taskService.getTasks(params.listId).subscribe((tasksResponse: Task[]) => {
          this.tasks = tasksResponse;
        });
      }
    );

    this.taskService.getLists().subscribe((listsResponse: List[]) => {
      console.log(listsResponse);
      this.lists = listsResponse;
    });
  }

  onTaskClick(task: Task) {
    // we want to set task to completed
    this.taskService.complete(task).subscribe(() => {
      console.log('Completed successfully!');
      // the task has been set to completed succesfullt
      task.completed = !task.completed;
    });
  }

}
