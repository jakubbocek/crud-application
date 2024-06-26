import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../todo.service';
import { Todo } from '../models/todo.model';

/**
 * The TodoEditModalComponent manages the modal dialog for editing existing Todo items.
 * It displays the selected Todo item for editing, validates user input, and communicates updates
 * back to the TodoService.
 */
@Component({
  selector: 'app-todo-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-edit-modal.component.html',
  styleUrls: ['./todo-edit-modal.component.scss'],
})
export class TodoEditModalComponent implements OnChanges {
  @Input() item: Todo | null = null; // Input Todo item to be edited
  @Output() close = new EventEmitter<void>(); // Event to close the modal dialog

  editTitle: string = ''; // Edited title of the Todo item
  editCompleted: boolean = false; // Edited completion status of the Todo item
  errorMessage: string = ''; // Error message for validation issues

  /**
   * Constructor to inject the TodoService for data operations.
   * @param todoService - The service used for managing Todo items.
   */
  constructor(private todoService: TodoService) {}

  /**
   * Lifecycle hook to handle changes to the input item.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && this.item) {
      this.editTitle = this.item.title; // Update the title
      this.editCompleted = this.item.completed; // Update completion status
      this.errorMessage = ''; // Clear the error message
    }
  }

  /**
   * Saves the edited Todo item.
   */

  saveEdit(): void {
    // Check if title is not empty
    if (!this.editTitle.trim()) {
      this.errorMessage = 'Title cannot be empty.';
      return;
    }

    // Subscribe to the current list of todos
    this.todoService.data$
      .subscribe((currentData) => {
        // Check if the title already exists (excluding the current item)
        if (
          currentData.some(
            (record) =>
              record.title === this.editTitle && record.id !== this.item!.id
          )
        ) {
          this.errorMessage = 'Record with this title already exists.';
          return;
        }

        // Create the updated Todo item
        const updatedRecord: Todo = {
          ...this.item!,
          title: this.editTitle,
          completed: this.editCompleted,
        };

        // Update the Todo using TodoService
        this.todoService.updateRecord(updatedRecord);
        this.close.emit(); // Emit the close event to the parent component
      })
      .unsubscribe(); // Unsubscribe to prevent memory leaks
  }

  /**
   * Closes the modal dialog.
   */
  closeEditModal(): void {
    this.errorMessage = ''; // Clear the error message
    this.close.emit(); // Emit the close event to the parent component
  }
}
