// Profile.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg"; // SVG décoratif
import { Dimensions } from "react-native";

const API_URL = "http://localhost:8001/api";
const MEDIA_BASE = "http://localhost:8001";
const { width } = Dimensions.get("window");

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [followedEvents, setFollowedEvents] = useState<any[]>([]);
  const [updatingEventId, setUpdatingEventId] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  const [likedPosts, setLikedPosts] = useState<any[]>([]);

  const fetchUserAndFollowedEvents = async () => {
    
    const token = await AsyncStorage.getItem("access");
    if (!token) return router.replace("/login");

    try {
      const resUser = await fetch(`${API_URL}/me/`, { headers: { Authorization: `Bearer ${token}` } });
      const userData = await resUser.json();
      setUser(userData);
      if (userData.profile_image) {
        const img = userData.profile_image.startsWith("http")
          ? userData.profile_image
          : `${MEDIA_BASE}${userData.profile_image}`;
        setPreview(`${img}?t=${Date.now()}`);
      }

      const resLiked = await fetch(`${API_URL}/clubs/me/liked-posts/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const likedData = await resLiked.json();
    setLikedPosts(likedData);
      const resEvents = await fetch(`${API_URL}/events/me/followed-events/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const eventsData = await resEvents.json();
      setFollowedEvents(eventsData);
    } catch (err) {
      console.error(err);
      await AsyncStorage.multiRemove(["access", "refresh"]);
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndFollowedEvents();
    
    const interval = setInterval(fetchUserAndFollowedEvents, 5000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  const handleUnfollow = async (eventId: number) => {
    const token = await AsyncStorage.getItem("access");
    if (!token) return router.replace("/login");

    setUpdatingEventId(eventId);
    try {
      await fetch(`${API_URL}/events/${eventId}/toggle-follow/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible de unfollow");
    } finally {
      setUpdatingEventId(null);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["access", "refresh", "role"]);
    router.replace("/login");
  };

  const handleEditProfile = () => {
    Alert.alert("Modifier Profil", "Cette fonction est à implémenter");
  };

  if (loading || !user) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#FFD700" />;
  }

  
  return (
<ScrollView style={styles.container}>
  {/* Header profil */}
  <View style={styles.header}>
    <Image
      source={preview ? { uri: preview } : require("../../assets/images/user.png")}
      style={styles.avatar}
    />
    <Text style={styles.username}>{user.username}</Text>
    <Text style={styles.email}>{user.email}</Text>

    <View style={styles.buttonsRow}>
      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Text style={styles.buttonText}>Modifier</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  </View>

  

  {/* Body */}
  <View style={styles.body}>
    {/* SVG de transition */}
  <Svg
    width={width}
    height={"10%"}
    viewBox="0 0 1200 120"
    preserveAspectRatio="none"
    style={styles.svg}
  >
    <Path
      d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
      opacity={0.25}
      fill="#064c8a"
    />
    <Path
      d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
      opacity={0.5}
      fill="#f0f0f0"
    />
    <Path
      d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
      fill="#064c8a"
    />
  </Svg>
  <View style={{ padding: 16 }}>
    <Text style={styles.sectionTitle}>Événements suivis</Text>
    {followedEvents.length === 0 ? (
      <Text style={styles.noEventText}>Vous ne suivez aucun événement</Text>
    ) : (
      <FlatList
        data={followedEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const eventDate = new Date(item.date);
          const time = eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return (
            <View style={styles.eventCard}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDesc}>{item.description}</Text>
              <Text style={styles.eventTime}>{time}</Text>
              <TouchableOpacity
                style={styles.unfollowButton}
                onPress={() => handleUnfollow(item.id)}
                disabled={updatingEventId === item.id}
              >
                <Text style={styles.unfollowText}>
                  {updatingEventId === item.id ? "..." : "Unfollow"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    )}
    <Text style={styles.sectionTitle}>Posts likés</Text>

{likedPosts.length === 0 ? (
  <Text style={styles.noEventText}>Aucun post liké</Text>
) : (
  likedPosts.map((post) => (
    <View key={post.id} style={styles.eventCard}>
      <Text style={styles.eventTitle}>{post.title}</Text>
      <Text style={styles.eventDesc}>{post.content}</Text>
      <Text style={{ fontSize: 12, color: "#666" }}>
        📅 {new Date(post.created_at).toLocaleDateString()}
      </Text>
    </View>
  ))
)}
    </View>
  </View>
</ScrollView>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#064c8a" },
  header: { alignItems: "center", paddingTop: 50, backgroundColor: "#064c8a" },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: "#FFD700", marginBottom: 10 },
  username: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  email: { fontSize: 14, color: "#eee", marginBottom: 15 },
  buttonsRow: { flexDirection: "row", marginBottom: 20 },
  editButton: { backgroundColor: "#04C2FF", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 25, marginRight: 10 },
  logoutButton: { backgroundColor: "#ff4d4d", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 25 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  body: {  backgroundColor: "#f0f0f0"},
  svg:{ },

  sectionTitle: { fontSize: 22, fontWeight: "bold", color: "#064c8a", marginBottom: 15 },
  noEventText: { color: "#333", textAlign: "center", fontStyle: "italic", marginBottom: 10 },
  eventCard: { backgroundColor: "#fff", borderRadius: 20, padding: 15, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  eventTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#064c8a" },
  eventDesc: { fontSize: 14, color: "#333", marginBottom: 5 },
  eventTime: { fontSize: 12, color: "#666", marginBottom: 8 },
  unfollowButton: { backgroundColor: "#FF6B6B", padding: 10, borderRadius: 15, alignItems: "center" },
  unfollowText: { color: "#fff", fontWeight: "bold" },
});