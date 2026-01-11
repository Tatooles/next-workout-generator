export interface Exercise {
  name: string;
  sets: number;
  reps: string; // Can be "8-10", "12-15", "AMRAP", etc.
  restTime: string; // e.g., "60s", "90s"
  muscleGroups: string[];
  formTips: string[];
}

export interface WorkoutData {
  exercises: Exercise[];
  estimatedDuration: string; // e.g., "45-60 minutes"
  notes?: string; // Optional general notes
}
