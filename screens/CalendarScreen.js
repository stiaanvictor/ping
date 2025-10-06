import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBar from "../components/NavigationBar";
import Colors from "../constants/colors";
import { Calendar } from "react-native-calendars";
import StudentNoticesSection from "../components/StudentNoticesSection";
import { useState } from "react";

const notices = [
  {
    id: 1,
    type: "sports",
    title: "Rugby",
    description: "vs DF Malan",
    eventDate: "2025-10-05",
    noticeDate: "2025-10-03",
    notice: "Match may be moved indoors due to possible rain.",
  },
  {
    id: 2,
    type: "academics",
    title: "Math Quiz",
    description: "Chapter 5 & 6",
    eventDate: "2025-10-07",
    noticeDate: "2025-10-02",
    notice: "Reminder: Bring calculators for the quiz.",
  },
  {
    id: 3,
    type: "entertainment",
    title: "Movie Night",
    description: "Avengers: Endgame",
    eventDate: "2025-10-08",
    noticeDate: "2025-10-05",
    notice: "Snacks will be sold at the entrance.",
  },
  {
    id: 4,
    type: "clubs",
    title: "Chess Club",
    description: "Weekly Meetup",
    eventDate: "2025-10-09",
    noticeDate: "2025-10-06",
    notice: "Special guest player attending this week.",
  },
  {
    id: 5,
    type: "sports",
    title: "Soccer",
    description: "vs Greenfield HS",
    eventDate: "2025-10-11",
    noticeDate: "2025-10-08",
    notice: "Kickoff time moved to 4 PM.",
  },
  {
    id: 6,
    type: "academics",
    title: "Science Fair",
    description: "Project submission",
    eventDate: "2025-10-13",
    noticeDate: "2025-10-09",
    notice: "Deadline extended by one day.",
  },
  {
    id: 7,
    type: "entertainment",
    title: "Concert",
    description: "Local Band Live",
    eventDate: "2025-10-14",
    noticeDate: "2025-10-10",
    notice: "Venue changed to school auditorium.",
  },
  {
    id: 8,
    type: "clubs",
    title: "Drama Club",
    description: "Rehearsal",
    eventDate: "2025-10-15",
    noticeDate: "2025-10-12",
    notice: "Rehearsal extended by 30 minutes.",
  },
];

function CaledarScreen() {
  const markedDates = notices.reduce((acc, notice) => {
    acc[notice.eventDate] = { marked: true, dotColor: Colors.primary };
    return acc;
  }, {});

  const [selectedDate, setSelectedDate] = useState(Object.keys(markedDates)[0]);
  const [formattedDate, setFormattedDate] = useState(
    new Date(Object.keys(markedDates)[0]).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  );

  const selectDate = (day) => {
    if (notices.some((item) => item.eventDate === day)) {
      setSelectedDate(day);
      setFormattedDate(
        new Date(day).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* App Bar Start */}
      <View style={styles.appBar}>
        <Text></Text>
        <Text style={styles.appBarText}>Calendar</Text>
        <Text></Text>
      </View>
      {/* App Bar End */}

      <Calendar
        dayComponent={({ date, state }) => {
          const isMarked = markedDates[date.dateString];
          const isToday =
            date.dateString === new Date().toISOString().split("T")[0];

          return (
            <TouchableOpacity
              style={styles.dayContainer}
              onPress={() => selectDate(date.dateString)}
            >
              <View
                style={[
                  isMarked && styles.markedCircle,
                  isToday && !isMarked && styles.todayCircle,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    isMarked && styles.markedText,
                    isToday && !isMarked && styles.todayText,
                    state === "disabled" && { color: "#ccc" },
                  ]}
                >
                  {date.day}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        theme={{
          textDayFontFamily: "Italics-Light", // font for regular days
          textMonthFontFamily: "Italics-Light", // font for month title
          textDayHeaderFontFamily: "Italics-Light", // font for Sun, Mon, etc.
          todayTextColor: Colors.primary, // optional highlight
          arrowColor: Colors.primary,
        }}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.dateDisplay}>{formattedDate}</Text>
        <StudentNoticesSection date={selectedDate} />
      </ScrollView>
      <NavigationBar />
    </SafeAreaView>
  );
}

export default CaledarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  dayContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
  },
  dayText: {
    color: "#000",
    fontSize: 16,
  },
  markedCircle: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  markedText: {
    color: "#fff",
  },
  todayCircle: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  todayText: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  dateDisplay: {
    fontFamily: "Inter-Light",
    color: Colors.primary,
    marginLeft: 30,
    marginTop: 20,
    fontSize: 22,
  },
});
