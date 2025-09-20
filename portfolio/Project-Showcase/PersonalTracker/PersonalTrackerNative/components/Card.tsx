import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  style?: any;
}

export default function Card({ children, style, ...props }: CardProps) {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? 'light'];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: C.card,
          borderColor: C.border,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    backgroundColor: 'oklch(15% 0.02 95)', // Darker than Stone 900 background
  },
}); 