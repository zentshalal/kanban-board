export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  column: string;
  position: number;
  expires_at: string | null;
  board: string;
}

export interface Board {
  id: string;
  user_id: string;
  name: string;
}
