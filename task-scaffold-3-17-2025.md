Below, I’ll guide you through creating a workout tracking app for a single gym session based on your project setup and specifications. This app will be mobile-friendly, frontend-only, and use localStorage efficiently. It will allow users to choose workouts, specify sets and reps, track progress with checkboxes, and include an optional interval timer. Since you’re using Next.js with React and Tailwind CSS, I’ll tailor the solution accordingly.
Project Overview
Your app, workout-assist, is a simple, mobile-first workout tracker for a single gym session. Here’s how it will work:
Planning Mode: Users add workouts with names, sets (default 3), and reps (default 12).
Tracking Mode: Users view their workouts in a table-like list and check off completed sets.
LocalStorage: Saves the workout data and mode to persist across page refreshes without complexity.
Optional Timer: An interval timer at the bottom of the tracking screen, toggleable by the user.
The app will use a single-page approach with two modes (planning and tracking), managed by React state and styled with Tailwind CSS for a clean, touch-friendly mobile design.
Step-by-Step Implementation
Let’s build this step-by-step, starting with the main App component in app/page.tsx (since you’re using Next.js App Router).

1. Set Up the Main App Component
   The App component will manage the state (workouts and mode) and handle all core functionality.
   jsx
   // app/page.tsx
   "use client";

import { useState, useEffect } from "react";
import PlanningMode from "./components/PlanningMode";
import TrackingMode from "./components/TrackingMode";

export default function Home() {
// Load initial state from localStorage or use defaults
const [workouts, setWorkouts] = useState(() => {
const savedWorkouts = localStorage.getItem("workouts");
return savedWorkouts ? JSON.parse(savedWorkouts) : [];
});
const [mode, setMode] = useState(() => {
const savedMode = localStorage.getItem("mode");
return savedMode || "planning";
});

// Save state to localStorage whenever it changes
useEffect(() => {
localStorage.setItem("workouts", JSON.stringify(workouts));
localStorage.setItem("mode", mode);
}, [workouts, mode]);

// Handle adding a new workout
const handleAddWorkout = (newWorkout) => {
const workoutWithSets = {
...newWorkout,
completedSets: Array(newWorkout.sets).fill(false),
};
setWorkouts([...workouts, workoutWithSets]);
};

// Handle removing a workout
const handleRemoveWorkout = (index) => {
setWorkouts(workouts.filter((\_, i) => i !== index));
};

// Handle toggling a set's completion status
const handleToggleSet = (workoutIndex, setIndex) => {
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
<div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
<h1 className="text-2xl font-bold mb-4">Workout Assist</h1>
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
</div>
);
}
Key Points:
State: workouts is an array of objects { name, sets, reps, completedSets }. mode toggles between "planning" and "tracking".
localStorage: Loads initial state on mount and saves whenever workouts or mode changes, keeping it simple and effective.
Handlers: Functions for adding, removing, toggling sets, and resetting are defined here and passed to child components. 2. Create the Planning Mode Component
This component lets users add and remove workouts.
jsx
// app/components/PlanningMode.jsx
import AddWorkoutForm from "./AddWorkoutForm";
import WorkoutItem from "./WorkoutItem";

export default function PlanningMode({
workouts,
onAddWorkout,
onRemoveWorkout,
onStartSession,
}) {
return (
<div className="w-full max-w-md flex flex-col gap-4">
<AddWorkoutForm onAddWorkout={onAddWorkout} />
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
{workouts.length > 0 && (
<button
          onClick={onStartSession}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg text-lg"
        >
Start Session
</button>
)}
</div>
);
}
Key Points:
Displays the AddWorkoutForm and a list of WorkoutItems.
Shows a “Start Session” button only if workouts exist.
Uses Tailwind for a vertical, mobile-friendly layout. 3. Create the Add Workout Form Component
This form collects workout details with defaults for sets (3) and reps (12).
jsx
// app/components/AddWorkoutForm.jsx
import { useState } from "react";

