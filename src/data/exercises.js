// Exercise Library Database
export const EXERCISE_LIBRARY = {
  'Chest': [
    { name: 'Push-ups', image: '💪', calories: 100, description: 'Classic chest exercise using body weight' },
    { name: 'Bench Press', image: '🏋️', calories: 150, description: 'Barbell chest press on flat bench' },
    { name: 'Dumbbell Flyes', image: '🦾', calories: 120, description: 'Chest isolation with dumbbells' },
    { name: 'Incline Press', image: '📐', calories: 140, description: 'Upper chest development exercise' },
  ],
  'Back': [
    { name: 'Pull-ups', image: '🎯', calories: 130, description: 'Upper back bodyweight exercise' },
    { name: 'Barbell Rows', image: '🎣', calories: 140, description: 'Middle back strength builder' },
    { name: 'Deadlifts', image: '⚡', calories: 200, description: 'Full posterior chain exercise' },
    { name: 'Lat Pulldowns', image: '⬇️', calories: 110, description: 'Lat development machine exercise' },
  ],
  'Legs': [
    { name: 'Squats', image: '🦵', calories: 180, description: 'Compound leg exercise' },
    { name: 'Lunges', image: '👟', calories: 150, description: 'Unilateral leg strengthener' },
    { name: 'Leg Press', image: '🚀', calories: 160, description: 'Machine-based quad exercise' },
    { name: 'Calf Raises', image: '👠', calories: 80, description: 'Lower leg isolation exercise' },
  ],
  'Shoulders': [
    { name: 'Overhead Press', image: '🎖️', calories: 130, description: 'Shoulder strength builder' },
    { name: 'Lateral Raises', image: '✈️', calories: 90, description: 'Side delt isolation' },
    { name: 'Front Raises', image: '🙌', calories: 85, description: 'Front delt targeting' },
    { name: 'Shrugs', image: '🤷', calories: 70, description: 'Trap development exercise' },
  ],
  'Arms': [
    { name: 'Bicep Curls', image: '💪', calories: 90, description: 'Classic arm exercise' },
    { name: 'Tricep Dips', image: '📍', calories: 110, description: 'Bodyweight tricep builder' },
    { name: 'Hammer Curls', image: '🔨', calories: 95, description: 'Forearm and bicep exercise' },
    { name: 'Skull Crushers', image: '💀', calories: 100, description: 'Lying tricep extension' },
  ],
  'Core': [
    { name: 'Crunches', image: '🌀', calories: 60, description: 'Classic ab exercise' },
    { name: 'Planks', image: '📏', calories: 80, description: 'Isometric core strengthener' },
    { name: 'Russian Twists', image: '🌪️', calories: 90, description: 'Oblique targeting exercise' },
    { name: 'Leg Raises', image: '📐', calories: 85, description: 'Lower ab developer' },
  ],
  'Cardio': [
    { name: 'Running', image: '🏃', calories: 250, description: 'High-intensity cardio' },
    { name: 'Cycling', image: '🚴', calories: 200, description: 'Low-impact cardio option' },
    { name: 'Jump Rope', image: '🪢', calories: 220, description: 'Full-body cardio exercise' },
    { name: 'Burpees', image: '💥', calories: 180, description: 'High-intensity full body' },
  ],
  'Full Body': [
    { name: 'Kettlebell Swings', image: '⚙️', calories: 170, description: 'Dynamic full body exercise' },
    { name: 'Mountain Climbers', image: '⛰️', calories: 140, description: 'Cardio and core combination' },
    { name: 'Turkish Get-ups', image: '🎪', calories: 160, description: 'Complex full body movement' },
    { name: 'Thrusters', image: '🎆', calories: 190, description: 'Squat to overhead press combo' },
  ],
};

// Get total exercise count
export const getTotalExercises = () => {
  return Object.values(EXERCISE_LIBRARY).reduce((total, exercises) => total + exercises.length, 0);
};
