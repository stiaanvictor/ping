import { useContext, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Colors from "../constants/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const TopLevelSelector = ({ title, children }) => {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const onPressHandle = () => setOpen(!open);

  const addPressed = () => {
    navigation.navigate("AddCategory", { title });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.titleContainer}
        activeOpacity={1}
        onPress={onPressHandle}
      >
        <Text style={styles.title}>{title}</Text>

        {user.userType == "admin" ? (
          <TouchableOpacity onPress={addPressed}>
            <AntDesign name="plus-circle" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          ""
        )}

        <Image
          style={styles.arrow}
          source={
            open
              ? require("../assets/images/arrow_down_white.png")
              : require("../assets/images/arrow_right_white.png")
          }
        />
      </TouchableOpacity>

      {open && <View style={styles.childrenContainer}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  title: { color: "white", fontSize: 32, fontFamily: "Inter-Light" },
  arrow: { resizeMode: "contain", height: 50, width: 50 },
  childrenContainer: { marginLeft: 15 },
});

export default TopLevelSelector;
