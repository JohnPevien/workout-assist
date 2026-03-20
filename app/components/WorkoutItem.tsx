"use client";

import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { X } from "lucide-react";

type Workout = {
  name: string;
  sets: number;
  reps: number;
  completedSets: boolean[];
};

type WorkoutItemProps = {
  workout: Workout;
  onRemove?: () => void;
  onToggleSet?: (setIndex: number) => void;
};

export default function WorkoutItem({ workout, onRemove, onToggleSet }: WorkoutItemProps) {
  return (
    <Card>
      <CardContent className="pt-6 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">{workout.name}</span>
          {onRemove && (
            <Button
              onClick={onRemove}
              variant="ghost"
              size="icon"
              className="text-red-500 h-8 w-8"
              aria-label="Remove workout"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {onToggleSet ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Target:</span>
              <span className="text-sm">{workout.reps} reps per set</span>
            </div>
            
            <div className="mt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Sets completed:</span>
                <span className="text-sm font-semibold text-primary">
                  {workout.completedSets.filter(Boolean).length}/{workout.sets}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {workout.completedSets.map((completed, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <Checkbox
                      id={`set-${workout.name}-${index}`}
                      checked={completed}
                      onCheckedChange={() => onToggleSet(index)}
                    />
                    <label 
                      htmlFor={`set-${workout.name}-${index}`}
                      className="text-xs"
                    >
                      {index + 1}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">Sets:</span>
              <span>{workout.sets}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">Reps:</span>
              <span>{workout.reps}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
