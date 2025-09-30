import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";

function NavigationBar({ selectedScreen }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.option}>
        <Image
          source={
            selectedScreen === "dashboard"
              ? require("../assets/images/home-selected.png")
              : require("../assets/images/home.png")
          }
          style={styles.icon}
        />
        <Text
          style={
            selectedScreen === "dashboard" ? styles.textSelected : styles.text
          }
        >
          Dashboard
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option}>
        <Image
          source={
            selectedScreen === "calendar"
              ? require("../assets/images/calendar-selected.png")
              : require("../assets/images/calendar.png")
          }
          style={styles.icon}
        />
        <Text
          style={
            selectedScreen === "calendar" ? styles.textSelected : styles.text
          }
        >
          Calendar
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option}>
        <Image
          source={
            selectedScreen === "groups"
              ? require("../assets/images/menu-selected.png")
              : require("../assets/images/menu.png")
          }
          style={styles.icon}
        />
        <Text
          style={
            selectedScreen === "groups" ? styles.textSelected : styles.text
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
