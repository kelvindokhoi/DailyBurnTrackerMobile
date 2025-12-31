import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, ProgressBar, useTheme, Dialog, Portal, TextInput } from 'react-native-paper';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { DynamicBackground } from '../components/DynamicBackground';
import { EntranceAnimation } from '../components/EntranceAnimation';

interface Measurement {
    date: Date;
    weight: number;
    waist: number;
    thigh: number;
}

interface ProgressScreenProps {
    isFocused?: boolean;
    measurements: Measurement[];
    onSaveMeasurement: (m: Measurement) => void;
    targetWeight: number;
}

export const ProgressScreen = ({ isFocused = true, measurements, onSaveMeasurement, targetWeight }: ProgressScreenProps) => {
    const [visible, setVisible] = useState(false);
    const [newMeasurement, setNewMeasurement] = useState({
        weight: '',
        waist: '',
        thigh: '',
    });

    const theme = useTheme();

    const currentWeight = measurements[measurements.length - 1]?.weight || 0;
    const startWeight = measurements[0]?.weight || 0;
    const weightLost = startWeight - currentWeight;
    const progressPercent = startWeight === targetWeight ? 1 : ((startWeight - currentWeight) / (startWeight - targetWeight));

    const handleSaveMeasurement = () => {
        if (!newMeasurement.weight || !newMeasurement.waist || !newMeasurement.thigh) {
            return;
        }

        const measurement: Measurement = {
            date: new Date(),
            weight: parseFloat(newMeasurement.weight),
            waist: parseFloat(newMeasurement.waist),
            thigh: parseFloat(newMeasurement.thigh),
        };

        onSaveMeasurement(measurement);
        setNewMeasurement({ weight: '', waist: '', thigh: '' });
        setVisible(false);
    };

    const ChangeIndicator = ({ current, previous, inverse = false }: { current: number, previous: number, inverse?: boolean }) => {
        const change = current - previous;
        const isSuccess = inverse ? change < 0 : change > 0;

        if (change === 0) return null;

        return (
            <View style={[styles.indicator, { backgroundColor: isSuccess ? 'rgba(0, 188, 212, 0.15)' : 'rgba(244, 67, 54, 0.15)' }]}>
                <FontAwesome6
                    name={change < 0 ? "caret-down" : "caret-up"}
                    size={10}
                    color={isSuccess ? theme.colors.secondary : theme.colors.error}
                    iconStyle="solid"
                />
                <Text style={{
                    fontSize: 11,
                    color: isSuccess ? theme.colors.secondary : theme.colors.error,
                    fontWeight: '700',
                    marginLeft: 2
                }}>
                    {Math.abs(change).toFixed(1)}
                </Text>
            </View>
        );
    };

    return (
        <DynamicBackground>
            <ScrollView contentContainerStyle={styles.container} style={styles.scroll}>
                <EntranceAnimation type="slide-up" trigger={isFocused}>
                    <View style={styles.header}>
                        <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onBackground }]}>Progress</Text>
                        <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>Your transformation journey</Text>
                    </View>
                </EntranceAnimation>

                {/* Weight Progress Card */}
                <EntranceAnimation type="scale" delay={150} trigger={isFocused}>
                    <Card style={[styles.mainCard, { backgroundColor: 'rgba(30, 30, 30, 0.7)', borderColor: theme.colors.outline, borderWidth: 1 }]} mode="contained">
                        <Card.Content>
                            <View style={styles.weightHeader}>
                                <View>
                                    <Text style={[styles.sectionLabel, { color: theme.colors.primary }]}>CURRENT WEIGHT</Text>
                                    <Text style={[styles.weightValue, { color: theme.colors.onSurface }]}>
                                        {currentWeight} <Text style={{ fontSize: 18, color: theme.colors.onSurfaceVariant }}>kg</Text>
                                    </Text>
                                </View>
                                <View style={[styles.lostBadge, { backgroundColor: 'rgba(33, 150, 243, 0.15)' }]}>
                                    <Text style={[styles.lostLabel, { color: theme.colors.primary }]}>LOST</Text>
                                    <Text style={[styles.lostValue, { color: theme.colors.primary }]}>-{weightLost.toFixed(1)}kg</Text>
                                </View>
                            </View>

                            <View style={styles.progressBox}>
                                <View style={styles.goalRow}>
                                    <Text style={[styles.goalText, { color: theme.colors.onSurfaceVariant }]}>START: {startWeight}kg</Text>
                                    <Text style={[styles.goalText, { color: theme.colors.onSurfaceVariant }]}>GOAL: {targetWeight}kg</Text>
                                </View>
                                <ProgressBar
                                    progress={Math.min(Math.max(progressPercent, 0), 1)}
                                    color={theme.colors.primary}
                                    style={[styles.progressBar, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
                                />
                                <Text style={[styles.percentText, { color: theme.colors.onSurfaceVariant }]}>
                                    {isNaN(progressPercent) ? 0 : (progressPercent * 100).toFixed(0)}% TO GOAL
                                </Text>
                            </View>
                        </Card.Content>
                    </Card>
                </EntranceAnimation>

                {/* Measurements Grid */}
                <View style={styles.grid}>
                    <EntranceAnimation type="scale" delay={300} style={{ flex: 1 }} trigger={isFocused}>
                        <Card style={[styles.gridItem, { backgroundColor: 'rgba(30,30,30,0.7)', borderColor: theme.colors.outline, borderWidth: 1 }]} mode="contained">
                            <Card.Content>
                                <View style={styles.gridHeader}>
                                    <View style={[styles.gridIcon, { backgroundColor: 'rgba(255, 193, 7, 0.1)' }]}>
                                        <FontAwesome6 name="tape" size={12} color="#ffc107" iconStyle="solid" />
                                    </View>
                                    <Text variant="labelMedium" style={[styles.bold, { color: theme.colors.onSurfaceVariant }]}>WAIST</Text>
                                </View>
                                <View style={styles.gridValueRow}>
                                    <Text variant="headlineSmall" style={[styles.bold, { color: theme.colors.onSurface }]}>
                                        {measurements[measurements.length - 1]?.waist || 0}
                                        <Text variant="bodySmall"> cm</Text>
                                    </Text>
                                    {measurements.length > 1 && (
                                        <ChangeIndicator
                                            current={measurements[measurements.length - 1].waist}
                                            previous={measurements[measurements.length - 2].waist}
                                            inverse
                                        />
                                    )}
                                </View>
                            </Card.Content>
                        </Card>
                    </EntranceAnimation>

                    <EntranceAnimation type="scale" delay={450} style={{ flex: 1 }} trigger={isFocused}>
                        <Card style={[styles.gridItem, { backgroundColor: 'rgba(30,30,30,0.7)', borderColor: theme.colors.outline, borderWidth: 1 }]} mode="contained">
                            <Card.Content>
                                <View style={styles.gridHeader}>
                                    <View style={[styles.gridIcon, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
                                        <FontAwesome6 name="tape" size={12} color={theme.colors.primary} iconStyle="solid" />
                                    </View>
                                    <Text variant="labelMedium" style={[styles.bold, { color: theme.colors.onSurfaceVariant }]}>THIGH</Text>
                                </View>
                                <View style={styles.gridValueRow}>
                                    <Text variant="headlineSmall" style={[styles.bold, { color: theme.colors.onSurface }]}>
                                        {measurements[measurements.length - 1]?.thigh || 0}
                                        <Text variant="bodySmall"> cm</Text>
                                    </Text>
                                    {measurements.length > 1 && (
                                        <ChangeIndicator
                                            current={measurements[measurements.length - 1].thigh}
                                            previous={measurements[measurements.length - 2].thigh}
                                            inverse
                                        />
                                    )}
                                </View>
                            </Card.Content>
                        </Card>
                    </EntranceAnimation>
                </View>

                <EntranceAnimation type="slide-up" delay={600} trigger={isFocused}>
                    <Button
                        mode="outlined"
                        onPress={() => setVisible(true)}
                        style={[styles.logButton, { borderColor: theme.colors.primary, backgroundColor: 'rgba(33, 150, 243, 0.05)' }]}
                        icon={(props) => <FontAwesome6 {...props} name="plus" iconStyle="solid" />}
                        textColor={theme.colors.primary}
                    >
                        ADD MEASUREMENTS
                    </Button>
                </EntranceAnimation>

                {/* History Section */}
                <View style={styles.historySection}>
                    <EntranceAnimation delay={700} trigger={isFocused}>
                        <Text variant="titleMedium" style={[styles.bold, { color: theme.colors.onSurface }]}>LOG HISTORY</Text>
                    </EntranceAnimation>
                    <View style={styles.historyList}>
                        {measurements.length === 0 ? (
                            <Text style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 20 }}>No measurements logged yet</Text>
                        ) : (
                            measurements.slice().reverse().map((m, i) => (
                                <EntranceAnimation key={i} type="slide-up" delay={800 + (i * 100)} trigger={isFocused}>
                                    <View style={[styles.historyItem, { backgroundColor: 'rgba(30,30,30,0.7)', borderColor: theme.colors.outline }]}>
                                        <View>
                                            <Text style={[styles.iDate, { color: theme.colors.onSurface }]}>
                                                {m.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </Text>
                                        </View>
                                        <View style={styles.historyStats}>
                                            <View style={styles.iStat}>
                                                <Text style={[styles.iStatVal, { color: theme.colors.onSurface }]}>{m.weight}</Text>
                                                <Text style={styles.iStatUnit}>kg</Text>
                                            </View>
                                            <View style={styles.iStat}>
                                                <Text style={[styles.iStatVal, { color: theme.colors.onSurface }]}>{m.waist}</Text>
                                                <Text style={styles.iStatUnit}>cm</Text>
                                            </View>
                                        </View>
                                    </View>
                                </EntranceAnimation>
                            ))
                        )}
                    </View>
                </View>
            </ScrollView>

            <Portal>
                <Dialog visible={visible} onDismiss={() => setVisible(false)} style={{ borderRadius: 24, backgroundColor: theme.colors.surface }}>
                    <Dialog.Title style={[styles.bold, { color: theme.colors.onSurface }]}>Log Measurements</Dialog.Title>
                    <Dialog.Content style={{ gap: 16 }}>
                        <TextInput
                            label="Weight (kg)"
                            mode="outlined"
                            value={newMeasurement.weight}
                            onChangeText={t => setNewMeasurement(p => ({ ...p, weight: t }))}
                            keyboardType="numeric"
                        />
                        <TextInput
                            label="Waist (cm)"
                            mode="outlined"
                            value={newMeasurement.waist}
                            onChangeText={t => setNewMeasurement(p => ({ ...p, waist: t }))}
                            keyboardType="numeric"
                        />
                        <TextInput
                            label="Thigh (cm)"
                            mode="outlined"
                            value={newMeasurement.thigh}
                            onChangeText={t => setNewMeasurement(p => ({ ...p, thigh: t }))}
                            keyboardType="numeric"
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setVisible(false)}>Cancel</Button>
                        <Button mode="contained" onPress={handleSaveMeasurement} style={{ borderRadius: 12 }}>Save Result</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </DynamicBackground>
    );
};

