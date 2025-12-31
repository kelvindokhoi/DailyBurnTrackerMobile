import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

// DynamicBackground is now memoized to prevent unnecessary re-renders during tab switching
export const DynamicBackground = React.memo(({ children }: { children: React.ReactNode }) => {
    const theme = useTheme();
    const moveAnim1 = useRef(new Animated.Value(0)).current;
    const moveAnim2 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const createAnim = (anim: Animated.Value, duration: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.timing(anim, {
                        toValue: 1,
                        duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        const anim1 = createAnim(moveAnim1, 20000);
        const anim2 = createAnim(moveAnim2, 25000);

        anim1.start();
        anim2.start();

        return () => {
            anim1.stop();
            anim2.stop();
        };
    }, [moveAnim1, moveAnim2]);

    const translateX1 = moveAnim1.interpolate({
        inputRange: [0, 1],
        outputRange: [-30, 30], // Reduced range for lighter computation
    });

    const translateY1 = moveAnim1.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 50],
    });

    const translateX2 = moveAnim2.interpolate({
        inputRange: [0, 1],
        outputRange: [30, -50],
    });

    const translateY2 = moveAnim2.interpolate({
        inputRange: [0, 1],
        outputRange: [50, -20],
    });

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Background Blobs - Purely visual, simplified for performance */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <Animated.View
                    style={[
                        styles.blob,
                        {
                            width: width * 0.7,
                            height: width * 0.7,
                            borderRadius: width * 0.35,
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            top: -50,
                            left: -50,
                            transform: [{ translateX: translateX1 }, { translateY: translateY1 }],
                        }
                    ]}
                />
                <Animated.View
                    style={[
                        styles.blob,
                        {
                            width: width * 0.8,
                            height: width * 0.8,
                            borderRadius: width * 0.4,
                            backgroundColor: 'rgba(0, 188, 212, 0.05)',
                            bottom: -100,
                            right: -50,
                            transform: [{ translateX: translateX2 }, { translateY: translateY2 }],
                        }
                    ]}
                />
            </View>

            {/* Content Layer */}
            <View style={StyleSheet.absoluteFill}>
                {children}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
    },
    blob: {
        position: 'absolute',
    },
});
