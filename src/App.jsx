import { useState, useEffect } from 'react';
import { Flame, Dumbbell, Users, History, TrendingUp, Plus, X, Check, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { EXERCISE_LIBRARY } from './data/exercises';
import {
  getCurrentStreak,
  getLongestStreak,
  updateStreak,
  checkStreakValidity,
  getWorkoutHistory,
  addWorkoutToHistory,
  getCalorieGoal,
  setCalorieGoal,
  getDailyCalories,
  addCalorieEntry,
  deleteCalorieEntry,
  getFriends,
  getStreakFlameColor,
  getStreakFlameSize,
  getTodayDate,
} from './utils/storage';

function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState('All');
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [calorieGoal, setCalorieGoalState] = useState(2000);
  const [dailyCalories, setDailyCalories] = useState({ consumed: 0, burned: 0, entries: [] });
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCalorieInput, setShowCalorieInput] = useState(false);
  const [calorieAmount, setCalorieAmount] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('');
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [expandedWorkouts, setExpandedWorkouts] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    checkStreakValidity();
    setCurrentStreak(getCurrentStreak());
    setLongestStreak(getLongestStreak());
    setWorkoutHistory(getWorkoutHistory());
    setCalorieGoalState(getCalorieGoal());
    setDailyCalories(getDailyCalories());
    setFriends(getFriends());
  }, []);

  // Calculate total calories for selected exercises
  const totalCalories = selectedExercises.reduce((sum, ex) => sum + ex.calories, 0);

  // Toggle exercise selection
  const toggleExercise = (exercise, bodyPart) => {
    const exerciseWithBodyPart = { ...exercise, bodyPart };
    const isSelected = selectedExercises.some(
      ex => ex.name === exercise.name && ex.bodyPart === bodyPart
    );

    if (isSelected) {
      setSelectedExercises(selectedExercises.filter(
        ex => !(ex.name === exercise.name && ex.bodyPart === bodyPart)
      ));
    } else {
      setSelectedExercises([...selectedExercises, exerciseWithBodyPart]);
    }
  };

  // Log workout
  const logWorkout = () => {
    if (selectedExercises.length === 0) return;

    const workout = {
      id: Date.now(),
      date: getTodayDate(),
      timestamp: new Date().toISOString(),
      exercises: selectedExercises,
      totalCalories: totalCalories,
    };

    addWorkoutToHistory(workout);
    addCalorieEntry(totalCalories, 'burned');
    
    const newStreak = updateStreak();
    setCurrentStreak(newStreak);
    setLongestStreak(getLongestStreak());
    setWorkoutHistory(getWorkoutHistory());
    setDailyCalories(getDailyCalories());
    
    setSelectedExercises([]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setCurrentTab('home');
  };

  // Add calorie intake
  const addCalorieIntake = () => {
    const amount = parseInt(calorieAmount);
    if (isNaN(amount) || amount <= 0) return;

    addCalorieEntry(amount, 'consumed', selectedMeal || null);
    setDailyCalories(getDailyCalories());
    setCalorieAmount('');
    setSelectedMeal('');
    setShowCalorieInput(false);
  };

  // Update calorie goal
  const updateCalorieGoal = () => {
    const goal = parseInt(newGoal);
    if (isNaN(goal) || goal <= 0) return;

    setCalorieGoal(goal);
    setCalorieGoalState(goal);
    setNewGoal('');
    setShowGoalInput(false);
  };

  // Delete calorie entry
  const handleDeleteEntry = (entryId) => {
    deleteCalorieEntry(entryId);
    setDailyCalories(getDailyCalories());
  };

  // Filter exercises based on body part and search
  const getFilteredExercises = () => {
    let exercises = [];
    
    if (selectedBodyPart === 'All') {
      Object.entries(EXERCISE_LIBRARY).forEach(([bodyPart, exList]) => {
        exercises.push(...exList.map(ex => ({ ...ex, bodyPart })));
      });
    } else {
      exercises = (EXERCISE_LIBRARY[selectedBodyPart] || []).map(ex => ({
        ...ex,
        bodyPart: selectedBodyPart
      }));
    }

    if (searchQuery) {
      exercises = exercises.filter(ex =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return exercises;
  };

  const netCalories = dailyCalories.consumed - dailyCalories.burned;
  const calorieProgress = Math.min((dailyCalories.consumed / calorieGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>Workout logged successfully! 🔥</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-black bg-opacity-30 backdrop-blur-md p-4 sticky top-0 z-40">
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
          🔥 FitStreak
        </h1>
      </header>

      {/* Main Content */}
      <main className="pb-20 px-4 py-6 max-w-4xl mx-auto">
        {/* Home Tab */}
        {currentTab === 'home' && (
          <div className="space-y-6">
            {/* Streak Section */}
            <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
              <div className="text-center">
                <div className={`${getStreakFlameSize(currentStreak)} ${getStreakFlameColor(currentStreak)} mb-4`}>
                  🔥
                </div>
                <h2 className="text-4xl font-bold mb-2">{currentStreak} Days</h2>
                <p className="text-gray-400">Current Streak</p>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400">Personal Best</p>
                  <p className="text-2xl font-semibold text-yellow-400">{longestStreak} Days</p>
                </div>
              </div>
            </div>

            {/* Calorie Dashboard */}
            <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Daily Calories</h3>
                <button
                  onClick={() => setShowGoalInput(!showGoalInput)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Goal: {calorieGoal}
                </button>
              </div>

              {showGoalInput && (
                <div className="mb-4 flex gap-2">
                  <input
                    type="number"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="New goal"
                    className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-white"
                  />
                  <button
                    onClick={updateCalorieGoal}
                    className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Set
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Consumed</span>
                  <span className="text-xl font-semibold text-green-400">
                    {dailyCalories.consumed} cal
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Burned</span>
                  <span className="text-xl font-semibold text-orange-400">
                    {dailyCalories.burned} cal
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                  <span className="text-gray-400">Net</span>
                  <span className={`text-xl font-semibold ${netCalories > calorieGoal ? 'text-red-400' : 'text-blue-400'}`}>
                    {netCalories} cal
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round(calorieProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        calorieProgress > 100 ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${calorieProgress}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setShowCalorieInput(!showCalorieInput)}
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Calorie Intake
                </button>

                {showCalorieInput && (
                  <div className="mt-4 space-y-3 bg-gray-800 p-4 rounded-lg">
                    <input
                      type="number"
                      value={calorieAmount}
                      onChange={(e) => setCalorieAmount(e.target.value)}
                      placeholder="Calories"
                      className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white"
                    />
                    <select
                      value={selectedMeal}
                      onChange={(e) => setSelectedMeal(e.target.value)}
                      className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="">Select meal (optional)</option>
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                    </select>
                    <button
                      onClick={addCalorieIntake}
                      className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                )}

                {/* Calorie Entries */}
                {dailyCalories.entries.filter(e => e.type === 'consumed').length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-400 font-semibold">Today&apos;s Intake</p>
                    {dailyCalories.entries
                      .filter(e => e.type === 'consumed')
                      .map(entry => (
                        <div
                          key={entry.id}
                          className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"
                        >
                          <div>
                            <span className="font-semibold">{entry.amount} cal</span>
                            {entry.meal && (
                              <span className="ml-2 text-sm text-gray-400 capitalize">
                                ({entry.meal})
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <History className="w-5 h-5" />
                Recent Activity
              </h3>
              {workoutHistory.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No workouts yet. Start your streak!</p>
              ) : (
                <div className="space-y-3">
                  {workoutHistory.slice(0, 5).map((workout) => (
                    <div key={workout.id} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{workout.date}</p>
                          <p className="text-sm text-gray-400">
                            {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-orange-400 font-semibold">
                            {workout.totalCalories} cal
                          </p>
                          <button
                            onClick={() => setExpandedWorkouts(prev => ({
                              ...prev,
                              [workout.id]: !prev[workout.id]
                            }))}
                            className="text-sm text-blue-400 flex items-center gap-1"
                          >
                            {expandedWorkouts[workout.id] ? (
                              <>
                                <ChevronUp className="w-4 h-4" /> Hide
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4" /> Details
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      {expandedWorkouts[workout.id] && (
                        <div className="mt-3 pt-3 border-t border-gray-700 space-y-1">
                          {workout.exercises.map((ex, idx) => (
                            <div key={idx} className="text-sm flex justify-between">
                              <span>
                                {ex.image} {ex.name}
                              </span>
                              <span className="text-gray-400">{ex.calories} cal</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {workoutHistory.length > 5 && (
                    <button
                      onClick={() => setCurrentTab('history')}
                      className="w-full text-center text-blue-400 hover:text-blue-300 py-2"
                    >
                      View All History
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Library Tab */}
        {currentTab === 'library' && (
          <div className="space-y-6">
            <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Exercise Library</h2>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400"
                />
              </div>

              {/* Body Part Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                {['All', ...Object.keys(EXERCISE_LIBRARY)].map(bodyPart => (
                  <button
                    key={bodyPart}
                    onClick={() => setSelectedBodyPart(bodyPart)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      selectedBodyPart === bodyPart
                        ? 'bg-purple-600'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    {bodyPart}
                  </button>
                ))}
              </div>

              {/* Exercise List */}
              <div className="space-y-2">
                {getFilteredExercises().map((exercise, idx) => {
                  const isSelected = selectedExercises.some(
                    ex => ex.name === exercise.name && ex.bodyPart === exercise.bodyPart
                  );
                  return (
                    <button
                      key={`${exercise.bodyPart}-${exercise.name}-${idx}`}
                      onClick={() => toggleExercise(exercise, exercise.bodyPart)}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-purple-600 border-2 border-purple-400'
                          : 'bg-gray-800 hover:bg-gray-700 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{exercise.image}</span>
                          <div>
                            <p className="font-semibold">{exercise.name}</p>
                            <p className="text-sm text-gray-400">{exercise.bodyPart}</p>
                            <p className="text-xs text-gray-500">{exercise.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-orange-400 font-semibold">{exercise.calories}</p>
                            <p className="text-xs text-gray-400">calories</p>
                          </div>
                          {isSelected && (
                            <Check className="w-6 h-6 text-white" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Friends Tab */}
        {currentTab === 'friends' && (
          <div className="space-y-6">
            <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Friend Streaks
              </h2>

              <div className="space-y-3">
                {friends
                  .sort((a, b) => b.currentStreak - a.currentStreak)
                  .map(friend => (
                    <div
                      key={friend.id}
                      className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{friend.avatar}</div>
                        <div>
                          <p className="font-semibold">{friend.name}</p>
                          <p className="text-sm text-gray-400">
                            Last workout: {friend.lastWorkout === getTodayDate() ? 'Today' : friend.lastWorkout}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-400">
                          {friend.currentStreak}
                        </p>
                        <p className="text-xs text-gray-400">day streak</p>
                      </div>
                    </div>
                  ))}
              </div>

              <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 py-3 rounded-lg flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Add Friend
              </button>
            </div>
          </div>
        )}

        {/* History Tab */}
        {currentTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Workout History
              </h2>

              {workoutHistory.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No workouts yet. Start your fitness journey!</p>
              ) : (
                <div className="space-y-3">
                  {workoutHistory.slice(0, 30).map((workout) => (
                    <div key={workout.id} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-lg">{workout.date}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(workout.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-orange-400 font-bold text-xl">
                            {workout.totalCalories}
                          </p>
                          <p className="text-xs text-gray-400">calories</p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2">
                        <p className="text-sm text-gray-400 font-semibold">
                          {workout.exercises.length} Exercise{workout.exercises.length !== 1 ? 's' : ''}
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {workout.exercises.map((ex, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center bg-gray-700 p-2 rounded"
                            >
                              <span className="text-sm">
                                {ex.image} {ex.name} ({ex.bodyPart})
                              </span>
                              <span className="text-sm text-orange-400">{ex.calories} cal</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button for Logging Workout */}
      {selectedExercises.length > 0 && (
        <button
          onClick={logWorkout}
          className="fixed bottom-24 right-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all transform hover:scale-105 flex items-center gap-2 z-30"
        >
          <Dumbbell className="w-5 h-5" />
          <span className="font-semibold">
            Log {selectedExercises.length} Exercise{selectedExercises.length !== 1 ? 's' : ''} ({totalCalories} cal)
          </span>
        </button>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-md border-t border-gray-800 z-40">
        <div className="flex justify-around items-center py-3 max-w-4xl mx-auto">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentTab === 'home'
                ? 'text-orange-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Flame className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => setCurrentTab('library')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentTab === 'library'
                ? 'text-orange-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-6 h-6" />
            <span className="text-xs">Library</span>
          </button>
          <button
            onClick={() => setCurrentTab('friends')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentTab === 'friends'
                ? 'text-orange-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs">Friends</span>
          </button>
          <button
            onClick={() => setCurrentTab('history')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentTab === 'history'
                ? 'text-orange-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs">History</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
