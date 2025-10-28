import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBar from "../components/NavigationBar";
import Colors from "../constants/colors";
import { Calendar } from "react-native-calendars";
import StudentNoticesSection from "../components/StudentNoticesSection";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserNotices } from "../firebase/firebaseFunctions";

function CalendarScreen() {
  const { user } = useContext(AuthContext);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await getUserNotices();
        setNotices(data);

        // auto-select first event date if available
        if (data.length > 0) {
          const firstDate = formatDate(data[0].eventDate);
          setSelectedDate(firstDate);
          setFormattedDate(formatLongDate(firstDate));
        }
      } catch (error) {
        console.error("Error fetching user notices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [user]);

  const formatDate = (timestamp) => {
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toISOString().split("T")[0];
    }
    return timestamp || "";
  };

  const formatLongDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const markedDates = notices.reduce((acc, notice) => {
    const dateStr = formatDate(notice.eventDate);
    if (dateStr) acc[dateStr] = { marked: true, dotColor: Colors.primary };
    return acc;
  }, {});

  const selectDate = (day) => {
    if (notices.some((item) => formatDate(item.eventDate) === day)) {
      setSelectedDate(day);
      setFormattedDate(formatLongDate(day));
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <Text></Text>
        <Text style={styles.appBarText}>Calendar</Text>
        <Text></Text>
      </View>

      <Calendar
        markedDates={markedDates} // ← add this line
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
          textDayFontFamily: "Italics-Light",
          textMonthFontFamily: "Italics-Light",
          textDayHeaderFontFamily: "Italics-Light",
          todayTextColor: Colors.primary,
          arrowColor: Colors.primary,
        }}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {selectedDate && (
          <Text style={styles.dateDisplay}>{formattedDate}</Text>
        )}
        <StudentNoticesSection date={selectedDate} />
      </ScrollView>

      <NavigationBar />
    </SafeAreaView>
  );
}

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    fontWeight: "500",
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
