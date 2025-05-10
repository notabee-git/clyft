import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons'; // Chevron icon
import { db, collection, getDocs } from "../firebaseConfig";
import { useFonts, OpenSans_400Regular, OpenSans_700Bold, OpenSans_600SemiBold } from '@expo-google-fonts/open-sans';

export const Footer = () => {
    const router = useRouter();
    return(
<View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => router.push("/Homepage")}>
        <Ionicons name="home" size={24} color="black" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push("/StoreSelectionScreen")}>
        <Ionicons name="swap-horizontal" size={24} color="black" />
        <Text style={styles.navText}>Switch Stores</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push("/Categories")}>
        <Ionicons name="grid" size={24} color="#00B900" />
        <Text style={[styles.navText, { color: "#00B900" }]}>Categories</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="person" size={24} color="black" />
        <Text style={styles.navText}>Account</Text>
      </TouchableOpacity>
    </View>
    )
}
const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: "#ccc",
        fontFamily: "OpenSans_400Regular",
      },
      navItem: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "OpenSans_400Regular",
      },
      navText: {
        fontSize: 12,
        marginTop: 4,  // Add space between the icon and the text
        fontFamily: "OpenSans_400Regular",
      },
})