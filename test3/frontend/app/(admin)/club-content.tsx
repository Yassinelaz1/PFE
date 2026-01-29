import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

const API_URL = "http://localhost:8001/api";

export default function ClubContent() {
  const { clubId } = useLocalSearchParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [editingPost, setEditingPost] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<any>(null);
  const [file, setFile] = useState<any>(null);

  const fetchPosts = async () => {
    const res = await fetch(`${API_URL}/clubs/${clubId}/posts/`);
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!res.canceled) setImage(res.assets[0]);
  };

  const pickFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({});
    if (!res.canceled) setFile(res.assets[0]);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImage(null);
    setFile(null);
    setEditingPost(null);
  };

  const savePost = async () => {
    const token = await AsyncStorage.getItem("access");
    console.log("ADMIN TOKEN:", token);
    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);

    if (image) {
      formData.append("image", {
        uri: image.uri,
        name: "image.jpg",
        type: "image/jpeg",
      } as any);
    }

    if (file) {
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || "application/octet-stream",
      } as any);
    }

const url = editingPost
  ? `${API_URL}/clubs/posts/${editingPost.id}/`
  : `${API_URL}/clubs/${clubId}/posts/create/`;

const method = editingPost ? "PUT" : "POST";;

    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      Alert.alert("Error", "Save failed");
      return;
    }

    resetForm();
    fetchPosts();
  };

  const deletePost = async (id: number) => {
    const token = await AsyncStorage.getItem("access");
    await fetch(`${API_URL}/clubs/posts/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📄 Club Posts</Text>

      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <TouchableOpacity style={styles.btn} onPress={pickImage}>
        <Text>📸 Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={pickFile}>
        <Text>📎 File</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.save} onPress={savePost}>
        <Text style={{ color: "#fff" }}>
          {editingPost ? "Update Post" : "Add Post"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={posts}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text>{item.content}</Text>

            {item.image && <Image source={{ uri: item.image }} style={styles.img} />}

            <View style={styles.row}>
              <TouchableOpacity onPress={() => {
                setEditingPost(item);
                setTitle(item.title);
                setContent(item.content);
              }}>
                <Text>✏️ Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deletePost(item.id)}>
                <Text style={{ color: "red" }}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#064c8a" },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 8, marginBottom: 8 },
  btn: { backgroundColor: "#ddd", padding: 10, borderRadius: 8, marginBottom: 6 },
  save: { backgroundColor: "#4caf50", padding: 12, borderRadius: 10, marginBottom: 20 },
  card: { backgroundColor: "#e3f2fd", padding: 10, borderRadius: 10, marginBottom: 10 },
  postTitle: { fontWeight: "bold" },
  img: { width: "100%", height: 120, marginTop: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
});
