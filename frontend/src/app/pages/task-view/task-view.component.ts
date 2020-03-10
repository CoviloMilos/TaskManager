import { TaskService } from './../../services/task.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  lists: any[];
  tasks: any[];

  constructor(private taskService: TaskService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        console.log(params);
        this.taskService.getTasks(params.listId).subscribe((tasksResponse: any[]) => {
          this.tasks = tasksResponse;
        });
      }
    );

    this.taskService.getLists().subscribe((listsResponse: any[]) => {
      this.lists = listsResponse;
    });
  }

}
