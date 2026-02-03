import { Stack } from "expo-router";
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:8001/api";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  followers: number[]; // ids des users
}

export default function EventsScreen({ onFollowChange }: { onFollowChange?: () => void }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [eventsOfDay, setEventsOfDay] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingEventId, setUpdatingEventId] = useState<number | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem("access");
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/events/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erreur fetch events");

        const data = await res.json();
        setEvents(data);

        // Marquer les jours avec events
        const marks: any = {};
        data.forEach((e: Event) => {
          const day = e.date.split("T")[0];
          marks[day] = { marked: true, dotColor: "#FFCC00" };
        });
        setMarkedDates(marks);
      } catch (err) {
        console.error("Fetch events error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDayPress = (day: any) => {
    setSelectedDay(day.dateString);
    const filtered = events.filter(e => e.date.startsWith(day.dateString));
    setEventsOfDay(filtered);
  };

  const handleToggleFollow = async (event: Event) => {
    const token = await AsyncStorage.getItem("access");
    if (!token) return;
    setUpdatingEventId(event.id);

    try {
      const res = await fetch(`${API_URL}/events/${event.id}/toggle-follow/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      // Mettre à jour localement le followers
      setEvents(prev =>
        prev.map(ev =>
          ev.id === event.id
            ? {
                ...ev,
                followers: data.followed
                  ? [...ev.followers, 1]
                  : ev.followers.filter(u => u !== 1),
              }
            : ev
        )
      );

      // Update liste des events suivis dans Profile
      onFollowChange?.();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingEventId(null);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={{
              ...markedDates,
              [selectedDay]: { selected: true, selectedColor: "#FFCC00" },
            }}
            theme={{
              calendarBackground: "#064c8a",
              textSectionTitleColor: "#fff",
              selectedDayTextColor: "#064c8a",
              todayTextColor: "#00C2FF",
              dayTextColor: "#fff",
              textDisabledColor: "rgba(255,255,255,0.3)",
              arrowColor: "#FFCC00",
              monthTextColor: "#fff",
              textDayFontWeight: "600",
              textMonthFontWeight: "700",
              textDayHeaderFontWeight: "600",
            }}
            style={styles.calendar}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FFCC00" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={eventsOfDay}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
             
              

              return (
                <View style={styles.eventCard}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text>{item.description}</Text>
                  

                  <TouchableOpacity
                    style={{
                      backgroundColor: item.followers.includes(1) ? "#ff4d4d" : "#04C2FF",
                      padding: 10,
                      borderRadius: 10,
                      marginTop: 8,
                      alignItems: "center",
                    }}
                    onPress={() => handleToggleFollow(item)}
                    disabled={updatingEventId === item.id}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      {updatingEventId === item.id
                        ? "..."
                        : item.followers.includes(1)
                        ? "Unfollow"
                        : "Follow"}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            ListEmptyComponent={
              selectedDay ? (
                <View style={styles.noEventCard}>
                  <Text style={styles.noEventText}>Aucun événement prévu pour ce jour</Text>
                </View>
              ) : null
            }
            contentContainerStyle={{ paddingBottom: 50 }}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#064c8a", padding: 16 },
  calendarContainer: { borderRadius: 20, padding: 10 },
  calendar: { borderRadius: 20 },
  eventCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
  },
  eventTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  eventTime: { fontSize: 12, color: "#666", marginTop: 5 },
  noEventCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  noEventText: { color: "#333", fontStyle: "italic" },
});
