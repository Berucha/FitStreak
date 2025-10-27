# 🔥 FitStreak

A gamified fitness tracking app that combines Duolingo-style streaks with comprehensive workout logging and social accountability features.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/react-18.x-61dafb.svg)

## 🎯 Overview

FitStreak helps you build lasting fitness habits through:

- 🔥 **Streak Tracking** - Maintain daily workout streaks like Duolingo
- 💪 **Exercise Library** - 32+ exercises across 8 body part categories
- 🍎 **Calorie Management** - Track consumption, burn, and net balance
- 👥 **Friend Competition** - Compare streaks and motivate each other
- 📊 **Workout History** - Complete log of your fitness journey

## ✨ Features

### Core Functionality

- **Daily Streak Counter** - Visual flame indicator that grows with consistency
- **Exercise Catalog** - Browse workouts by muscle group (Chest, Back, Legs, Shoulders, Arms, Core, Cardio, Full Body)
- **Multi-Select Logging** - Add multiple exercises per workout session
- **Calorie Dashboard** - See consumed vs. burned calories at a glance
- **Friend Leaderboard** - View friends’ streaks and recent activity
- **Persistent Storage** - All data saved across sessions

### Gamification Elements

- Current streak tracking
- Longest streak records
- Calorie burn calculations per exercise
- Visual progress indicators
- Social comparison features

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/fitstreak.git
cd fitstreak
```

1. **Install dependencies**

```bash
npm install
# or
yarn install
```

1. **Start the development server**

```bash
npm start
# or
yarn start
```

1. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Usage

### Logging Your First Workout

1. **Navigate to Library** - Tap the “Library” icon in the bottom navigation
1. **Select Body Part** - Choose the muscle group you worked (e.g., Chest, Legs)
1. **Pick Exercises** - Tap exercises to add them to your workout
1. **Log Workout** - Hit the floating “Log X Exercises” button
1. **See Your Streak Grow** - Return to home to see your updated streak!

### Tracking Calories

- View your daily calorie consumption and burn on the home screen
- Set your daily calorie goal in settings
- Workouts automatically add to calories burned
- Track net calories (consumed - burned)

### Competing with Friends

- Navigate to the Friends tab
- See friends’ current streaks and last workout
- Use social pressure to stay motivated!

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: Browser localStorage (persistent data)
- **Deployment**: Ready for Vercel, Netlify, or any static host

## 📂 Project Structure

```
fitstreak/
├── src/
│   ├── components/        # React components
│   ├── data/             # Exercise library and constants
│   ├── utils/            # Helper functions
│   ├── App.jsx           # Main application component
│   └── index.js          # Entry point
├── public/               # Static assets
├── package.json          # Dependencies
└── README.md            # This file
```

## 🎨 Customization

### Adding New Exercises

Edit the `EXERCISE_LIBRARY` constant in `App.jsx`:

```javascript
'BodyPart': [
  { 
    name: 'Exercise Name', 
    image: '💪', 
    calories: 150, 
    description: 'Brief description' 
  }
]
```

### Modifying Streak Logic

Streak calculations are handled in the `saveWorkout` function. Customize reset timing or freeze days as needed.

### Styling

FitStreak uses Tailwind CSS utility classes. Modify colors, gradients, and spacing directly in component JSX.

## 🗺️ Roadmap

### Version 1.1 (Planned)

- [ ] Manual calorie input for meals
- [ ] Workout templates/routines
- [ ] Weekly/monthly statistics
- [ ] Export workout data (CSV/PDF)

### Version 2.0 (Future)

- [ ] User authentication
- [ ] Real friend connections (not mock data)
- [ ] Cloud sync across devices
- [ ] Mobile app (iOS/Android)
- [ ] Wearable integration (Apple Watch, Fitbit)
- [ ] Custom exercise creation
- [ ] Progress photos
- [ ] Achievement badges

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
1. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
1. Push to the branch (`git push origin feature/AmazingFeature`)
1. Open a Pull Request

### Development Guidelines

- Follow React best practices and hooks patterns
- Use Tailwind utility classes for styling
- Maintain component modularity
- Add comments for complex logic
- Test thoroughly before submitting PR

## 📄 License

This project is licensed under the MIT License - see the <LICENSE> file for details.

## 🙏 Acknowledgments

- Inspired by [Duolingo](https://www.duolingo.com/)’s streak mechanics
- Icons by [Lucide](https://lucide.dev/)
- Built with [React](https://react.dev/)

## 📧 Contact

**Project Link**: <https://github.com/Berucha/FitStreak>

For questions or suggestions, please open an issue on GitHub.

---

*Stay consistent. Build your streak. Transform your fitness.*