import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, reload } from "firebase/auth";
import { router } from "expo-router";

export default function VerifyEmail() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        await reload(user); // refresh user info
        if (user.emailVerified) {
          clearInterval(interval);
          router.replace("/Homepage");
        }
      }
      setChecking(false);
    }, 3000); // checks every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Waiting for email verification...</Text>
      <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      <Text style={styles.subtext}>
        Please check your inbox and verify your email to continue.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  loader: {
    marginBottom: 20,
  },
  subtext: {
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 20,
    textAlign: "center",
  },
});
