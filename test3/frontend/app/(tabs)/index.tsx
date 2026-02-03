import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      


      {/* Titre principal */}
      <Text style={styles.title}>ESGITECH LIFE 🎓</Text>
      {/* Illustration */}
      <Image
        source={require("../../assets/images/uni.png")}
        style={styles.illustration}
      />
      {/* Sous-titre amélioré */}
      <Text style={styles.subtitle}>
        Explore les clubs, découvre les événements et profite d'une expérience
        universitaire exceptionnelle.
      </Text>

      {/* Section À propos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔥 Clubs</Text>
        <Text style={styles.sectionText}>
          Rejoins des clubs passionnants : Tech, Gaming, Photo, Robotique,
          Entrepreneuriat... Trouve ta communauté et développe tes talents !
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎉 Événements</Text>
        <Text style={styles.sectionText}>
          Participe à des conférences, compétitions, workshops, soirées et
          activités sociales organisées tout au long de l’année.
        </Text>
      </View>

      {/* Bouton CTA */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/events")}
      >
        <Text style={styles.buttonText}>Découvrir les événements →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 55,
    paddingBottom: 40,
    alignItems: "center",
    backgroundColor: "#064c8a",
  },
  illustration: {
    width: 400,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 25,
  },
  section: {
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 15,
    color: "#e8e8e8",
    lineHeight: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#ffcc00",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
  },
  buttonText: {
    color: "#064c8a",
    fontSize: 16,
    fontWeight: "700",
  },
});
