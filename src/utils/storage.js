// Storage keys
const STORAGE_KEYS = {
  CURRENT_STREAK: 'fitstreak_current_streak',
  LONGEST_STREAK: 'fitstreak_longest_streak',
  LAST_WORKOUT_DATE: 'fitstreak_last_workout',
  WORKOUT_HISTORY: 'fitstreak_workout_history',
  CALORIE_GOAL: 'fitstreak_calorie_goal',
  DAILY_CALORIES: 'fitstreak_daily_calories',
  FRIENDS: 'fitstreak_friends',
};

// Get current date in YYYY-MM-DD format
export const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Calculate difference in days between two dates
export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Streak Management
export const getCurrentStreak = () => {
  return parseInt(localStorage.getItem(STORAGE_KEYS.CURRENT_STREAK) || '0');
};

export const setCurrentStreak = (streak) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_STREAK, streak.toString());
};

export const getLongestStreak = () => {
  return parseInt(localStorage.getItem(STORAGE_KEYS.LONGEST_STREAK) || '0');
};

export const setLongestStreak = (streak) => {
  localStorage.setItem(STORAGE_KEYS.LONGEST_STREAK, streak.toString());
};

export const getLastWorkoutDate = () => {
  return localStorage.getItem(STORAGE_KEYS.LAST_WORKOUT_DATE) || null;
};

export const setLastWorkoutDate = (date) => {
  localStorage.setItem(STORAGE_KEYS.LAST_WORKOUT_DATE, date);
};

// Update streak when logging a workout
export const updateStreak = () => {
  const today = getTodayDate();
  const lastWorkout = getLastWorkoutDate();
  let currentStreak = getCurrentStreak();

  if (!lastWorkout) {
    // First workout ever
    currentStreak = 1;
  } else if (lastWorkout === today) {
    // Already worked out today, no change
    return currentStreak;
  } else {
    const daysSinceLastWorkout = getDaysDifference(lastWorkout, today);
    
    if (daysSinceLastWorkout === 1) {
      // Consecutive day, increment streak
      currentStreak += 1;
    } else {
      // Missed a day or more, reset streak
      currentStreak = 1;
    }
  }

  setCurrentStreak(currentStreak);
  setLastWorkoutDate(today);

  // Update longest streak if necessary
  const longestStreak = getLongestStreak();
  if (currentStreak > longestStreak) {
    setLongestStreak(currentStreak);
  }

  return currentStreak;
};

// Check if streak should be reset (called on app load)
export const checkStreakValidity = () => {
  const today = getTodayDate();
  const lastWorkout = getLastWorkoutDate();
  
  if (!lastWorkout) {
    return;
  }

  const daysSinceLastWorkout = getDaysDifference(lastWorkout, today);
  
  // If more than 1 day has passed without a workout, reset streak
  if (daysSinceLastWorkout > 1) {
    setCurrentStreak(0);
  }
};

// Workout History
export const getWorkoutHistory = () => {
  const history = localStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
  return history ? JSON.parse(history) : [];
};

export const addWorkoutToHistory = (workout) => {
  const history = getWorkoutHistory();
  history.unshift(workout); // Add to beginning
  // Keep only last 100 workouts
  if (history.length > 100) {
    history.pop();
  }
  localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(history));
};

// Calorie Management
export const getCalorieGoal = () => {
  return parseInt(localStorage.getItem(STORAGE_KEYS.CALORIE_GOAL) || '2000');
};

export const setCalorieGoal = (goal) => {
  localStorage.setItem(STORAGE_KEYS.CALORIE_GOAL, goal.toString());
};

export const getDailyCalories = () => {
  const today = getTodayDate();
  const storedData = localStorage.getItem(STORAGE_KEYS.DAILY_CALORIES);
  
  if (!storedData) {
    return { date: today, consumed: 0, burned: 0, entries: [] };
  }
  
  const data = JSON.parse(storedData);
  
  // Reset if it's a new day
  if (data.date !== today) {
    return { date: today, consumed: 0, burned: 0, entries: [] };
  }
  
  return data;
};

export const setDailyCalories = (calorieData) => {
  localStorage.setItem(STORAGE_KEYS.DAILY_CALORIES, JSON.stringify(calorieData));
};

export const addCalorieEntry = (amount, type = 'consumed', meal = null) => {
  const dailyData = getDailyCalories();
  const today = getTodayDate();
  
  const entry = {
    id: Date.now(),
    amount,
    type,
    meal,
    timestamp: new Date().toISOString(),
  };
  
  dailyData.entries.push(entry);
  
  if (type === 'consumed') {
    dailyData.consumed += amount;
  } else {
    dailyData.burned += amount;
  }
  
  dailyData.date = today;
  setDailyCalories(dailyData);
  
  return dailyData;
};

export const deleteCalorieEntry = (entryId) => {
  const dailyData = getDailyCalories();
  const entry = dailyData.entries.find(e => e.id === entryId);
  
  if (!entry) return dailyData;
  
  if (entry.type === 'consumed') {
    dailyData.consumed -= entry.amount;
  } else {
    dailyData.burned -= entry.amount;
  }
  
  dailyData.entries = dailyData.entries.filter(e => e.id !== entryId);
  setDailyCalories(dailyData);
  
  return dailyData;
};

// Friend Management (mock data for now)
export const getFriends = () => {
  const friends = localStorage.getItem(STORAGE_KEYS.FRIENDS);
  if (!friends) {
    // Initialize with mock data
    const mockFriends = [
      { id: 1, name: 'Alex Johnson', avatar: '👤', currentStreak: 12, lastWorkout: getTodayDate() },
      { id: 2, name: 'Sarah Williams', avatar: '👩', currentStreak: 8, lastWorkout: getTodayDate() },
      { id: 3, name: 'Mike Chen', avatar: '👨', currentStreak: 25, lastWorkout: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
      { id: 4, name: 'Emma Davis', avatar: '👧', currentStreak: 5, lastWorkout: getTodayDate() },
    ];
    localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(mockFriends));
    return mockFriends;
  }
  return JSON.parse(friends);
};

export const addFriend = (friend) => {
  const friends = getFriends();
  friends.push({ ...friend, id: Date.now() });
  localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(friends));
  return friends;
};

// Get streak flame color based on milestone
export const getStreakFlameColor = (streak) => {
  if (streak >= 100) return 'text-purple-500'; // 100+ days
  if (streak >= 30) return 'text-blue-500';    // 30+ days
  if (streak >= 7) return 'text-orange-500';   // 7+ days
  return 'text-red-500';                        // < 7 days
};

export const getStreakFlameSize = (streak) => {
  if (streak >= 100) return 'text-8xl';
  if (streak >= 30) return 'text-7xl';
  if (streak >= 7) return 'text-6xl';
  return 'text-5xl';
};
