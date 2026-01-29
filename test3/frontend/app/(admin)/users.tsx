import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:8001/api";

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem("access");

    const res = await fetch(`${API_URL}/admin/users/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setUsers(data);
  };

  const filteredUsers = users.filter((u: any) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Users</Text>

      <TextInput
        placeholder="Search user..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/(admin)/user-form")}
      >
        <Text style={styles.addText}>➕ Add User</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/(admin)/user-form",
                params: { user: JSON.stringify(item) },
              })
            }
          >
            <Text style={styles.name}>{item.username}</Text>
            <Text>{item.email}</Text>
            <Text>{item.is_admin ? "ADMIN" : "USER"}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 ,backgroundColor: "#064c8a"},
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, color: "#ffffff" },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#ffffff",
  },
  addBtn: {
    backgroundColor: "#bbd42cff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  addText: { color: "#000000ff", textAlign: "center", fontWeight: "bold" },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#e3f2fd",
    padding: 15,

    borderRadius: 10,
    marginBottom: 10,
  },

  name: { fontWeight: "bold" },
});
