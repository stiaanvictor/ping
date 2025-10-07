import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Colors from "../constants/colors";

const TopLevelSelector = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  const onPressHandle = () => {
    setOpen(!open);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.titleContainer}
        activeOpacity={1}
        onPress={onPressHandle}
      >
        <Text style={styles.title}>{title}</Text>
        <Image
          style={styles.arrow}
          source={
            open
              ? require("../assets/images/arrow_down_white.png")
              : require("../assets/images/arrow_right_white.png")
          }
        />
      </TouchableOpacity>
      {open ? <View style={styles.childrenContainer}>{children}</View> : ""}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontFamily: "Inter-Light",
  },
  arrow: {
    resizeMode: "contain",
    height: 50,
    width: 50,
  },
  childrenContainer: {
    marginLeft: 15,
  },
});

export default TopLevelSelector;