const styles = StyleSheet.create({
    scroll: { flex: 1 },
    container: { padding: 20, gap: 24 },
    header: { alignItems: 'flex-start' },
    title: { fontWeight: '700' },
    subtitle: { fontWeight: '500' },
    mainCard: { borderRadius: 16, paddingVertical: 8 },
    weightHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
    weightValue: { fontSize: 40, fontWeight: '700' },
    lostBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, alignItems: 'center' },
    lostLabel: { fontSize: 10, fontWeight: '700' },
    lostValue: { fontSize: 18, fontWeight: '700' },
    progressBox: { marginTop: 0 },
    goalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    goalText: { fontSize: 11, fontWeight: '600' },
    progressBar: { height: 8, borderRadius: 4 },
    percentText: { textAlign: 'center', marginTop: 8, fontSize: 11, fontWeight: '700' },
    grid: { flexDirection: 'row', gap: 16 },
    gridItem: { flex: 1, borderRadius: 16 },
    gridHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
    gridIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    gridValueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    indicator: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    logButton: { marginTop: 8, borderRadius: 12, borderWidth: 1.5 },
    historySection: { marginTop: 8 },
    historyList: { marginTop: 12, gap: 10 },
    historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1 },
    iDate: { fontWeight: '600', fontSize: 14 },
    historyStats: { flexDirection: 'row', gap: 16 },
    iStat: { flexDirection: 'row', alignItems: 'baseline' },
    iStatVal: { fontWeight: '700', fontSize: 15 },
    iStatUnit: { fontSize: 10, color: '#a1a1a1', marginLeft: 2, fontWeight: '600' },
    bold: { fontWeight: '700' },
});
