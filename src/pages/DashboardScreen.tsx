// src/pages/DashboardScreen.tsx – React Native version of the web DashboardScreen

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, ProgressBar, Card, useTheme } from 'react-native-paper';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { getWorkoutForDay, getDayName } from '../data/exercises';
import { ExerciseCard } from '../components/ExerciseCard';
import { DynamicBackground } from '../components/DynamicBackground';
import { EntranceAnimation } from '../components/EntranceAnimation';

interface DashboardProps {
    onStartWorkout?: () => void;
    isFocused?: boolean;
    minutesCompleted?: number;
    streak?: number;
    goalMinutes?: number;
}

export const DashboardScreen = ({
    onStartWorkout,
    isFocused = true,
    minutesCompleted = 0,
    streak = 0,
    goalMinutes = 60
}: DashboardProps) => {
    const theme = useTheme();
    const today = new Date();
    const dayOfWeek = today.getDay();
    const { type, exercises } = getWorkoutForDay(dayOfWeek);

    const progress = Math.min((minutesCompleted / goalMinutes), 1);

    const isRestDay = dayOfWeek === 0;

    return (
        <DynamicBackground>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <EntranceAnimation type="slide-up" trigger={isFocused}>
                    <View style={styles.header}>
                        <Text style={[styles.dayText, { color: theme.colors.primary }]}>
                            {getDayName(dayOfWeek).toUpperCase()}
                        </Text>
                        <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onBackground }]}>Daily Burn</Text>
                    </View>
                </EntranceAnimation>

                {/* Progress Section */}
                <EntranceAnimation type="scale" delay={150} trigger={isFocused}>
                    <View style={styles.progressContainer}>
                        <View style={[styles.ringPlaceholder, { borderColor: theme.colors.outline, backgroundColor: 'rgba(18, 18, 18, 0.6)' }]}>
                            <Text style={[styles.progressNumber, { color: theme.colors.primary }]}>{minutesCompleted}</Text>
                            <Text style={[styles.progressLabel, { color: theme.colors.onSurfaceVariant }]}>of {goalMinutes} min</Text>
                        </View>
                        <ProgressBar
                            progress={progress}
                            color={theme.colors.primary}
                            style={[styles.progressBar, { backgroundColor: theme.colors.outline }]}
                        />
                    </View>
                </EntranceAnimation>

                {/* Today's Focus */}
                <EntranceAnimation type="slide-up" delay={300} trigger={isFocused}>
                    <Card style={[styles.focusCard, { backgroundColor: 'rgba(30, 30, 30, 0.7)' }]} mode="contained">
                        <Card.Title
                            title="Today's Focus"
                            titleStyle={[styles.bold, { color: theme.colors.onSurface }]}
                            subtitle={type}
                            subtitleStyle={{ color: theme.colors.secondary, fontWeight: '700' }}
                            left={(props) => (
                                <FontAwesome6
                                    name={isRestDay ? 'person-walking' : 'fire'}
                                    size={24}
                                    color={isRestDay ? theme.colors.secondary : theme.colors.primary}
                                    iconStyle="solid"
                                />
                            )}
                        />
                        <Card.Content>
                            {isRestDay ? (
                                <View style={styles.restDayContainer}>
                                    <Text style={[styles.restText, { color: theme.colors.onSurfaceVariant }]}>Take a 20‑30 minute walk to stay active without overexerting yourself.</Text>
                                    <View style={[styles.recoveryBadge, { backgroundColor: 'rgba(0, 188, 212, 0.15)' }]}>
                                        <FontAwesome6 name="person-walking-arrow-right" size={20} color={theme.colors.secondary} iconStyle="solid" />
                                        <Text style={[styles.recoveryText, { color: theme.colors.secondary }]}>Active Recovery Day</Text>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.exerciseList}>
                                    {exercises.slice(0, 4).map((ex, index) => (
                                        <EntranceAnimation key={ex.id} type="slide-up" delay={450 + (index * 100)} trigger={isFocused}>
                                            <ExerciseCard exercise={ex} />
                                        </EntranceAnimation>
                                    ))}
                                    {exercises.length > 4 && (
                                        <Text style={[styles.moreCount, { color: theme.colors.onSurfaceVariant }]}>+{exercises.length - 4} more exercises</Text>
                                    )}
                                </View>
                            )}
                        </Card.Content>
                    </Card>
                </EntranceAnimation>

                {/* Start Button */}
                {!isRestDay && (
                    <EntranceAnimation type="slide-up" delay={800} trigger={isFocused}>
                        <Button
                            mode="contained"
                            onPress={onStartWorkout ?? (() => { })}
                            style={styles.startButton}
                            labelStyle={styles.startButtonLabel}
                            buttonColor={theme.colors.primary}
                            icon={(props) => <FontAwesome6 {...props} name="play" iconStyle="solid" />}
                        >
                            Start Workout
                        </Button>
                    </EntranceAnimation>
                )}

                {/* Quick Stats */}
                <View style={styles.statsGrid}>
                    <EntranceAnimation type="scale" delay={900} style={{ flex: 1 }} trigger={isFocused}>
                        <Card style={[styles.statCard, { backgroundColor: 'rgba(30, 30, 30, 0.7)' }]} mode="contained">
                            <Card.Content style={styles.statContent}>
                                <FontAwesome6 name="calendar-check" size={24} color={theme.colors.primary} iconStyle="solid" />
                                <Text variant="headlineSmall" style={[styles.bold, { color: theme.colors.onSurface }]}>{streak}</Text>
                                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Day Streak</Text>
                            </Card.Content>
                        </Card>
                    </EntranceAnimation>
                    <EntranceAnimation type="scale" delay={1000} style={{ flex: 1 }} trigger={isFocused}>
                        <Card style={[styles.statCard, { backgroundColor: 'rgba(30, 30, 30, 0.7)' }]} mode="contained">
                            <Card.Content style={styles.statContent}>
                                <FontAwesome6 name="fire-flame-curved" size={24} color={theme.colors.secondary} iconStyle="solid" />
                                <Text variant="headlineSmall" style={[styles.bold, { color: theme.colors.onSurface }]}>{minutesCompleted}</Text>
                                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Total Minutes</Text>
                            </Card.Content>
                        </Card>
                    </EntranceAnimation>
                </View>
            </ScrollView>
        </DynamicBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 40 },
    header: { alignItems: 'flex-start', marginBottom: 24, marginTop: 10 },
    dayText: { fontSize: 13, fontWeight: '700', letterSpacing: 1.5, marginBottom: 4 },
    title: { fontWeight: '700' },
    progressContainer: { alignItems: 'center', marginBottom: 30 },
    ringPlaceholder: {
        width: 170,
        height: 170,
        borderRadius: 85,
        borderWidth: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    progressNumber: { fontSize: 48, fontWeight: '700' },
    progressLabel: { fontSize: 13, fontWeight: '600' },
    progressBar: { width: '80%', height: 6, borderRadius: 3 },
    focusCard: { marginBottom: 20, borderRadius: 16 },
    exerciseList: { marginTop: 10 },
    moreCount: { textAlign: 'center', fontSize: 12, marginTop: 8 },
    startButton: { marginBottom: 24, paddingVertical: 8, borderRadius: 12 },
    startButtonLabel: { fontSize: 16, fontWeight: '700' },
    restDayContainer: { alignItems: 'center', paddingVertical: 20 },
    restText: { textAlign: 'center', marginBottom: 16, fontSize: 14, lineHeight: 20 },
    recoveryBadge: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
    recoveryText: { fontWeight: '700', fontSize: 13 },
    statsGrid: { flexDirection: 'row', gap: 16 },
    statCard: { flex: 1, borderRadius: 16 },
    statContent: { alignItems: 'center', gap: 4 },
    bold: { fontWeight: '700' },
});
