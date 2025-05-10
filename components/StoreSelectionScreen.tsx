import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import { useRouter } from "expo-router";

export default function StoreSelectionScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Store Selection</Text>

      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => router.push("/Homepage")}
      >
        <ImageBackground
          source={require("../assets/buildstore.png")}
          style={styles.card}
          imageStyle={styles.cardImage}
        >
          {/* <Text style={styles.storeTitle}>BuildStore</Text>
          <Text style={styles.byText}>
            ~ by <Text style={styles.brand}>clyft</Text>
          </Text>
          <View style={styles.divider} />
          <Text style={styles.storeSubtitle}>
            All your Building Materials.{"\n"}One Store.
          </Text> */}
        </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cardContainer}
        // onPress={() => router.push("/ClyftCrew")}
      >
        <ImageBackground
          source={require("../assets/crew.png")}
          style={styles.card}
          imageStyle={styles.cardImage}
        >
          {/* <Text style={styles.crewLogo}>clyft</Text>
          <Text style={styles.crewTitle}>Crew</Text> */}
          {/* <View style={styles.divider} /> */}
          {/* <Text style={styles.storeSubtitle}>
            Your Dream Team for your{"\n"}Dream Home
          </Text> */}
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    color: "#66A3FF",
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "600",
  },
  cardContainer: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
  },
  card: {
    height: 350,
    padding: 20,
    justifyContent: "center",
  },
  cardImage: {
    borderRadius: 16,
    resizeMode: "cover",
  },
  storeTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  byText: {
    fontSize: 14,
    color: "#ddd",
    marginBottom: 8,
  },
  brand: {
    fontWeight: "bold",
    color: "#fff",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    width: "80%",
    marginVertical: 10,
  },
  storeSubtitle: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
  },
  crewLogo: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  crewTitle: {
    color: "#A8BFFF",
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 4,
  },
});
