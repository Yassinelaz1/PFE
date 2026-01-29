import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:8001/api";

export default function AdminClubs() {
  const router = useRouter();
  const [clubs, setClubs] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchClubs = async () => {
    try {
      const token = await AsyncStorage.getItem("access");
      const res = await fetch(`${API_URL}/clubs/admin/clubs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setClubs(data);
    } catch (err) {
      console.log("Admin clubs error:", err);
    }
  };

  const deleteClub = async (clubId: number) => {
    try {
      const token = await AsyncStorage.getItem("access");
      const res = await fetch(`${API_URL}/clubs/admin/clubs/${clubId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setClubs(clubs.filter((c) => c.id !== clubId));
        Alert.alert("Success", "Club deleted.");
      } else {
        Alert.alert("Error", "Failed to delete club.");
      }
    } catch (err) {
      console.log("Delete club error:", err);
      Alert.alert("Error", "Failed to delete club.");
    }
  };

  const confirmDelete = (club: any) => {
    Alert.alert(
      "Delete Club",
      `Are you sure you want to delete "${club.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteClub(club.id) },
      ]
    );
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const filteredClubs = clubs.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏛️ Clubs (Admin)</Text>

      <TextInput
        placeholder="Search club..."
        placeholderTextColor="#777"
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/(admin)/club-form")}
      >
        <Text style={styles.addText}>➕ Add Club</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredClubs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardContent}
              onPress={() =>
                router.push({
                  pathname: "/(admin)/club-form",
                  params: { club: JSON.stringify(item) },
                })
              }
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text>{item.description}</Text>
              <Text style={styles.creator}>
                Created by: {item.created_by_username}
              </Text>

              {item.image && (
                <Image source={{ uri: item.image }} style={styles.image} />
              )}

              {item.content && (
                <Text style={styles.content}>
                  Content: {Array.isArray(item.content) ? item.content.join(", ") : item.content}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() =>
                  router.push({
                    pathname: "/(admin)/club-form",
                    params: { club: JSON.stringify(item) },
                  })
                }
              >
                <Text style={styles.actionText}>✏️ Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => confirmDelete(item)}
              >
                <Text style={styles.actionText}>🗑️ Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contentBtn}
                onPress={() =>
                  router.push({
                    pathname: "/(admin)/club-content", // Create this screen for managing content (text/files)
                    params: { clubId: item.id },
                  })
                }
              >
                <Text style={styles.actionText}>📄 Manage Content</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#064c8a",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#ffffff",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#ffffff",
  },
  addBtn: {
    backgroundColor: "#bbd42c",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  addText: {
    color: "#000",
    textAlign: "center",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  creator: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  image: {
    width: "100%",
    height: 120,
    marginTop: 10,
    borderRadius: 10,
  },
  content: {
    marginTop: 10,
    fontStyle: "italic",
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editBtn: {
    backgroundColor: "#4caf50",
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  deleteBtn: {
    backgroundColor: "#f44336",
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  contentBtn: {
    backgroundColor: "#2196f3",
    padding: 8,
    borderRadius: 5,
    flex: 1,
  },
  actionText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
  },
});
