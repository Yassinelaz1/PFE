import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:8001/api";

export default function UserForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editingUser = params.user ? JSON.parse(params.user as string) : null;

  const [username, setUsername] = useState(editingUser?.username || "");
  const [email, setEmail] = useState(editingUser?.email || "");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(editingUser?.is_superuser || false);

  const handleSave = async () => {
    const token = await AsyncStorage.getItem("access");

    const payload: any = { username, email, is_superuser: isAdmin };
    if (password) payload.password = password;

    const res = await fetch(
      editingUser
        ? `${API_URL}/admin/users/${editingUser.id}/`
        : `${API_URL}/admin/users/`,
      {
        method: editingUser ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) return Alert.alert("Error", "Save failed");

    Alert.alert("Success");
    router.back();
  };

  const handleDelete = async () => {
    const token = await AsyncStorage.getItem("access");
    const res = await fetch(`${API_URL}/admin/users/${editingUser.id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return Alert.alert("Error", "Delete failed");

    Alert.alert("Success", "User deleted");
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingUser ? "✏️ Edit User" : "➕ Create User"}
      </Text>

      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

      <View style={styles.switchRow}>
        <Text>Admin</Text>
        <Switch value={isAdmin} onValueChange={setIsAdmin} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      {editingUser && (
        <TouchableOpacity style={[styles.button, { backgroundColor: "red" }]} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20,backgroundColor: "#064c8a" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 , color: "#ffffff"},
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#ffffff",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
