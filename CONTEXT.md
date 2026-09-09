# CONTEXT

## Glossary

- **User**: A person with an account. Owns workout history.
- **AuthSession**: An authenticated login period for a User. Distinct from training work.
- **WorkoutSession**: One training instance on a date, owned by a single User. Contains an ordered list of exercises.
- **SessionExercise**: A movement within a WorkoutSession. Has a name and a target (sets × reps).
- **SetLog**: The record of one performed set within a SessionExercise. Has a position and a completed state.
- **Planning**: Composing a WorkoutSession draft (choosing SessionExercises and targets).
- **Tracking**: Logging SetLogs against a started WorkoutSession, including rest timing between sets.
