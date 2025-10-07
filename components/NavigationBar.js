import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useNavigationState } from "@react-navigation/native";

function NavigationBar() {
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

  const navigateCalendar = () => {
    if (currentRoute !== "Calendar") {
      navigation.replace("Calendar");
    } else {
      console.log("Error navigating");
    }
  };

  const navigateGroups = () => {
    if (currentRoute !== "GroupSelection") {
      navigation.replace("GroupSelection");
    } else {
      console.log("Error navigating");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.option} onPress={navigateDashboard}>
        <Image
          source={
            currentRoute === "Dashboard"
              ? require("../assets/images/home-selected.png")
              : require("../assets/images/home.png")
          }
          style={styles.icon}
        />
        <Text
          style={
            currentRoute === "Dashboard" ? styles.textSelected : styles.text
          }
        >
          Dashboard
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={navigateCalendar}>
        <Image
          source={
            currentRoute === "Calendar"
              ? require("../assets/images/calendar-selected.png")
              : require("../assets/images/calendar.png")
          }
          style={styles.icon}
        />
        <Text
          style={
            currentRoute === "Calendar" ? styles.textSelected : styles.text
          }
        >
          Calendar
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={navigateGroups}>
        <Image
          source={
            currentRoute === "GroupSelection"
              ? require("../assets/images/menu-selected.png")
              : require("../assets/images/menu.png")
          }
          style={styles.icon}
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
  option: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
  },
  text: {
    fontFamily: "Inter-Light",
    marginTop: -5,
  },
  textSelected: {
    fontFamily: "Inter-Light",
    marginTop: -5,
    color: "#1E88E5",
  },
});
