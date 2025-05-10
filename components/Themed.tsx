import { View, Text, StyleSheet } from 'react-native';

type ThemedTextProps = {
  type?: 'title' | 'default';
  children: React.ReactNode;
};

export function ThemedText({ type = 'default', children }: ThemedTextProps) {
  return <Text style={type === 'title' ? styles.title : styles.default}>{children}</Text>;
}

type ThemedViewProps = {
  children: React.ReactNode;
  style?: object;
};

export function ThemedView({ children, style }: ThemedViewProps) {
  return <View style={[styles.view, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  default: {
    fontSize: 16,
  },
  view: {
    padding: 16,
  },
});
