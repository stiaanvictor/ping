import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/colors";
import ReturnToDashboardButton from "../components/ReturnToDashboardButton";

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
