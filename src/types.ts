export type Status = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: Status;
  position: number;
  expires_at: string | null;
}
