import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Text, useTheme, Card } from 'react-native-paper';
import { Exercise } from '../data/exercises';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { EntranceAnimation } from '../components/EntranceAnimation';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface WorkoutTimerProps {
    exercises: Exercise[];
    onComplete: () => void;
    onProgressUpdate: (minutes: number) => void;
}

type TimerPhase = 'work' | 'rest';

export const WorkoutTimer = ({ exercises, onComplete, onProgressUpdate }: WorkoutTimerProps) => {
    const theme = useTheme();
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [phase, setPhase] = useState<TimerPhase>('work');
    const [timeRemaining, setTimeRemaining] = useState(40);
    const [isRunning, setIsRunning] = useState(false);
    const [totalSecondsCompleted, setTotalSecondsCompleted] = useState(0);

    const currentExercise = exercises[currentExerciseIndex];
    const workDuration = 40;
    const restDuration = 20;

    const totalDuration = phase === 'work' ? workDuration : restDuration;

    // SVG Constants
    const size = 200;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const progressAnim = useRef(new Animated.Value(1)).current;

    const nextExercise = useCallback(() => {
        if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex((prev) => prev + 1);
            setPhase('work');
            setTimeRemaining(workDuration);
        } else {
            onComplete();
            setIsRunning(false);
        }
    }, [currentExerciseIndex, exercises.length, onComplete]);

    // Handle timer interval
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isRunning && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining((prev) => prev - 1);
                setTotalSecondsCompleted((prev) => prev + 1);
            }, 1000);
        } else if (isRunning && timeRemaining === 0) {
            if (phase === 'work') {
                setPhase('rest');
                setTimeRemaining(restDuration);
            } else {
                nextExercise();
            }
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, timeRemaining, phase, nextExercise]);

    // Notify parent of progress exactly when a minute is completed
    // Using a separate useEffect to avoid updating parent state during child state calculation
    useEffect(() => {
        if (totalSecondsCompleted > 0 && totalSecondsCompleted % 60 === 0) {
            onProgressUpdate(1);
        }
    }, [totalSecondsCompleted, onProgressUpdate]);

    // Animate the circle whenever timeRemaining or phase changes
    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: timeRemaining / totalDuration,
            duration: isRunning ? 1000 : 300,
            useNativeDriver: true,
        }).start();
    }, [timeRemaining, totalDuration, progressAnim, isRunning]);

    const toggleTimer = () => setIsRunning(!isRunning);

    const skipExercise = () => {
        nextExercise();
    };

    const resetTimer = () => {
        setIsRunning(false);
        setCurrentExerciseIndex(0);
        setPhase('work');
        setTimeRemaining(workDuration);
        setTotalSecondsCompleted(0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!currentExercise) return null;

    const isWork = phase === 'work';
    const accentColor = isWork ? theme.colors.primary : theme.colors.secondary;

    const strokeDashoffset = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
    });

    return (
        <View style={styles.container}>
            {/* Phase Badge */}
            <EntranceAnimation type="fade" delay={200}>
                <View style={[styles.phaseBadge, { backgroundColor: isWork ? 'rgba(33, 150, 243, 0.15)' : 'rgba(0, 188, 212, 0.15)' }]}>
                    <FontAwesome6
                        name={isWork ? "fire" : "mug-hot"}
                        size={14}
                        color={isWork ? theme.colors.primary : theme.colors.secondary}
                        iconStyle="solid"
                    />
                    <Text style={[styles.phaseText, { color: isWork ? theme.colors.primary : theme.colors.secondary }]}>
                        {isWork ? 'BURN PHASE' : 'REST PHASE'}
                    </Text>
                </View>
            </EntranceAnimation>

            {/* Large Timer Display with SVG Circle Progress */}
            <EntranceAnimation type="scale" delay={400}>
                <View style={styles.timerWrapper}>
                    <Svg width={size} height={size} style={styles.svg}>
                        {/* Background Circle */}
                        <Circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth={strokeWidth}
                            fill="rgba(18, 18, 18, 0.5)"
                        />
                        {/* Progress Circle */}
                        <AnimatedCircle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke={accentColor}
                            strokeWidth={strokeWidth}
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            transform={`rotate(-90 ${size / 2} ${size / 2})`}
                        />
                    </Svg>
                    <View style={styles.timerTextContainer}>
                        <Text style={[styles.timerNumber, { color: accentColor }]}>
                            {timeRemaining}
                        </Text>
                        <Text style={[styles.timerLabel, { color: theme.colors.onSurfaceVariant }]}>SECONDS</Text>
                    </View>
                </View>
            </EntranceAnimation>

            {/* Active Exercise Card */}
            <EntranceAnimation type="slide-up" delay={600}>
                <Card style={[styles.infoCard, { backgroundColor: 'rgba(30,30,30,0.7)', borderColor: theme.colors.outline, borderWidth: 1 }]} mode="contained">
                    <Card.Content style={styles.center}>
                        <Text variant="titleLarge" style={[styles.exName, { color: theme.colors.onSurface }]}>{currentExercise.name}</Text>
                        <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>{currentExercise.description}</Text>
                        <View style={[styles.progressCounter, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}>
                            <Text style={[styles.counterText, { color: theme.colors.onSurfaceVariant }]}>
                                {currentExerciseIndex + 1} <Text style={{ color: theme.colors.outline }}>/ {exercises.length}</Text>
                            </Text>
                        </View>
                    </Card.Content>
                </Card>
            </EntranceAnimation>

            {/* Controls */}
            <View style={styles.controlsRow}>
                <EntranceAnimation type="scale" delay={800}>
                    <TouchableOpacity onPress={resetTimer} style={[styles.sideButton, { backgroundColor: 'rgba(30, 30, 30, 0.7)', borderColor: theme.colors.outline, borderWidth: 1 }]}>
                        <FontAwesome6 name="rotate-right" size={18} color={theme.colors.onSurfaceVariant} iconStyle="solid" />
                    </TouchableOpacity>
                </EntranceAnimation>

                <EntranceAnimation type="scale" delay={900}>
                    <TouchableOpacity
                        onPress={toggleTimer}
                        style={[styles.mainPlayButton, { backgroundColor: accentColor }]}
                    >
                        <FontAwesome6
                            name={isRunning ? "pause" : "play"}
                            size={28}
                            color="#ffffff"
                            iconStyle="solid"
                            style={{ marginLeft: isRunning ? 0 : 4 }}
                        />
                    </TouchableOpacity>
                </EntranceAnimation>

                <EntranceAnimation type="scale" delay={1000}>
                    <TouchableOpacity onPress={skipExercise} style={[styles.sideButton, { backgroundColor: 'rgba(30, 30, 30, 0.7)', borderColor: theme.colors.outline, borderWidth: 1 }]}>
                        <FontAwesome6 name="forward-step" size={18} color={theme.colors.onSurfaceVariant} iconStyle="solid" />
                    </TouchableOpacity>
                </EntranceAnimation>
            </View>

            {/* Footer Status */}
            <EntranceAnimation type="fade" delay={1100}>
                <View style={styles.footer}>
                    <FontAwesome6 name="clock" size={14} color={theme.colors.outline} iconStyle="solid" />
                    <Text style={[styles.totalTimeText, { color: theme.colors.onSurfaceVariant }]}>
                        SESSION TIME: <Text style={[styles.boldTime, { color: theme.colors.onSurface }]}>{formatTime(totalSecondsCompleted)}</Text>
                    </Text>
                </View>
            </EntranceAnimation>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { alignItems: 'center', width: '100%' },
    phaseBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, gap: 8, marginBottom: 32 },
    phaseText: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
    timerWrapper: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32
    },
    svg: {
        position: 'absolute',
    },
    timerTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerNumber: { fontSize: 64, fontWeight: '700' },
    timerLabel: { fontSize: 12, fontWeight: '600', letterSpacing: 1.5, marginTop: -4 },
    infoCard: { width: '100%', borderRadius: 12, marginBottom: 32 },
    center: { alignItems: 'center', paddingVertical: 16 },
    exName: { fontWeight: '700' },
    description: { textAlign: 'center', marginTop: 8, paddingHorizontal: 10, lineHeight: 20 },
    progressCounter: { marginTop: 12, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
    counterText: { fontSize: 12, fontWeight: '600' },
    controlsRow: { flexDirection: 'row', alignItems: 'center', gap: 32, marginBottom: 32 },
    sideButton: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    mainPlayButton: { width: 76, height: 76, borderRadius: 38, justifyContent: 'center', alignItems: 'center', elevation: 2 },
    footer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    totalTimeText: { fontSize: 11, fontWeight: '600' },
    boldTime: { fontWeight: '700' },
});
