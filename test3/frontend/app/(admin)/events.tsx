import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, Alert, StyleSheet, ScrollView } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL ="http://localhost:8001/api";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  created_by: string;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  // Charger la liste des événements
  const fetchEvents = async () => {
    try {
      const token = await AsyncStorage.getItem("access");
      const res = await fetch(`${API_URL}/events/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Supprimer un événement
  const deleteEvent = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem("access");
      const res = await fetch(`${API_URL}/events/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete event");
      setEvents(events.filter(event => event.id !== id));
      Alert.alert("Success", "Event deleted successfully");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to delete event");
    }
  };

  // Ouvrir modal pour ajouter ou éditer un événement
  const openModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setTitle(event.title);
      setDescription(event.description);
      setDate(event.date.split("T")[0]);
    } else {
      setEditingEvent(null);
      setTitle("");
      setDescription("");
      setDate("");
    }
    setModalVisible(true);
  };

  // Ajouter / Éditer un événement
  const handleSubmit = async () => {
    if (!title || !description || !date) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("access");
      const method = editingEvent ? "PUT" : "POST";
      const url = editingEvent ? `${API_URL}/events/${editingEvent.id}/` : `${API_URL}/events/`;

      const bodyData = { title, description, date: new Date(date).toISOString() };

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      console.log("Backend response:", res.status, data);

      if (!res.ok) throw new Error(JSON.stringify(data));

      Alert.alert("Success", `Event ${editingEvent ? "updated" : "created"} successfully`);
      setModalVisible(false);
      fetchEvents();
    } catch (err) {
      console.error("Error saving event:", err);
      Alert.alert("Error", "Failed to save event. Check console for details.");
    }
  };

  // Affichage de chaque événement en card
  const renderEvent = ({ item }: { item: Event }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
      <Text style={styles.eventMeta}>Date: {new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.eventMeta}>Created by: {item.created_by}</Text>

      <View style={styles.eventActions}>
        <TouchableOpacity style={styles.editButton} onPress={() => openModal(item)}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteEvent(item.id)}>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Manage Events</Text>

      <TouchableOpacity style={{ marginTop: 20, marginBottom: 10 }} onPress={() => openModal()}>
        <Text style={{ fontSize: 16 }}>➕ Add Event</Text>
      </TouchableOpacity>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEvent}
        refreshing={false}
        onRefresh={fetchEvents}
      />

      {/* Modal pour ajouter / éditer */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingEvent ? "Edit Event" : "Add Event"}</Text>

            <Text style={styles.label}>Title:</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              placeholder="Enter title"
            />

            <Text style={styles.label}>Description:</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              style={[styles.input, { height: 80 }]}
              multiline
              placeholder="Enter description"
            />

            <Text style={styles.label}>Date:</Text>
            <TextInput
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              style={styles.input}
            />

            <TouchableOpacity onPress={handleSubmit} style={[styles.button, { backgroundColor: "#4CAF50" }]}>
              <Text style={styles.buttonText}>{editingEvent ? "Update" : "Add"} Event</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.button, { backgroundColor: "#f44336" }]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  eventTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  eventDescription: { fontSize: 14, marginBottom: 10, color: "#333" },
  eventMeta: { fontSize: 12, color: "#666" },
  eventActions: { flexDirection: "row", marginTop: 10 },
  editButton: { marginRight: 15, backgroundColor: "#2196F3", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  deleteButton: { backgroundColor: "#f44336", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  actionText: { color: "#fff", fontWeight: "bold", fontSize: 14 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    padding: 40,

  },
  modalTitle: { 
  fontSize: 22,
  fontWeight: "bold",
  marginBottom: 20,
  textAlign: "center"},

  label: {
    fontWeight: "600",
    marginBottom: 5,
    fontSize: 16,
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc",
    borderRadius: 8, 
    padding: 10,
    width: 250,
    marginBottom: 15, 
    backgroundColor: "#f9f9f9" },
    
  button: { padding: 12, borderRadius: 10, marginTop: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 16 },
});
