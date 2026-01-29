import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdminDashboard() {



const router = useRouter();

const handleLogout = async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("role");

  router.replace("/login");
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👑 Admin Dashboard</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/(admin)/events")}
      >
        <Text style={styles.cardText}>📅 Manage Events</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/(admin)/clubs")}
      >
        <Text style={styles.cardText}>🏫 Manage Clubs</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/(admin)/users")}
      >
        <Text style={styles.cardText}>👥 Manage Users</Text>
      </TouchableOpacity>
    <TouchableOpacity
    style={{ marginTop: 30 }}
    onPress={handleLogout}
    >
    <Text style={{ color: "red", textAlign: "center" }}>
        Logout
    </Text>
    </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  cardText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});
