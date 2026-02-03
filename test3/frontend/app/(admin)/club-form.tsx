import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";


const API_URL = "http://localhost:8001/api";

export default function ClubForm() {
  const [image, setImage] = useState<any>(null);


  const router = useRouter();
  const params = useLocalSearchParams();
  const editingClub = params.club ? JSON.parse(params.club as string) : null;

  const [name, setName] = useState(editingClub?.name || "");
  const [description, setDescription] = useState(editingClub?.description || "");


const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    quality: 1,
  });

  if (!result.canceled) {
    const asset = result.assets[0];

    setImage({
      uri: asset.uri,
      name: "club.jpg",
      type: "image/jpeg",
    });
  }
};



  const handleDelete = async () => {
    const token = await AsyncStorage.getItem("access");
    const res = await fetch(`${API_URL}/clubs/admin/clubs/${editingClub.id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return Alert.alert("Error", "Delete failed");

    Alert.alert("Success", "Club deleted");
    router.back();
  };
const handleSave = async () => {
  const token = await AsyncStorage.getItem("access");


  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);

  if (image) {
    formData.append("image", {
      uri: image.uri,
      name: "club.jpg",
      type: "image/jpeg",
    } as any);
  }

  const res = await fetch(
    editingClub
      ? `${API_URL}/clubs/admin/clubs/${editingClub.id}/`
      : `${API_URL}/clubs/admin/clubs/`,
    {
      method: editingClub ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!res.ok) {
    console.log(await res.text());
    Alert.alert("Error", "Save failed");
    return;
  }

  Alert.alert("Success");
  router.back();
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingClub ? "✏️ Edit Club" : "➕ Create Club"}
      </Text>

      <TextInput
        placeholder="Club Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
        numberOfLines={4}
      />
<TouchableOpacity onPress={pickImage} style={styles.button}>
  <Text style={styles.buttonText}>📸 Pick Image</Text>
</TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      {editingClub && (
        <TouchableOpacity style={[styles.button, { backgroundColor: "red" }]} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#064c8a" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, color: "#ffffff" },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#ffffff",
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