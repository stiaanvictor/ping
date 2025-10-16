import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "../constants/colors";

export default function ReturnToGroupsButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={() => navigation.navigate("GroupSelection")}
    >
      <Text style={styles.text}>Return to Group Selection</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  text: {
    color: "white",
    fontFamily: "Inter-Light",
    fontSize: 16,
  },
});
