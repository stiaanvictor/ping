import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Colors from "../constants/colors";
import { TouchableOpacity } from "react-native";

const SubLevelSelector = ({ title, children }) => {
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
    height: 50,
    backgroundColor: "#5A688F",
    paddingHorizontal: 15,
    marginBottom: 1,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontFamily: "Inter-Light",
  },
  arrow: {
    resizeMode: "contain",
    height: 40,
    width: 40,
  },
  childrenContainer: {
    marginLeft: 15,
  },
});

export default SubLevelSelector;