export default function AddWorkoutForm({ onAddWorkout }) {
const [formData, setFormData] = useState({
name: "",
sets: 3,
reps: 12,
});

const handleChange = (e) => {
const { name, value } = e.target;
setFormData({
...formData,
[name]: name === "name" ? value : parseInt(value) || 0,
});
};

const handleSubmit = (e) => {
e.preventDefault();
if (formData.name && formData.sets > 0 && formData.reps > 0) {
onAddWorkout(formData);
setFormData({ name: "", sets: 3, reps: 12 });
}
};

return (
<form onSubmit={handleSubmit} className="flex flex-col gap-2">
<input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Workout name (e.g., Push-ups)"
        className="p-2 border rounded-lg"
      />
<div className="flex gap-2">
<input
          type="number"
          name="sets"
          value={formData.sets}
          onChange={handleChange}
          min="1"
          className="p-2 border rounded-lg w-1/2"
          placeholder="Sets"
        />
<input
          type="number"
          name="reps"
          value={formData.reps}
          onChange={handleChange}
          min="1"
          className="p-2 border rounded-lg w-1/2"
          placeholder="Reps"
        />
</div>
<button
        type="submit"
        className="bg-green-500 text-white py-2 px-4 rounded-lg text-lg"
      >
Add Workout
</button>
</form>
);
}
Key Points:
Uses a single state object for form data.
Validates that name is non-empty and sets/reps are positive.
Resets to defaults after submission.
Styled with Tailwind for a compact, touch-friendly form. 4. Create the Workout Item Component
This component adapts its display based on the mode.
jsx
// app/components/WorkoutItem.jsx
export default function WorkoutItem({ workout, onRemove, onToggleSet }) {
return (
<div className="bg-white p-3 rounded-lg shadow flex flex-col gap-2">
<div className="flex justify-between items-center">
<span className="font-semibold">{workout.name}</span>
{onRemove && (
<button
            onClick={onRemove}
            className="text-red-500 font-bold"
          >
✕
</button>
)}
</div>
<div>
{onToggleSet ? (
<>
<span>{workout.reps} reps</span>
<div className="flex gap-2 mt-1">
{workout.completedSets.map((completed, index) => (
<input
key={index}
type="checkbox"
checked={completed}
onChange={() => onToggleSet(index)}
className="w-6 h-6"
/>
))}
</div>
</>
) : (
<span>
{workout.sets} sets x {workout.reps} reps
</span>
)}
</div>
</div>
);
}
Key Points:
In planning mode (onRemove provided): Shows name, sets, reps, and a remove button.
In tracking mode (onToggleSet provided): Shows name, reps, and checkboxes for each set.
Checkboxes are styled larger with w-6 h-6 for touch-friendliness. 5. Create the Tracking Mode Component
This component displays workouts for tracking and includes a reset option.
jsx
// app/components/TrackingMode.jsx
import WorkoutItem from "./WorkoutItem";

export default function TrackingMode({ workouts, onToggleSet, onReset }) {
return (
<div className="w-full max-w-md flex flex-col gap-4">
<div className="flex flex-col gap-2">
{workouts.map((workout, index) => (
<WorkoutItem
key={index}
workout={workout}
onToggleSet={(setIndex) => onToggleSet(index, setIndex)}
/>
))}
</div>
<button
        onClick={onReset}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg text-lg"
      >
Reset Session
</button>
</div>
);
}
Key Points:
Lists workouts with checkboxes for tracking.
“Reset Session” clears data and returns to planning mode.
Keeps the layout simple and vertical. 6. Optional Interval Timer (Bonus)
If time permits, add a timer to TrackingMode. Here’s a basic implementation:
jsx
// app/components/TrackingMode.jsx (updated)
import { useState, useEffect } from "react";
import WorkoutItem from "./WorkoutItem";

