import { StyleSheet, View, Platform } from "react-native";
import StudentNavigationBar from "./StudentNavigationBar";
import TeacherNavigationBar from "./TeacherNavigationBar";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function NavigationBar() {
  const { user } = useContext(AuthContext);
  const insets = useSafeAreaInsets();

  // Some Android devices report 0; give a sensible fallback.
  const bottomOffset =
    insets.bottom && insets.bottom > 0
      ? insets.bottom
      : Platform.OS === "android"
      ? 24
      : 0;

  return (
    <View style={[styles.container, { bottom: bottomOffset }]}>
      {user.userType === "student" || user.userType === "admin" ? (
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
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    left: 0,
    right: 0,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
    // Ensure it's above screen content if needed:
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
  },
});
