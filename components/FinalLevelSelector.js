import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/colors";

const FinalLevelSelector = ({ title }) => {
  const [notifications, setNotifications] = useState(false);

  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  return (
    <TouchableOpacity onPress={toggleNotifications} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View>
        <MaterialIcons
          name={notifications ? "notifications-active" : "notifications-off"}
          size={24}
          color={Colors.primary}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    backgroundColor: "white",
    paddingHorizontal: 15,
    marginTop: 2,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter-Light",
  },
});

export default FinalLevelSelector;
