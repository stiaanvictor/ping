import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import StudentNavigationBar from "./StudentNavigationBar";
import TeacherNavigationBar from "./TeacherNavigationBar";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function NavigationBar() {
  const { user } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      {user.userType === "student" || user.userType == "admin" ? (
        <StudentNavigationBar />
      ) : (
        <TeacherNavigationBar />
      )}
    </View>
  );
}

export default NavigationBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
  },
});
