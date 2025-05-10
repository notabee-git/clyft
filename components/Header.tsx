import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useFonts, OpenSans_700Bold } from "@expo-google-fonts/open-sans";
import { useRouter } from "expo-router";

export default function Header() {
  const router = useRouter(); // ✅ Move it here
  const [fontsLoaded] = useFonts({
    OpenSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleSkip = () => {
    router.push("/StoreSelectionScreen");
  };

  return (
    <View>
      <View style={styles.header}>
        <Image source={require("../assets/loading.png")} style={styles.logo} />
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
          <Text style={styles.arrow}> ❯ </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={styles.tagline}>
          One App.{"\n"}All Materials.{"\n"}Every Expert!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: "#000",
    paddingVertical: 0,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "OpenSans_700Bold",
  },
  tagline: {
    fontSize: 22,
    color: "white",
    paddingBottom: 40,
    paddingHorizontal: 30,
    fontFamily: "OpenSans_700Bold",
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: "contain",
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#444",
    borderRadius: 20,
  },
  skipText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  arrow: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 5,
  },
});
