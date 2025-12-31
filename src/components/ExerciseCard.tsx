import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { Exercise } from '../data/exercises';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

interface ExerciseCardProps {
    exercise: Exercise;
    isActive?: boolean;
    onPress?: () => void;
}

export const ExerciseCard = ({ exercise, isActive, onPress }: ExerciseCardProps) => {
    const theme = useTheme();

    return (
        <Card
            style={[
                styles.card,
                { backgroundColor: theme.colors.elevation.level1, borderColor: theme.colors.outline, borderWidth: 1 },
                isActive && { borderColor: theme.colors.primary, borderWidth: 2 }
            ]}
            onPress={onPress}
            mode="contained"
        >
            <Card.Content style={styles.content}>
                <View style={[
                    styles.iconBox,
                    { backgroundColor: theme.colors.primaryContainer }
                ]}>
                    <FontAwesome6
                        name={exercise.mode === 'Strength' ? 'dumbbell' : 'fire'}
                        size={18}
                        color={theme.colors.primary}
                        iconStyle="solid"
                    />
                </View>

                <View style={styles.info}>
                    <Text variant="titleMedium" style={[styles.bold, { color: theme.colors.onSurface }]}>{exercise.name}</Text>
                    <View style={styles.tagRow}>
                        <FontAwesome6 name="bullseye" size={12} color={theme.colors.onSurfaceVariant} iconStyle="solid" />
                        <Text variant="bodySmall" style={[styles.tagText, { color: theme.colors.onSurfaceVariant }]}>{exercise.targetArea}</Text>
                        <View style={[
                            styles.modeBadge,
                            { backgroundColor: theme.colors.secondaryContainer }
                        ]}>
                            <Text style={[styles.modeText, { color: theme.colors.secondary }]}>
                                {exercise.mode.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
        borderRadius: 12,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        flex: 1,
        marginLeft: 12,
    },
    bold: {
        fontWeight: '700',
    },
    tagRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 6,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '500',
    },
    modeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 1.5,
        borderRadius: 6,
    },
    modeText: {
        fontSize: 9,
        fontWeight: '800',
    },
});
