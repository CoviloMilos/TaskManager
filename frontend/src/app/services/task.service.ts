import { WebRequestService } from './web-request.service';
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webRequestService: WebRequestService) { }

  createList(title: string) {
    return this.webRequestService.post('lists', { title });
  }

  getLists() {
    return this.webRequestService.get('lists');
  }

  createTask(listId: string, title: string) {
    return this.webRequestService.post(`lists/${listId}/tasks`, { title });
  }

  getTasks(listId: string) {
    return this.webRequestService.get(`lists/${listId}/tasks`);
  }

  complete(task: Task) {
    return this.webRequestService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    });
  }
}
