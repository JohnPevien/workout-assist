"use client";

import { useState, useEffect } from "react";
import WorkoutItem from "./WorkoutItem";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent } from "../../components/ui/card";

type Workout = {
  name: string;
  sets: number;
  reps: number;
  completedSets: boolean[];
};

type TrackingModeProps = {
  workouts: Workout[];
  onToggleSet: (workoutIndex: number, setIndex: number) => void;
  onReset: () => void;
};

export default function TrackingMode({ workouts, onToggleSet, onReset }: TrackingModeProps) {
  const [showTimer, setShowTimer] = useState(false);
  const [time, setTime] = useState(30); // Default 30 seconds
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => setTime((t) => t - 1), 1000);
    } else if (time === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const startTimer = () => setIsRunning(true);
  const stopTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTime(30);
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3">
            {workouts.map((workout, index) => (
              <WorkoutItem
                key={index}
                workout={workout}
                onToggleSet={(setIndex) => onToggleSet(index, setIndex)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Button
        onClick={() => setShowTimer(!showTimer)}
        variant="secondary"
        className="w-full"
      >
        {showTimer ? "Hide Timer" : "Show Timer"}
      </Button>
      
      {showTimer && (
        <Card>
          <CardContent className="pt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="rest-time">Rest Time (seconds)</Label>
              <Input
                id="rest-time"
                type="number"
                value={time}
                onChange={(e) => setTime(parseInt(e.target.value) || 0)}
                disabled={isRunning}
                min={0}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={isRunning ? stopTimer : startTimer}
                variant="default"
                className="flex-1"
              >
                {isRunning ? "Pause" : "Start"}
              </Button>
              <Button
                onClick={resetTimer}
                variant="secondary"
                className="flex-1"
              >
                Reset
              </Button>
            </div>
            
            <Card>
              <CardContent className="py-3 flex justify-center items-center">
                <span className="text-xl font-semibold">
                  {time} {time === 1 ? "second" : "seconds"} remaining
                </span>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
      
      <Button
        onClick={onReset}
        variant="destructive"
        className="w-full"
      >
        Reset Session
      </Button>
    </div>
  );
}
