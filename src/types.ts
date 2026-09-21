export type QuadrantId = 'q1' | 'q2' | 'q3' | 'q4';

export interface Task {
  id: string;
  title: string;
  quadrant: QuadrantId;
  completed: boolean;
  deadline?: string; // ISO string
  recurring: boolean;
  lastCompletedDate?: string; // ISO string
  createdAt: string; // ISO string
}
