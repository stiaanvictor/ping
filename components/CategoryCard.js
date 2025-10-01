import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import Colors from "../constants/colors";

const { width, height } = Dimensions.get("window");

function CategoryCard({ title, imageSource }) {
  const handlePress = () => {
    console.log(title + " pressed");
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.title}>{title}</Text>
      <Image style={styles.image} source={imageSource} />
    </TouchableOpacity>
  );
}

export default CategoryCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    maxWidth: width * 0.45,
    maxHeight: width * 0.45,
    minWidth: width * 0.45,
    minHeight: width * 0.45,
    marginBottom: 20,
    borderRadius: 20,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 5,
    paddingBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, // for Android shadow
  },
  title: {
    color: "white",
    fontFamily: "Inter-Regular",
    fontSize: 22,
  },
  image: {
    resizeMode: "contain",
    height: width * 0.32,
    width: width * 0.32,
  },
});
