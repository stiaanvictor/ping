import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/colors";
import ReturnToDashboardButton from "../components/ReturnToDashboardButton";

const events = [
  {
    id: 1,
    type: "sports",
    title: "Rugby",
    description: "vs DF Malan",
    date: "2025-10-05",
  },
  {
    id: 2,
    type: "academics",
    title: "Math Quiz",
    description: "Chapter 5 & 6",
    date: "2025-10-07",
  },
  {
    id: 3,
    type: "entertainment",
    title: "Movie Night",
    description: "Avengers: Endgame",
    date: "2025-10-08",
  },
  {
    id: 4,
    type: "clubs",
    title: "Chess Club",
    description: "Weekly Meetup",
    date: "2025-10-09",
  },
  {
    id: 5,
    type: "sports",
    title: "Soccer",
    description: "vs Greenfield HS",
    date: "2025-10-11",
  },
  {
    id: 6,
    type: "academics",
    title: "Science Fair",
    description: "Project submission",
    date: "2025-10-13",
  },
  {
    id: 7,
    type: "entertainment",
    title: "Concert",
    description: "Local Band Live",
    date: "2025-10-14",
  },
  {
    id: 8,
    type: "clubs",
    title: "Drama Club",
    description: "Rehearsal",
    date: "2025-10-15",
  },
];

function ViewEventScreen({ route }) {
  const { id, type, title, description, date } = route.params;

  const dateStr = "2025-10-05";
  const dateDisplay = new Date(dateStr);

  const formatted = dateDisplay.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* App Bar Start */}
      <View style={styles.appBar}>
        <Text></Text>
        <Text style={styles.appBarText}>{title}</Text>
        <Text></Text>
      </View>
      {/* App Bar End */}

      <View style={styles.detailsContainer}>
        <View style={styles.details}>
          <Text style={styles.text}>Date: {formatted}</Text>
          <Text style={styles.text}>Time: 11:00AM</Text>
          <Text style={styles.text}>At: DF Malan</Text>
        </View>
      </View>
      <ReturnToDashboardButton />
    </SafeAreaView>
  );
}

export default ViewEventScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EFEFEF" },
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between", // pushes items to the edges
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  appBarText: {
    fontSize: 30,
    color: "white",
    fontFamily: "Inter-Light",
    fontWeight: 500,
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  details: {
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  text: {
    fontFamily: "Inter-Regular",
    fontSize: 18,
    marginBottom: 15,
  },
});
