import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface EntranceAnimationProps {
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    delay?: number;
    duration?: number;
    type?: 'fade' | 'slide-up' | 'scale';
    trigger?: boolean;
}

export const EntranceAnimation = React.memo(({
    children,
    style,
    delay = 0,
    duration = 300, // Reduced duration for snappier feel
    type = 'fade',
    trigger = true
}: EntranceAnimationProps) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(type === 'slide-up' ? 10 : 0)).current; // Smaller offset
    const scale = useRef(new Animated.Value(type === 'scale' ? 0.98 : 1)).current; // Smaller scale offset

    useEffect(() => {
        if (!trigger) {
            // Immediate reset without animation when hidden to save resources
            fadeAnim.setValue(0);
            if (type === 'slide-up') translateY.setValue(10);
            if (type === 'scale') scale.setValue(0.98);
            return;
        }

        const animations = [
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: duration,
                useNativeDriver: true,
            })
        ];

        if (type === 'slide-up') {
            animations.push(
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: duration,
                    useNativeDriver: true,
                })
            );
        }

        if (type === 'scale') {
            animations.push(
                Animated.timing(scale, {
                    toValue: 1,
                    duration: duration,
                    useNativeDriver: true,
                })
            );
        }

        const animationSequence = Animated.sequence([
            Animated.delay(delay),
            Animated.parallel(animations)
        ]);

        animationSequence.start();

        return () => {
            animationSequence.stop();
        };
    }, [delay, duration, fadeAnim, scale, translateY, type, trigger]);

    const animatedStyle = {
        opacity: fadeAnim,
        transform: [] as any[],
    };

    if (type === 'slide-up') {
        animatedStyle.transform.push({ translateY });
    } else if (type === 'scale') {
        animatedStyle.transform.push({ scale });
    }

    return (
        <Animated.View style={[style, animatedStyle]}>
            {children}
        </Animated.View>
    );
});
