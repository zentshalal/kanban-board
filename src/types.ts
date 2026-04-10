export type Status = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  status: Status;
  position: number;
  column: number;
}
