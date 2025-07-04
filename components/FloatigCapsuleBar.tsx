import { Colors } from '@/constants/Colors';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View,
    ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { icons } from './icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTAINER_PADDING = 8;

// tabs and routes
const TABS = ['index', 'camera', 'conversation', 'favorites'] as const;
const TAB_WIDTH = (SCREEN_WIDTH - CONTAINER_PADDING * 2) / TABS.length;

const tabMeta: Record<(typeof TABS)[number], { label: string; icon: keyof typeof icons }> = {
    index: { label: 'Translate', icon: 'translate' },
    camera: { label: 'Camera', icon: 'camera' },
    conversation: { label: 'Conversation', icon: 'conversation' },
    favorites: { label: 'Favorites', icon: 'favorites' },
};

export default function FloatingCapsuleTabBar({
    state,
    navigation,
}: BottomTabBarProps) {
    const capsuleScaleX = useSharedValue(1);
    const capsuleScaleY = useSharedValue(1);
    const isDragging = useSharedValue(false);
    const translateX = useSharedValue(state.index * TAB_WIDTH);
    const startX = useSharedValue(state.index * TAB_WIDTH);
    const colorScheme = Colors[useColorScheme() || "light"];

    const capsuleStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }, { scaleX: capsuleScaleX.value }, { scaleY: capsuleScaleY.value }],
    }));

    // pan gesture detector
    const panGesture = Gesture.Pan()
        .onBegin(() => {
            isDragging.value = true;
            capsuleScaleX.value = withTiming(1.21, { duration: 150 });
            capsuleScaleY.value = withTiming(1.35, { duration: 150 });
        })
        .onStart(() => {
            startX.value = translateX.value;
        })
        .onUpdate((event) => {
            const newX = startX.value + event.translationX;
            const minX = 0;
            const maxX = (TABS.length - 1) * TAB_WIDTH;
            translateX.value = Math.min(Math.max(newX, minX), maxX);
        })
        .onEnd(() => {
            const index = Math.round(translateX.value / TAB_WIDTH);
            const clampedIndex = Math.max(0, Math.min(TABS.length - 1, index));
            translateX.value = withTiming((clampedIndex * TAB_WIDTH) / 1.1);
            runOnJS(navigation.navigate)(TABS[clampedIndex] as never);
            isDragging.value = false;

            capsuleScaleX.value = withTiming(1, { duration: 150 });
            capsuleScaleY.value = withTiming(1, { duration: 150 });
        });

    return (
        <View style={[styles.container, {backgroundColor: colorScheme.nav}, {borderColor: colorScheme.nav_border}]}>
            {/* use panGesture with GestureDetector to detect pans */}
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.capsule, capsuleStyle, {backgroundColor: colorScheme.nav_capsule}]} />
            </GestureDetector>
            {TABS.map((tab, index) => {
                const isFocused = state.index === index;
                const tintColor = isFocused ? colorScheme.nav_icons_tinted : colorScheme.nav_icons;

                const { icon, label } = tabMeta[tab];

                return (
                    <TouchableOpacity
                        key={tab}
                        style={styles.tab}
                        onPress={() => {
                            capsuleScaleX.value = withSequence(
                                withTiming(1.21, { duration: 150 }),
                                withTiming(1, { duration: 150 })
                            );
                            capsuleScaleY.value = withSequence(
                                withTiming(1.35, { duration: 150 }),
                                withTiming(1, { duration: 150 })
                            );
                            translateX.value = withTiming((index * TAB_WIDTH) / 1.1);
                            navigation.navigate(tab as never);
                        }}
                        activeOpacity={1}
                    >
                        <View style={styles.tabContent}>
                            {icons[icon]({ color: tintColor })}
                            <Animated.Text style={[styles.tabLabel, { color: tintColor }]}>
                                {label}
                            </Animated.Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

// styles
const styles = StyleSheet.create({
    container: {
        height: 61,
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        borderRadius: 50,
        flexDirection: 'row',
        // overflow: 'hidden',
        elevation: 10,
        paddingHorizontal: CONTAINER_PADDING,
        borderWidth: 1.8,
    } as ViewStyle,
    capsule: {
        position: 'absolute',
        top: 2.5,
        left: 2.5,
        width: 92,
        height: 52,
        borderRadius: 30,
    },
    tab: {
        flex: 1,
    },
    tabContent: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 8,
        justifyContent: 'space-between',
    },
    tabLabel: {
        fontSize: 12,
        marginBottom: 4,
        fontWeight: "regular",
        letterSpacing: 0
    },
});