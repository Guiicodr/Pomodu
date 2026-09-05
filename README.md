# Pomodu

**Master your time. Stay present.**

Pomodu is a premium productivity app that combines the Pomodoro Technique with physical phone-flip detection, task management, and geolocation-based metrics. Built with React Native (Expo) and TypeScript.

---

## ✨ Features

### 🎯 Focus Timer
- Configurable Pomodoro timer (work / short break / long break)
- **Flip-to-Focus**: timer only runs when phone is face down (accelerometer)
- Haptic feedback on flip detection and interruptions
- Circular SVG progress ring with gradient stroke and breathing glow
- Session history with GPS location logging

### ✅ Task Management
- Kanban-style (To Do / In Progress / Done)
- Create, edit, delete tasks with categories
- Priority indicators with color-coded bars
- Mini session progress bar per task
- Search and filter by status

### 📊 Metrics & Dashboard
- Total focused time, streak tracking, daily session count
- Weekly focus chart, productivity comparison by location
- GitHub-style streak calculation

### 🎨 Design System
- **Primary accent**: `#249c44` (Electric Green)
- **Brand colors**: Terracotta (`#BD5328`) + Sage (`#71977A`)
- OLED Dark Mode (`#080A0F`) and crisp Light Mode (`#F8FAFC`)
- Gradient buttons, glassmorphic cards, breathing glow animations

### 🔐 Authentication
- Email/password login and signup | Guest mode (no account required)
### 📍 GPS & Location
- Automatic location capture on session completion
- Reverse geocoding to resolve location names
- Auto-infer location icon from name keywords | Productivity comparison

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Physical device with **Expo Go** (iOS/Android)

### Installation

```bash
git clone https://github.com/yourusername/pomodu.git
cd pomodu
npm install --legacy-peer-deps
npx expo start
```

Scan the QR code with Expo Go.

---

## 📁 Project Structure

```
src/
├── app/             # Expo Router screens (auth, focus, tasks, insights, settings)
├── components/      # Reusable UI (brand, focus, insights, navigation, tasks, ui)
├── constants/       # Theme, colors, spacing tokens
├── context/         # Auth, Theme, Settings providers
├── hooks/           # useFlipDetector, usePomodoroTimer, useTasks, etc.
├── services/        # SQLite database, task/session/location services
├── types/           # TypeScript interfaces
└── utils/           # Formatting helpers
```

---

## 🛠️ Tech Stack

| Category | Library |
|---|---|
| **Framework** | React Native 0.86 + Expo SDK 57 |
| **Language** | TypeScript ~5.7 |
| **Navigation** | Expo Router (file-based) + Drawer |
| **State** | React Context + AsyncStorage |
| **Database** | expo-sqlite |
| **Sensors** | expo-sensors (Accelerometer) |
| **Haptics** | expo-haptics |
| **GPS** | expo-location + reverse geocoding |
| **Audio** | expo-av (ambient sounds) |
| **Animations** | react-native-reanimated + Animated |
| **Charts** | react-native-chart-kit + react-native-svg |
| **Gradients** | expo-linear-gradient |
| **Icons** | lucide-react-native |

---

## 🎮 Core Mechanics

### Flip-to-Focus
1. Place phone **face down** on a flat surface → timer **auto-starts** + haptic
2. **Lift the phone** → timer pauses + alert haptic
3. **Flip back down** → timer resumes
4. Session saved on completion with GPS location

### Pomodoro Cycle
```
Focus (25min) → Short Break (5min) → Focus → ... → 4 cycles → Long Break (15min)
```

---

## 📱 Screens

| Screen | Description |
|---|---|
| **Focus** | Main timer, flip detection, presets, daily goal widget |
| **Tasks** | Kanban with search, filters, priority indicators |
| **Metrics** | Charts, streak, location comparison, weekly stats |
| **Settings** | Timer durations, appearance toggle, about |
| **Login / Signup** | Auth with guest mode, always light mode |

---

## 🔄 State Management

- **AuthContext**: User session, login/signup/guest/logout, AsyncStorage
- **ThemeContext**: Light/Dark mode toggle, AsyncStorage
- **SettingsContext**: Timer durations, AsyncStorage
- **SQLite**: Tasks, focus sessions, work locations

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT

---

## 🙏 Acknowledgments

- Pomodoro Technique® by Francesco Cirillo
- Design inspired by Linear, Apple, and Opal
- Built with ❤️ using React Native & Expo
- Session persistence with AsyncStorage | Login always in Light Mode