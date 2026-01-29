import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:8001/api";

export default function ClubDetail() {
  const { id } = useLocalSearchParams();
  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchClub = async () => {
    try {
      const token = await AsyncStorage.getItem("access");
      const res = await fetch(`${API_URL}/clubs/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setClub(data);
    } catch (err) {
      console.log("Fetch club error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClub();
  }, [id]);

  if (loading || !club) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loading}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title: club.name }} />

      <ScrollView>
        <Image
          source={{ uri: club.image || "https://via.placeholder.com/400x200.png?text=Club" }}
          style={styles.cover}
        />

        <View style={styles.content}>
          <Text style={styles.title}>{club.name}</Text>

          <Text style={styles.desc}>{club.description}</Text>

          {club.content && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Content</Text>
              <Text style={styles.contentText}>{club.content}</Text>
            </View>
          )}

          {club.files && club.files.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Files</Text>
              <FlatList
                data={club.files}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.fileItem}>
                    <Text style={styles.fileName}>{item.name}</Text>
                    {item.uri && item.uri.includes("image") && (
                      <Image source={{ uri: item.uri }} style={styles.fileImage} />
                    )}
                  </View>
                )}
              />
            </View>
          )}

          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinText}>Rejoindre le club</Text>
          </TouchableOpacity>

          <View style={styles.stats}>
            <Text style={styles.m}>👥 {club.followers_count || 0} membres</Text>
            <Text style={styles.e}>📅 {club.events_count || 0} events</Text>
          </View>
        </View>
                {club.posts && club.posts.length > 0 && club.posts.map((post) => (
  <View key={post.id} style={{ marginVertical: 15 }}>
    <Text style={{ color: "#fff", fontWeight: "bold" }}>{post.title}</Text>
    <Text style={{ color: "#e0e0e0" }}>{post.content}</Text>

    {post.image && (
      <Image source={{ uri: post.image }} style={{ width: "100%", height: 180 }} />
    )}
  </View>
))}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#064c8a" },
  cover: { width: "100%", height: 200 },
  content: { padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },
  desc: {
    color: "#e0e0e0",
    marginVertical: 10,
  },
  joinButton: {
    backgroundColor: "#FFCC00",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 15,
  },
  joinText: {
    fontWeight: "bold",
    color: "#064c8a",
    fontSize: 16,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  m:{
    color: "#e0e0e0",
    backgroundColor: "#333",
    padding: 5,
    borderRadius: 5,
  },
  e:{
    color: "#000000ff",
    backgroundColor: "#ffae00ff",
    padding: 5,
    borderRadius: 5,
    
  },
  loading: { color: "#fff", textAlign: "center", marginTop: 50 },
  section: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  contentText: {
    color: "#e0e0e0",
  },
  fileItem: {
    backgroundColor: "#e3f2fd",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  fileName: {
    fontWeight: "bold",
  },
  fileImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
  },
});
