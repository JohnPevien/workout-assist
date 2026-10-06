"use client";

import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Card, CardContent } from "../../components/ui/card";

type WorkoutFormData = {
  name: string;
  sets: number;
  reps: number;
};

type AddWorkoutFormProps = {
  onAddWorkout: (workout: WorkoutFormData) => void;
};

export default function AddWorkoutForm({ onAddWorkout }: AddWorkoutFormProps) {
  const [formData, setFormData] = useState<WorkoutFormData>({
    name: "",
    sets: 3,
    reps: 12,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "name" ? value : parseInt(value) || 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.sets > 0 && formData.reps > 0) {
      onAddWorkout(formData);
      setFormData({ name: "", sets: 3, reps: 12 });
    }
  };

  const isValid = formData.name.trim() !== "" && formData.sets > 0 && formData.reps > 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="workout-name">Exercise Name</Label>
            <Input
              id="workout-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Push-ups, Squats, etc."
              required
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 w-1/2">
              <Label htmlFor="workout-sets">Sets</Label>
              <Input
                id="workout-sets"
                type="number"
                name="sets"
                value={formData.sets}
                onChange={handleChange}
                min={1}
              />
            </div>
            
            <div className="flex flex-col gap-1.5 w-1/2">
              <Label htmlFor="workout-reps">Reps</Label>
              <Input
                id="workout-reps"
                type="number"
                name="reps"
                value={formData.reps}
                onChange={handleChange}
                min={1}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={!isValid}>
            {isValid ? "Add Workout" : "Enter exercise details"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
