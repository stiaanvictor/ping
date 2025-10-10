import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/colors";
import ReturnToDashboardButton from "../components/ReturnToDashboardButton";

const notices = [
  {
    id: 1,
    type: "sports",
    title: "Rugby",
    subHeading: "vs DF Malan",
    eventDate: "2025-10-05",
    noticeDate: "2025-10-03",
    notice: "Match may be moved indoors due to possible rain.",
  },
  {
    id: 2,
    type: "academics",
    title: "Math Quiz",
    subHeading: "Chapter 5 & 6",
    eventDate: "2025-10-07",
    noticeDate: "2025-10-02",
    notice: "Reminder: Bring calculators for the quiz.",
  },
  {
    id: 3,
    type: "entertainment",
    title: "Movie Night",
    subHeading: "Avengers: Endgame",
    eventDate: "2025-10-08",
    noticeDate: "2025-10-05",
    notice: "Snacks will be sold at the entrance.",
  },
  {
    id: 4,
    type: "clubs",
    title: "Chess Club",
    subHeading: "Weekly Meetup",
    eventDate: "2025-10-09",
    noticeDate: "2025-10-06",
    notice: "Special guest player attending this week.",
  },
  {
    id: 5,
    type: "sports",
    title: "Soccer",
    subHeading: "vs Greenfield HS",
    eventDate: "2025-10-11",
    noticeDate: "2025-10-08",
    notice: "Kickoff time moved to 4 PM.",
  },
  {
    id: 6,
    type: "academics",
    title: "Science Fair",
    subHeading: "Project submission",
    eventDate: "2025-10-13",
    noticeDate: "2025-10-09",
    notice: "Deadline extended by one day.",
  },
  {
    id: 7,
    type: "entertainment",
    title: "Concert",
    subHeading: "Local Band Live",
    eventDate: "2025-10-14",
    noticeDate: "2025-10-10",
    notice: "Venue changed to school auditorium.",
  },
  {
    id: 8,
    type: "clubs",
    title: "Drama Club",
    subHeading: "Rehearsal",
    eventDate: "2025-10-15",
    noticeDate: "2025-10-12",
    notice: "Rehearsal extended by 30 minutes.",
  },
];

function ViewNoticeScreen({ route }) {
  const { id, type, title, subHeading, eventDate, noticeDate, notice } =
    route.params;

  const eventDateTemp = new Date(eventDate);
  const noticeDateTemp = new Date(noticeDate);

  const formattedEventDate = eventDateTemp.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedNoticeDate = noticeDateTemp.toLocaleDateString("en-GB", {
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
          <Text style={styles.eventDateLabel}>📅 Event Date:</Text>
          <Text style={styles.eventDate}>{formattedEventDate}</Text>

          <Text style={styles.descriptionLabel}>📝 Details:</Text>
          <Text style={styles.description}>{subHeading}</Text>

          <Text style={styles.noticeDateLabel}>🕒 Notice Posted:</Text>
          <Text style={styles.noticeDate}>{formattedNoticeDate}</Text>

          <Text style={styles.noticeLabel}>📢 Notice:</Text>
          <Text style={styles.notice}>{notice}</Text>
        </View>
      </View>
      <ReturnToDashboardButton />
    </SafeAreaView>
  );
}

export default ViewNoticeScreen;

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
  eventDateLabel: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#111",
    marginBottom: 30,
  },
  descriptionLabel: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: Colors.primary,
    marginBottom: 6,
  },
  description: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#222",
    marginBottom: 20,
    lineHeight: 24,
  },
  noticeDateLabel: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: Colors.primary,
    marginTop: 12,
    marginBottom: 4,
  },
  noticeDate: {
    fontSize: 16,
    fontFamily: "Inter-Light",
    color: "#666",
    marginBottom: 30,
  },
  noticeLabel: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  notice: {
    fontSize: 18,
    fontFamily: "Inter-Italic",
    color: "#333",
    lineHeight: 26,
    marginTop: 6,
  },
});