export default function TrackingMode({ workouts, onToggleSet, onReset }) {
const [showTimer, setShowTimer] = useState(false);
const [time, setTime] = useState(30); // Default 30 seconds
const [isRunning, setIsRunning] = useState(false);

useEffect(() => {
let interval;
if (isRunning && time > 0) {
interval = setInterval(() => setTime((t) => t - 1), 1000);
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
<div className="flex flex-col gap-2">
{workouts.map((workout, index) => (
<WorkoutItem
key={index}
workout={workout}
onToggleSet={(setIndex) => onToggleSet(index, setIndex)}
/>
))}
</div>
<button
onClick={() => setShowTimer(!showTimer)}
className="bg-gray-500 text-white py-2 px-4 rounded-lg text-lg" >
{showTimer ? "Hide Timer" : "Show Timer"}
</button>
{showTimer && (
<div className="bg-white p-3 rounded-lg shadow flex flex-col gap-2">
<input
type="number"
value={time}
onChange={(e) => setTime(parseInt(e.target.value) || 0)}
disabled={isRunning}
className="p-2 border rounded-lg"
/>
<div className="flex gap-2">
<button
onClick={isRunning ? stopTimer : startTimer}
className="bg-blue-500 text-white py-1 px-3 rounded-lg" >
{isRunning ? "Stop" : "Start"}
</button>
<button
              onClick={resetTimer}
              className="bg-gray-500 text-white py-1 px-3 rounded-lg"
            >
Reset
</button>
</div>
<span>{time} seconds remaining</span>
</div>
)}
<button
        onClick={onReset}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg text-lg"
      >
Reset Session
</button>
</div>
);
}
Key Points:
Toggleable with showTimer.
Basic countdown with start/stop/reset functionality.
No sound alerts to keep it simple.
Folder Structure
workout-assist/
├── app/
│ ├── components/
│ │ ├── AddWorkoutForm.jsx
│ │ ├── PlanningMode.jsx
│ │ ├── TrackingMode.jsx
│ │ └── WorkoutItem.jsx
│ ├── page.tsx
│ └── globals.css (Tailwind setup should already be here)
├── package.json
└── ... (other config files)
Styling Notes
Mobile-Friendly: Uses flex flex-col, max-w-md, and large buttons/inputs (e.g., text-lg, w-6 h-6 for checkboxes).
Tailwind: Leverages utility classes for responsiveness and simplicity. Adjust padding/margins as needed during testing.
How to Run
Save the files as shown.
Run npm run dev to start the development server.
Open http://localhost:3000 in a mobile browser or use dev tools in mobile view to test.
Meeting the Specs
Choose Workouts:
Add workouts in planning mode with name, sets (default 3), and reps (default 12).
Display and Track:
Workouts shown in a list (table-like) with touch-friendly checkboxes for each set.
Interval Timer:
Optional, toggleable timer added to tracking mode.
localStorage:
Smartly used to save workouts and mode, reloaded on mount, keeping it simple.

Below is a detailed plan to incorporate Zod, a TypeScript-first schema validation library, into your workout tracking app for simple state management. This approach ensures that your app's state—consisting of workouts and a mode—remains valid by enforcing a defined structure whenever the state is initialized or updated. Zod will help catch invalid data early, making your app more robust without adding unnecessary complexity.
Plan to Incorporate Zod for Simple State Management

1. Install Zod
   To use Zod, you need to install it in your project. Run the following command in your terminal:
   bash
   npm install zod
   This adds Zod as a dependency, allowing you to define and validate schemas in your app.
2. Define Zod Schemas
   Zod schemas define the expected structure of your state. For your workout tracking app, you have two main pieces of state: an array of workouts and a mode. Here’s how to define schemas for them:
   Workout Schema
   Each workout in your app has the following properties:
   name: A required string (e.g., "Push-ups").
   sets: An integer number, minimum 1 (e.g., 3 sets).
   reps: An integer number, minimum 1 (e.g., 10 reps).
   completedSets: An array of booleans, with length equal to sets (e.g., [false, false, false] for 3 sets).
   The schema uses Zod’s refine method to enforce that the length of completedSets matches sets:
   typescript
   import { z } from 'zod';

const WorkoutSchema = z.object({
name: z.string().min(1, "Workout name is required"),
sets: z.number().int().min(1, "At least one set is required"),
reps: z.number().int().min(1, "At least one rep is required"),
completedSets: z.array(z.boolean()),
}).refine((data) => data.completedSets.length === data.sets, {
message: "Completed sets must match the number of sets",
path: ["completedSets"],
});
Mode Schema
The mode toggles between "planning" and "tracking". Use Zod’s enum to restrict it to these two values:
typescript
const ModeSchema = z.enum(["planning", "tracking"]);
These schemas will be used to validate your state at key points in the app. 3. Validate State When Loading from localStorage
Your app likely persists the state in localStorage to retain data between sessions. When initializing the state with React’s useState, validate the loaded data against the schemas. If the data is invalid (e.g., corrupted or doesn’t match the schema), fall back to default values.
Here’s how to do it in your App component:
jsx
import { useState } from 'react';
import { z } from 'zod';

// Define schemas (as shown above)
const WorkoutSchema = z.object({
name: z.string().min(1, "Workout name is required"),
sets: z.number().int().min(1, "At least one set is required"),
reps: z.number().int().min(1, "At least one rep is required"),
completedSets: z.array(z.boolean()),
}).refine((data) => data.completedSets.length === data.sets, {
message: "Completed sets must match the number of sets",
path: ["completedSets"],
});

const ModeSchema = z.enum(["planning", "tracking"]);

// Initialize state with validation
const [workouts, setWorkouts] = useState(() => {
const savedWorkouts = localStorage.getItem("workouts");
if (savedWorkouts) {
try {
const parsed = JSON.parse(savedWorkouts);
const result = z.array(WorkoutSchema).safeParse(parsed);
if (result.success) {
return result.data;
} else {
console.error("Invalid workouts in localStorage:", result.error);
}
} catch (e) {
console.error("Error parsing workouts from localStorage:", e);
}
}
return []; // Default to empty array if invalid or no data
});

const [mode, setMode] = useState(() => {
const savedMode = localStorage.getItem("mode");
if (savedMode) {
const result = ModeSchema.safeParse(savedMode);
if (result.success) {
return result.data;
} else {
console.error("Invalid mode in localStorage:", result.error);
}
}
return "planning"; // Default to "planning" if invalid or no data
});
How it works:
safeParse attempts to validate the data without throwing errors. If successful, it returns the validated data; otherwise, it provides an error object.
If validation fails or parsing throws an error (e.g., malformed JSON), the app falls back to defaults ([] for workouts, "planning" for mode).
Benefit: Ensures the app starts with valid state, even if localStorage contains corrupted data. 4. Validate New Workouts Before Adding
When a user adds a new workout (likely via an AddWorkoutForm component), validate the new workout against the WorkoutSchema before updating the state. This prevents invalid data from entering the workouts array.
In your App component, update the handleAddWorkout function:
jsx
const handleAddWorkout = (newWorkout) => {
// Add completedSets initialized as an array of falses
const workoutWithSets = {
...newWorkout,
completedSets: Array(newWorkout.sets).fill(false),
};

// Validate the new workout
const result = WorkoutSchema.safeParse(workoutWithSets);
if (result.success) {
setWorkouts([...workouts, workoutWithSets]);
} else {
console.error("Invalid workout data:", result.error);
// Optionally, set an error state to display a message to the user
// e.g., setError(result.error.message);
}
};
How it works:
The form likely passes an object with name, sets, and reps. You add completedSets as an array of false values matching the number of sets.
safeParse validates this object. If it passes, the workout is added to the state; if it fails, an error is logged, and the state remains unchanged.
Benefit: Ensures only valid workouts are added, catching issues like empty names or non-integer sets/reps.
Example usage in your AddWorkoutForm:
jsx
<AddWorkoutForm onAddWorkout={handleAddWorkout} /> 5. Optional: Enhance Form Validation
While Zod ensures invalid data doesn’t reach the state, you can improve the user experience by adding basic validation in the AddWorkoutForm component. For example, disable the submit button if the form data is invalid (e.g., empty name, sets < 1). However, since Zod already enforces these rules in handleAddWorkout, this step is optional and can be skipped for simplicity.
If you choose to add it, here’s an example:
jsx
const AddWorkoutForm = ({ onAddWorkout }) => {
const [formData, setFormData] = useState({ name: "", sets: 1, reps: 1 });

const handleSubmit = (e) => {
e.preventDefault();
onAddWorkout(formData);
};

const isValid = formData.name.trim() !== "" && formData.sets >= 1 && formData.reps >= 1;

return (
<form onSubmit={handleSubmit}>
<input
type="text"
name="name"
value={formData.name}
onChange={(e) => setFormData({ ...formData, name: e.target.value })}
/>
<input
type="number"
name="sets"
value={formData.sets}
min="1"
step="1"
onChange={(e) => setFormData({ ...formData, sets: parseInt(e.target.value) || 1 })}
/>
<input
type="number"
name="reps"
value={formData.reps}
min="1"
step="1"
onChange={(e) => setFormData({ ...formData, reps: parseInt(e.target.value) || 1 })}
/>
<button type="submit" disabled={!isValid}>Add Workout</button>
</form>
);
}; 6. Ensure Mode Integrity
The mode state toggles between "planning" and "tracking" via controlled interactions (e.g., a button). Since your app sets it directly to these values, it’s unlikely to become invalid during runtime. The ModeSchema validation when loading from localStorage is sufficient to ensure its integrity.
Example mode toggle:
jsx
const handleToggleMode = () => {
setMode(mode === "planning" ? "tracking" : "planning");
};
If you want to be extra cautious, you could validate mode changes:
jsx
const handleToggleMode = () => {
const newMode = mode === "planning" ? "tracking" : "planning";
const result = ModeSchema.safeParse(newMode);
if (result.success) {
setMode(result.data);
}
};
But since newMode is hardcoded to valid values, this is unnecessary.
Putting It All Together
Here’s how your updated App component might look:
jsx
import { useState, useEffect } from 'react';
import { z } from 'zod';
import AddWorkoutForm from './AddWorkoutForm';

const WorkoutSchema = z.object({
name: z.string().min(1, "Workout name is required"),
sets: z.number().int().min(1, "At least one set is required"),
reps: z.number().int().min(1, "At least one rep is required"),
completedSets: z.array(z.boolean()),
}).refine((data) => data.completedSets.length === data.sets, {
message: "Completed sets must match the number of sets",
path: ["completedSets"],
});

const ModeSchema = z.enum(["planning", "tracking"]);

function App() {
const [workouts, setWorkouts] = useState(() => {
const savedWorkouts = localStorage.getItem("workouts");
if (savedWorkouts) {
try {
const parsed = JSON.parse(savedWorkouts);
const result = z.array(WorkoutSchema).safeParse(parsed);
if (result.success) return result.data;
console.error("Invalid workouts in localStorage:", result.error);
} catch (e) {
console.error("Error parsing workouts from localStorage:", e);
}
}
return [];
});

const [mode, setMode] = useState(() => {
const savedMode = localStorage.getItem("mode");
if (savedMode) {
const result = ModeSchema.safeParse(savedMode);
if (result.success) return result.data;
console.error("Invalid mode in localStorage:", result.error);
}
return "planning";
});

useEffect(() => {
localStorage.setItem("workouts", JSON.stringify(workouts));
localStorage.setItem("mode", mode);
}, [workouts, mode]);

const handleAddWorkout = (newWorkout) => {
const workoutWithSets = {
...newWorkout,
completedSets: Array(newWorkout.sets).fill(false),
};
const result = WorkoutSchema.safeParse(workoutWithSets);
if (result.success) {
setWorkouts([...workouts, workoutWithSets]);
} else {
console.error("Invalid workout data:", result.error);
}
};

const handleToggleMode = () => {
setMode(mode === "planning" ? "tracking" : "planning");
};

return (
<div>
<h1>Workout Tracker</h1>
<button onClick={handleToggleMode}>
Switch to {mode === "planning" ? "Tracking" : "Planning"} Mode
</button>
{mode === "planning" && <AddWorkoutForm onAddWorkout={handleAddWorkout} />}
{/_ Add your workout list and tracking UI here _/}
</div>
);
}

export default App;
Benefits of This Approach
Data Integrity: Zod ensures your state adheres to a defined structure, preventing invalid data from causing bugs.
Robust Persistence: Validates localStorage data on load, falling back to defaults if invalid.
Simple Updates: Validates new workouts before adding them, keeping state management lightweight.
Minimal Complexity: Avoids heavy state management libraries, using Zod as a simple validation tool.
This plan integrates Zod seamlessly into your workout tracking app, providing reliable state management with minimal overhead. You can now implement these changes and ensure your app’s state remains valid at all times!
