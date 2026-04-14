export interface TaskType {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  column: string;
  position: number;
  expires_at: string | null;
  board: string;
}

export interface BoardType {
  id: string;
  user_id: string;
  name: string;
}

export interface ColumnType {
  id: string;
  user_id: string;
  name: string;
  color: string;
  board: string;
}
