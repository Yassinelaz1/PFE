import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:8001/api";

export default function ClubScreen() {
  const router = useRouter();
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClubs = async () => {
    try {
      const token = await AsyncStorage.getItem("access");
      const res = await fetch(`${API_URL}/clubs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setClubs(data);
    } catch (err) {
      console.log("Error fetching clubs:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem("access");
      await fetch(`${API_URL}/clubs/${id}/follow/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchClubs();
    } catch (err) {
      console.log("Follow error:", err);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title: "Clubs" }} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>Clubs ESGITECH</Text>

        {clubs.map((club) => (
          <View key={club.id} style={styles.card}>
            <TouchableOpacity
              onPress={() => router.push(`/club/${club.id}`)}
            >
              <Image
                source={{
                  uri:
                    club.image ||
                    "https://via.placeholder.com/400x200.png?text=Club",
                }}
                style={styles.image}
              />
              <Text style={styles.title}>{club.name}</Text>
              <Text style={styles.desc}>{club.description}</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.followers}>
                👥 {club.followers_count}
              </Text>

              <TouchableOpacity
                style={[
                  styles.followBtn,
                  club.is_followed && styles.followed,
                ]}
                onPress={() => toggleFollow(club.id)}
              >
                <Text
                  style={[
                    styles.followText,
                    club.is_followed && { color: "#fff" },
                  ]}
                >
                  {club.is_followed ? "Unfollow" : "Follow"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        



      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#064c8a",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 25,
    textAlign: "center",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 14,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  desc: {
    fontSize: 15,
    color: "#e6e6e6",
    marginTop: 4,
  },
  footer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  followers: {
    color: "#fff",
    fontWeight: "600",
  },
  followBtn: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  followed: {
    backgroundColor: "#ff5c5c",
  },
  followText: {
    fontWeight: "700",
    color: "#064c8a",
  },
});
