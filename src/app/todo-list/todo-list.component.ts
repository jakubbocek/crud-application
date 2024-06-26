import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../todo.service';
import { Todo } from '../models/todo.model';
import { TodoEditModalComponent } from '../todo-edit-modal/todo-edit-modal.component';

/**
 * The TodoListComponent manages the display of the list of Todo items.
 * It allows users to view, sort, search, edit, and delete Todo items.
 */
@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoEditModalComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
})
export class TodoListComponent implements OnInit {
  data: Todo[] = []; // Array to hold all Todo items
  filteredData: Todo[] = []; // Array to hold filtered Todo items based on search input
  selectedItem: Todo | null = null; // Currently selected Todo item for editing
  isEditModalOpen: boolean = false; // Flag to control the visibility of the edit modal

  /**
   * Constructor to inject the TodoService for data operations.
   * @param todoService - The service used for managing Todo items.
   */
  constructor(private todoService: TodoService) {}

  /**
   * ngOnInit Lifecycle Hook
   * Initializes the component and subscribes to the data observable from the TodoService.
   * Populates the data and filteredData arrays with Todo items.
   */
  ngOnInit(): void {
    this.todoService.data$.subscribe((data) => {
      this.data = data;
      this.filteredData = data;
    });
  }

  /**
   * Returns the role of the user based on the userId.
   * @param userId - The ID of the user.
   * @returns {string} - The role of the user ('admin', 'tester', or 'unknown user').
   */
  getUser(userId: number): string {
    if (userId === 1) return 'admin';
    if (userId === 2) return 'tester';
    return 'neznámý uživatel';
  }

  /**
   * Opens the edit modal and sets the selected item for editing.
   * @param item - The Todo item to be edited.
   */
  openEditModal(item: Todo): void {
    this.selectedItem = item;
    this.isEditModalOpen = true;
  }

  /**
   * Closes the edit modal and resets the selected item.
   */
  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedItem = null;
  }

  /**
   * Deletes a Todo item after confirming with the user.
   * @param id - The ID of the Todo item to be deleted.
   */
  deleteRecord(id: number): void {
    const yes = confirm('Are you sure you want to delete this record?');
    if (yes) {
      this.todoService.deleteRecord(id);
    }
  }

  /**
   * Sorts the Todo items based on the title in either ascending or descending order.
   * @param order - The order in which to sort the items ('asc' for ascending, 'desc' for descending).
   */

  sortData(order: 'asc' | 'desc'): void {
    this.todoService.setSortOrder(order);
  }
  /**
   * Filters the Todo items based on the search term entered by the user.
   * @param event - The input event from the search field.
   */
  searchTable(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value.toLowerCase(); // Convert search term to lowercase
    this.filteredData = this.data.filter(
      (item) => item.title.toLowerCase().includes(searchTerm) // Filter items by title
    );
  }

  /**
   * HostListener for keydown events to close the modal on Escape key press.
   * @param event - The keyboard event.
   */
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent): void {
    if (this.isEditModalOpen) {
      this.closeEditModal();
    }
  }
}
