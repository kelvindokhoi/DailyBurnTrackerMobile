import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { PlateMethodModal, PlateCheck } from './PlateMethodModal';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { DynamicBackground } from '../components/DynamicBackground';
import { EntranceAnimation } from '../components/EntranceAnimation';

interface MealLog {
    id: string;
    timestamp: Date;
    checks: PlateCheck;
}

interface MealsScreenProps {
    isFocused?: boolean;
    mealLogs: MealLog[];
    onSaveMeal: (checks: PlateCheck) => void;
}

export const MealsScreen = ({ isFocused = true, mealLogs, onSaveMeal }: MealsScreenProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const theme = useTheme();

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const getScore = (checks: PlateCheck) => {
        return Object.values(checks).filter(Boolean).length;
    };

    return (
        <DynamicBackground>
            <ScrollView contentContainerStyle={styles.container} style={styles.scroll}>
                <EntranceAnimation type="slide-up" trigger={isFocused}>
                    <View style={styles.header}>
                        <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onBackground }]}>Journal</Text>
                        <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>Log your Plate Method meals</Text>
                    </View>
                </EntranceAnimation>

                {/* Log a Meal Card */}
                <EntranceAnimation type="scale" delay={150} trigger={isFocused}>
                    <Card
                        style={[styles.addMealCard, { backgroundColor: 'rgba(30,30,30,0.7)', borderColor: theme.colors.outline, borderWidth: 1 }]}
                        onPress={() => setIsModalVisible(true)}
                        mode="contained"
                    >
                        <Card.Content style={styles.addMealInner}>
                            <View style={[styles.cameraIcon, { backgroundColor: theme.colors.primaryContainer }]}>
                                <FontAwesome6 name="camera" size={24} color={theme.colors.primary} iconStyle="solid" />
                            </View>
                            <View>
                                <Text variant="titleMedium" style={[styles.bold, { color: theme.colors.onSurface }]}>Log Today's Meal</Text>
                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Snap a photo or check habits</Text>
                            </View>
                        </Card.Content>
                    </Card>
                </EntranceAnimation>

                <View style={styles.logsContainer}>
                    <EntranceAnimation delay={300} trigger={isFocused}>
                        <Text variant="labelLarge" style={[styles.bold, { color: theme.colors.primary, letterSpacing: 1 }]}>TODAY'S LOGS</Text>
                    </EntranceAnimation>

                    {mealLogs.length === 0 ? (
                        <EntranceAnimation type="fade" delay={450} trigger={isFocused}>
                            <View style={[styles.emptyContainer, { backgroundColor: 'rgba(30,30,30,0.5)', borderColor: theme.colors.outline }]}>
                                <FontAwesome6 name="utensils" size={40} color={theme.colors.outline} iconStyle="solid" />
                                <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>No meals logged yet today</Text>
                            </View>
                        </EntranceAnimation>
                    ) : (
                        mealLogs.map((meal, index) => {
                            const score = getScore(meal.checks);
                            const isPerfect = score === 3;
                            return (
                                <EntranceAnimation key={meal.id} type="slide-up" delay={450 + (index * 150)} trigger={isFocused}>
                                    <Card style={[styles.mealCard, { backgroundColor: 'rgba(30,30,30,0.7)', borderColor: theme.colors.outline, borderWidth: 1 }]} mode="contained">
                                        <View style={[styles.scoreBar, { backgroundColor: isPerfect ? theme.colors.secondary : score >= 1 ? '#ffa726' : theme.colors.error }]} />
                                        <Card.Content>
                                            <View style={styles.mealHeader}>
                                                <View>
                                                    <Text variant="titleSmall" style={[styles.bold, { color: theme.colors.onSurface }]}>Meal Choice</Text>
                                                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>{formatTime(meal.timestamp)}</Text>
                                                </View>
                                                <View style={[
                                                    styles.scoreBadge,
                                                    { backgroundColor: isPerfect ? 'rgba(0, 188, 212, 0.15)' : theme.colors.secondaryContainer }
                                                ]}>
                                                    <Text style={{
                                                        color: isPerfect ? theme.colors.secondary : theme.colors.onSecondaryContainer,
                                                        fontWeight: '700',
                                                        fontSize: 14
                                                    }}>
                                                        {score} / 3
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={styles.checksList}>
                                                {[
                                                    { key: 'halfVeggies', label: 'Half plant-based', icon: 'leaf' },
                                                    { key: 'drankWater', label: 'Pre-meal hydration', icon: 'faucet-drip' },
                                                    { key: 'noSeconds', label: 'Single helping', icon: 'ban' }
                                                ].map(item => (
                                                    <View key={item.key} style={styles.checkItem}>
                                                        <FontAwesome6
                                                            name={meal.checks[item.key as keyof PlateCheck] ? 'circle-check' : 'circle'}
                                                            size={14}
                                                            color={meal.checks[item.key as keyof PlateCheck] ? theme.colors.secondary : theme.colors.outline}
                                                            iconStyle="solid"
                                                        />
                                                        <Text style={{
                                                            color: meal.checks[item.key as keyof PlateCheck] ? theme.colors.onSurface : theme.colors.onSurfaceVariant,
                                                            fontSize: 13,
                                                            marginLeft: 10,
                                                            fontWeight: meal.checks[item.key as keyof PlateCheck] ? '600' : '400'
                                                        }}>
                                                            {item.label}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </Card.Content>
                                    </Card>
                                </EntranceAnimation>
                            );
                        })
                    )}
                </View>
            </ScrollView>

            <PlateMethodModal
                visible={isModalVisible}
                onDismiss={() => setIsModalVisible(false)}
                onSave={onSaveMeal}
            />
        </DynamicBackground>
    );
};

const styles = StyleSheet.create({
    scroll: { flex: 1 },
    container: { padding: 20, gap: 24 },
    header: { alignItems: 'flex-start' },
    title: { fontWeight: '700' },
    subtitle: { marginTop: 2, fontWeight: '500' },
    addMealCard: { borderRadius: 16 },
    addMealInner: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 8 },
    cameraIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
    logsContainer: { gap: 16 },
    bold: { fontWeight: '700' },
    emptyContainer: { alignItems: 'center', paddingVertical: 40, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed' },
    mealCard: { borderRadius: 16, overflow: 'hidden' },
    scoreBar: { height: 4, width: '100%' },
    mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    scoreBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    checksList: { gap: 6 },
    checkItem: { flexDirection: 'row', alignItems: 'center' },
});
