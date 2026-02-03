import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * URL de l’API backend
 * ⚠️ En production, éviter localhost
 */
const API_URL = "http://localhost:8001/api";

export default function ClubDetail() {
  /* =======================
     Params & States
  ======================== */
  const { id } = useLocalSearchParams();
  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* =======================
     Fetch club details
  ======================== */
  const fetchClub = async () => {
    try {
      // Récupération du token JWT
      const token = await AsyncStorage.getItem("access");

      // Appel API
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

  /* =======================
     Lifecycle
  ======================== */
  useEffect(() => {
    fetchClub();
  }, [id]);

  /* =======================
     Loading state
  ======================== */
  if (loading || !club) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loading}>Loading...</Text>
      </SafeAreaView>
    );
  }

/* =======================
   Like post function
======================== */
  const toggleLike = async (postId: number) => {
  const token = await AsyncStorage.getItem("access");
  if (!token) return;

  await fetch(`${API_URL}/clubs/posts/${postId}/like/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // refresh club pour mettre à jour likes
  fetchClub();
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

  return (
    <SafeAreaView style={styles.safe}>
      {/* Titre dynamique dans le header */}
      <Stack.Screen options={{ title: club.name }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image de couverture */}
        <Image
          source={{
            uri:
              club.image ||
              "https://via.placeholder.com/400x200.png?text=Club",
          }}
          style={styles.cover}
        />

        <View style={styles.content}>
          {/* Nom du club */}
          <Text style={styles.title}>{club.name}</Text>

          {/* Description */}
          <Text style={styles.desc}>{club.description}</Text>

          {/* Contenu du club */}
          {club.content && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Content</Text>
              <Text style={styles.contentText}>{club.content}</Text>
            </View>
          )}

          {/* Bouton rejoindre */}
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinText}>Rejoindre le club</Text>
          </TouchableOpacity>

          {/* Stats */}
          <View style={styles.stats}>
            <Text style={styles.m}>
              👥 {club.followers_count || 0} membres
            </Text>
            <Text style={styles.e}>
              📅 {club.events_count || 0} events
            </Text>
          </View>
        </View>

        {/* Posts du club */}
        {club.posts?.length > 0 && (
          <View style={{ marginTop: 20 }}>
            {club.posts.map((post: any) => (
              <View key={post.id} style={styles.postCard}>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postContent}>{post.content}</Text>

                {/* FOOTER */}
                <View style={styles.postFooter}>
                  <TouchableOpacity
                    style={styles.likeBtn}
                    onPress={() => toggleLike(post.id)}
                  >
                    <Text style={styles.likeText}>
                      {post.is_liked ? "❤️" : "🤍"} {post.likes_count}
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.postDate}>
                    📅 {formatDate(post.created_at)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* =======================
   Styles
======================== */
const styles = StyleSheet.create({
safe: {
  flex: 1,
  backgroundColor: "#064c8a",
},

content: {
  marginTop: -30,
  marginHorizontal: 15,
  padding: 20,
  backgroundColor: "#0b5fa5",
  borderRadius: 20,
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowOffset: { width: 0, height: 5 },
  shadowRadius: 10,
  elevation: 6,
},

cover: {
  width: "100%",
  height: 220,
  borderBottomLeftRadius: 25,
  borderBottomRightRadius: 25,
},

title: {
  fontSize: 28,
  fontWeight: "900",
  color: "#fff",
  marginBottom: 6,
},

desc: {
  color: "#dbe9ff",
  fontSize: 15,
  lineHeight: 22,
},

section: {
  marginTop: 20,
  padding: 15,
  backgroundColor: "#0f6fbf",
  borderRadius: 15,
},

sectionTitle: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#FFCC00",
  marginBottom: 8,
},

contentText: {
  color: "#eaf4ff",
  lineHeight: 21,
},

joinButton: {
  backgroundColor: "#FFCC00",
  paddingVertical: 15,
  borderRadius: 30,
  alignItems: "center",
  marginTop: 25,
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 6,
  elevation: 5,
},

joinText: {
  fontWeight: "bold",
  color: "#064c8a",
  fontSize: 17,
  letterSpacing: 0.5,
},

  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  m: {
    color: "#e0e0e0",
    backgroundColor: "#333",
    padding: 5,
    borderRadius: 5,
  },

  e: {
    color: "#000",
    backgroundColor: "#ffae00",
    padding: 5,
    borderRadius: 5,
  },

  loading: {
    color: "#fff",
    textAlign: "center",
    marginTop: 50,
  },

fileItem: {
  backgroundColor: "#ffffff",
  padding: 12,
  borderRadius: 12,
  marginBottom: 10,
},

fileName: {
  fontWeight: "bold",
  color: "#064c8a",
},

fileImage: {
  width: "100%",
  height: 120,
  marginTop: 10,
  borderRadius: 10,
},
postCard: {
  marginHorizontal: 15,
  marginVertical: 10,
  padding: 15,
  borderRadius: 18,
  backgroundColor: "#0b5fa5",
  shadowColor: "#000",
  shadowOpacity: 0.25,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 8,
  elevation: 5,
},

postTitle: {
  color: "#FFCC00",
  fontWeight: "bold",
  fontSize: 18,
  marginBottom: 6,
},

postContent: {
  color: "#e6f2ff",
  fontSize: 14,
  lineHeight: 20,
  marginBottom: 10,
},

postImage: {
  width: "100%",
  height: 180,
  borderRadius: 15,
},

likeText: {
  color: "#064c8a",
  fontWeight: "bold",
},
postFooter: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 10,
},

postDate: {
  color: "#dbe9ff",
  fontSize: 12,
},

likeBtn: {
  backgroundColor: "#FFCC00",
  paddingHorizontal: 14,
  paddingVertical: 6,
  borderRadius: 20,
},


});

