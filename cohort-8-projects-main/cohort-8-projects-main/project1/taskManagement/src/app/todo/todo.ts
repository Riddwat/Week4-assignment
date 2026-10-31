
import { Component, OnInit, signal } from '@angular/core';
import { NgClass, NgStyle, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../Services/todo-service';
import { Task } from '../interface/createTodo';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [FormsModule, NgClass, NgStyle, UpperCasePipe],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo implements OnInit {

  constructor(private todoService: TodoService) {}

  taskName = '';
  dueDate = '';
  tagsRaw = '';
  tasks = signal<Task[]>([]);

addTodo(): void {
  if (!this.taskName.trim() || !this.dueDate) {
    alert('Please enter a task name and due date.');
    return;
  }

  const selectedDate = new Date(this.dueDate);

  if (isNaN(selectedDate.getTime())) {
    alert('Please enter a valid date.');
    return;
  }

  const allowedTags = ['Health', 'Fitness', 'Default'];

const tags = this.tagsRaw
  .split(',')
  .map((tag) => tag.trim())
  .filter((tag) => tag !== '');

const invalidTags = tags.filter(
  (tag) => !allowedTags.some(
    (allowed) => allowed.toLowerCase() === tag.toLowerCase()
  )
);

if (invalidTags.length > 0) {
  alert('Allowed tags are Health, Fitness, and Default.');
  return;
}

  this.todoService
    .createTodo({
      taskName: this.taskName.trim(),
      dueDate: selectedDate.toISOString(),
      tags: tags,
    })
    .subscribe({
      next: () => {
        this.taskName = '';
        this.dueDate = '';
        this.tagsRaw = '';
        this.getAllTodo();
      },
      error: (err) => {
        console.error('Failed to add task:', err);
        alert('Failed to add task. Please try again.');
      },
    });
}


  getAllTodo() {
    this.todoService.getAllTask().subscribe({
      next: (res) => {
        this.tasks.set(res);
      },
      error: (err) => {
        console.error('Failed to load tasks:', err);
      },
    });
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.tasks.update((tasks) =>
          tasks.filter((task) => task.id !== id)
        );
      },
      error: (err) => {
        console.error('Failed to delete task:', err);
        alert('Could not delete task. Please try again.');
      },
    });
  }

  ngOnInit(): void {
    this.getAllTodo();
  }
}
