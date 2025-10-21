import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

function TeacherNavigationBar() {
  const navigation = useNavigation();

  const routes = useNavigationState((state) => state.routes);
  const index = useNavigationState((state) => state.index);

  const currentRoute = routes[index].name;

  const navigateDashboard = () => {
    if (currentRoute !== "Dashboard") {
      navigation.replace("Dashboard");
    } else {
      console.log("Error navigating");
    }
  };

  const navigateGroups = () => {
    if (currentRoute !== "TeacherGroups") {
      navigation.replace("TeacherGroups");
    } else {
      console.log("Error navigating");
    }
  };

  const activeColor = "#1E88E5";
  const inactiveColor = "#000";

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.option} onPress={navigateDashboard}>
        <Ionicons
          name={currentRoute === "Dashboard" ? "home" : "home-outline"}
          size={28}
          color={currentRoute === "Dashboard" ? activeColor : inactiveColor}
        />
        <Text
          style={
            currentRoute === "Dashboard" ? styles.textSelected : styles.text
          }
        >
          Dashboard
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={navigateGroups}>
        <Ionicons
          name={currentRoute === "TeacherGroups" ? "people" : "people-outline"}
          size={28}
          color={currentRoute === "TeacherGroups" ? activeColor : inactiveColor}
        />
        <Text
          style={
            currentRoute === "TeacherGroups" ? styles.textSelected : styles.text
          }
        >
          Your Groups
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default TeacherNavigationBar;

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
  option: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  text: {
    fontFamily: "Inter-Light",
    marginTop: -5,
    color: "#000",
  },
  textSelected: {
    fontFamily: "Inter-Light",
    marginTop: -5,
    color: "#1E88E5",
  },
});
