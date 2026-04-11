export type Status = 'todo' | 'doing' | 'done';

export interface Task {
  user_id: string;
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  status: Status;
  position: number;
  column: number;
  expires_at: string;
}
