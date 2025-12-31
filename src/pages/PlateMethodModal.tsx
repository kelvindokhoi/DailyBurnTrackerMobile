import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text, Switch, useTheme } from 'react-native-paper';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { EntranceAnimation } from '../components/EntranceAnimation';

export interface PlateCheck {
    halfVeggies: boolean;
    drankWater: boolean;
    noSeconds: boolean;
}

interface PlateMethodModalProps {
    visible: boolean;
    onDismiss: () => void;
    onSave: (checks: PlateCheck) => void;
}

export const PlateMethodModal = ({
    visible,
    onDismiss,
    onSave,
}: PlateMethodModalProps) => {
    const [checks, setChecks] = useState<PlateCheck>({
        halfVeggies: false,
        drankWater: false,
        noSeconds: false,
    });
    const theme = useTheme();

    const handleSave = () => {
        onSave(checks);
        setChecks({ halfVeggies: false, drankWater: false, noSeconds: false });
        onDismiss();
    };

    const allChecked = checks.halfVeggies && checks.drankWater && checks.noSeconds;

    const Item = ({ label, icon, value, onValueChange, delay }: { label: string, icon: string, value: boolean, onValueChange: (v: boolean) => void, delay: number }) => (
        <EntranceAnimation type="slide-up" delay={delay}>
            <View style={[
                styles.item,
                { backgroundColor: value ? 'rgba(33, 150, 243, 0.15)' : 'rgba(40, 40, 40, 0.5)', borderColor: value ? theme.colors.primary : theme.colors.outline }
            ]}>
                <View style={styles.itemLeft}>
                    <View style={[styles.itemIcon, { backgroundColor: value ? 'rgba(33, 150, 243, 0.2)' : theme.colors.background }]}>
                        <FontAwesome6 name={icon} size={14} color={value ? theme.colors.primary : theme.colors.onSurfaceVariant} iconStyle="solid" />
                    </View>
                    <Text variant="bodyMedium" style={[styles.itemLabel, { fontWeight: value ? '700' : '500', color: value ? theme.colors.primary : theme.colors.onSurface }]}>
                        {label}
                    </Text>
                </View>
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    color={theme.colors.primary}
                />
            </View>
        </EntranceAnimation>
    );

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss} style={[styles.dialog, { backgroundColor: theme.colors.surface }]}>
                <Dialog.Title style={[styles.title, { color: theme.colors.onSurface }]}>Track Your Habit</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                        Did you follow the Plate Method rules?
                    </Text>

                    <View style={styles.itemsContainer}>
                        <Item
                            label="Half plate is greens/veggies"
                            icon="leaf"
                            value={checks.halfVeggies}
                            onValueChange={(v) => setChecks(p => ({ ...p, halfVeggies: v }))}
                            delay={100}
                        />
                        <Item
                            label="Water drank before meal"
                            icon="faucet-drip"
                            value={checks.drankWater}
                            onValueChange={(v) => setChecks(p => ({ ...p, drankWater: v }))}
                            delay={250}
                        />
                        <Item
                            label="No second helpings"
                            icon="ban"
                            value={checks.noSeconds}
                            onValueChange={(v) => setChecks(p => ({ ...p, noSeconds: v }))}
                            delay={400}
                        />
                    </View>
                </Dialog.Content>
                <Dialog.Actions style={styles.actions}>
                    <Button onPress={onDismiss} textColor={theme.colors.onSurfaceVariant} labelStyle={{ fontWeight: '700' }}>CANCEL</Button>
                    <Button
                        mode="contained"
                        onPress={handleSave}
                        style={[styles.saveButton, allChecked && { backgroundColor: theme.colors.primary }]}
                        labelStyle={{ fontWeight: '700' }}
                    >
                        {allChecked ? 'LOG PERFECT MEAL' : 'SAVE LOG'}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    dialog: {
        borderRadius: 24,
    },
    title: {
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 16,
    },
    subtitle: {
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: '500',
    },
    itemsContainer: {
        gap: 10,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    itemIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemLabel: {
        flexShrink: 1,
    },
    actions: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        justifyContent: 'space-between',
    },
    saveButton: {
        borderRadius: 12,
        paddingHorizontal: 8,
    },
});
