import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { View, Text } from '@/components/Themed';
import Colors from '@/constants/Colors';

export default function PrayerScreen() {
  const colorScheme = 'dark';
  const C = Colors[colorScheme];

  return (
    <Animated.View 
      entering={FadeIn.duration(600).delay(100)}
      style={[styles.container, { backgroundColor: C.background }]}
    >
      <Animated.View entering={SlideInUp.duration(800).delay(200)}>
        <Text style={[styles.title, { color: C.text }]}>Prayer</Text>
        <Text style={[styles.subtitle, { color: C.text }]}>
          Track your daily prayers and spiritual goals
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
}); 