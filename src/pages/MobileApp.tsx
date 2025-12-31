// MobileApp.tsx – top‑level navigation for DailyBurnTrackerMobile
import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { BottomNavigation, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DashboardScreen } from './DashboardScreen';
import { WorkoutScreen } from './WorkoutScreen';
import { MealsScreen } from './MealsScreen';
import { ProgressScreen } from './ProgressScreen';
import { SettingsScreen } from './SettingsScreen';
import { NutTrackerScreen, NutLog } from './NutTrackerScreen';

// NutLog interface removed from here to NutTrackerScreen to avoid circular deps

export default function MobileApp() {
    const [index, setIndex] = useState(0);
    const theme = useTheme();
    const [isWorkingOut, setIsWorkingOut] = useState(false);

    // --- SHARED DATA STATE ---
    const [userProfile, setUserProfile] = useState({
        name: 'John Doe',
        weight: '90',
        goalWeight: '80',
        age: '25',
    });

    const [minutesCompleted, setMinutesCompleted] = useState(25);
    const [streak, setStreak] = useState(7);

    const [mealLogs, setMealLogs] = useState<any[]>([
        {
            id: '1',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            checks: { halfVeggies: true, drankWater: true, noSeconds: true },
        },
        {
            id: '2',
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
            checks: { halfVeggies: true, drankWater: false, noSeconds: true },
        },
    ]);

    const [measurements, setMeasurements] = useState<any[]>([
        { date: new Date('2024-01-01'), weight: 90, waist: 95, thigh: 62 },
        { date: new Date('2024-01-08'), weight: 89.2, waist: 94, thigh: 61.5 },
        { date: new Date('2024-01-15'), weight: 88.5, waist: 93, thigh: 61 },
        { date: new Date('2024-01-22'), weight: 87.8, waist: 92, thigh: 60.5 },
    ]);

    // Nut Logs State
    const [nutLogs, setNutLogs] = useState<NutLog[]>([
        { id: '1', date: new Date(Date.now() - 86400000 * 1), duration: 15 },
        { id: '2', date: new Date(Date.now() - 86400000 * 2), duration: 10 },
        { id: '3', date: new Date(Date.now() - 86400000 * 5), duration: 20 },
    ]);

    // --- HANDLERS ---
    const handleStartWorkout = useCallback(() => {
        setIsWorkingOut(true);
    }, []);

    const handleProgressUpdate = useCallback((minutes: number) => {
        setMinutesCompleted((prev) => prev + minutes);
    }, []);

    const handleSaveMeal = useCallback((checks: any) => {
        const newMeal = {
            id: Date.now().toString(),
            timestamp: new Date(),
            checks,
        };
        setMealLogs((prev) => [newMeal, ...prev]);
    }, []);

    const handleSaveMeasurement = useCallback((m: any) => {
        setMeasurements((prev) => [...prev, m]);
    }, []);

    const handleSaveNutLog = useCallback((date: Date, duration: number) => {
        const newLog: NutLog = {
            id: Date.now().toString(),
            date,
            duration,
        };
        setNutLogs((prev) => [...prev, newLog]);
    }, []);

    const handleDeleteNutLog = useCallback((id: string) => {
        setNutLogs((prev) => prev.filter(l => l.id !== id));
    }, []);

    const handleResetData = useCallback((type: 'all' | 'meals' | 'progress' | 'workouts' | 'nut') => {
        if (type === 'all' || type === 'meals') setMealLogs([]);
        if (type === 'all' || type === 'progress') setMeasurements([]);
        if (type === 'all' || type === 'nut') setNutLogs([]);
        if (type === 'all' || type === 'workouts') {
            setMinutesCompleted(0);
            setStreak(0);
        }
    }, []);

    const routes = useMemo(() => [
        { key: 'dashboard', title: 'Home', focusedIcon: 'house', unfocusedIcon: 'house' },
        { key: 'meals', title: 'Meals', focusedIcon: 'utensils', unfocusedIcon: 'utensils' },
        { key: 'progress', title: 'Stats', focusedIcon: 'chart-line', unfocusedIcon: 'chart-line' },
        { key: 'nut', title: 'Frequency', focusedIcon: 'bolt', unfocusedIcon: 'bolt' },
        { key: 'settings', title: 'Settings', focusedIcon: 'gear', unfocusedIcon: 'gear' },
    ], []);

    const renderScene = useCallback(({ route }: { route: any }) => {
        switch (route.key) {
            case 'dashboard':
                return <DashboardScreen
                    onStartWorkout={handleStartWorkout}
                    isFocused={index === 0}
                    minutesCompleted={minutesCompleted}
                    streak={streak}
                    goalMinutes={60}
                />;
            case 'meals':
                return <MealsScreen
                    isFocused={index === 1}
                    mealLogs={mealLogs}
                    onSaveMeal={handleSaveMeal}
                />;
            case 'progress':
                return <ProgressScreen
                    isFocused={index === 2}
                    measurements={measurements}
                    onSaveMeasurement={handleSaveMeasurement}
                    targetWeight={parseFloat(userProfile.goalWeight)}
                />;
            case 'nut':
                return <NutTrackerScreen
                    isFocused={index === 3}
                    logs={nutLogs}
                    onSaveLog={handleSaveNutLog}
                    onDeleteLog={handleDeleteNutLog}
                    age={parseInt(userProfile.age)}
                />;
            case 'settings':
                return <SettingsScreen
                    isFocused={index === 4}
                    userProfile={userProfile}
                    onUpdateProfile={setUserProfile}
                    onResetData={handleResetData}
                />;
            default:
                return null;
        }
    }, [index, handleStartWorkout, minutesCompleted, streak, mealLogs, handleSaveMeal, measurements, handleSaveMeasurement, userProfile, nutLogs, handleSaveNutLog, handleDeleteNutLog, handleResetData]);

    if (isWorkingOut) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
                <WorkoutScreen
                    onProgressUpdate={handleProgressUpdate}
                    onBack={() => setIsWorkingOut(false)}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
                shifting={false}
                barStyle={[styles.bottomBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outline }]}
                activeColor={theme.colors.primary}
                inactiveColor={theme.colors.onSurfaceVariant}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    bottomBar: { borderTopWidth: 1 },
});
