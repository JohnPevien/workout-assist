"use client";

import { useState, useEffect } from "react";
import PlanningMode from "./components/PlanningMode";
import TrackingMode from "./components/TrackingMode";

type Workout = {
  name: string;
  sets: number;
  reps: number;
  completedSets: boolean[];
};

export default function Home() {
  // Load initial state from localStorage or use defaults
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    if (typeof window === "undefined") return [];

    const savedWorkouts = localStorage.getItem("workouts");
    return savedWorkouts ? JSON.parse(savedWorkouts) : [];
  });

  const [mode, setMode] = useState<"planning" | "tracking">(() => {
    if (typeof window === "undefined") return "planning";

    const savedMode = localStorage.getItem("mode");
    return savedMode === "tracking" ? "tracking" : "planning";
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
    localStorage.setItem("mode", mode);
  }, [workouts, mode]);

  // Handle adding a new workout
  const handleAddWorkout = (newWorkout: {
    name: string;
    sets: number;
    reps: number;
  }) => {
    const workoutWithSets = {
      ...newWorkout,
      completedSets: Array(newWorkout.sets).fill(false),
    };
    setWorkouts([...workouts, workoutWithSets]);
  };

  // Handle removing a workout
  const handleRemoveWorkout = (index: number) => {
    setWorkouts(workouts.filter((_, i) => i !== index));
  };

  // Handle toggling a set's completion status
  const handleToggleSet = (workoutIndex: number, setIndex: number) => {
    const newWorkouts = [...workouts];
    const newCompletedSets = [...newWorkouts[workoutIndex].completedSets];
    newCompletedSets[setIndex] = !newCompletedSets[setIndex];
    newWorkouts[workoutIndex] = {
      ...newWorkouts[workoutIndex],
      completedSets: newCompletedSets,
    };
    setWorkouts(newWorkouts);
  };

  // Handle resetting the session
  const handleReset = () => {
    setWorkouts([]);
    setMode("planning");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white flex flex-col items-center p-4">
      <header className="w-full max-w-md mb-4">
        <h1 className="text-2xl font-bold">Workout Assist</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          {mode === "planning" ? "Plan your workout routine" : "Track your workout progress"}
        </p>
      </header>
      
      <main className="w-full max-w-md flex-1">
        {mode === "planning" ? (
          <PlanningMode
            workouts={workouts}
            onAddWorkout={handleAddWorkout}
            onRemoveWorkout={handleRemoveWorkout}
            onStartSession={() => setMode("tracking")}
          />
        ) : (
          <TrackingMode
            workouts={workouts}
            onToggleSet={handleToggleSet}
            onReset={handleReset}
          />
        )}
      </main>
      
      <footer className="w-full max-w-md mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>Workout data is saved locally in your browser</p>
      </footer>
    </div>
  );
}
