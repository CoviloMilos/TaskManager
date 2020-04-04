import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  listId: string;

  constructor(private taskService: TaskService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.listId = params.listId;
      }
    );
  }

  createTask(title: string) {
    this.taskService.createTask(this.listId, title).subscribe((task: Task) => {
      console.log(task);
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }
}
