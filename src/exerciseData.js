// Exercise Database - 32+ exercises across 8 body part categories
// Each exercise includes: name, emoji icon, description, body part, and calorie estimate

export const EXERCISE_LIBRARY = {
  Chest: [
    { 
      name: 'Push-Ups', 
      image: '💪', 
      calories: 100, 
      description: 'Classic bodyweight chest exercise'
    },
    { 
      name: 'Bench Press', 
      image: '🏋️', 
      calories: 150, 
      description: 'Barbell or dumbbell chest press'
    },
    { 
      name: 'Chest Flyes', 
      image: '🦅', 
      calories: 120, 
      description: 'Isolation exercise for chest muscles'
    },
    { 
      name: 'Dips', 
      image: '🤸', 
      calories: 130, 
      description: 'Bodyweight exercise targeting chest and triceps'
    },
  ],
  Back: [
    { 
      name: 'Pull-Ups', 
      image: '🆙', 
      calories: 120, 
      description: 'Bodyweight back builder'
    },
    { 
      name: 'Rows', 
      image: '🚣', 
      calories: 140, 
      description: 'Barbell or dumbbell rowing motion'
    },
    { 
      name: 'Lat Pulldown', 
      image: '⬇️', 
      calories: 110, 
      description: 'Machine-based lat exercise'
    },
    { 
      name: 'Deadlift', 
      image: '🏋️‍♀️', 
      calories: 180, 
      description: 'Compound movement for back and legs'
    },
  ],
  Legs: [
    { 
      name: 'Squats', 
      image: '🦵', 
      calories: 150, 
      description: 'King of leg exercises'
    },
    { 
      name: 'Lunges', 
      image: '🚶', 
      calories: 130, 
      description: 'Single-leg strength builder'
    },
    { 
      name: 'Leg Press', 
      image: '🦿', 
      calories: 140, 
      description: 'Machine-based leg exercise'
    },
    { 
      name: 'Leg Curls', 
      image: '🌀', 
      calories: 100, 
      description: 'Hamstring isolation'
    },
    { 
      name: 'Calf Raises', 
      image: '👟', 
      calories: 80, 
      description: 'Target calf muscles'
    },
  ],
  Shoulders: [
    { 
      name: 'Overhead Press', 
      image: '🏆', 
      calories: 130, 
      description: 'Barbell or dumbbell shoulder press'
    },
    { 
      name: 'Lateral Raises', 
      image: '🤷', 
      calories: 90, 
      description: 'Side delt isolation'
    },
    { 
      name: 'Front Raises', 
      image: '🙋', 
      calories: 85, 
      description: 'Front delt targeting'
    },
    { 
      name: 'Shrugs', 
      image: '🤔', 
      calories: 95, 
      description: 'Trap development'
    },
  ],
  Arms: [
    { 
      name: 'Bicep Curls', 
      image: '💪', 
      calories: 90, 
      description: 'Classic bicep builder'
    },
    { 
      name: 'Tricep Extensions', 
      image: '🔨', 
      calories: 85, 
      description: 'Tricep isolation exercise'
    },
    { 
      name: 'Hammer Curls', 
      image: '🔧', 
      calories: 95, 
      description: 'Targets biceps and forearms'
    },
    { 
      name: 'Close-Grip Press', 
      image: '👊', 
      calories: 100, 
      description: 'Tricep-focused pressing'
    },
  ],
  Core: [
    { 
      name: 'Crunches', 
      image: '🔴', 
      calories: 80, 
      description: 'Basic ab exercise'
    },
    { 
      name: 'Plank', 
      image: '🪵', 
      calories: 90, 
      description: 'Isometric core hold'
    },
    { 
      name: 'Russian Twists', 
      image: '🌀', 
      calories: 100, 
      description: 'Oblique targeting rotation'
    },
    { 
      name: 'Leg Raises', 
      image: '⬆️', 
      calories: 95, 
      description: 'Lower ab exercise'
    },
    { 
      name: 'Mountain Climbers', 
      image: '⛰️', 
      calories: 120, 
      description: 'Dynamic core cardio'
    },
  ],
  Cardio: [
    { 
      name: 'Running', 
      image: '🏃', 
      calories: 200, 
      description: '30 minutes of running'
    },
    { 
      name: 'Cycling', 
      image: '🚴', 
      calories: 180, 
      description: '30 minutes of cycling'
    },
    { 
      name: 'Jump Rope', 
      image: '🪢', 
      calories: 220, 
      description: '15 minutes of jumping'
    },
    { 
      name: 'Swimming', 
      image: '🏊', 
      calories: 250, 
      description: '30 minutes of swimming'
    },
    { 
      name: 'HIIT', 
      image: '⚡', 
      calories: 300, 
      description: 'High-intensity interval training'
    },
  ],
  'Full Body': [
    { 
      name: 'Burpees', 
      image: '🤾', 
      calories: 150, 
      description: 'Full-body explosive movement'
    },
    { 
      name: 'Kettlebell Swings', 
      image: '⚖️', 
      calories: 160, 
      description: 'Dynamic full-body exercise'
    },
    { 
      name: 'Box Jumps', 
      image: '📦', 
      calories: 140, 
      description: 'Plyometric power builder'
    },
    { 
      name: 'Clean and Press', 
      image: '🏋️‍♂️', 
      calories: 170, 
      description: 'Olympic-style lift'
    },
  ],
};

export const BODY_PARTS = Object.keys(EXERCISE_LIBRARY);
