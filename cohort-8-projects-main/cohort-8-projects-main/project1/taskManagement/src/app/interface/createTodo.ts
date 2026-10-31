export interface CreateTodo {
  taskName: String;
  dueDate: String;
  tags: string[];
}

export interface Task extends CreateTodo {
  id: number;
}
