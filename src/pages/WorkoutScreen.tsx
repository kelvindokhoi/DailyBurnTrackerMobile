import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, IconButton, useTheme } from 'react-native-paper';
import { WorkoutTimer } from './WorkoutTimer';
import { getWorkoutForDay } from '../data/exercises';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { DynamicBackground } from '../components/DynamicBackground';
import { EntranceAnimation } from '../components/EntranceAnimation';

interface WorkoutScreenProps {
    onProgressUpdate?: (minutes: number) => void;
    onBack?: () => void;
}

export const WorkoutScreen = ({ onProgressUpdate, onBack }: WorkoutScreenProps) => {
    const [isComplete, setIsComplete] = useState(false);
    const dayOfWeek = new Date().getDay();
    const { type, exercises } = getWorkoutForDay(dayOfWeek);
    const theme = useTheme();

    if (dayOfWeek === 0) {
        return (
            <DynamicBackground>
                <View style={styles.centerContainer}>
                    <EntranceAnimation type="scale">
                        <View style={[styles.recoveryIconWrapper, { backgroundColor: 'rgba(0, 188, 212, 0.15)' }]}>
                            <FontAwesome6 name="person-walking" size={64} color={theme.colors.secondary} iconStyle="solid" />
                        </View>
                    </EntranceAnimation>
                    <EntranceAnimation type="slide-up" delay={200}>
                        <Text variant="headlineSmall" style={[styles.bold, { color: theme.colors.onBackground }]}>Active Recovery Day</Text>
                    </EntranceAnimation>
                    <EntranceAnimation type="fade" delay={400}>
                        <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
                            Today is for rest. Take a leisurely 20-30 minute walk and let your body recover.
                        </Text>
                    </EntranceAnimation>
                    {onBack && (
                        <EntranceAnimation type="slide-up" delay={600}>
                            <Button
                                mode="contained-tonal"
                                onPress={onBack}
                                style={styles.backButton}
                                labelStyle={styles.bold}
                            >
                                Back to Dashboard
                            </Button>
                        </EntranceAnimation>
                    )}
                </View>
            </DynamicBackground>
        );
    }

    if (isComplete) {
        return (
            <DynamicBackground>
                <View style={styles.centerContainer}>
                    <EntranceAnimation type="scale">
                        <View style={[styles.successCircle, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
                            <FontAwesome6 name="circle-check" size={54} color="#4caf50" iconStyle="solid" />
                        </View>
                    </EntranceAnimation>
                    <EntranceAnimation type="slide-up" delay={200}>
                        <Text variant="headlineMedium" style={[styles.bold, { color: theme.colors.onBackground }]}>Workout Complete!</Text>
                    </EntranceAnimation>
                    <EntranceAnimation type="fade" delay={400}>
                        <Text variant="bodyLarge" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
                            Amazing work! You crushed today's {type}.
                        </Text>
                    </EntranceAnimation>
                    {onBack && (
                        <EntranceAnimation type="slide-up" delay={600}>
                            <Button
                                mode="contained"
                                onPress={onBack}
                                style={styles.backButton}
                                buttonColor={theme.colors.primary}
                                labelStyle={styles.bold}
                            >
                                Back to Dashboard
                            </Button>
                        </EntranceAnimation>
                    )}
                </View>
            </DynamicBackground>
        );
    }

    return (
        <DynamicBackground>
            <ScrollView contentContainerStyle={styles.container} style={styles.scroll}>
                <EntranceAnimation type="slide-up">
                    <View style={styles.header}>
                        <IconButton
                            icon={(props) => <FontAwesome6 {...props} name="chevron-left" iconStyle="solid" />}
                            size={24}
                            onPress={onBack}
                            containerColor="rgba(30, 30, 30, 0.7)"
                            iconColor={theme.colors.onSurfaceVariant}
                            style={{ borderWidth: 1, borderColor: theme.colors.outline }}
                        />
                        <View style={{ marginLeft: 12 }}>
                            <Text variant="headlineSmall" style={[styles.bold, { color: theme.colors.onBackground }]}>{type}</Text>
                            <Text variant="labelMedium" style={{ color: theme.colors.secondary, fontWeight: '700' }}>
                                40s WORK / 20s REST
                            </Text>
                        </View>
                    </View>
                </EntranceAnimation>

                <WorkoutTimer
                    exercises={exercises}
                    onComplete={() => setIsComplete(true)}
                    onProgressUpdate={onProgressUpdate ?? (() => { })}
                />
            </ScrollView>
        </DynamicBackground>
    );
};

const styles = StyleSheet.create({
    scroll: { flex: 1 },
    container: {
        padding: 20,
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    recoveryIconWrapper: {
        marginBottom: 24,
        padding: 24,
        borderRadius: 40,
    },
    bold: {
        fontWeight: '700',
    },
    description: {
        textAlign: 'center',
        marginTop: 12,
        maxWidth: 280,
        lineHeight: 22,
    },
    backButton: {
        marginTop: 40,
        borderRadius: 16,
        paddingHorizontal: 20,
    },
    successCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
});
