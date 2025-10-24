import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

function StudentNavigationBar() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const routes = useNavigationState((state) => state.routes);
  const index = useNavigationState((state) => state.index);
  const currentRoute = routes[index].name;

  const navigateDashboard = () => {
    if (currentRoute !== "Dashboard") navigation.replace("Dashboard");
  };

  const navigateCalendar = () => {
    if (currentRoute !== "Calendar") navigation.replace("Calendar");
  };

  const navigateGroups = () => {
    if (currentRoute !== "GroupSelection") navigation.replace("GroupSelection");
  };

  const navigateManageUsers = () => {
    if (currentRoute !== "ManageUsers") navigation.replace("ManageUsers");
  };

  // Helper for color highlight
  const activeColor = "#1E88E5";
  const inactiveColor = "#000";

  return (
    <View style={styles.container}>
      {/* Dashboard */}
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

      {/* Calendar */}
      <TouchableOpacity style={styles.option} onPress={navigateCalendar}>
        <Ionicons
          name={currentRoute === "Calendar" ? "calendar" : "calendar-outline"}
          size={28}
          color={currentRoute === "Calendar" ? activeColor : inactiveColor}
        />
        <Text
          style={
            currentRoute === "Calendar" ? styles.textSelected : styles.text
          }
        >
          Calendar
        </Text>
      </TouchableOpacity>

      {/* Groups */}
      <TouchableOpacity style={styles.option} onPress={navigateGroups}>
        <Ionicons
          name={currentRoute === "GroupSelection" ? "people" : "people-outline"}
          size={28}
          color={
            currentRoute === "GroupSelection" ? activeColor : inactiveColor
          }
        />
        <Text
          style={
            currentRoute === "GroupSelection"
              ? styles.textSelected
              : styles.text
          }
        >
          Groups
        </Text>
      </TouchableOpacity>

      {/*Admin-only: Managed Users */}
      {user?.userType === "admin" && (
        <TouchableOpacity style={styles.option} onPress={navigateManageUsers}>
          <Ionicons
            name={
              currentRoute === "ManageUsers" ? "settings" : "settings-outline"
            }
            size={28}
            color={currentRoute === "ManageUsers" ? activeColor : inactiveColor}
          />
          <Text
            style={
              currentRoute === "ManageUsers" ? styles.textSelected : styles.text
            }
          >
            Users
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default StudentNavigationBar;

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
