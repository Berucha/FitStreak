import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Dumbbell, 
  Users, 
  Calendar,
  Flame,
  TrendingUp,
  Plus,
  Check,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Award,
  Utensils
} from 'lucide-react';
import { EXERCISE_LIBRARY, BODY_PARTS } from './exerciseData';

function App() {
  // State management
  const [activeTab, setActiveTab] = useState('home');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [lastWorkoutDate, setLastWorkoutDate] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2000);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('All');
  const [calorieInputValue, setCalorieInputValue] = useState('');
  const [mealTag, setMealTag] = useState('');
  const [calorieEntries, setCalorieEntries] = useState([]);
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  
  // Mock friend data for P1 Friend Streaks feature
  const [friends] = useState([
    { id: 1, name: 'Sarah Johnson', avatar: '👩', currentStreak: 12, lastWorkout: new Date() },
    { id: 2, name: 'Mike Chen', avatar: '👨', currentStreak: 8, lastWorkout: new Date(Date.now() - 86400000) },
    { id: 3, name: 'Emily Davis', avatar: '👧', currentStreak: 15, lastWorkout: new Date() },
    { id: 4, name: 'Alex Kumar', avatar: '🧑', currentStreak: 5, lastWorkout: new Date(Date.now() - 172800000) },
  ].sort((a, b) => b.currentStreak - a.currentStreak));

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('fitStreakData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setCurrentStreak(data.currentStreak || 0);
        setLongestStreak(data.longestStreak || 0);
        setLastWorkoutDate(data.lastWorkoutDate ? new Date(data.lastWorkoutDate) : null);
        setWorkoutHistory(data.workoutHistory || []);
        setCaloriesConsumed(data.caloriesConsumed || 0);
        setCaloriesBurned(data.caloriesBurned || 0);
        setDailyCalorieGoal(data.dailyCalorieGoal || 2000);
        setCalorieEntries(data.calorieEntries || []);
      } catch (error) {
        console.error('Failed to load saved data:', error);
        // Reset to default values if data is corrupted
        localStorage.removeItem('fitStreakData');
      }
    }
    checkStreakReset();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const data = {
      currentStreak,
      longestStreak,
      lastWorkoutDate,
      workoutHistory,
      caloriesConsumed,
      caloriesBurned,
      dailyCalorieGoal,
      calorieEntries
    };
    localStorage.setItem('fitStreakData', JSON.stringify(data));
  }, [currentStreak, longestStreak, lastWorkoutDate, workoutHistory, caloriesConsumed, caloriesBurned, dailyCalorieGoal, calorieEntries]);

  // Reset calories at midnight
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      const lastReset = localStorage.getItem('lastCalorieReset');
      const today = now.toDateString();
      
      if (lastReset !== today) {
        setCaloriesConsumed(0);
        setCaloriesBurned(0);
        setCalorieEntries([]);
        localStorage.setItem('lastCalorieReset', today);
      }
    };
    
    checkMidnight();
    // Check every 10 minutes for efficiency
    const interval = setInterval(checkMidnight, 600000);
    return () => clearInterval(interval);
  }, []);

  // Check if streak should reset
  const checkStreakReset = () => {
    if (!lastWorkoutDate) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastDate = new Date(lastWorkoutDate);
    lastDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    
    // Reset streak if more than 1 day has passed
    if (daysDiff > 1) {
      setCurrentStreak(0);
    }
  };

  // Get flame color based on streak
  const getFlameColor = (streak) => {
    if (streak >= 100) return 'text-purple-500';
    if (streak >= 30) return 'text-blue-500';
    if (streak >= 7) return 'text-orange-500';
    return 'text-red-500';
  };

  // Get flame size based on streak
  const getFlameSize = (streak) => {
    if (streak >= 100) return 'text-7xl';
    if (streak >= 30) return 'text-6xl';
    if (streak >= 7) return 'text-5xl';
    return 'text-4xl';
  };

  // Toggle exercise selection
  const toggleExercise = (bodyPart, exercise) => {
    const exerciseId = `${bodyPart}-${exercise.name}`;
    const isSelected = selectedExercises.some(e => e.id === exerciseId);
    
    if (isSelected) {
      setSelectedExercises(selectedExercises.filter(e => e.id !== exerciseId));
    } else {
      setSelectedExercises([...selectedExercises, { 
        id: exerciseId, 
        ...exercise, 
        bodyPart 
      }]);
    }
  };

  // Log workout
  const logWorkout = () => {
    if (selectedExercises.length === 0) return;
    
    const today = new Date();
    const todayStr = today.toDateString();
    const lastWorkoutStr = lastWorkoutDate ? new Date(lastWorkoutDate).toDateString() : null;
    
    // Calculate total calories
    const totalCalories = selectedExercises.reduce((sum, ex) => sum + ex.calories, 0);
    
    // Update streak
    let newStreak = currentStreak;
    if (lastWorkoutStr !== todayStr) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      if (lastWorkoutStr === yesterdayStr || lastWorkoutDate === null) {
        newStreak = currentStreak + 1;
      } else {
        newStreak = 1; // Reset streak
      }
      
      setCurrentStreak(newStreak);
      
      // Update longest streak
      if (newStreak > longestStreak) {
        setLongestStreak(newStreak);
      }
    }
    
    // Add to workout history
    const workout = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      date: today.toISOString(),
      exercises: selectedExercises.map(e => ({
        name: e.name,
        bodyPart: e.bodyPart,
        calories: e.calories,
        image: e.image
      })),
      totalCalories
    };
    
    setWorkoutHistory([workout, ...workoutHistory]);
    setLastWorkoutDate(today);
    setCaloriesBurned(caloriesBurned + totalCalories);
    
    // Clear selection
    setSelectedExercises([]);
    
    // Switch to home (confirmation will be visible in the activity log)
    setActiveTab('home');
  };

  // Add calorie entry
  const addCalorieEntry = () => {
    if (!calorieInputValue || isNaN(calorieInputValue) || Number(calorieInputValue) <= 0) return;
    
    const entry = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      calories: Number(calorieInputValue),
      meal: mealTag || 'Snack',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setCalorieEntries([...calorieEntries, entry]);
    setCaloriesConsumed(caloriesConsumed + entry.calories);
    setCalorieInputValue('');
    setMealTag('');
  };

  // Delete calorie entry
  const deleteCalorieEntry = (id, calories) => {
    setCalorieEntries(calorieEntries.filter(e => e.id !== id));
    setCaloriesConsumed(caloriesConsumed - calories);
  };

  // Filter exercises
  const getFilteredExercises = () => {
    let exercises = [];
    
    if (selectedBodyPart === 'All') {
      BODY_PARTS.forEach(bodyPart => {
        exercises.push({ bodyPart, exercises: EXERCISE_LIBRARY[bodyPart] });
      });
    } else {
      exercises.push({ 
        bodyPart: selectedBodyPart, 
        exercises: EXERCISE_LIBRARY[selectedBodyPart] 
      });
    }
    
    if (searchQuery) {
      exercises = exercises.map(group => ({
        ...group,
        exercises: group.exercises.filter(ex => 
          ex.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(group => group.exercises.length > 0);
    }
    
    return exercises;
  };

  // Calculate net calories
  const netCalories = caloriesConsumed - caloriesBurned;
  const calorieProgress = (caloriesConsumed / dailyCalorieGoal) * 100;
  
  // Get progress color
  const getProgressColor = () => {
    if (calorieProgress > 110) return 'bg-red-500';
    if (calorieProgress > 90 && calorieProgress <= 110) return 'bg-green-500';
    return 'bg-yellow-500';
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Render Home Tab
  const renderHome = () => (
    <div className="p-6 space-y-6 pb-24">
      {/* Streak Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Your Streak</h2>
        </div>
        
        <div className="flex justify-around items-center">
          {/* Current Streak */}
          <div className="text-center">
            <div className={`${getFlameSize(currentStreak)} ${getFlameColor(currentStreak)}`}>
              <Flame className="inline-block" strokeWidth={1.5} fill="currentColor" />
            </div>
            <div className="text-4xl font-bold text-gray-800 mt-2">{currentStreak}</div>
            <div className="text-sm text-gray-600">Current Streak</div>
            {currentStreak >= 7 && (
              <div className="mt-2 text-xs font-semibold text-orange-600">
                {currentStreak >= 100 ? '🎯 LEGENDARY!' : 
                 currentStreak >= 30 ? '🔥 ON FIRE!' : 
                 '⭐ Great job!'}
              </div>
            )}
          </div>
          
          {/* Longest Streak */}
          <div className="text-center">
            <div className="text-5xl text-yellow-500">
              <Award className="inline-block" strokeWidth={1.5} />
            </div>
            <div className="text-4xl font-bold text-gray-800 mt-2">{longestStreak}</div>
            <div className="text-sm text-gray-600">Longest Streak</div>
          </div>
        </div>
      </div>

      {/* Calorie Dashboard */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Daily Calories</h2>
        
        {/* Calorie Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-sm text-gray-600">Consumed</div>
            <div className="text-2xl font-bold text-orange-600">{caloriesConsumed}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Burned</div>
            <div className="text-2xl font-bold text-green-600">{caloriesBurned}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Net</div>
            <div className={`text-2xl font-bold ${netCalories > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {netCalories}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Goal Progress</span>
            <span>{caloriesConsumed} / {dailyCalorieGoal} cal</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`${getProgressColor()} h-3 rounded-full transition-all duration-300`}
              style={{ width: `${Math.min(calorieProgress, 100)}%` }}
            />
          </div>
        </div>
        
        {/* Goal Adjustment */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">Daily Goal:</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setDailyCalorieGoal(Math.max(1000, dailyCalorieGoal - 100))}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg"
            >
              -
            </button>
            <span className="font-bold text-gray-800 w-20 text-center">{dailyCalorieGoal}</span>
            <button 
              onClick={() => setDailyCalorieGoal(Math.min(5000, dailyCalorieGoal + 100))}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
          <Calendar className="text-gray-400" size={24} />
        </div>
        
        {workoutHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No workouts logged yet.</p>
            <p className="text-sm mt-2">Start your fitness journey today!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {workoutHistory.slice(0, 5).map(workout => (
              <div key={workout.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-gray-800">{formatDate(workout.date)}</div>
                    <div className="text-sm text-gray-600">{workout.exercises.length} exercises</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-600">{workout.totalCalories}</div>
                    <div className="text-xs text-gray-600">calories</div>
                  </div>
                </div>
                
                <button
                  onClick={() => setExpandedWorkout(expandedWorkout === workout.id ? null : workout.id)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  {expandedWorkout === workout.id ? (
                    <>
                      <ChevronUp size={16} /> Hide details
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} /> Show details
                    </>
                  )}
                </button>
                
                {expandedWorkout === workout.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-2">
                      {workout.exercises.map((ex, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <span className="text-xl">{ex.image}</span>
                          <div>
                            <div className="font-medium text-gray-700">{ex.name}</div>
                            <div className="text-xs text-gray-500">{ex.calories} cal</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {workoutHistory.length > 5 && (
              <button
                onClick={() => setActiveTab('history')}
                className="w-full text-center py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                View all {workoutHistory.length} workouts →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Render Exercise Library Tab
  const renderLibrary = () => {
    const filteredExercises = getFilteredExercises();
    const totalSelectedCalories = selectedExercises.reduce((sum, ex) => sum + ex.calories, 0);
    
    return (
      <div className="pb-32">
        {/* Header */}
        <div className="bg-white shadow-md p-4 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Exercise Library</h1>
          
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          {/* Body Part Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedBodyPart('All')}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedBodyPart === 'All'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {BODY_PARTS.map(bodyPart => (
              <button
                key={bodyPart}
                onClick={() => setSelectedBodyPart(bodyPart)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedBodyPart === bodyPart
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {bodyPart}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise List */}
        <div className="p-4 space-y-6">
          {filteredExercises.map(({ bodyPart, exercises }) => (
            <div key={bodyPart}>
              <h2 className="text-xl font-bold text-gray-800 mb-3">{bodyPart}</h2>
              <div className="grid grid-cols-1 gap-3">
                {exercises.map(exercise => {
                  const exerciseId = `${bodyPart}-${exercise.name}`;
                  const isSelected = selectedExercises.some(e => e.id === exerciseId);
                  
                  return (
                    <button
                      key={exercise.name}
                      onClick={() => toggleExercise(bodyPart, exercise)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 bg-white hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{exercise.image}</span>
                          <div>
                            <div className="font-semibold text-gray-800 flex items-center gap-2">
                              {exercise.name}
                              {isSelected && <Check className="text-orange-500" size={20} />}
                            </div>
                            <div className="text-sm text-gray-600">{exercise.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-orange-600">{exercise.calories}</div>
                          <div className="text-xs text-gray-600">cal</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          
          {filteredExercises.every(group => group.exercises.length === 0) && (
            <div className="text-center py-12 text-gray-500">
              <p>No exercises found.</p>
              <p className="text-sm mt-2">Try a different search term.</p>
            </div>
          )}
        </div>

        {/* Floating Log Button */}
        {selectedExercises.length > 0 && (
          <div className="fixed bottom-20 left-0 right-0 p-4">
            <button
              onClick={logWorkout}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-full shadow-lg flex items-center justify-center gap-2"
            >
              <Check size={24} />
              Log {selectedExercises.length} Exercise{selectedExercises.length > 1 ? 's' : ''} 
              ({totalSelectedCalories} cal)
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render Friends Tab
  const renderFriends = () => (
    <div className="p-6 pb-24">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Friend Streaks</h2>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus size={20} />
            Add Friend
          </button>
        </div>
        
        <div className="space-y-4">
          {friends.map(friend => {
            const workedOutToday = new Date(friend.lastWorkout).toDateString() === new Date().toDateString();
            const lastWorkoutText = formatDate(friend.lastWorkout.toISOString());
            
            return (
              <div key={friend.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{friend.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-800">{friend.name}</div>
                    <div className="text-sm text-gray-600">
                      Last workout: {lastWorkoutText}
                    </div>
                    {workedOutToday && (
                      <div className="text-xs text-green-600 font-semibold mt-1">
                        ✓ Worked out today!
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Flame size={20} className="text-orange-500" fill="currentColor" />
                    <span className="text-2xl font-bold text-gray-800">{friend.currentStreak}</span>
                  </div>
                  <div className="text-xs text-gray-600">day streak</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Render Calorie Input Tab
  const renderCalories = () => (
    <div className="p-6 pb-24 space-y-6">
      {/* Input Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Log Calories</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calories Consumed
            </label>
            <input
              type="number"
              value={calorieInputValue}
              onChange={(e) => setCalorieInputValue(e.target.value)}
              placeholder="Enter calories..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meal Type (Optional)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(meal => (
                <button
                  key={meal}
                  onClick={() => setMealTag(meal)}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    mealTag === meal
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {meal}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={addCalorieEntry}
            disabled={!calorieInputValue || isNaN(calorieInputValue) || Number(calorieInputValue) <= 0}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Entry
          </button>
        </div>
      </div>

      {/* Today's Entries */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Entries</h2>
        
        {calorieEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Utensils className="mx-auto mb-2 text-gray-400" size={48} />
            <p>No entries yet today.</p>
            <p className="text-sm mt-2">Log your meals above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {calorieEntries.map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-800">{entry.meal}</div>
                  <div className="text-sm text-gray-600">{entry.time}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold text-orange-600">{entry.calories}</div>
                    <div className="text-xs text-gray-600">calories</div>
                  </div>
                  <button
                    onClick={() => deleteCalorieEntry(entry.id, entry.calories)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
            
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800">Total Consumed:</span>
                <span className="text-2xl font-bold text-orange-600">{caloriesConsumed} cal</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render History Tab
  const renderHistory = () => (
    <div className="p-6 pb-24">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Workout History
        </h2>
        
        {workoutHistory.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="mx-auto mb-3 text-gray-400" size={64} />
            <p className="text-lg">No workouts logged yet.</p>
            <p className="text-sm mt-2">Your fitness journey starts with the first step!</p>
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-600 mb-4">
              Showing {Math.min(30, workoutHistory.length)} most recent workouts
            </div>
            
            <div className="space-y-4">
              {workoutHistory.slice(0, 30).map(workout => (
                <div key={workout.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-lg text-gray-800">{formatDate(workout.date)}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(workout.date).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">{workout.totalCalories}</div>
                      <div className="text-xs text-gray-600">calories burned</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {workout.exercises.map((ex, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <span className="text-2xl">{ex.image}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-700 truncate">{ex.name}</div>
                          <div className="text-xs text-gray-500">{ex.bodyPart} • {ex.calories} cal</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {workoutHistory.length > 30 && (
              <div className="mt-4 text-center text-sm text-gray-600">
                Showing 30 of {workoutHistory.length} total workouts
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
      {/* Content */}
      <div className="max-w-2xl mx-auto">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'library' && renderLibrary()}
        {activeTab === 'friends' && renderFriends()}
        {activeTab === 'calories' && renderCalories()}
        {activeTab === 'history' && renderHistory()}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-2xl mx-auto flex justify-around py-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'home' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('library')}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'library' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Dumbbell size={24} />
            <span className="text-xs mt-1">Library</span>
          </button>
          
          <button
            onClick={() => setActiveTab('calories')}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'calories' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Utensils size={24} />
            <span className="text-xs mt-1">Calories</span>
          </button>
          
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'friends' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users size={24} />
            <span className="text-xs mt-1">Friends</span>
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'history' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar size={24} />
            <span className="text-xs mt-1">History</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
