/**
 * Daily Burn Tracker Mobile
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import MobileApp from './src/pages/MobileApp';

// Define a sleek "Midnight Blue" color palette
const customColors = {
  primary: '#2196f3',    // Bright Blue
  secondary: '#00bcd4',  // Cyan/Light Blue
  tertiary: '#8b5cf6',   // Soft Violet
  success: '#4caf50',    // Green
  error: '#f44336',      // Red
  background: '#000000', // Pure Black
  surface: '#121212',    // Dark Gray (Material Design Surface)
  outline: '#2c2c2e',    // Dark Outline
};

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: customColors.primary,
    secondary: customColors.secondary,
    tertiary: customColors.tertiary,
    background: customColors.background,
    surface: customColors.surface,
    outline: customColors.outline,
    error: customColors.error,
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level1: '#1c1c1e',
      level2: '#2c2c2e',
    },
    onSurface: '#e1e1e1',
    onSurfaceVariant: '#a1a1a1',
    primaryContainer: 'rgba(33, 150, 243, 0.1)',
    secondaryContainer: 'rgba(0, 188, 212, 0.1)',
  },
};

function App() {
  // Force dark theme as requested by "black-blue" scheme
  const activeTheme = theme;

  return (
    <PaperProvider
      theme={activeTheme}
      settings={{
        icon: (props: any) => <FontAwesome6 {...props} iconStyle="solid" />,
      }}
    >
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <MobileApp />
      </SafeAreaProvider>
    </PaperProvider>
  );
}

export default App;
