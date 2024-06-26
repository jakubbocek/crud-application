import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../todo.service';
import { Todo } from '../models/todo.model';

/**
 * The TodoFormComponent manages the form for adding new Todo items.
 * It validates user input, prevents duplicates, and interacts with TodoService to add new items.
 */

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.css',
})
export class TodoFormComponent {
  newTitle = ''; // Title of the new Todo item
  newCompleted = false; // Completion status of the new Todo item
  errorMessage = ''; // Error message for validation issues

  /**
   * Constructor to inject the TodoService for data operations.
   * @param todoService - The service used for managing Todo items.
   */
  constructor(private todoService: TodoService) {}

  /**
   * Adds a new Todo item.
   */

  addRecord(): void {
    // Check if title is not empty
    if (!this.newTitle.trim()) {
      this.errorMessage = 'Title cannot be empty.';
      return;
    }

    // Subscribe to the current list of todos
    this.todoService.data$
      .subscribe((currentData) => {
        // Check if the title already exists
        if (currentData.some((record) => record.title === this.newTitle)) {
          this.errorMessage = 'Record with this title already exists.';
          return;
        }

        // Create a new Todo item
        const newRecord: Todo = {
          userId: Math.floor(Math.random() * 10) + 1,
          id: Date.now(),
          title: this.newTitle,
          completed: this.newCompleted,
        };

        // Add the new Todo using TodoService
        this.todoService.addRecord(newRecord);
        this.newTitle = ''; // Clear the input field after adding
        this.newCompleted = false;
        this.errorMessage = ''; // Clear the error message
      })
      .unsubscribe(); // Unsubscribe to prevent memory leaks
  }
}
