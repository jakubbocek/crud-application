import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { Todo } from "./models/todo.model";
import { isEqual } from "lodash"; // Use lodash for deep comparison

/**
 * The TodoService manages operations on Todo items including fetching data from an API,
 * adding, updating, and deleting items, and provides an observable data stream of Todo items.
 */

@Injectable({
  providedIn: "root",
})
export class TodoService {
  private apiUrl = "https://jsonplaceholder.typicode.com/todos"; // API URL for Todo items
  private dataSource = new BehaviorSubject<Todo[]>([]); // BehaviorSubject to hold Todo data
  data$ = this.dataSource.asObservable(); // Observable data stream of Todo items
  private originalData: Todo[] = []; // Keep a copy of the original data
  isUpdating = false; // Flag to prevent recursive updates
  private sortOrder: "asc" | "desc" | null = null;
  private filterValue: string = "";

  constructor(private http: HttpClient) {
    this.fetchData(); // Fetch initial data when the service is instantiated
  }

  /**
   * Fetches Todo data from the API and updates the BehaviorSubject.
   */

  fetchData(): void {
    this.http
      .get<Todo[]>(this.apiUrl)
      .subscribe((data) => this.dataSource.next(data)); // Update BehaviorSubject with the fetched data
  }

  /**
   * Adds a new Todo item to the BehaviorSubject.
   * @param record New Todo item to be added.
   */

  addRecord(record: Todo): void {
    const currentData = this.dataSource.value; // Get the current data from the BehaviorSubject
    this.dataSource.next([record, ...currentData]); // Add the new item to the beginning of the array
  }

  /**
   * Updates an existing Todo item in the BehaviorSubject.
   * @param updatedRecord Updated Todo item.
   */

  updateRecord(updatedRecord: Todo): void {
    if (this.isUpdating) {
      return; // Exit if an update is already in progress
    }

    this.isUpdating = true; // Set the flag to indicate an update is in progress

    try {
      console.log("Updating record:", updatedRecord);

      const currentData = this.dataSource.value;
      let hasChanged = false;

      const newData = currentData.map((record: Todo) => {
        if (record.id === updatedRecord.id) {
          if (!isEqual(record, updatedRecord)) {
            // Use deep comparison
            hasChanged = true;
            return updatedRecord;
          }
        }
        return record;
      });

      if (hasChanged) {
        console.log("Data changed, updating dataSource");
        this.dataSource.next(newData); // Update BehaviorSubject with the modified data
      } else {
        console.log("No changes detected, not updating dataSource");
      }
    } catch (error) {
      console.error("Error updating record:", error);
    } finally {
      this.isUpdating = false; // Reset the flag after the update is complete
    }
  }

  /**
   * Deletes a Todo item from the BehaviorSubject by its ID.
   * @param id ID of the Todo item to be deleted.
   */

  deleteRecord(id: number): void {
    const currentData = this.dataSource.value.filter(
      (record) => record.id !== id // Filter out the item with the given ID
    );

    this.dataSource.next(currentData); // Update BehaviorSubject with the filtered data
    this.applySortAndFilter();
  }

  setSortOrder(order: "asc" | "desc" | null): void {
    this.sortOrder = order;
    this.applySortAndFilter();
  }

  private applySortAndFilter(): void {
    let data = [...this.dataSource.value];

    if (this.sortOrder) {
      data = data.sort((a, b) => {
        const comparison = a.title.localeCompare(b.title);
        return this.sortOrder === "asc" ? comparison : -comparison;
      });
    }

    this.dataSource.next(data);
  }
}
