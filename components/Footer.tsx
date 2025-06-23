import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

export const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isCategoriesActive = [
    "/Categories",
    "/Product_page",
    "/subcategories/[categoryName]",
    "/widelisting/[subcategoryName]", // <- add any others as needed
  ].includes(pathname);

  const tabs = [
    {
      name: "Home",
      icon: "home" as const,
      route: "/Homepage",
      active: pathname === "/Homepage",
    },
    {
      name: "Switch Stores",
      icon: "swap-horizontal" as const,
      route: "/StoreSelectionScreen",
      active: pathname === "/StoreSelectionScreen",
    },
    {
      name: "Categories",
      icon: "grid" as const,
      route: "/Categories",
      active: isCategoriesActive,
    },
    {
      name: "Account",
      icon: "person" as const,
      route: "/Account",
      active: pathname === "/Account",
    },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={styles.navItem}
          onPress={() => {
            if (pathname === tab.route) {
              router.replace(tab.route as any);
            }else router.push(tab.route as any);
          }}
        >
          <Ionicons
            name={tab.icon}
            size={24}
            color={tab.active ? "#00B900" : "black"}
          />
          <Text
            style={[
              styles.navText,
              { color: tab.active ? "#00B900" : "black" },
            ]}
          >
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: "OpenSans_400Regular",
  },
});
