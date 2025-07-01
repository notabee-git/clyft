import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Address } from "@/constants/types";
import { useCart } from "@/context/cartContext";
import { useFocusEffect } from "@react-navigation/native"; // ✅ added

export default function SelectAddressScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { cart, address, setAddress } = useCart();

  // ✅ Refresh logic when screen regains focus
  useFocusEffect(
    useCallback(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDocRef = doc(db, "Users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              const fetchedAddresses = userData.address || [];

              setAddresses(fetchedAddresses);

              const defaultAddressIndex = userData.default_address ?? 0;
              if (fetchedAddresses.length > 0) {
                setSelectedId(defaultAddressIndex);
                setAddress(fetchedAddresses[defaultAddressIndex]);
              }
            } else {
              setAddresses([]);
              setSelectedId(null);
            }
          } catch (error) {
            console.error("Error fetching user addresses:", error);
            setAddresses([]);
            setSelectedId(null);
          }
        } else {
          setAddresses([]);
          setSelectedId(null);
        }
      });

      return () => unsubscribe();
    }, [])
  );

  const renderAddresses = () =>
    addresses.map((item, index) => {
      const isSelected = selectedId === index;
      const fullAddress = `${item.flatBuilding}\n${item.locality}\n${item.city}, ${item.state}, ${item.pincode}`;
      return (
        <View key={index} style={styles.addressBox}>
          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => {
              setSelectedId(index);
              setAddress(item);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.radioOuter}>
              {isSelected && <View style={styles.radioInner} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nameText}>{item.fullname}</Text>
              <Text style={styles.addressText}>{fullAddress}</Text>

              {isSelected && (
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.removeBtn}>
                    <Text style={styles.actionBtnText}>REMOVE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.editBtn}>
                    <Text style={styles.actionBtnText}>EDIT</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      );
    });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <TouchableOpacity style={{ padding: 4 }} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}> Address</Text>
        <View style={{ width: 24 }} />
      </View>

      <TouchableOpacity
        style={styles.addAddressButton}
        onPress={() =>
          router.push({
            pathname: "./AddNewAddress",
            params: { from: "Select_address" },
          })
        }
      >
        <Text style={styles.addAddressText}>ADD A NEW ADDRESS</Text>
      </TouchableOpacity>

      <ScrollView>{renderAddresses()}</ScrollView>

      <TouchableOpacity
        style={styles.deliverBtn}
        onPress={() => router.back()}
      >
        <Text style={styles.deliverBtnText}>DELIVER HERE</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "left",
    color: "#000",
  },
  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  progressActive: {
    color: "#0C8744",
    fontWeight: "bold",
    fontSize: 15,
  },
  progressInactive: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 15,
  },
  progressArrowActive: {
    marginHorizontal: 6,
    color: "#0C8744",
  },
  progressArrowInactive: {
    marginHorizontal: 6,
    color: "#000",
  },
  addAddressButton: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    marginHorizontal: 16,
    marginBottom: 14,
    marginTop: 6,
    paddingVertical: 18,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  addAddressText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
    letterSpacing: 0.5,
  },
  addressBox: {
    backgroundColor: "#fafafa",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 3,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#000",
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
    color: "#000",
  },
  addressText: {
    color: "#222",
    fontSize: 14,
    marginBottom: 2,
    marginTop: 2,
    lineHeight: 18,
  },
  mobileText: {
    color: "#000",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 2,
  },
  removeBtn: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  editBtn: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
  },
  actionBtnText: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  deliverBtn: {
    backgroundColor: "#000",
    alignItems: "center",
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 6,
  },
  deliverBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});
