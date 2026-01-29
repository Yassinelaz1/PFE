// components/ScreenWrapper.tsx
import { View, StyleSheet } from "react-native";

export default function ScreenWrapper({ children }: { children: React.ReactNode }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // ajuste la distance du haut
  },
});
