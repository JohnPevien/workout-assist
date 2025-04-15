"use client";

import AddWorkoutForm from "./AddWorkoutForm";
import WorkoutItem from "./WorkoutItem";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

type Workout = {
  name: string;
  sets: number;
  reps: number;
  completedSets: boolean[];
};

type PlanningModeProps = {
  workouts: Workout[];
  onAddWorkout: (workout: { name: string; sets: number; reps: number }) => void;
  onRemoveWorkout: (index: number) => void;
  onStartSession: () => void;
};

export default function PlanningMode({
  workouts,
  onAddWorkout,
  onRemoveWorkout,
  onStartSession,
}: PlanningModeProps) {
  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <AddWorkoutForm onAddWorkout={onAddWorkout} />
      <Card className="p-4">
        <div className="flex flex-col gap-2">
          {workouts.length > 0 ? (
            workouts.map((workout, index) => (
              <WorkoutItem
                key={index}
                workout={workout}
                onRemove={() => onRemoveWorkout(index)}
              />
            ))
          ) : (
            <p className="text-gray-500">No workouts added yet.</p>
          )}
        </div>
      </Card>
      {workouts.length > 0 && (
        <Button
          onClick={onStartSession}
          size="lg"
          className="w-full mt-4"
          variant="default"
        >
          Start Session
        </Button>
      )}
    </div>
  );
}
