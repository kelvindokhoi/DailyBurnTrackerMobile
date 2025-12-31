import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, Divider, useTheme, Portal, Dialog } from 'react-native-paper';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { DynamicBackground } from '../components/DynamicBackground';
import { EntranceAnimation } from '../components/EntranceAnimation';

interface SettingsScreenProps {
    isFocused: boolean;
    userProfile: {
        weight: string;
        goalWeight: string;
        name: string;
        age: string;
    };
    onUpdateProfile: (profile: any) => void;
    onResetData: (type: 'all' | 'meals' | 'progress' | 'workouts' | 'nut') => void;
}

export const SettingsScreen = ({ isFocused, userProfile, onUpdateProfile, onResetData }: SettingsScreenProps) => {
    const theme = useTheme();
    const [name, setName] = useState(userProfile.name);
    const [weight, setWeight] = useState(userProfile.weight);
    const [goalWeight, setGoalWeight] = useState(userProfile.goalWeight);
    const [age, setAge] = useState(userProfile.age || '25');
    const [showConfirm, setShowConfirm] = useState<any>(null);

    const handleSave = () => {
        onUpdateProfile({ name, weight, goalWeight, age });
    };

    const confirmReset = (type: any) => {
        setShowConfirm(type);
    };

    const handleConfirm = () => {
        onResetData(showConfirm);
        setShowConfirm(null);
    };

    return (
        <DynamicBackground>
            <ScrollView contentContainerStyle={styles.container} style={styles.scroll}>
                <EntranceAnimation type="slide-up" trigger={isFocused}>
                    <View style={styles.header}>
                        <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onBackground }]}>Settings</Text>
                        <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>Profile & Data Management</Text>
                    </View>
                </EntranceAnimation>

                {/* Profile Section */}
                <EntranceAnimation type="scale" delay={150} trigger={isFocused}>
                    <Card style={[styles.card, { backgroundColor: 'rgba(30,30,30,0.7)', borderColor: theme.colors.outline, borderWidth: 1 }]} mode="contained">
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.sectionHeader}>
                                <FontAwesome6 name="user-gear" size={18} color={theme.colors.primary} iconStyle="solid" />
                                <Text variant="titleMedium" style={[styles.bold, { color: theme.colors.onSurface, marginLeft: 10 }]}>User Profile</Text>
                            </View>

                            <View style={styles.inputGap}>
                                <View style={styles.row}>
                                    <TextInput
                                        label="Full Name"
                                        value={name}
                                        onChangeText={setName}
                                        mode="outlined"
                                        style={[styles.input, { flex: 2 }]}
                                    />
                                    <View style={{ width: 12 }} />
                                    <TextInput
                                        label="Age"
                                        value={age}
                                        onChangeText={setAge}
                                        mode="outlined"
                                        keyboardType="numeric"
                                        style={[styles.input, { flex: 1 }]}
                                    />
                                </View>
                                <View style={styles.row}>
                                    <TextInput
                                        label="Current Weight (kg)"
                                        value={weight}
                                        onChangeText={setWeight}
                                        mode="outlined"
                                        keyboardType="numeric"
                                        style={[styles.input, { flex: 1 }]}
                                    />
                                    <View style={{ width: 12 }} />
                                    <TextInput
                                        label="Goal Weight (kg)"
                                        value={goalWeight}
                                        onChangeText={setGoalWeight}
                                        mode="outlined"
                                        keyboardType="numeric"
                                        style={[styles.input, { flex: 1 }]}
                                    />
                                </View>
                                <Button
                                    mode="contained"
                                    onPress={handleSave}
                                    style={styles.saveButton}
                                    buttonColor={theme.colors.primary}
                                >
                                    SAVE PROFILE
                                </Button>
                            </View>
                        </Card.Content>
                    </Card>
                </EntranceAnimation>

                {/* Data Management */}
                <EntranceAnimation type="slide-up" delay={300} trigger={isFocused}>
                    <Card style={[styles.card, { backgroundColor: 'rgba(30, 30, 30, 0.7)', borderColor: theme.colors.outline, borderWidth: 1 }]} mode="contained">
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.sectionHeader}>
                                <FontAwesome6 name="database" size={18} color={theme.colors.error} iconStyle="solid" />
                                <Text variant="titleMedium" style={[styles.bold, { color: theme.colors.onSurface, marginLeft: 10 }]}>Data Management</Text>
                            </View>

                            <View style={styles.dangerZone}>
                                <Button
                                    mode="outlined"
                                    onPress={() => confirmReset('meals')}
                                    textColor={theme.colors.onSurface}
                                    style={styles.actionButton}
                                    icon={(props) => <FontAwesome6 name="utensils" {...props} size={12} />}
                                >
                                    Clear Meals
                                </Button>
                                <Button
                                    mode="outlined"
                                    onPress={() => confirmReset('progress')}
                                    textColor={theme.colors.onSurface}
                                    style={styles.actionButton}
                                    icon={(props) => <FontAwesome6 name="chart-line" {...props} size={12} />}
                                >
                                    Clear Progress
                                </Button>
                                <Button
                                    mode="outlined"
                                    onPress={() => confirmReset('nut')}
                                    textColor={theme.colors.onSurface}
                                    style={styles.actionButton}
                                    icon={(props) => <FontAwesome6 name="bolt" {...props} size={12} />}
                                >
                                    Clear Frequency Logs
                                </Button>

                                <Divider style={styles.divider} />

                                <Button
                                    mode="contained"
                                    onPress={() => confirmReset('all')}
                                    buttonColor={theme.colors.error}
                                    style={styles.saveButton}
                                    icon={(props) => <FontAwesome6 name="trash-can" {...props} size={14} />}
                                >
                                    WIPE ALL DATA
                                </Button>
                            </View>
                        </Card.Content>
                    </Card>
                </EntranceAnimation>

                <View style={styles.footer}>
                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Daily Burn Mobile v1.0.3</Text>
                </View>
            </ScrollView>

            <Portal>
                <Dialog visible={!!showConfirm} onDismiss={() => setShowConfirm(null)} style={{ borderRadius: 24, backgroundColor: theme.colors.surface }}>
                    <Dialog.Title style={[styles.bold, { color: theme.colors.onSurface }]}>Are you sure?</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                            This action cannot be undone. All selected records will be permanently deleted.
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowConfirm(null)}>Cancel</Button>
                        <Button mode="contained" onPress={handleConfirm} buttonColor={theme.colors.error}>Delete Forever</Button>
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
    card: { borderRadius: 16 },
    cardContent: { paddingVertical: 8 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    bold: { fontWeight: '700' },
    inputGap: { gap: 12 },
    input: { backgroundColor: 'transparent' },
    row: { flexDirection: 'row' },
    saveButton: { borderRadius: 12, marginTop: 8, paddingVertical: 4 },
    dangerZone: { gap: 10, marginTop: 4 },
    actionButton: { borderRadius: 12, borderColor: 'rgba(255,255,255,0.1)' },
    divider: { marginVertical: 10, backgroundColor: 'rgba(255,255,255,0.05)' },
    footer: { alignItems: 'center', marginTop: 20, paddingBottom: 20 },
});
