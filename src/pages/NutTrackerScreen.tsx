import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, useTheme, Button, Portal, Dialog, TextInput, SegmentedButtons, Divider } from 'react-native-paper';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { DynamicBackground } from '../components/DynamicBackground';
import { EntranceAnimation } from '../components/EntranceAnimation';

export interface NutLog {
    id: string;
    date: Date;
    duration: number; // in minutes
}

interface NutTrackerScreenProps {
    isFocused: boolean;
    logs: NutLog[];
    onSaveLog: (date: Date, duration: number) => void;
    onDeleteLog: (id: string) => void;
    age: number;
}

export const NutTrackerScreen = ({ isFocused, logs, onSaveLog, onDeleteLog, age }: NutTrackerScreenProps) => {
    const theme = useTheme();
    const [viewMode, setViewMode] = useState('week'); // 'week' | 'month' | 'year'
    const [metricMode, setMetricMode] = useState('count'); // 'count' | 'minutes'
    const [isDialogVisible, setIsDialogVisible] = useState(false);

    // Log state
    const [logDateOffset, setLogDateOffset] = useState(0); // 0=today, 1=yesterday, etc.
    const [logDuration, setLogDuration] = useState('15');
    const [hasError, setHasError] = useState(false);

    const handleSave = () => {
        const mins = parseInt(logDuration);
        if (isNaN(mins) || mins <= 0 || mins >= 1440) {
            setHasError(true);
            return;
        }
        setHasError(false);
        const date = new Date();
        date.setDate(date.getDate() - logDateOffset);
        onSaveLog(date, mins);
        setIsDialogVisible(false);
    };

    // --- Visualization Data Calculation ---
    const chartData = useMemo(() => {
        const getMetricValue = (filteredLogs: NutLog[]) => {
            if (metricMode === 'count') return filteredLogs.length;
            return filteredLogs.reduce((acc, curr) => acc + curr.duration, 0);
        };

        if (viewMode === 'week') {
            return Array.from({ length: 7 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                const filtered = logs.filter(l => l.date.toDateString() === d.toDateString());
                return { label: d.toLocaleDateString('en-US', { weekday: 'narrow' }), value: getMetricValue(filtered) };
            });
        } else if (viewMode === 'month') {
            return Array.from({ length: 4 }).map((_, i) => {
                const weekEnd = new Date();
                weekEnd.setDate(weekEnd.getDate() - (3 - i) * 7);
                weekEnd.setHours(23, 59, 59, 999);
                const weekStart = new Date(weekEnd);
                weekStart.setDate(weekStart.getDate() - 6);
                weekStart.setHours(0, 0, 0, 0);

                const filtered = logs.filter(l => l.date >= weekStart && l.date <= weekEnd);
                return { label: `W${i + 1}`, value: getMetricValue(filtered) };
            });
        } else {
            return Array.from({ length: 6 }).map((_, i) => {
                const d = new Date();
                d.setMonth(d.getMonth() - (5 - i));
                const filtered = logs.filter(l => l.date.getMonth() === d.getMonth() && l.date.getFullYear() === d.getFullYear());
                return { label: d.toLocaleDateString('en-US', { month: 'narrow' }), value: getMetricValue(filtered) };
            });
        }
    }, [logs, viewMode, metricMode]);

    const maxValue = Math.max(...chartData.map(d => d.value), 1);

    // --- Statistics ---
    const totalCount = logs.length;
    const totalTime = logs.reduce((acc, curr) => acc + curr.duration, 0);

    const avgMinDay = useMemo(() => {
        if (logs.length === 0) return 0;
        const uniqueDays = new Set(logs.map(l => l.date.toDateString()));
        return Math.round(totalTime / Math.max(uniqueDays.size, 1));
    }, [logs, totalTime]);

    const sessionStats = useMemo(() => {
        if (logs.length === 0) return { max: 0, min: 0 };
        const durations = logs.map(l => l.duration);
        return {
            max: Math.max(...durations),
            min: Math.min(...durations)
        };
    }, [logs]);

    const frequencyStats = useMemo(() => {
        if (logs.length === 0) return { max: 0 };
        // Group by day for freq record
        const groups: Record<string, number> = {};
        logs.forEach(l => {
            const key = l.date.toDateString();
            groups[key] = (groups[key] || 0) + 1;
        });
        return { max: Math.max(...Object.values(groups)) };
    }, [logs]);

    const recommendation = useMemo(() => {
        if (age < 20) return "Recommended: 3-5 times per week. Focus on hormonal balance.";
        if (age < 30) return "Recommended: 3-4 times per week. Optimal for high metabolism.";
        if (age < 40) return "Recommended: 2-3 times per week. Maintain prostate health.";
        return "Recommended: 1-2 times per week. Prioritize energy conservation.";
    }, [age]);

    const sortedLogs = [...logs].sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <DynamicBackground>
            <ScrollView contentContainerStyle={styles.container} style={styles.scroll}>
                <EntranceAnimation type="slide-up" trigger={isFocused}>
                    <View style={styles.header}>
                        <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onBackground }]}>Frequency</Text>
                        <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>Track and visualize habits</Text>
                    </View>
                </EntranceAnimation>

                <EntranceAnimation type="scale" delay={100} trigger={isFocused}>
                    <Button
                        mode="contained"
                        onPress={() => setIsDialogVisible(true)}
                        style={styles.logBtn}
                        buttonColor={theme.colors.secondary}
                        icon={(props) => <FontAwesome6 name="bolt" {...props} size={16} iconStyle="solid" />}
                    >
                        LOG NEW SESSION
                    </Button>
                </EntranceAnimation>

                {/* Primary Stats Grid */}
                <View style={styles.statsRow}>
                    <Card style={[styles.statCard, { backgroundColor: 'rgba(30,30,30,0.7)', borderColor: 'rgba(255,255,255,0.05)', borderWidth: 1 }]} mode="contained">
                        <Card.Content style={styles.center}>
                            <Text variant="headlineSmall" style={[styles.bold, { color: theme.colors.secondary }]}>{totalCount}</Text>
                            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Total Logs</Text>
                        </Card.Content>
                    </Card>
                    <Card style={[styles.statCard, { backgroundColor: 'rgba(30,30,30,0.7)', borderColor: 'rgba(255,255,255,0.05)', borderWidth: 1 }]} mode="contained">
                        <Card.Content style={styles.center}>
                            <Text variant="headlineSmall" style={[styles.bold, { color: theme.colors.primary }]}>{avgMinDay}</Text>
                            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Avg Min/Day</Text>
                        </Card.Content>
                    </Card>
                </View>

                {/* Visualization Card */}
                <EntranceAnimation type="slide-up" delay={150} trigger={isFocused}>
                    <Card style={[styles.vizCard, { backgroundColor: 'rgba(30,30,30,0.7)', borderColor: theme.colors.outline, borderWidth: 1 }]} mode="contained">
                        <Card.Content>
                            <View style={styles.vizHeader}>
                                <SegmentedButtons
                                    value={metricMode}
                                    onValueChange={setMetricMode}
                                    style={styles.metricSegmented}
                                    density="small"
                                    buttons={[
                                        { value: 'count', label: 'Sessions', icon: (props) => <FontAwesome6 name="list-ol" {...props} size={10} iconStyle="solid" /> },
                                        { value: 'minutes', label: 'Minutes', icon: (props) => <FontAwesome6 name="clock" {...props} size={10} iconStyle="solid" /> },
                                    ]}
                                />
                            </View>

                            <View style={styles.periodRow}>
                                <SegmentedButtons
                                    value={viewMode}
                                    onValueChange={setViewMode}
                                    style={styles.periodSegmented}
                                    density="small"
                                    buttons={[
                                        { value: 'week', label: 'WEEK', labelStyle: styles.segLabel },
                                        { value: 'month', label: 'MONTH', labelStyle: styles.segLabel },
                                        { value: 'year', label: 'YEAR', labelStyle: styles.segLabel },
                                    ]}
                                />
                            </View>

                            <View style={styles.chartContainer}>
                                {chartData.map((d, i) => (
                                    <View key={i} style={styles.barItem}>
                                        <Text variant="labelSmall" style={[styles.barValue, { color: theme.colors.secondary }]}>
                                            {d.value}{metricMode === 'minutes' ? 'm' : ''}
                                        </Text>
                                        <View style={styles.barWrapper}>
                                            <View
                                                style={[
                                                    styles.bar,
                                                    {
                                                        height: `${(d.value / maxValue) * 100}%`,
                                                        backgroundColor: theme.colors.secondary,
                                                        opacity: d.value === 0 ? 0.2 : 0.8 + (d.value / maxValue) * 0.2
                                                    }
                                                ]}
                                            />
                                        </View>
                                        <Text variant="labelSmall" style={styles.barLabel}>{d.label}</Text>
                                    </View>
                                ))}
                            </View>
                        </Card.Content>
                    </Card>
                </EntranceAnimation>

                {/* Insights Grid */}
                <EntranceAnimation type="slide-up" delay={300} trigger={isFocused}>
                    <Text variant="labelLarge" style={[styles.bold, { color: theme.colors.primary, letterSpacing: 1, marginBottom: 12 }]}>INSIGHTS & RECORDS</Text>
                    <View style={styles.insightsRow}>
                        <Card style={[styles.insightCard, { backgroundColor: 'rgba(255,193,7,0.05)', borderColor: 'rgba(255,193,7,0.1)', borderWidth: 1 }]} mode="contained">
                            <Card.Content style={styles.insightContent}>
                                <FontAwesome6 name="stopwatch" size={14} color="#ffc107" iconStyle="solid" />
                                <View style={styles.insightText}>
                                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>SESSION RANGE</Text>
                                    <Text variant="titleSmall" style={[styles.bold, { color: '#ffc107' }]}>{sessionStats.min} - {sessionStats.max} m</Text>
                                </View>
                            </Card.Content>
                        </Card>
                        <Card style={[styles.insightCard, { backgroundColor: 'rgba(0,188,212,0.05)', borderColor: 'rgba(0,188,212,0.1)', borderWidth: 1 }]} mode="contained">
                            <Card.Content style={styles.insightContent}>
                                <FontAwesome6 name="ranking-star" size={14} color="#00bcd4" iconStyle="solid" />
                                <View style={styles.insightText}>
                                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>DAILY PEAK</Text>
                                    <Text variant="titleSmall" style={[styles.bold, { color: '#00bcd4' }]}>{frequencyStats.max} logs / day</Text>
                                </View>
                            </Card.Content>
                        </Card>
                    </View>
                </EntranceAnimation>

                {/* History */}
                <View style={styles.historyContainer}>
                    <Text variant="labelLarge" style={[styles.bold, { color: theme.colors.primary, letterSpacing: 1, marginBottom: 12 }]}>RECENT ACTIVITY</Text>
                    {sortedLogs.length === 0 ? (
                        <View style={styles.empty}>
                            <Text style={{ color: theme.colors.onSurfaceVariant }}>No logs yet</Text>
                        </View>
                    ) : (
                        sortedLogs.slice(0, 10).map((log) => (
                            <View key={log.id} style={[styles.historyRow, { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: theme.colors.outline }]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                    <View style={[styles.logIndicator, { backgroundColor: theme.colors.secondary }]} />
                                    <View>
                                        <Text style={[styles.bold, { color: theme.colors.onSurface }]}>
                                            {log.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>{log.duration} minutes spent</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => onDeleteLog(log.id)}
                                    style={styles.deleteBtn}
                                >
                                    <FontAwesome6 name="trash-can" size={16} color={theme.colors.error} iconStyle="solid" />
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>

                {/* Analysis */}
                <Card style={[styles.recCard, { borderLeftColor: theme.colors.primary, borderLeftWidth: 4, backgroundColor: 'rgba(33, 150, 243, 0.05)' }]} mode="contained">
                    <Card.Content>
                        <View style={styles.recHeader}>
                            <FontAwesome6 name="circle-info" size={14} color={theme.colors.primary} iconStyle="solid" />
                            <Text variant="bodySmall" style={[styles.bold, { color: theme.colors.primary, marginLeft: 8 }]}>ANALYSIS & ADVICE</Text>
                        </View>
                        <Text style={{ color: theme.colors.onSurface, fontWeight: '600', marginTop: 8 }}>{recommendation}</Text>
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, fontStyle: 'italic', marginTop: 8 }}>
                            Daily Average: {avgMinDay}m. Your frequency is {totalCount > 15 ? 'above' : totalCount > 5 ? 'within' : 'below'} average ranges.
                        </Text>
                    </Card.Content>
                </Card>
            </ScrollView>

            <Portal>
                <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)} style={{ borderRadius: 24, backgroundColor: theme.colors.surface }}>
                    <Dialog.Title style={styles.bold}>Log Activity</Dialog.Title>
                    <Dialog.Content style={{ gap: 16 }}>
                        <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>When did this session occur?</Text>
                        <View style={styles.datePickerGrid}>
                            {[0, 1, 2, 3].map(offset => (
                                <TouchableOpacity
                                    key={offset}
                                    onPress={() => setLogDateOffset(offset)}
                                    style={[
                                        styles.dateBtn,
                                        {
                                            borderColor: logDateOffset === offset ? theme.colors.secondary : theme.colors.outline,
                                            backgroundColor: logDateOffset === offset ? 'rgba(0, 188, 212, 0.1)' : 'transparent'
                                        }
                                    ]}
                                >
                                    <Text style={{
                                        color: logDateOffset === offset ? theme.colors.secondary : theme.colors.onSurfaceVariant,
                                        fontWeight: logDateOffset === offset ? '700' : '500'
                                    }}>
                                        {offset === 0 ? 'Today' : offset === 1 ? 'Yest.' : `${offset}d ago`}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TextInput
                            label="Session Duration (min)"
                            value={logDuration}
                            onChangeText={(text) => {
                                setLogDuration(text);
                                setHasError(false);
                            }}
                            mode="outlined"
                            keyboardType="numeric"
                            error={hasError}
                            style={{ backgroundColor: 'transparent' }}
                        />
                        {hasError && (
                            <Text variant="labelSmall" style={{ color: theme.colors.error, marginTop: -12 }}>
                                Please enter 1 - 1439 minutes
                            </Text>
                        )}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setIsDialogVisible(false)}>CANCEL</Button>
                        <Button mode="contained" onPress={handleSave} buttonColor={theme.colors.secondary}>SAVE LOG</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </DynamicBackground>
    );
};

const styles = StyleSheet.create({
    scroll: { flex: 1 },
    container: { padding: 20, gap: 24, paddingBottom: 40 },
    header: { alignItems: 'flex-start' },
    title: { fontWeight: '700' },
    subtitle: { fontWeight: '500' },
    logBtn: { borderRadius: 12, paddingVertical: 4 },
    statsRow: { flexDirection: 'row', gap: 12 },
    statCard: { flex: 1, borderRadius: 16 },
    center: { alignItems: 'center' },
    bold: { fontWeight: '700' },
    vizCard: { borderRadius: 16 },
    vizHeader: { marginBottom: 12 },
    metricSegmented: { width: '100%' },
    periodRow: { marginBottom: 12 },
    periodSegmented: { width: '100%' },
    segLabel: { fontSize: 8.5, fontWeight: '700' },
    deleteBtn: { padding: 8 },
    chartContainer: { flexDirection: 'row', height: 140, alignItems: 'flex-end', justifyContent: 'space-between' },
    barItem: { alignItems: 'center', flex: 1 },
    barValue: { fontSize: 10, fontWeight: '800', marginBottom: 4 },
    barWrapper: { height: 90, width: 18, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 9, justifyContent: 'flex-end', overflow: 'hidden' },
    bar: { width: '100%', borderRadius: 9 },
    barLabel: { marginTop: 8, color: '#a1a1a1', fontSize: 9, fontWeight: '700' },
    insightsRow: { flexDirection: 'row', gap: 12 },
    insightCard: { flex: 1, borderRadius: 16 },
    insightContent: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
    insightText: { flex: 1 },
    historyContainer: { marginTop: 4 },
    historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1 },
    logIndicator: { width: 4, height: 32, borderRadius: 2 },
    empty: { padding: 20, alignItems: 'center' },
    recCard: { borderRadius: 12 },
    recHeader: { flexDirection: 'row', alignItems: 'center' },
    datePickerGrid: { flexDirection: 'row', gap: 6 },
    dateBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
});
