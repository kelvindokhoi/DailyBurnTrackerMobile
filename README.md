# Daily Burn Tracker Mobile

A premium, high-performance fitness and habit tracking application built with React Native.

## ✨ Features
- **Daily Burn Dashboard**: Dynamic workout suggestions and circular progress tracking.
- **Workout Player**: 40s Work / 20s Rest interval timer with exercise descriptions.
- **Plate Method Journal**: Quick logging for nutritional habits and hydration.
- **Frequency Tracker**: Analytics for consistency with "Frequency vs Minutes" visualization.
- **Progress Tracking**: Body measurement logging (Weight, Waist, Thigh) with change indicators.

## 🚀 Getting Started

### 📋 Prerequisites
- Node.js & npm
- React Native Environment Setup (Android Studio/SDK)
- Java 17 (set in `JAVA_HOME`)

### 🛠️ Installation
1. Clone the repository
2. Install dependencies:
   ```powershell
   npm install
   ```

### 📱 Running Locally
1. Start Metro Bundler:
   ```powershell
   npm start
   ```
2. Run on Android:
   ```powershell
   npm run android
   ```

## 🏗️ Building the APK

### 🔑 Generate Upload Key (First Time)
```powershell
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### 📦 Assemble APK
```powershell
cd android
./gradlew clean
./gradlew assembleDebug  # For testing
./gradlew assembleRelease # For final build
```

The APK will be located at:
`android/app/build/outputs/apk/debug/app-debug.apk`

## 🎨 Icon Generation

To generate/update the app icons from a master image:

1. **Install the generator dependency** (if not already present):
   ```powershell
   npm install --save-dev "@bam.tech/react-native-make"
   ```

2. **Run the generator**:
   Ensure your master image is located at `assets/app_icon.png` and run:
   ```powershell
   npx react-native set-icon --path assets/app_icon.png --platform android
   ```
   *Note: If you encounter "Input file is missing", try using the full path or ensure you are in the project root.*

## 🛠️ Tech Stack
- **Framework**: React Native
- **UI Library**: React Native Paper (MD3)
- **Icons**: FontAwesome 6 (Solid)
- **Animation**: React Native Animated API
- **Styling**: Vanilla StyleSheet with Midnight Blue/Black theme
