/**
 * The Todo interface defines the structure of a Todo item.
 */

export interface Todo {
  userId: number; // ID of the user associated with the Todo item
  id: number; // Unique identifier for the Todo item
  title: string; // Title of the Todo item
  completed: boolean; // Status indicating if the Todo item is completed (true) or not (false)
}
