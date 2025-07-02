import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const bottom = useBottomTabOverflow();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[{ paddingTop: insets.top + 17 }, container.container]}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}>
        <ThemedView style={container.content}>
          <ThemedView style={styles.header}>
            <ThemedText type='title'>Translate</ThemedText>
          </ThemedView>
        </ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

// stylesheets
const styles = StyleSheet.create({
  header: {
    paddingLeft: 32,
    paddingRight: 20
  }
});


const container = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: 16,
    overflow: 'hidden',
  },
});
