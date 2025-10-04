export interface Goal {
  id: string;
  name: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  emoji: string;
  priority: 1 | 2 | 3;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  created_at: string;
}