import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Colors from "../constants/colors";

const TeacherGroupCard = ({ title }) => {
  const handlePress = () => {
    console.log(`${title} clicked!`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.manage}>Click to Manage</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: "row", // arrange title and manage text horizontally
    justifyContent: "space-between", // push them to edges
    alignItems: "center",
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    // Android shadow
    elevation: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  manage: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8, // slightly lighter for subtle hint
  },
});

export default TeacherGroupCard;
